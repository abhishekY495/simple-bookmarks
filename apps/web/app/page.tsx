import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";

export default function Home() {
  return (
    <div className="force-light flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1">
        <Header />
        <div className="p-5 px-8 pb-28 mt-5"></div>
      </div>
      <Footer />
    </div>
  );
}
