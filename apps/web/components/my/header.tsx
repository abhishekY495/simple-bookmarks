import { getAvatar } from "@/utils/get-avatar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function Header() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    redirect("/login");
  }

  const avatar = getAvatar(user.fullName);
  const pathname = usePathname();

  const isAccountPage = pathname === "/my/account";

  return (
    <header className="w-full sticky top-0 flex justify-between items-center p-3 px-4 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 border-x-2 border-b-2 rounded-b">
      <Link href="/my" className="flex items-center gap-1.5">
        <Image
          src={isAccountPage ? "/back-icon.png" : "/app-icon.png"}
          alt="logo"
          width={28}
          height={28}
        />
        <h1 className="lg:text-2xl font-bold text-xl">
          {isAccountPage ? "Settings" : "Simple Bookmarks"}
        </h1>
      </Link>

      <Link href="/my/account">
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatar} className="rounded" />
          <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}
