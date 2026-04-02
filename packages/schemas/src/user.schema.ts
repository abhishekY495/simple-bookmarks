import { z } from "zod";

// user schema
export const UserSchema = z.object({
  id: z.uuid(),
  fullName: z
    .string({
      error: "Full name is required",
    })
    .min(1, "Full name is required")
    .max(100),
  email: z
    .email({
      error: "Invalid email address",
    })
    .min(1, "Email is required"),
  password: z
    .string({
      error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type User = z.infer<typeof UserSchema>;

// register user schema
export const RegisterUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type RegisterUser = z.infer<typeof RegisterUserSchema>;

// login user schema
export const LoginUserSchema = UserSchema.omit({
  id: true,
  fullName: true,
  createdAt: true,
  updatedAt: true,
});
export type LoginUser = z.infer<typeof LoginUserSchema>;

// auth user response schema
export const UserResponseSchema = UserSchema.omit({
  password: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  accessToken: z.string().optional(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

// update email schema
export const UserEmailSchema = z.object({
  email: z
    .email({
      error: "Invalid email address",
    })
    .min(1, "Email is required"),
});
export type UserEmail = z.infer<typeof UserEmailSchema>;

// update fullName schema
export const UserFullNameSchema = z.object({
  fullName: z
    .string({
      error: "Full name is required",
    })
    .min(1, "Full name is required")
    .max(100),
});
export type UserFullName = z.infer<typeof UserFullNameSchema>;

// update password schema
export const UserPasswordSchema = z.object({
  oldPassword: z
    .string({
      error: "Old password is required",
    })
    .min(8, "Old password must be at least 8 characters"),
  newPassword: z
    .string({
      error: "New password is required",
    })
    .min(8, "New password must be at least 8 characters"),
});
export type UserPassword = z.infer<typeof UserPasswordSchema>;

// refresh token response schema
export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
