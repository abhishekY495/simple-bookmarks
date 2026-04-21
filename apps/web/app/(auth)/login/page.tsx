"use client";

import { Button } from "@/components/ui/button";
import { login } from "@/services/auth-services";
import { useAuthStore } from "@/store/auth-store";
import { LoginUserSchema } from "@repo/schemas";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/my/unsorted");
    }
  }, [user, router]);

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data);
      router.push("/my/unsorted");
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    const result = LoginUserSchema.safeParse({
      email: emailValue,
      password: passwordValue,
    });

    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      setValidationError(firstError);
      return;
    }

    loginUser(result.data);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold -mb-1">Welcome</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to log in
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="border rounded px-3 h-9 text-sm dark:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-ring"
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
            className="border rounded px-3 h-9 text-sm dark:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-ring"
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
          {isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="text-sm text-center">
        <span className="text-neutral-400">Don&apos;t have an account? </span>
        <Link href="/register" className="underline underline-offset-4">
          Register
        </Link>
      </p>
    </>
  );
}
