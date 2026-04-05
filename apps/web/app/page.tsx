import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 p-5 pt-0 px-8 pb-28">
        <Header />
        <div className="flex flex-col gap-4 items-center justify-center mt-28">
          <h1 className="text-6xl font-black text-center tracking-tight text-black">
            <span>
              Bookmark manager <br /> for{" "}
            </span>
            <span className="text-red-500">the modern web</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-500 text-balance w-full max-w-2xl text-center">
            Keep everything you discover — all in one place
          </p>
          <Link
            href="/my/unsorted"
            className="bg-black text-white p-2 px-6 mt-6 rounded hover:bg-neutral-800 shadow-[3px_3px_0_rgba(244,67,54,0.7)] active:translate-y-[3px] active:shadow-none transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
