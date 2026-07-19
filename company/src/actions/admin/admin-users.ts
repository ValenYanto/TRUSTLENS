"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/src/lib/auth";
import {
  hasAdminRole,
  requireAdminSession,
} from "@/src/lib/auth-session";
import type { AdminUserActionResult } from "@/src/lib/admin-users/admin-user-types";
import { getDb } from "@/src/lib/db";
import {
  adminUserIdSchema,
  banAdminUserSchema,
  createAdminUserSchema,
  deleteAdminUserSchema,
  resetAdminPasswordSchema,
  updateAdminUserSchema,
} from "@/src/lib/validations/admin-user";

function success(
  message: string,
): AdminUserActionResult {
  return {
    success: true,
    message,
  };
}

function failure(
  message: string,
): AdminUserActionResult {
  return {
    success: false,
    message,
  };
}

function revalidateAdminPages() {
  revalidatePath("/admin");
  revalidatePath("/admin/admins");
}

function getPrimaryAdminEmail() {
  return (
    process.env.ADMIN_SEED_EMAIL
      ?.trim()
      .toLowerCase() ?? ""
  );
}

async function getTargetAdmin(
  userId: string,
) {
  const db = getDb();

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
    },
  });

  if (
    !user ||
    !hasAdminRole(user.role)
  ) {
    return null;
  }

  return user;
}

async function getActiveAdminCount() {
  const db = getDb();

  const users = await db.user.findMany({
    where: {
      role: {
        contains: "admin",
      },
    },

    select: {
      role: true,
      banned: true,
    },
  });

  return users.filter(
    (user) =>
      hasAdminRole(user.role) &&
      user.banned !== true,
  ).length;
}

function isPrimaryAdmin(
  email: string,
) {
  const primaryEmail =
    getPrimaryAdminEmail();

  return (
    primaryEmail.length > 0 &&
    email.toLowerCase() ===
      primaryEmail
  );
}

function getFirstValidationMessage(
  issues: {
    message: string;
  }[],
  fallback: string,
) {
  return issues[0]?.message ?? fallback;
}

export async function createAdminUserAction(
  formData: FormData,
): Promise<AdminUserActionResult> {
  await requireAdminSession();

  const validationResult =
    createAdminUserSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password:
        formData.get("password"),

      confirmPassword:
        formData.get(
          "confirmPassword",
        ),
    });

  if (!validationResult.success) {
    return failure(
      getFirstValidationMessage(
        validationResult.error.issues,
        "Data akun admin tidak valid.",
      ),
    );
  }

  const {
    name,
    email,
    password,
  } = validationResult.data;

  const db = getDb();

  const existingUser =
    await db.user.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
      },
    });

  if (existingUser) {
    return failure(
      "Email tersebut sudah digunakan oleh akun lain.",
    );
  }

  try {
    await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role: "admin",
      },

      headers: await headers(),
    });

    revalidateAdminPages();

    return success(
      "Akun admin berhasil dibuat.",
    );
  } catch (error) {
    console.error(
      "[createAdminUserAction]",
      error,
    );

    return failure(
      "Akun admin belum dapat dibuat.",
    );
  }
}

export async function updateAdminUserAction(
  formData: FormData,
): Promise<AdminUserActionResult> {
  const session =
    await requireAdminSession();

  const validationResult =
    updateAdminUserSchema.safeParse({
      userId: formData.get("userId"),
      name: formData.get("name"),
      email: formData.get("email"),
    });

  if (!validationResult.success) {
    return failure(
      getFirstValidationMessage(
        validationResult.error.issues,
        "Data akun admin tidak valid.",
      ),
    );
  }

  const {
    userId,
    name,
    email,
  } = validationResult.data;

  const target =
    await getTargetAdmin(userId);

  if (!target) {
    return failure(
      "Akun admin tidak ditemukan.",
    );
  }

  const emailChanged =
    target.email.toLowerCase() !== email;

  if (
    isPrimaryAdmin(target.email) &&
    emailChanged
  ) {
    return failure(
      "Email admin utama tidak dapat diubah.",
    );
  }

  if (
    session.user.id === userId &&
    emailChanged
  ) {
    return failure(
      "Email akun yang sedang digunakan tidak dapat diubah dari halaman ini.",
    );
  }

  const db = getDb();

  const duplicateEmail =
    await db.user.findFirst({
      where: {
        email,

        id: {
          not: userId,
        },
      },

      select: {
        id: true,
      },
    });

  if (duplicateEmail) {
    return failure(
      "Email tersebut sudah digunakan oleh akun lain.",
    );
  }

  try {
    await auth.api.adminUpdateUser({
      body: {
        userId,

        data: {
          name,
          email,

          ...(emailChanged
            ? {
                emailVerified: false,
              }
            : {}),
        },
      },

      headers: await headers(),
    });

    revalidateAdminPages();

    return success(
      "Data akun admin berhasil diperbarui.",
    );
  } catch (error) {
    console.error(
      "[updateAdminUserAction]",
      error,
    );

    return failure(
      "Data akun admin belum dapat diperbarui.",
    );
  }
}

export async function resetAdminPasswordAction(
  formData: FormData,
): Promise<AdminUserActionResult> {
  const session =
    await requireAdminSession();

  const validationResult =
    resetAdminPasswordSchema.safeParse({
      userId: formData.get("userId"),

      newPassword:
        formData.get("newPassword"),

      confirmPassword:
        formData.get(
          "confirmPassword",
        ),
    });

  if (!validationResult.success) {
    return failure(
      getFirstValidationMessage(
        validationResult.error.issues,
        "Kata sandi baru tidak valid.",
      ),
    );
  }

  const {
    userId,
    newPassword,
  } = validationResult.data;

  if (session.user.id === userId) {
    return failure(
      "Kata sandi akun sendiri tidak dapat direset dari halaman ini.",
    );
  }

  const target =
    await getTargetAdmin(userId);

  if (!target) {
    return failure(
      "Akun admin tidak ditemukan.",
    );
  }

  const requestHeaders =
    await headers();

  try {
    await auth.api.setUserPassword({
      body: {
        userId,
        newPassword,
      },

      headers: requestHeaders,
    });

    await auth.api.revokeUserSessions({
      body: {
        userId,
      },

      headers: requestHeaders,
    });

    revalidateAdminPages();

    return success(
      "Kata sandi berhasil direset dan seluruh sesi akun telah dicabut.",
    );
  } catch (error) {
    console.error(
      "[resetAdminPasswordAction]",
      error,
    );

    return failure(
      "Kata sandi admin belum dapat direset.",
    );
  }
}

export async function banAdminUserAction(
  formData: FormData,
): Promise<AdminUserActionResult> {
  const session =
    await requireAdminSession();

  const validationResult =
    banAdminUserSchema.safeParse({
      userId: formData.get("userId"),

      banReason:
        formData.get("banReason") ??
        "",
    });

  if (!validationResult.success) {
    return failure(
      getFirstValidationMessage(
        validationResult.error.issues,
        "Data penonaktifan tidak valid.",
      ),
    );
  }

  const {
    userId,
    banReason,
  } = validationResult.data;

  if (session.user.id === userId) {
    return failure(
      "Anda tidak dapat menonaktifkan akun sendiri.",
    );
  }

  const target =
    await getTargetAdmin(userId);

  if (!target) {
    return failure(
      "Akun admin tidak ditemukan.",
    );
  }

  if (isPrimaryAdmin(target.email)) {
    return failure(
      "Admin utama tidak dapat dinonaktifkan.",
    );
  }

  if (target.banned === true) {
    return failure(
      "Akun admin sudah dinonaktifkan.",
    );
  }

  const activeAdminCount =
    await getActiveAdminCount();

  if (activeAdminCount <= 1) {
    return failure(
      "Admin aktif terakhir tidak dapat dinonaktifkan.",
    );
  }

  try {
    await auth.api.banUser({
      body: {
        userId,

        banReason:
          banReason ||
          "Dinonaktifkan oleh admin TrustLens.",
      },

      headers: await headers(),
    });

    revalidateAdminPages();

    return success(
      "Akun admin berhasil dinonaktifkan.",
    );
  } catch (error) {
    console.error(
      "[banAdminUserAction]",
      error,
    );

    return failure(
      "Akun admin belum dapat dinonaktifkan.",
    );
  }
}

export async function unbanAdminUserAction(
  formData: FormData,
): Promise<AdminUserActionResult> {
  await requireAdminSession();

  const validationResult =
    adminUserIdSchema.safeParse({
      userId: formData.get("userId"),
    });

  if (!validationResult.success) {
    return failure(
      "ID akun admin tidak valid.",
    );
  }

  const { userId } =
    validationResult.data;

  const target =
    await getTargetAdmin(userId);

  if (!target) {
    return failure(
      "Akun admin tidak ditemukan.",
    );
  }

  if (target.banned !== true) {
    return failure(
      "Akun admin sudah dalam keadaan aktif.",
    );
  }

  try {
    await auth.api.unbanUser({
      body: {
        userId,
      },

      headers: await headers(),
    });

    revalidateAdminPages();

    return success(
      "Akun admin berhasil diaktifkan kembali.",
    );
  } catch (error) {
    console.error(
      "[unbanAdminUserAction]",
      error,
    );

    return failure(
      "Akun admin belum dapat diaktifkan.",
    );
  }
}

export async function revokeAdminSessionsAction(
  formData: FormData,
): Promise<AdminUserActionResult> {
  const session =
    await requireAdminSession();

  const validationResult =
    adminUserIdSchema.safeParse({
      userId: formData.get("userId"),
    });

  if (!validationResult.success) {
    return failure(
      "ID akun admin tidak valid.",
    );
  }

  const { userId } =
    validationResult.data;

  if (session.user.id === userId) {
    return failure(
      "Seluruh sesi akun sendiri tidak dapat dicabut dari halaman ini.",
    );
  }

  const target =
    await getTargetAdmin(userId);

  if (!target) {
    return failure(
      "Akun admin tidak ditemukan.",
    );
  }

  try {
    await auth.api.revokeUserSessions({
      body: {
        userId,
      },

      headers: await headers(),
    });

    revalidateAdminPages();

    return success(
      "Seluruh sesi akun admin berhasil dicabut.",
    );
  } catch (error) {
    console.error(
      "[revokeAdminSessionsAction]",
      error,
    );

    return failure(
      "Sesi akun admin belum dapat dicabut.",
    );
  }
}

export async function deleteAdminUserAction(
  formData: FormData,
): Promise<AdminUserActionResult> {
  const session =
    await requireAdminSession();

  const validationResult =
    deleteAdminUserSchema.safeParse({
      userId: formData.get("userId"),

      confirmation:
        formData.get("confirmation"),
    });

  if (!validationResult.success) {
    return failure(
      getFirstValidationMessage(
        validationResult.error.issues,
        "Konfirmasi penghapusan tidak valid.",
      ),
    );
  }

  const { userId } =
    validationResult.data;

  if (session.user.id === userId) {
    return failure(
      "Anda tidak dapat menghapus akun sendiri.",
    );
  }

  const target =
    await getTargetAdmin(userId);

  if (!target) {
    return failure(
      "Akun admin tidak ditemukan.",
    );
  }

  if (isPrimaryAdmin(target.email)) {
    return failure(
      "Admin utama tidak dapat dihapus.",
    );
  }

  if (target.banned !== true) {
    const activeAdminCount =
      await getActiveAdminCount();

    if (activeAdminCount <= 1) {
      return failure(
        "Admin aktif terakhir tidak dapat dihapus.",
      );
    }
  }

  try {
    await auth.api.removeUser({
      body: {
        userId,
      },

      headers: await headers(),
    });

    revalidateAdminPages();

    return success(
      "Akun admin berhasil dihapus permanen.",
    );
  } catch (error) {
    console.error(
      "[deleteAdminUserAction]",
      error,
    );

    return failure(
      "Akun admin belum dapat dihapus.",
    );
  }
}