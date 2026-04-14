import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <nav className="sticky pt-5 z-10">
      <div className="xl:w-[50%] w-full lg:mx-auto flex items-center md:justify-between justify-center bg-neutral-100 dark:bg-neutral-800 p-3 px-6 border-2 dark:border-neutral-700 rounded shadow-lg">
        <Link href="/" className="flex items-center gap-1.5">
          <Image
            src="/app-icon.png"
            alt="logo"
            width={28}
            height={28}
            loading="eager"
          />
          <h1 className="md:text-2xl font-bold text-xl ">Simple Bookmarks</h1>
        </Link>
        <Link
          href="/login"
          className="bg-neutral-950 dark:bg-neutral-200 text-primary-foreground dark:font-medium p-1.5 px-6 rounded hover:bg-neutral-800 hidden md:block"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
