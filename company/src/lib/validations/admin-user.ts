import { z } from "zod";

const userIdSchema = z
  .string()
  .trim()
  .min(1, "ID akun admin tidak valid.")
  .max(200, "ID akun admin tidak valid.");

const nameSchema = z
  .string()
  .trim()
  .min(
    2,
    "Nama admin minimal terdiri dari 2 karakter.",
  )
  .max(
    100,
    "Nama admin maksimal 100 karakter.",
  );

const emailSchema = z
  .string()
  .trim()
  .email("Alamat email tidak valid.")
  .max(
    150,
    "Alamat email maksimal 150 karakter.",
  )
  .transform((value) =>
    value.toLowerCase(),
  );

const passwordSchema = z
  .string()
  .min(
    12,
    "Kata sandi minimal terdiri dari 12 karakter.",
  )
  .max(
    128,
    "Kata sandi maksimal 128 karakter.",
  );

export const createAdminUserSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .superRefine((data, context) => {
    if (
      data.password !==
      data.confirmPassword
    ) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message:
          "Konfirmasi kata sandi tidak cocok.",
      });
    }
  });

export const updateAdminUserSchema =
  z.object({
    userId: userIdSchema,
    name: nameSchema,
    email: emailSchema,
  });

export const resetAdminPasswordSchema =
  z
    .object({
      userId: userIdSchema,
      newPassword: passwordSchema,
      confirmPassword: z.string(),
    })
    .superRefine((data, context) => {
      if (
        data.newPassword !==
        data.confirmPassword
      ) {
        context.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message:
            "Konfirmasi kata sandi tidak cocok.",
        });
      }
    });

export const banAdminUserSchema =
  z.object({
    userId: userIdSchema,

    banReason: z
      .string()
      .trim()
      .max(
        250,
        "Alasan penonaktifan maksimal 250 karakter.",
      )
      .optional(),
  });

export const adminUserIdSchema =
  z.object({
    userId: userIdSchema,
  });

export const deleteAdminUserSchema =
  z.object({
    userId: userIdSchema,

    confirmation: z.literal("HAPUS", {
      message:
        "Ketik HAPUS untuk mengonfirmasi penghapusan.",
    }),
  });