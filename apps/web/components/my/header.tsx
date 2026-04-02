import { getAvatar } from "@/utils/get-avatar";
import { UserResponse } from "@repo/schemas";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header({ user }: { user: UserResponse }) {
  const avatar = getAvatar(user.fullName);
  const pathname = usePathname();

  const isAccountPage = pathname === "/my/account";

  return (
    <header className="w-full sticky top-0 flex  justify-between items-center p-3 px-3 pr-4 bg-muted border-b border-x-0 border-2">
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
