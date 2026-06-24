import { prismaClient } from "../app/database/db.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import slugify from "slugify";
import { Role, BlogStatus } from "../app/generated/prisma/enums.js";

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean up existing tables (order matters due to foreign keys)
  console.log("🧹 Cleaning up existing data...");
  const preservedUserIds = [
    "by0RFL6KENnIL4d4rO2B4cbZsgATjffE",
    "dLVuGbNtjFouvr0adhg6o7pUKZRWoj3N",
    "rVm7Aus0WsmM3s9inPX78PGmx3D2LEIc"
  ];

  await prismaClient.comment.deleteMany({});
  await prismaClient.blog.deleteMany({});
  await prismaClient.image.deleteMany({});
  await prismaClient.tag.deleteMany({});
  await prismaClient.category.deleteMany({});
  await prismaClient.account.deleteMany({
    where: {
      userId: { notIn: preservedUserIds }
    }
  });
  await prismaClient.session.deleteMany({
    where: {
      userId: { notIn: preservedUserIds }
    }
  });
  await prismaClient.user.deleteMany({
    where: {
      id: { notIn: preservedUserIds }
    }
  });
  console.log("✅ Cleanup complete.");

  // 2. Hash default password
  const defaultPassword = "password123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  console.log(`🔑 Generated default password hash for password: "${defaultPassword}"`);

  // 3. Populate preserved users or create if missing
  console.log("👤 Querying and ensuring preserved users...");
  const users: any[] = [];

  for (let i = 0; i < preservedUserIds.length; i++) {
    const id = preservedUserIds[i];
    if (!id) continue;
    let user = await prismaClient.user.findUnique({
      where: { id }
    });

    if (!user) {
      console.log(`Preserved user ${id} not found in DB. Creating a mock entry...`);
      const email = `preserved${i + 1}@example.com`;
      const name = `Preserved User ${i + 1}`;
      user = await prismaClient.user.create({
        data: {
          id,
          name,
          email,
          emailVerified: true,
          image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
          role: Role.USER,
          accounts: {
            create: {
              id: faker.string.uuid(),
              providerId: "credential",
              accountId: email,
              password: hashedPassword,
            },
          },
        },
      });
    }
    users.push(user);
  }

  // Create additional regular users to reach 10 users total
  const additionalNeeded = 10 - users.length;
  console.log(`👤 Seeding ${additionalNeeded} additional regular users...`);
  for (let i = 1; i <= additionalNeeded; i++) {
    const userId = faker.string.uuid();
    const email = `user${i}@example.com`;
    const name = faker.person.fullName();
    const user = await prismaClient.user.create({
      data: {
        id: userId,
        name: name,
        email: email,
        emailVerified: true,
        image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        role: i === 1 ? Role.ADMIN : Role.USER, // Make the first additional user the admin
        accounts: {
          create: {
            id: faker.string.uuid(),
            providerId: "credential",
            accountId: email,
            password: hashedPassword,
          },
        },
      },
    });
    users.push(user);
  }
  console.log(`✅ Seeded ${users.length} users successfully.`);

  // 4. Create 5 Categories
  console.log("📂 Seeding 5 Categories...");
  const categoryNames = [
    "Technology & AI",
    "Health & Wellness",
    "Travel & Adventure",
    "Finance & Business",
    "Food & Culinary Arts"
  ];
  const categories: any[] = [];

  for (const name of categoryNames) {
    const category = await prismaClient.category.create({
      data: {
        name,
        slug: slugify.default ? slugify.default(name, { lower: true }) : slugify(name, { lower: true }),
        description: faker.lorem.sentence(),
      },
    });
    categories.push(category);
  }
  console.log(`✅ Seeded ${categories.length} categories successfully.`);

  // 5. Create 20 Tags
  console.log("🏷️ Seeding 20 Tags...");
  const tagNames = [
    "React", "Node.js", "TypeScript", "Next.js", "Prisma",
    "Artificial Intelligence", "Machine Learning", "Tailwind CSS",
    "Healthy Lifestyle", "Fitness Journey", "Mental Health",
    "Budget Traveling", "Solo Backpacker", "Investing 101",
    "Personal Finance", "Cooking Hacks", "Gourmet Recipes",
    "Web Development", "UI/UX Design", "Productivity Tips"
  ];
  const tags: any[] = [];

  for (const name of tagNames) {
    const tag = await prismaClient.tag.create({
      data: {
        name,
        slug: slugify.default ? slugify.default(name, { lower: true }) : slugify(name, { lower: true }),
      },
    });
    tags.push(tag);
  }
  console.log(`✅ Seeded ${tags.length} tags successfully.`);

  // 6. Create 10 Images (to be used as featured images / gallery)
  console.log("🖼️ Seeding 10 Images...");
  const images: any[] = [];
  for (let i = 0; i < 10; i++) {
    const randomUser = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const image = await prismaClient.image.create({
      data: {
        name: `Image ${i + 1}`,
        alt: faker.lorem.sentence(),
        url: `https://picsum.photos/seed/image-${i + 1}/800/600`,
        mimeType: "image/jpeg",
        size: faker.number.int({ min: 50000, max: 250000 }),
        uploaderId: randomUser.id,
      },
    });
    images.push(image);
  }
  console.log(`✅ Seeded ${images.length} images successfully.`);

  // 7. Create 20 Blogs
  console.log("📝 Seeding 20 Blogs...");
  const blogs: any[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const title = faker.lorem.sentence({ min: 4, max: 8 });
    const rawSlug = slugify.default ? slugify.default(title, { lower: true }) : slugify(title, { lower: true });
    // Ensure uniqueness by adding index to slug
    const slug = `${rawSlug}-${i}`;
    const author = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const category = categories[faker.number.int({ min: 0, max: categories.length - 1 })];
    const featuredImage = images[faker.number.int({ min: 0, max: images.length - 1 })];
    
    // Choose 2 to 5 random tags
    const blogTags = faker.helpers.arrayElements(tags, { min: 2, max: 5 });

    // Choose 1 to 3 random users who liked/favorited/viewed this blog
    const randomLikers = faker.helpers.arrayElements(users, { min: 0, max: 5 });
    const randomFavoriters = faker.helpers.arrayElements(users, { min: 0, max: 3 });
    const randomViewers = faker.helpers.arrayElements(users, { min: 1, max: 8 });

    // Choose random status
    const statusOptions = [BlogStatus.PUBLISHED, BlogStatus.PUBLISHED, BlogStatus.PUBLISHED, BlogStatus.DRAFT, BlogStatus.ARCHIVED];
    const status = statusOptions[faker.number.int({ min: 0, max: statusOptions.length - 1 })];

    const blog = await prismaClient.blog.create({
      data: {
        title,
        slug,
        content: faker.lorem.paragraphs({ min: 4, max: 8 }, "\n\n"),
        excerpt: faker.lorem.paragraph(),
        readTime: faker.number.int({ min: 2, max: 12 }),
        status,
        authorId: author.id,
        categoryId: category.id,
        featuredImageId: featuredImage.id,
        publishedAt: status === BlogStatus.PUBLISHED ? faker.date.past() : null,
        tags: {
          connect: blogTags.map(t => ({ id: t.id })),
        },
        likedByUsers: {
          connect: randomLikers.map(u => ({ id: u.id })),
        },
        favoritedByUsers: {
          connect: randomFavoriters.map(u => ({ id: u.id })),
        },
        viewedByUsers: {
          connect: randomViewers.map(u => ({ id: u.id })),
        },
        likedCount: randomLikers.length,
        favoriteCount: randomFavoriters.length,
        views: faker.number.int({ min: randomViewers.length + 15, max: 1200 }),
      },
    });
    blogs.push(blog);
  }
  console.log(`✅ Seeded ${blogs.length} blogs successfully.`);

  // 8. Create 30 Comments
  console.log("💬 Seeding 30 Comments...");
  let commentsSeeded = 0;
  for (let i = 0; i < 30; i++) {
    const blog = blogs[faker.number.int({ min: 0, max: blogs.length - 1 })];
    const author = users[faker.number.int({ min: 0, max: users.length - 1 })];
    
    await prismaClient.comment.create({
      data: {
        content: faker.lorem.sentences({ min: 1, max: 3 }),
        blogId: blog.id,
        authorId: author.id,
      },
    });
    commentsSeeded++;
  }
  console.log(`✅ Seeded ${commentsSeeded} comments successfully.`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
