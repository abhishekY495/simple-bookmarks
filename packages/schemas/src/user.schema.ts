import { z } from "zod";

// user schema
export const UserSchema = z
  .object({
    id: z.uuid(),
    fullName: z.string().min(1, "Name is required").max(100),
    email: z.email("Invalid email address"),
    password: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({
    id: "User",
  });
export type User = z.infer<typeof UserSchema>;

// create user schema
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).meta({
  id: "CreateUser",
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

// update user schema
export const UpdateUserSchema = CreateUserSchema.partial().meta({
  id: "UpdateUser",
});
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// user response schema
export const UserResponseSchema = UserSchema.omit({
  password: true,
  createdAt: true,
  updatedAt: true,
})
  //   .extend({
  //     token: z.string(),
  //   })
  .meta({
    id: "UserResponse",
  });
export type UserResponse = z.infer<typeof UserResponseSchema>;
