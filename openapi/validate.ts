import SwaggerParser from "@apidevtools/swagger-parser";

const file = process.argv[2];

try {
  await SwaggerParser.validate(file);
  console.log("✓ OpenAPI spec is valid");
} catch (err) {
  console.error("✗ Validation failed:");
  console.error(err.message);
  process.exit(1);
}
