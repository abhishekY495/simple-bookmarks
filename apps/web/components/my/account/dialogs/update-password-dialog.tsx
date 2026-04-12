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
import { updateUserPasswordService } from "@/services/user-services";
import { UserPassword, UserPasswordSchema, UserResponse } from "@repo/schemas";

type UpdatePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
};

export function UpdatePasswordDialog({
  open,
  onOpenChange,
  user,
}: UpdatePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const { mutate: updateUserPassword, isPending } = useMutation({
    mutationFn: (userPassword: UserPassword) =>
      updateUserPasswordService(userPassword, user.accessToken ?? ""),
    onSuccess: () => {
      handleClose();
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setValidationError("");
    onOpenChange(false);
  };

  const handleSave = () => {
    setValidationError("");

    const result = UserPasswordSchema.safeParse({
      oldPassword: currentPassword,
      newPassword: newPassword,
    });
    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "An error occurred.";
      setValidationError(firstError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match.");
      return;
    }

    updateUserPassword(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded mx-auto" autoFocus={false}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update password
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
            <label className="text-sm font-medium">Current password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isPending}
              className="rounded"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isPending}
              className="rounded"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Confirm new password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
