import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-black border-t hairline">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="font-display text-3xl tracking-[0.12em]">ATH · BARBERCLUB</div>
          <p className="mt-4 text-white/55 max-w-sm text-sm leading-relaxed">
            A private grooming house in Athens. By appointment only.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-4">House</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#about" data-testid="footer-link-about">About</a></li>
            <li><a href="#services" data-testid="footer-link-services">Services</a></li>
            <li><a href="#team" data-testid="footer-link-team">Team</a></li>
            <li><a href="#gallery" data-testid="footer-link-gallery">Gallery</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Leoforos Irakleiou 526, Athens</li>
            <li>+30 21 1218 0303</li>
            <li>athbarberclub@gmail.com</li>
          </ul>
          <Link to="/book" data-testid="footer-book" className="btn-ghost mt-6 !py-3 !px-5">Book →</Link>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.32em] text-white/35">
          <span>© {new Date().getFullYear()} ATH Barberclub. All rights reserved.</span>
          <span>Athens · Greece</span>
        </div>
      </div>
    </footer>
  );
}
