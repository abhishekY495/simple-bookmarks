import { useAuthStore } from "@/store/auth-store";
import { Button } from "../ui/button";
import { UserFullName, UserFullNameSchema, UserResponse } from "@repo/schemas";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserFullNameService } from "@/services/user-services";

export function AccountDetails({ user }: { user: UserResponse }) {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [fullNameValue, setFullNameValue] = useState(user.fullName);
  const [validationError, setValidationError] = useState("");

  const { mutate: updateUserFullName, isPending } = useMutation({
    mutationFn: (userFullName: UserFullName) =>
      updateUserFullNameService(userFullName, user.accessToken ?? ""),
    onSuccess: (data) => {
      setAuth({ ...user, fullName: data.fullName });
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    const result = UserFullNameSchema.safeParse({
      fullName: fullNameValue,
    });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      setValidationError(firstError);
      return;
    }

    updateUserFullName(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="account-full-name" className="text-sm font-semibold">
          Full Name
        </label>
        <input
          id="account-full-name"
          type="text"
          placeholder="Your full name"
          value={fullNameValue}
          onChange={(e) => setFullNameValue(e.target.value)}
          className="border rounded px-3 h-9 text-sm bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="account-email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="account-email"
          type="email"
          value={user.email}
          disabled
          className="w-full border rounded px-3 h-9 text-sm outline-none bg-muted"
        />
      </div>

      {validationError && (
        <p className="text-sm text-destructive">{validationError}</p>
      )}

      <div className="flex justify-start">
        <Button
          disabled={isPending}
          type="submit"
          className="rounded cursor-pointer px-5 bg-sky-500 hover:bg-sky-600 text-white"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
