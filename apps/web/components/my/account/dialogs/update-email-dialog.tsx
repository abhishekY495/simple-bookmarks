import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserEmailService } from "@/services/user-services";
import { UserEmail, UserEmailSchema, UserResponse } from "@repo/schemas";
import { useAuthStore } from "@/store/auth-store";

type UpdateEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
};

export function UpdateEmailDialog({
  open,
  onOpenChange,
  user,
}: UpdateEmailDialogProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const { mutate: updateUserEmail, isPending } = useMutation({
    mutationFn: (userEmail: UserEmail) =>
      updateUserEmailService(userEmail, user.accessToken ?? ""),
    onSuccess: () => {
      setAuth({ ...user, email: email });
      handleClose();
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleClose = () => {
    setEmail("");
    setValidationError("");
    onOpenChange(false);
  };

  const handleSave = () => {
    setValidationError("");

    const result = UserEmailSchema.safeParse({
      email: email,
    });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      setValidationError(firstError);
      return;
    }

    updateUserEmail(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded mx-auto" autoFocus={false}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update email
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col gap-4 mt-1"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="rounded"
              required
            />
          </div>

          {validationError && (
            <p className="text-sm text-red-500">{validationError}</p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="rounded cursor-pointer"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              className="rounded cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
