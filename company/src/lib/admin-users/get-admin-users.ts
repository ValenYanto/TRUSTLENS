import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import { getDb } from "@/src/lib/db";
import type { AdminUserListItem } from "@/src/lib/admin-users/admin-user-types";

export const ADMIN_PAGE_SIZE = 10;

type GetAdminUsersInput = {
  page?: string;
  search?: string;
  currentUserId: string;
};

function parsePage(value?: string) {
  const parsed = Number.parseInt(
    value ?? "1",
    10,
  );

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    return 1;
  }

  return parsed;
}

function normalizeSearch(value?: string) {
  return value?.trim().slice(0, 100) ?? "";
}

function hasAdminRole(
  role?: string | null,
) {
  if (!role) {
    return false;
  }

  return role
    .split(",")
    .map((item) => item.trim())
    .includes("admin");
}

export async function getAdminUsers({
  page,
  search,
  currentUserId,
}: GetAdminUsersInput) {
  const db = getDb();

  const requestedPage = parsePage(page);
  const normalizedSearch =
    normalizeSearch(search);

  const primaryAdminEmail =
    process.env.ADMIN_SEED_EMAIL
      ?.trim()
      .toLowerCase() ?? "";

  const where: Prisma.UserWhereInput = {
    role: {
      contains: "admin",
    },

    ...(normalizedSearch
      ? {
          OR: [
            {
              name: {
                contains:
                  normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains:
                  normalizedSearch,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [
    totalItems,
    allAdminStates,
  ] = await Promise.all([
    db.user.count({
      where,
    }),

    db.user.findMany({
      where: {
        role: {
          contains: "admin",
        },
      },

      select: {
        role: true,
        banned: true,
      },
    }),
  ]);

  const activeAdminCount =
    allAdminStates.filter(
      (user) =>
        hasAdminRole(user.role) &&
        user.banned !== true,
    ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / ADMIN_PAGE_SIZE,
    ),
  );

  const currentPage = Math.min(
    requestedPage,
    totalPages,
  );

  const users =
    await db.user.findMany({
      where,

      orderBy: [
        {
          createdAt: "asc",
        },
        {
          name: "asc",
        },
      ],

      skip:
        (currentPage - 1) *
        ADMIN_PAGE_SIZE,

      take: ADMIN_PAGE_SIZE,

      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,

        banned: true,
        banReason: true,
        banExpires: true,

        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

  const items: AdminUserListItem[] =
    users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified:
        user.emailVerified,
      role: user.role,

      banned: user.banned === true,
      banReason: user.banReason,
      banExpires:
        user.banExpires?.toISOString() ??
        null,

      createdAt:
        user.createdAt.toISOString(),

      updatedAt:
        user.updatedAt.toISOString(),

      sessionCount:
        user._count.sessions,

      isCurrentUser:
        user.id === currentUserId,

      isPrimaryAdmin:
        primaryAdminEmail.length > 0 &&
        user.email.toLowerCase() ===
          primaryAdminEmail,
    }));

  return {
    items,

    filters: {
      search: normalizedSearch,
    },

    pagination: {
      currentPage,
      totalItems,
      totalPages,

      firstItem:
        totalItems === 0
          ? 0
          : (currentPage - 1) *
              ADMIN_PAGE_SIZE +
            1,

      lastItem: Math.min(
        currentPage * ADMIN_PAGE_SIZE,
        totalItems,
      ),
    },

    activeAdminCount,
  };
}