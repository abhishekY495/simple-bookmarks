import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logoutService } from "@/services/auth-services";
import { useAuthStore } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type LogoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: () => logoutService(),
    onSettled: () => {
      clearAuth();
      onOpenChange(false);
      router.replace("/");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded mx-auto -mt-20 gap-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Logout</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-end gap-2 mt-5">
          <Button
            variant="outline"
            className="rounded cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <Button
            className="rounded cursor-pointer bg-red-400 text-white hover:bg-red-500"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
