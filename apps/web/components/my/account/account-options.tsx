import { Button } from "@/components/ui/button";
import { UserResponse } from "@repo/schemas";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UpdatePasswordDialog } from "./dialogs/update-password-dialog";
import { UpdateEmailDialog } from "./dialogs/update-email-dialog";
import { LogoutDialog } from "./dialogs/logout-dialog";

export function AccountOptions({ user }: { user: UserResponse }) {
  const [updatePasswordOpen, setUpdatePasswordOpen] = useState(false);
  const [updateEmailOpen, setUpdateEmailOpen] = useState(false);
  const [logoutAccountOpen, setLogoutAccountOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Change password */}
      <div className="flex justify-between items-center gap-2 border-b pb-5 pt-1">
        <div className="flex flex-col">
          <p className="font-semibold">Update password</p>
          <p className="text-sm text-muted-foreground">
            Update your account password.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded cursor-pointer px-6 border border-border"
          onClick={() => setUpdatePasswordOpen(true)}
        >
          Update Password
        </Button>
      </div>

      {/* Change email */}
      <div className="flex justify-between items-center gap-2 border-b pb-5">
        <div className="flex flex-col">
          <p className="font-semibold">Update email</p>
          <p className="text-sm text-muted-foreground">
            Update your account email.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded cursor-pointer px-6 border border-border"
          onClick={() => setUpdateEmailOpen(true)}
        >
          Update Email
        </Button>
      </div>

      {/* Theme toggle */}
      <div className="flex justify-between items-center gap-2 border-b pb-5">
        <div className="flex flex-col">
          <p className="font-semibold">Theme</p>
          <p className="text-sm text-muted-foreground">
            Change the theme of the application.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Logout account */}
      <div className="flex justify-between items-center gap-2 pb-1.5">
        <div className="flex flex-col">
          <p className="font-semibold">Logout</p>
          <p className="text-sm text-muted-foreground">
            Logout from your account.
          </p>
        </div>
        <Button
          variant="destructive"
          className="rounded cursor-pointer px-6 border border-red-300 dark:border-red-800"
          onClick={() => setLogoutAccountOpen(true)}
        >
          Logout
        </Button>
      </div>

      <UpdatePasswordDialog
        open={updatePasswordOpen}
        onOpenChange={setUpdatePasswordOpen}
        user={user}
      />
      <UpdateEmailDialog
        open={updateEmailOpen}
        onOpenChange={setUpdateEmailOpen}
        user={user}
      />
      <LogoutDialog
        open={logoutAccountOpen}
        onOpenChange={setLogoutAccountOpen}
      />
    </div>
  );
}
