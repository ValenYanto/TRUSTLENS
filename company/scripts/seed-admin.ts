import "dotenv/config";

import { auth } from "../src/lib/auth";
import { getDb } from "../src/lib/db";

function getRequiredEnvironment(
  key: string,
) {
  const value =
    process.env[key]?.trim();

  if (!value) {
    throw new Error(
      `${key} belum dikonfigurasi di .env.`,
    );
  }

  return value;
}

async function main() {
  const db = getDb();

  const name = getRequiredEnvironment(
    "ADMIN_SEED_NAME",
  );

  const email = getRequiredEnvironment(
    "ADMIN_SEED_EMAIL",
  ).toLowerCase();

  const password =
    getRequiredEnvironment(
      "ADMIN_SEED_PASSWORD",
    );

  if (password.length < 12) {
    throw new Error(
      "ADMIN_SEED_PASSWORD minimal 12 karakter.",
    );
  }

  const existingUser =
    await db.user.findUnique({
      where: {
        email,
      },

      include: {
        accounts: true,
      },
    });

  if (existingUser) {
    if (
      !existingUser.role
        ?.split(",")
        .map((role) => role.trim())
        .includes("admin")
    ) {
      await db.user.update({
        where: {
          id: existingUser.id,
        },

        data: {
          role: "admin",
        },
      });
    }

    const credentialAccount =
      existingUser.accounts.find(
        (account) =>
          account.providerId ===
          "credential",
      );

    if (!credentialAccount) {
      await auth.api.setUserPassword({
        body: {
          userId: existingUser.id,
          newPassword: password,
        },
      });
    }

    console.log(
      `Admin sudah tersedia: ${email}`,
    );

    return;
  }

  await auth.api.createUser({
    body: {
      name,
      email,
      password,
      role: "admin",
    },
  });

  console.log(
    `Admin berhasil dibuat: ${email}`,
  );
}

const db = getDb();

main()
  .catch((error: unknown) => {
    console.error(
      "Seed admin gagal:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });