import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "@/data/site";
import { Menu, X, ChevronsRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { useBooking } from "@/contexts/BookingContext";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [active, setActive] = useState("hero");
  const loc = useLocation();
  const nav = useNavigate();
  const { openBooking } = useBooking();
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  // Scroll-spy
  useEffect(() => {
    if (loc.pathname !== "/") return;
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = "hero";
      for (const l of NAV_LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.offsetTop <= y) current = l.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [loc.pathname]);

  const goToSection = (id) => (e) => {
    e.preventDefault();
    if (loc.pathname !== "/") {
      nav(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header data-testid="site-nav" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-[1500px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="/#hero" onClick={goToSection("hero")} data-testid="brand-logo" className="flex items-center gap-3 shrink-0 group">
          <span className="font-display text-2xl md:text-3xl leading-none relative">
            TZOUL
            <sup className="font-mono text-[0.36rem] align-super ml-1 text-[#38BDF8]">®</sup>
          </span>
          <span className="hidden md:inline font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 border-l border-gray-200 pl-3">
            BARBER / ATHENS
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-6 mx-auto">
          {NAV_LINKS.map((l) => {
            const isActive = loc.pathname === "/" && active === l.id;
            return (
              <a
                key={l.id}
                href={`/#${l.id}`}
                onClick={goToSection(l.id)}
                data-testid={`nav-link-${l.id}`}
                className={`group flex items-center gap-2 transition-colors ${isActive ? "text-sky-500" : "text-slate-600 hover:text-slate-900"}`}
              >
                <span className="font-mono text-[0.6rem] text-gray-400">{l.num}</span>
                <span className={`font-display text-xs tracking-wide uppercase ${isActive ? "font-semibold" : ""}`}>
                  {l.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex rounded-full overflow-hidden border border-gray-200 font-mono text-[0.66rem]" data-testid="lang-switch">
            {["EL", "EN"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-testid={`lang-${l}`}
                className={`px-3 py-1.5 transition-all ${lang === l ? "bg-sky-400 text-white" : "text-slate-600 hover:bg-gray-50"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <Magnetic strength={0.2}>
            <button onClick={openBooking} data-testid="nav-book-btn" className="px-4 py-2 bg-[#F97316] text-white rounded-full font-display uppercase text-xs hover:bg-[#EA580C] transition-all shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0F172A] flex items-center gap-1.5 border-2 border-[#0F172A]">
              <ChevronsRight size={12} /> Book now
            </button>
          </Magnetic>
          <button
            data-testid="mobile-menu-btn"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div data-testid="mobile-drawer" className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-5 py-5 flex flex-col gap-2">
            {NAV_LINKS.map((l) => {
              const isActive = loc.pathname === "/" && active === l.id;
              return (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={goToSection(l.id)}
                  data-testid={`mobile-nav-${l.id}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-sky-400 text-white" : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <span className={`font-mono text-[0.58rem] ${isActive ? "text-white/70" : "text-gray-400"}`}>{l.num}</span>
                  <span className="font-display uppercase text-base">{l.label}</span>
                </a>
              );
            })}
            <button onClick={openBooking} data-testid="mobile-book-btn" className="mt-2 px-4 py-3 bg-[#F97316] text-white rounded-lg font-display uppercase text-sm hover:bg-[#EA580C] transition-all shadow-[3px_3px_0px_#0F172A] flex items-center gap-2 border-2 border-[#0F172A]">
              <ChevronsRight size={12} /> Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
