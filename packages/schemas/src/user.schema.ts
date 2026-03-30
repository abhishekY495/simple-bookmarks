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
  email: z.email({
    error: "Invalid email address",
  }),
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

// update user schema
export const UpdateUserSchema = RegisterUserSchema.partial();
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// auth user response schema
export const AuthUserResponseSchema = UserSchema.omit({
  password: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  accessToken: z.string(),
});
export type AuthUserResponse = z.infer<typeof AuthUserResponseSchema>;
