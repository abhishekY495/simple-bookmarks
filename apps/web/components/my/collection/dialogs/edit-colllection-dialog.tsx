import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateCollectionService } from "@/services/collection-service";
import { useAuthStore } from "@/store/auth-store";
import {
  CollectionResponse,
  UpdateCollection,
  UpdateCollectionSchema,
} from "@repo/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { getPublicCollectionUrl } from "@/utils/get-public-collection-url";

type EditCollectionDialogProps = {
  collection: CollectionResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditCollectionDialog({
  collection,
  open,
  onOpenChange,
}: EditCollectionDialogProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(collection.name ?? "");
  const [emoji, setEmoji] = useState(collection.emoji ?? "📁");
  const [isPublic, setIsPublic] = useState(collection.isPublic);
  const [validationError, setValidationError] = useState("");
  const publicCollectionUrl = getPublicCollectionUrl(collection.id);

  const handleClose = () => {
    setName(collection.name ?? "");
    setValidationError("");
    onOpenChange(false);
  };

  const { mutate: updateCollection, isPending } = useMutation({
    mutationFn: (payload: UpdateCollection) =>
      updateCollectionService(user?.accessToken ?? "", collection.id, payload),
    onSuccess: async () => {
      handleClose();
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      setValidationError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    const result = UpdateCollectionSchema.safeParse({
      name,
      emoji,
      isPublic,
    });

    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "Failed to update collection";
      setValidationError(firstError);
      return;
    }

    updateCollection(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded mx-auto -mt-20">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit collection
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="collection-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="collection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Collection"
              disabled={isPending}
              className="rounded"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="collection-emoji" className="text-sm font-medium">
              Emoji
            </label>
            <div className="flex items-center gap-2">
              <span className="p-1 text-lg border rounded cursor-pointer">
                {emoji}
              </span>
              <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className="rounded w-fit border border-border cursor-pointer focus-visible:ring-0 focus:ring-0"
                  >
                    Update emoji
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0" align="start">
                  <EmojiPicker
                    className="h-[326px] rounded"
                    onEmojiSelect={({ emoji }) => {
                      setIsOpen(false);
                      setEmoji(emoji);
                    }}
                  >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t pt-4">
            <div className="flex gap-2 items-center">
              <label
                htmlFor="collection-is-public"
                className="text-[16px] font-medium"
              >
                Public
              </label>
              <Switch
                id="collection-is-public"
                className="cursor-pointer"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <div
              className={`p-2 rounded border select-none ${isPublic ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground/50 cursor-not-allowed"}`}
            >
              {isPublic ? (
                <Link href={publicCollectionUrl} target="_blank">
                  {publicCollectionUrl}
                </Link>
              ) : (
                publicCollectionUrl
              )}
            </div>
          </div>

          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded cursor-pointer px-5"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
