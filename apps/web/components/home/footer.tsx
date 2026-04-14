import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-2 p-4 px-5 border-t bg-muted">
      <p>
        Made by{" "}
        <Link
          href="https://x.com/abhishekY495"
          target="_blank"
          className="text-muted-foreground underline underline-offset-[3px]"
        >
          Abhishek
        </Link>
      </p>
    </footer>
  );
}
