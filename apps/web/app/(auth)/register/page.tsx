"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { RegisterUserSchema } from "@repo/schemas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth-services";
import { useMutation } from "@tanstack/react-query";

export default function Register() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [fullNameValue, setFullNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data);
      router.push("/account");
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    const result = RegisterUserSchema.safeParse({
      fullName: fullNameValue,
      email: emailValue,
      password: passwordValue,
    });

    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      setValidationError(firstError);
      return;
    }

    registerUser(result.data);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold -mb-1">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to register
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullNameValue}
            onChange={(e) => setFullNameValue(e.target.value)}
            required
            className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            required
            className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
            className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {validationError && (
          <p className="text-sm text-destructive">{validationError}</p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="rounded cursor-pointer text-base py-5"
        >
          {isPending ? "Registering..." : "Register"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
