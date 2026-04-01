import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-5 px-8">
        <Header />
        <div className="flex items-center justify-center mt-20">
          <div className="w-full max-w-sm flex flex-col gap-6">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
