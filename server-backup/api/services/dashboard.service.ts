import { prisma } from "../db/db.js";
import { UserRole } from "../middlewares/role.middleware.js";
import { BlogStatus } from "../../generated/prisma/enums.js";

const USER_ROLES: UserRole[] = ["user", "author", "editor", "admin"];
const BLOG_STATUSES: BlogStatus[] = ["draft", "published", "archived"];

function toRoleCounts(rows: { role: UserRole; _count: { _all?: number } }[]) {
  const counts = Object.fromEntries(USER_ROLES.map((role) => [role, 0])) as Record<UserRole, number>;

  for (const row of rows) {
    counts[row.role] = row._count._all ?? 0;
  }

  return counts;
}

function toStatusCounts(rows: { status: BlogStatus; _count: { _all?: number } }[]) {
  const counts = Object.fromEntries(BLOG_STATUSES.map((status) => [status, 0])) as Record<BlogStatus, number>;

  for (const row of rows) {
    counts[row.status] = row._count._all ?? 0;
  }

  return counts;
}

export async function getDashboardStats() {
  const now = new Date();

  const [
    usersTotal,
    usersByRole,
    usersEmailVerified,
    blogsTotal,
    blogsByStatus,
    categoriesTotal,
    tagsTotal,
    imagesTotal,
    imagesSizeSum,
    activeSessions,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.groupBy({ by: ["role"], orderBy: { role: "asc" }, _count: { _all: true } }),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.blog.count(),
    prisma.blog.groupBy({ by: ["status"], orderBy: { status: "asc" }, _count: { _all: true } }),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.image.count(),
    prisma.image.aggregate({ _sum: { size: true } }),
    prisma.session.count({ where: { expiresAt: { gt: now } } }),
  ]);

  return {
    users: {
      total: usersTotal,
      byRole: toRoleCounts(usersByRole as { role: UserRole; _count: { _all?: number } }[]),
      emailVerified: usersEmailVerified,
      emailUnverified: usersTotal - usersEmailVerified,
    },
    blogs: {
      total: blogsTotal,
      byStatus: toStatusCounts(blogsByStatus as { status: BlogStatus; _count: { _all?: number } }[]),
    },
    categories: {
      total: categoriesTotal,
    },
    tags: {
      total: tagsTotal,
    },
    images: {
      total: imagesTotal,
      totalSizeBytes: imagesSizeSum._sum.size ?? 0,
    },
    sessions: {
      active: activeSessions,
    },
    generatedAt: now.toISOString(),
  };
}
