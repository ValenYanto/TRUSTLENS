import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(1, "Kata sandi wajib diisi")
        .min(6, "Kata sandi minimal 6 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    full_name: z.string().min(2, "Nama wajib diisi").max(120),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter"),
    confirm_password: z.string().min(6, "Konfirmasi kata sandi wajib diisi"),
    role: z.enum(["ADMIN", "ANALYST", "INSTITUTION"]),
    institution_name: z.string().max(120).optional().or(z.literal("")),
}).refine((value) => value.password === value.confirm_password, {
    path: ["confirm_password"],
    message: "Konfirmasi kata sandi tidak sama",
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
