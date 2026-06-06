import { Outlet } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MusicToggle from "@/components/MusicToggle";
import PageTransition from "@/components/PageTransition";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <Nav />
      <PageTransition>
        <main>
          <Outlet />
        </main>
        <Footer />
      </PageTransition>
      <MusicToggle />
    </div>
  );
}
