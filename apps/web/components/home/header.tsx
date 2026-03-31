import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <nav className="w-[60%] flex items-center justify-between mx-auto bg-neutral-100/50 backdrop-blur-xl p-3 px-6 border rounded-full sticky top-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/app-icon.png" alt="logo" width={28} height={28} />
        <h1 className="text-2xl font-bold">Simple Bookmarks</h1>
      </Link>
      <Link
        href="/login"
        className="bg-black text-white p-1.5 px-5 rounded-full hover:bg-neutral-800"
      >
        Login
      </Link>
    </nav>
  );
}
