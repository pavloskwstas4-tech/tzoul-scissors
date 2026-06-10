import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronsRight, ArrowUpRight, ArrowRight, Phone, Mail, MapPin, Instagram, Sparkles } from "lucide-react";
import Ticker from "@/components/Ticker";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Magnetic from "@/components/Magnetic";
import ParallaxImage from "@/components/ParallaxImage";
import { SHOP_IMAGES, STOCK, MANIFESTO_WORDS, SERVICE_GROUPS } from "@/data/site";
import { useBooking } from "@/contexts/BookingContext";
import BookingModal from "@/components/BookingModal";
import StyleFinder from "@/components/StyleFinder";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [biz, setBiz] = useState(null);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [styleFinderOpen, setStyleFinderOpen] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    axios.get(`${API}/services`).then((r) => setServices(r.data)).catch(() => {});
    axios.get(`${API}/barbers`).then((r) => setBarbers(r.data)).catch(() => {});
    axios.get(`${API}/business`).then((r) => setBiz(r.data)).catch(() => {});
    axios.get(`${API}/instagram-posts`).then((r) => setInstagramPosts(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <BookingModal />
      <StyleFinder open={styleFinderOpen} onClose={() => setStyleFinderOpen(false)} />
      
      {/* HERO — Split layout: editorial left + sharp photo right, red marquee below */}
      <HeroSection services={services} barbers={barbers} openBooking={openBooking} />

      {/* Ticker */}
      <Ticker words={MANIFESTO_WORDS} theme="blue" />

      {/* MANIFESTO */}
      <Reveal>
        <section id="manifesto" className="bg-[#F5F5F7] py-14 md:py-20 border-y border-black/[0.05]">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 reveal flex flex-col justify-center gap-8 pt-2">
              {[
                { num: "2019", label: "Est. Athens" },
                { num: "4.8★", label: "90+ Reviews" },
                { num: "No.526", label: "Leoforos Irakleiou" },
              ].map((s) => (
                <div key={s.num} className="border-l-2 border-[#1D1D1F]/10 pl-5">
                  <div className="font-display font-black text-3xl md:text-4xl text-[#1D1D1F] leading-none">{s.num}</div>
                  <div className="font-mono text-[0.6rem] uppercase tracking-widest text-[#A1A1A6] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="md:col-span-8 reveal">
              <h2 className="title-massive text-2xl md:text-4xl lg:text-5xl leading-tight">
                It's not just a haircut. It's a ritual.
              </h2>
              <p className="mt-5 max-w-2xl text-[#86868B] text-sm md:text-base leading-relaxed">
                At TZOUL BARBER we fuse classic American barbering with the raw aesthetic of modern Athens.
                Vintage chairs, hot towels, music, culture — all under a wall covered in typography.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* STYLE FINDER CTA */}
      <Reveal>
        <section id="style-finder" className="py-14 md:py-20 bg-[#1D1D1F] text-white relative overflow-hidden" data-testid="style-finder-cta">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="max-w-[1500px] mx-auto px-5 md:px-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 reveal">
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl leading-[0.95]">
                  Not sure which cut suits you?
                </h2>
                <p className="mt-5 max-w-xl text-white/55 text-sm md:text-base leading-relaxed">
                  Answer 3 quick questions about your face shape, hair texture, and daily vibe — we'll match you with the cut that fits your story.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Magnetic strength={0.25}>
                    <button onClick={() => setStyleFinderOpen(true)} data-testid="open-style-finder"
                      className="btn-white flex items-center gap-2">
                      <Sparkles size={13} /> Find your style
                    </button>
                  </Magnetic>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-white/35">~30 seconds</span>
                </div>
              </div>
              <div className="md:col-span-5 reveal">
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: "Step 01", t: "Face shape" }, { l: "Step 02", t: "Hair texture" }, { l: "Step 03", t: "Daily vibe" }].map((s, i) => (
                    <div key={s.t} className="aspect-square rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex flex-col justify-between hover:bg-white/10 transition-all">
                      <div className="font-mono text-[0.56rem] uppercase tracking-wider text-white/40">{s.l}</div>
                      <div>
                        <div className="font-display text-lg md:text-xl leading-tight">{s.t}</div>
                        <div className="mt-2 w-5 h-px bg-white/30" />
                      </div>
                      <div className="font-display text-3xl md:text-4xl text-white/10 self-end">0{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SERVICES */}
      <Reveal>
        <section id="services" className="py-14 md:py-20 bg-white" data-testid="services-section">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8">
            <div className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
              <div>
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">Services.</h2>
              </div>
              <p className="text-gray-500 text-sm max-w-md">
                All prices are indicative. Ask your barber for a personalised quote.
              </p>
            </div>

            <div className="space-y-6">
              {SERVICE_GROUPS.map((g) => {
                const items = services.filter((s) => s.category === g.key);
                if (items.length === 0) return null;
                return (
                  <div key={g.key} className="reveal" data-testid={`group-${g.key}`}>
                    <div className="flex items-center justify-between pb-2 mb-3 gap-4">
                      <h3 className="title-massive text-xl md:text-2xl">{g.label}</h3>
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-400">
                        {String(items.length).padStart(2, "0")} Items
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" data-testid={`svc-list-${g.key}`}>
                      {items.map((s) => (
                        <div
                          key={s.id}
                          data-testid={`svc-${s.id}`}
                          onClick={openBooking}
                          className="group flex items-center justify-between gap-3 px-5 py-4 bg-white rounded-2xl hover:bg-[#F5F5F7] transition-all duration-300 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 cursor-pointer"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-body text-sm md:text-base font-medium text-[#1D1D1F] truncate group-hover:text-[#1D1D1F] transition-colors">{s.name}</span>
                            <span className="font-mono text-[0.58rem] uppercase tracking-wider text-gray-500 mt-0.5">
                              {s.duration} min
                            </span>
                          </div>
                          <span className="font-display text-xl md:text-2xl text-[#1D1D1F] shrink-0">€{s.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-8 reveal">
              <Magnetic strength={0.25}>
                <button onClick={openBooking} data-testid="services-cta" className="btn-dark flex items-center gap-2">
                  <ChevronsRight size={13} /> Book Your Service
                </button>
              </Magnetic>
            </div>
          </div>
        </section>
      </Reveal>

      {/* INSTAGRAM FEED */}
      <Reveal>
        <section id="instagram" className="py-14 md:py-20 bg-white" data-testid="instagram-section">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8">
            <div className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
              <div>
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">On Instagram.</h2>
                <p className="text-gray-500 text-sm mt-2">See our latest work and transformations</p>
              </div>
              <a
                href="https://www.instagram.com/tzoulian_haircutz"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-display uppercase text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Instagram size={16} /> @tzoulian_haircutz
              </a>
            </div>

            {instagramPosts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="instagram-grid">
                {instagramPosts.slice(0, 8).map((post) => (
                  <a
                    key={post.id}
                    href={post.post_url || "https://www.instagram.com/tzoulian_haircutz"}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative aspect-square rounded-xl overflow-hidden bg-gray-900 hover:shadow-xl transition-all"
                  >
                    <img
                      src={post.image_url}
                      alt={post.caption || "Instagram post"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4 w-full">
                        {post.caption && (
                          <p className="text-white text-sm line-clamp-3">{post.caption}</p>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Instagram size={16} className="text-pink-600" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <Instagram size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Follow us on Instagram to see our latest work</p>
                <a
                  href="https://www.instagram.com/tzoulian_haircutz"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-display uppercase text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  @tzoulian_haircutz
                </a>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* GALLERY */}
      <Reveal>
        <section id="gallery" className="py-14 md:py-20 bg-white" data-testid="gallery-section">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8">
            <div className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
              <div>
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">The Plates.</h2>
              </div>
              <a
                href="https://www.instagram.com/tzoulian_haircutz" target="_blank" rel="noreferrer"
                data-testid="gallery-ig-link"
                className="font-mono text-[0.62rem] uppercase tracking-wider text-gray-500 hover:text-[#E63329] transition-colors"
              >
                @tzoulian_haircutz →
              </a>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-8 rounded-xl overflow-hidden"><ParallaxImage src={SHOP_IMAGES.storefront} alt="Storefront" label="Plate · 01" height={420} /></div>
              <div className="col-span-12 md:col-span-4 rounded-xl overflow-hidden"><ParallaxImage src={SHOP_IMAGES.interior1} alt="Chairs" label="Plate · 02" height={420} /></div>
              <div className="col-span-6 md:col-span-4 rounded-xl overflow-hidden"><ParallaxImage src={SHOP_IMAGES.interior2} alt="Lounge" label="Plate · 03" height={280} /></div>
              <div className="col-span-6 md:col-span-4 rounded-xl overflow-hidden"><ParallaxImage src={STOCK.razor} alt="Tools" label="Plate · 04" height={280} /></div>
              <div className="col-span-12 md:col-span-4 rounded-xl overflow-hidden"><ParallaxImage src={SHOP_IMAGES.staircase} alt="Mural" label="Plate · 05" height={280} /></div>
              <div className="col-span-6 md:col-span-5 rounded-xl overflow-hidden"><ParallaxImage src={STOCK.beardCloseup} alt="Beard" label="Plate · 06" height={260} /></div>
              <div className="col-span-6 md:col-span-7 rounded-xl overflow-hidden"><ParallaxImage src={SHOP_IMAGES.exterior} alt="Exterior" label="Plate · 07" height={260} /></div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ABOUT */}
      <Reveal>
        <section id="about" className="py-14 md:py-20 bg-gradient-to-b from-gray-50 to-white" data-testid="about-section">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5 reveal">
              <div className="rounded-xl overflow-hidden">
                <ParallaxImage src={SHOP_IMAGES.interior2} alt="Inside TZOUL BARBER" label="Est. 2019" height={520} />
              </div>
            </div>

            <div className="md:col-span-7 reveal space-y-7">
              <div>
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">About.</h2>
              </div>

              <div>
                <h3 className="title-massive text-xl md:text-3xl mt-1">Beyond the chair.</h3>
                <p className="mt-3 text-sm md:text-base text-[#86868B] max-w-2xl leading-relaxed">
                  TZOUL BARBER was born from a love for traditional barbering and music.
                  Records on the wall, hip-hop in the air, references to Athenian street art — every corner tells a story.
                </p>
              </div>

              <div>
                <h3 className="title-massive text-xl md:text-3xl mt-1">The Philosophy.</h3>
                <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl leading-relaxed">
                  Curated products, vintage Belmont and Takara chairs, hot towels, straight razor. No rushing.
                  Every client leaves transformed.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 max-w-2xl">
                  {[
                    { k: "Tradition", v: "Straight razor, hot towel." },
                    { k: "Modern",    v: "Contemporary fades & styling." },
                    { k: "Culture",   v: "Music, art, street." },
                    { k: "Products",  v: "Curated. Premium." },
                  ].map((p) => (
                    <div key={p.k} className="p-4 bg-white rounded-2xl border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
                      <div className="font-display uppercase text-sm md:text-base">{p.k}</div>
                      <div className="font-mono text-[0.62rem] text-gray-500 mt-1">{p.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CONTACT */}
      <Reveal>
        <section id="contact" className="py-14 md:py-20 bg-white" data-testid="contact-section">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8">
            <div className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
              <div>
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">Visit.</h2>
              </div>
              <p className="text-gray-500 text-sm max-w-md">
                Walk-ins welcome. Reservations strongly recommended.
              </p>
            </div>

            {biz && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                <div className="md:col-span-5 space-y-3 reveal">
                  <ContactCard testid="contact-address" icon={<MapPin size={14} className="shrink-0 text-[#86868B]" />} label="Address" value={biz.address} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address)}`} />
                  <ContactCard testid="contact-phone"   icon={<Phone size={14} className="shrink-0 text-[#86868B]" />} label="Phone"   value={biz.phone}   href={`tel:${biz.phone.replace(/\s/g, "")}`} />
                  <ContactCard testid="contact-email"   icon={<Mail size={14} className="shrink-0 text-[#86868B]" />} label="Email"   value={biz.email}   href={`mailto:${biz.email}`} />
                  <ContactCard testid="contact-instagram" icon={<Instagram size={14} className="shrink-0 text-[#86868B]" />} label="Instagram" value="@tzoulian_haircutz" href={biz.instagram} />

                  <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                    <div className="font-mono text-[0.58rem] uppercase tracking-wider text-gray-500 mb-3">Opening Hours</div>
                    <ul className="space-y-2 text-xs">
                      {Object.entries(biz.hours_label).map(([day, hours]) => (
                        <li key={day} className="flex justify-between pb-2 border-b border-gray-200 last:border-0">
                          <span className="font-mono uppercase text-[0.66rem] tracking-wider text-gray-700">{day}</span>
                          <span className={hours === "Closed" ? "text-gray-400" : "font-display text-gray-900"}>{hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-7 reveal rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <iframe
                    data-testid="contact-map"
                    title="TZOUL BARBER Location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(biz.address)}&output=embed`}
                    className="w-full h-[380px] md:h-[560px] border-0 block"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* CTA BAND */}
      <section className="bg-[#1D1D1F] text-white py-16 md:py-24" data-testid="cta-band">
        <div className="max-w-[1500px] mx-auto px-5 md:px-8 text-center">
          <h2 className="title-massive text-5xl md:text-7xl lg:text-8xl leading-tight mt-3 text-white">Book the chair.</h2>
          <p className="mt-4 text-white/45 text-sm md:text-base max-w-md mx-auto">By appointment only. No walk-ins.</p>
          <div className="mt-8 inline-block">
            <Magnetic strength={0.3}>
              <button onClick={openBooking} data-testid="cta-band-book" className="btn-white flex items-center gap-2">
                Book Appointment <ChevronsRight size={16} />
              </button>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon, label, value, href, testid }) {
  return (
    <a
      href={href}
      data-testid={testid}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="rounded-2xl border border-black/[0.05] p-4 flex items-start gap-3 bg-white hover:bg-[#F5F5F7] transition-all group shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
    >
      {icon}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[0.58rem] uppercase tracking-wider text-gray-500">{label}</div>
        <div className="font-display uppercase text-base mt-1 truncate text-gray-900">{value}</div>
      </div>
      <ArrowUpRight size={14} className="shrink-0 text-[#A1A1A6] group-hover:text-[#1D1D1F] transition-colors" />
    </a>
  );
}


/* ---------------------------------------------------------------------------
 * HeroSection — Scroll-driven video scrub + text split.
 * Layout: strict 100vh section → absolute video layer → absolute flex overlay.
 * ScrollTrigger created IMMEDIATELY (no metadata wait) so pin is always active.
 * ------------------------------------------------------------------------- */
function HeroSection({ services, barbers, openBooking }) {
  void services; void barbers;

  const sectionRef  = useRef(null);
  const videoRef    = useRef(null);
  const cornerLRef  = useRef(null);
  const cornerRRef  = useRef(null);
  const wordLRef    = useRef(null);
  const wordRRef    = useRef(null);
  const subtitleRef = useRef(null);
  const bottomRef   = useRef(null);

  useEffect(() => {
    const video   = videoRef.current;
    const section = sectionRef.current;

    video.load();

    // ── Text exit timeline (paused; driven manually via onUpdate) ────────────
    const textTl = gsap.timeline({ paused: true })
      .to(wordLRef.current,    { xPercent: -150, opacity: 0, ease: "none" }, 0)
      .to(wordRRef.current,    { xPercent:  150, opacity: 0, ease: "none" }, 0)
      .to(cornerLRef.current,  { x: -140,  opacity: 0, ease: "none" }, 0)
      .to(cornerRRef.current,  { x:  140,  opacity: 0, ease: "none" }, 0)
      .to(subtitleRef.current, { opacity: 0, y: 10, ease: "none" }, 0)
      .to(bottomRef.current,   { opacity: 0, y: 32, ease: "none" }, 0);

    // ── ScrollTrigger ────────────────────────────────────────────────────────
    // scrub: 2.5 on the ScrollTrigger (NOT on an animation) means GSAP's
    // internal inertia tween catches up to raw scroll over 2.5 s.
    // self.progress in onUpdate IS the smoothed value — the inertia is already
    // baked in before we touch the video or text.
    ScrollTrigger.create({
      trigger:             section,
      start:               "top top",
      end:                 () => `+=${window.innerHeight * 12}`,
      pin:                 true,
      pinSpacing:          true,
      anticipatePin:       1,
      scrub:               2.5,
      invalidateOnRefresh: true,
      onUpdate(self) {
        // Video: near-instant tween (0.1 s) on top of the already-smoothed
        // scrub progress. overwrite:"auto" kills any in-flight tween first.
        const dur = video.duration;
        if (dur && isFinite(dur)) {
          gsap.to(video, {
            currentTime: self.progress * dur,
            duration:    0.1,
            ease:        "none",
            overwrite:   "auto",
          });
        }
        // Text exits in first 25 % of scrubbed scroll progress
        textTl.progress(Math.min(self.progress / 0.25, 1));
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    /*
     * 1. Strict 100vh container — gives GSAP a reliable offsetHeight to measure.
     *    overflow:hidden clips the text as it exits left/right.
     */
    <section
      ref={sectionRef}
      id="hero"
      data-testid="hero"
      style={{ position: "relative", zIndex: 10, width: "100%", height: "100vh", overflow: "hidden", background: "#000" }}
    >
      {/*
       * 2. True fullscreen video — explicit px/% coords so it never collapses.
       */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        webkit-playsinline="true"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
      >
        <source src="https://customer-assets.emergentagent.com/job_tzoul-build-1/artifacts/wsanky2s_Metallic_hair_cutting_scissor_ro%E2%80%A6_202606072121.mp4" type="video/mp4" />
      </video>

      {/* Dim overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />

      {/*
       * 3. Single overlay content container — position:absolute fills the
       *    100vh section, then uses flex-column internally so centering
       *    and spacing work without breaking the pin.
       */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2, display: "flex", flexDirection: "column" }}>

        {/* Corner labels */}
        <div style={{ padding: "7rem 2.5rem 0" }}>
          <div className="max-w-[1500px] mx-auto flex items-start justify-between">
            <div ref={cornerLRef} className="font-mono text-[0.58rem] uppercase tracking-[0.32em] text-white/50">
              "TZOUL" / VOL. 01 / DROP A
            </div>
            <div ref={cornerRRef} className="hidden md:block font-mono text-[0.58rem] uppercase tracking-[0.32em] text-white/50 text-right">
              FOR PRIVATE APPOINTMENT<br />
              <span className="opacity-70">SCHEDULED · NOT WALKED-IN</span>
            </div>
          </div>
        </div>

        {/* Wordmark — flex:1 centers it in the remaining space */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 1.25rem" }}>
          <div style={{ width: "100%" }}>
            <h1
              data-testid="hero-title"
              className="font-display font-black uppercase text-white text-center select-none"
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(7rem, 28vw, 26rem)", letterSpacing: "-0.045em", lineHeight: 0.82 }}
            >
              <span ref={wordLRef} style={{ display: "inline-block" }}>TZO</span>
              <span ref={wordRRef} style={{ display: "inline-block" }}>
                UL
                <span aria-hidden="true" className="align-top text-white/40 font-mono"
                  style={{ fontSize: "0.18em", marginLeft: "0.05em", letterSpacing: "0.05em" }}>®</span>
              </span>
            </h1>
            <div
              ref={subtitleRef}
              className="font-mono uppercase text-white/50"
              style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", fontSize: "0.7rem", letterSpacing: "0.42em" }}
            >
              <span style={{ display: "inline-block", width: "3rem", height: "1px", background: "rgba(255,255,255,0.2)" }} />
              BARBER · ATHENS
              <span style={{ display: "inline-block", width: "3rem", height: "1px", background: "rgba(255,255,255,0.2)" }} />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div ref={bottomRef} style={{ padding: "0 2.5rem 1.5rem" }}>
          <div className="max-w-[1500px] mx-auto flex items-end justify-between gap-4">
            <div className="font-mono text-[0.56rem] uppercase tracking-[0.28em] text-white/40 leading-relaxed">
              © 2026 TZOUL / NO. 526 IRAKLEIOU
              <br className="hidden md:inline" />
              <span className="hidden md:inline">★ 4.8 · 90 REVIEWS</span>
            </div>
            <Magnetic strength={0.3}>
              <button data-testid="hero-book-btn" onClick={openBooking}
                className="btn-dark group flex items-center gap-3 px-6 py-3">
                <span className="inline-block w-1.5 h-1.5 bg-white/60 rounded-full" aria-hidden="true" />
                Book
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </section>
  );
}
