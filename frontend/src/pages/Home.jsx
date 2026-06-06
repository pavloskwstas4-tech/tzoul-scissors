import { useEffect, useState } from "react";
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
      <Ticker words={MANIFESTO_WORDS} theme="red" />

      {/* MANIFESTO */}
      <Reveal>
        <section id="manifesto" className="bg-gradient-to-b from-gray-50 to-white py-14 md:py-20">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 reveal">
              <div className="mt-5 w-12 h-12 bg-[#E63329] rounded-lg" />
            </div>
            <div className="md:col-span-8 reveal">
              <h2 className="title-massive text-2xl md:text-4xl lg:text-5xl leading-tight">
                It's not just a haircut<span className="text-[#E63329]">.</span> It's a ritual<span className="text-[#E63329]">.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-gray-600 text-sm md:text-base leading-relaxed">
                At TZOUL BARBER we fuse classic American barbering with the raw aesthetic of modern Athens.
                Vintage chairs, hot towels, music, culture — all under a black wall covered in typography.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* STYLE FINDER CTA */}
      <Reveal>
        <section id="style-finder" className="py-14 md:py-20 bg-black text-white relative overflow-hidden" data-testid="style-finder-cta">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, #E63329 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <div className="max-w-[1500px] mx-auto px-5 md:px-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 reveal">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E63329]/15 border border-[#E63329]/40 rounded-full mb-5">
                  <Sparkles size={13} className="text-[#E63329]" />
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#ffb1a8]">New · Style Finder</span>
                </div>
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl leading-[0.95]">
                  Not sure which cut suits you<span className="text-[#E63329]">?</span>
                </h2>
                <p className="mt-5 max-w-xl text-white/70 text-sm md:text-base leading-relaxed">
                  Answer 3 quick questions about your face shape, hair texture, and daily vibe — we'll match you
                  with the cut that fits your story, plus the barber who'll nail it.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Magnetic strength={0.25}>
                    <button
                      onClick={() => setStyleFinderOpen(true)}
                      data-testid="open-style-finder"
                      className="px-6 py-3 bg-[#E63329] text-white rounded-full font-display uppercase text-sm hover:bg-[#d62d25] transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Sparkles size={13} /> Find your style
                    </button>
                  </Magnetic>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-white/45">~30 seconds</span>
                </div>
              </div>
              <div className="md:col-span-5 reveal">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "Step 01", t: "Face shape" },
                    { l: "Step 02", t: "Hair texture" },
                    { l: "Step 03", t: "Daily vibe" },
                  ].map((s, i) => (
                    <div key={s.t} className="aspect-square rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-4 flex flex-col justify-between hover:border-[#E63329]/60 hover:bg-white/10 transition-all">
                      <div className="font-mono text-[0.56rem] uppercase tracking-wider text-white/50">{s.l}</div>
                      <div>
                        <div className="font-display text-lg md:text-xl leading-tight">{s.t}</div>
                        <div className="mt-2 w-6 h-[2px] bg-[#E63329]" />
                      </div>
                      <div className="font-display text-3xl md:text-4xl text-white/15 self-end">0{i + 1}</div>
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
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">Services<span className="text-[#E63329]">.</span></h2>
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
                          className="group flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-gray-900/90 hover:border-[#E63329] hover:shadow-md cursor-pointer"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-body text-sm md:text-base font-medium text-gray-900 truncate group-hover:text-[#E63329] transition-colors">{s.name}</span>
                            <span className="font-mono text-[0.58rem] uppercase tracking-wider text-gray-500 mt-0.5">
                              {s.duration} min
                            </span>
                          </div>
                          <span className="font-display text-xl md:text-2xl text-[#E63329] shrink-0">€{s.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-8 reveal">
              <Magnetic strength={0.25}>
                <button onClick={openBooking} data-testid="services-cta" className="px-6 py-3 bg-[#E63329] text-white rounded-full font-display uppercase text-sm hover:bg-[#d62d25] transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
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
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">On Instagram<span className="text-[#E63329]">.</span></h2>
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
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">The Plates<span className="text-[#E63329]">.</span></h2>
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
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">About<span className="text-[#E63329]">.</span></h2>
              </div>

              <div>
                <h3 className="title-massive text-xl md:text-3xl mt-1">Beyond the chair<span className="text-[#E63329]">.</span></h3>
                <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl leading-relaxed">
                  TZOUL BARBER was born from a love for traditional barbering and music.
                  Records on the wall, hip-hop in the air, references to Athenian street art — every corner tells a story.
                </p>
              </div>

              <div>
                <h3 className="title-massive text-xl md:text-3xl mt-1">The Philosophy<span className="text-[#E63329]">.</span></h3>
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
                    <div key={p.k} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
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
                <h2 className="title-massive text-3xl md:text-5xl lg:text-6xl mt-2">Visit<span className="text-[#E63329]">.</span></h2>
              </div>
              <p className="text-gray-500 text-sm max-w-md">
                Walk-ins welcome. Reservations strongly recommended.
              </p>
            </div>

            {biz && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                <div className="md:col-span-5 space-y-3 reveal">
                  <ContactCard testid="contact-address" icon={<MapPin size={14} className="shrink-0 text-[#E63329]" />} label="Address" value={biz.address} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address)}`} />
                  <ContactCard testid="contact-phone"   icon={<Phone size={14} className="shrink-0 text-[#E63329]" />} label="Phone"   value={biz.phone}   href={`tel:${biz.phone.replace(/\s/g, "")}`} />
                  <ContactCard testid="contact-email"   icon={<Mail size={14} className="shrink-0 text-[#E63329]" />} label="Email"   value={biz.email}   href={`mailto:${biz.email}`} />
                  <ContactCard testid="contact-instagram" icon={<Instagram size={14} className="shrink-0 text-[#E63329]" />} label="Instagram" value="@tzoulian_haircutz" href={biz.instagram} />

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
      <section className="bg-gradient-to-br from-[#E63329] to-[#d62d25] text-white py-16 md:py-20" data-testid="cta-band">
        <div className="max-w-[1500px] mx-auto px-5 md:px-8 text-center">
          <h2 className="title-massive text-5xl md:text-7xl lg:text-8xl leading-tight mt-3">Book the chair<span className="text-white/80">.</span></h2>
          <div className="mt-8 inline-block">
            <Magnetic strength={0.3}>
              <button onClick={openBooking} data-testid="cta-band-book" className="px-8 py-4 bg-black text-white rounded-full font-display uppercase text-base hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2">
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
      className="rounded-xl border border-gray-200 p-4 flex items-start gap-3 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all group"
    >
      {icon}
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[0.58rem] uppercase tracking-wider text-gray-500">{label}</div>
        <div className="font-display uppercase text-base mt-1 truncate text-gray-900">{value}</div>
      </div>
      <ArrowUpRight size={14} className="shrink-0 text-gray-400 group-hover:text-[#E63329] transition-colors" />
    </a>
  );
}


/* ---------------------------------------------------------------------------
 * HeroSection — Brutalist Type Poster.
 * Pure black, no photo. Massive "TZOUL" wordmark fills the canvas.
 * A horizontal marquee runs beneath. Chrome "Book →" pill bottom-right.
 * Streetwear / drop-page energy.
 * ------------------------------------------------------------------------- */
function HeroSection({ services, barbers, openBooking }) {
  void services;
  void barbers;

  const tickerWords = [
    "BARBER",
    "ATHENS",
    "HERAKLION",
    "EST. 2019",
    "NO. 526",
    "TZOUL",
    "BY APPOINTMENT",
    "TRADITION × STREET",
  ];

  return (
    <section
      id="hero"
      data-testid="hero"
      className="relative bg-[#0A0A0A] text-[#F5EFE7] overflow-hidden min-h-[100svh] flex flex-col"
    >
      {/* Subtle film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Top corner labels — Off-White style */}
      <div className="relative z-10 pt-28 md:pt-32 px-5 md:px-10">
        <div className="max-w-[1500px] mx-auto flex items-start justify-between">
          <div className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-[#F5EFE7]/55">
            <span className="text-[#E63329]">"</span>TZOUL<span className="text-[#E63329]">"</span>{" "}
            <span className="opacity-50">/</span> VOL.&nbsp;01 / DROP&nbsp;A
          </div>
          <div className="hidden md:block font-mono text-[0.6rem] uppercase tracking-[0.32em] text-[#F5EFE7]/55 text-right">
            FOR <span className="text-[#E63329]">PRIVATE</span> APPOINTMENT
            <br />
            <span className="opacity-60">SCHEDULED · NOT WALKED-IN</span>
          </div>
        </div>
      </div>

      {/* MASSIVE wordmark — takes the canvas */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 md:px-10">
        <div className="w-full">
          <h1
            data-testid="hero-title"
            className="font-display font-black uppercase text-[#F5EFE7] text-center leading-[0.78]"
            style={{
              fontFamily: "'Archivo Black', 'Anton', sans-serif",
              fontSize: "clamp(7rem, 28vw, 26rem)",
              letterSpacing: "-0.045em",
            }}
          >
            TZOUL
            <span
              aria-hidden="true"
              className="align-top text-[#E63329] font-mono"
              style={{ fontSize: "0.18em", marginLeft: "0.05em", letterSpacing: "0.05em" }}
            >
              ®
            </span>
          </h1>

          {/* Quotation-style sublabel underneath */}
          <div className="mt-2 md:mt-4 flex items-center justify-center gap-3 font-mono text-[0.65rem] md:text-xs uppercase tracking-[0.45em] text-[#F5EFE7]/70">
            <span className="inline-block w-8 md:w-12 h-px bg-[#F5EFE7]/40" />
            <span>
              <span className="text-[#E63329]">"</span>BARBER · ATHENS
              <span className="text-[#E63329]">"</span>
            </span>
            <span className="inline-block w-8 md:w-12 h-px bg-[#F5EFE7]/40" />
          </div>
        </div>
      </div>

      {/* Horizontal ticker tape */}
      <div className="relative z-10 border-y border-[#F5EFE7]/15 overflow-hidden py-4 md:py-5">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-10 shrink-0">
              {tickerWords.map((w, i) => (
                <span
                  key={`${idx}-${i}`}
                  className="font-display uppercase text-2xl md:text-4xl tracking-tight whitespace-nowrap flex items-center gap-10 text-[#F5EFE7]"
                >
                  {w}
                  <span className="inline-block w-1.5 h-1.5 bg-[#E63329] rotate-45" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row — copyright + chrome book button */}
      <div className="relative z-10 px-5 md:px-10 pb-6 md:pb-8 pt-6">
        <div className="max-w-[1500px] mx-auto flex items-end justify-between gap-4">
          <div className="font-mono text-[0.58rem] uppercase tracking-[0.32em] text-[#F5EFE7]/45 leading-relaxed">
            © 2026 TZOUL <span className="text-[#E63329]">/</span> NO. 526 IRAKLEIOU
            <br className="hidden md:inline" />
            <span className="hidden md:inline">★ 4.8 · 90 REVIEWS</span>
          </div>

          <Magnetic strength={0.3}>
            <button
              data-testid="hero-book-btn"
              onClick={openBooking}
              className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full font-mono text-[0.7rem] uppercase tracking-[0.32em] text-[#0A0A0A] transition-transform hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
              style={{
                background:
                  "linear-gradient(135deg, #f5f5f5 0%, #c9c9c9 35%, #ffffff 55%, #a8a8a8 100%)",
                border: "1px solid rgba(255,255,255,0.7)",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 bg-[#E63329] rounded-full"
                aria-hidden="true"
              />
              Book
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
