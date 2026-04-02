import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <nav className="bg-white sticky p-5 pb-0 lg:top-0">
      <div className="lg:w-[60%] w-full lg:mx-auto flex items-center lg:justify-between justify-center bg-neutral-100 p-3 px-6 border-2 rounded shadow-xl">
        <Link href="/" className="flex items-center gap-1.5">
          <Image src="/app-icon.png" alt="logo" width={28} height={28} />
          <h1 className="lg:text-2xl font-bold text-xl">Simple Bookmarks</h1>
        </Link>
        <Link
          href="/login"
          className="bg-black text-white p-1.5 px-6 rounded hover:bg-neutral-800 hidden lg:block"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
