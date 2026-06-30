import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "@/features/auth/lib/password";

const prisma = new PrismaClient();

function loadEnvFile(): void {
  const envPath = resolve(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main(): Promise<void> {
  loadEnvFile();

  const email = requireEnv("ADMIN_EMAIL");
  const phone = requireEnv("ADMIN_PHONE");
  const name = requireEnv("ADMIN_NAME");
  const password = requireEnv("ADMIN_PASSWORD");
  const password_hash = await hashPassword(password);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      phone,
      name,
      role: UserRole.ADMIN,
      password_hash,
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      is_blocked: false,
    },
    create: {
      email,
      phone,
      name,
      role: UserRole.ADMIN,
      password_hash,
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (existing) {
    console.log(`✓ Existing user promoted to ADMIN: ${user.email}`);
  } else {
    console.log(`✓ Admin user created: ${user.email}`);
  }

  console.log("✅ Admin setup completed.");
}

main()
  .catch((error) => {
    console.error("❌ Admin creation failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
