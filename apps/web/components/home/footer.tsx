import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-2 p-4 px-5 bg-neutral-100 dark:bg-neutral-100 border-t border-t-neutral-300 dark:border-t-neutral-300">
      <p className="text-black dark:text-black">
        Made by{" "}
        <Link
          href="https://x.com/abhishekY495"
          target="_blank"
          className="text-neutral-500 dark:text-neutral-500 underline decoration-neutral-400 dark:decoration-neutral-400 underline-offset-[3px]"
        >
          Abhishek
        </Link>
      </p>
    </footer>
  );
}
