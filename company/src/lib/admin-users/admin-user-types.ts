export type AdminUserActionResult = {
  success: boolean;
  message: string;
};

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string | null;

  banned: boolean;
  banReason: string | null;
  banExpires: string | null;

  createdAt: string;
  updatedAt: string;

  sessionCount: number;

  isCurrentUser: boolean;
  isPrimaryAdmin: boolean;
};