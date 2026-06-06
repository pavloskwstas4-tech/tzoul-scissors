import { useRef, useState, useEffect } from "react";

// Image with parallax (Y translate based on scroll) + split-frame hover reveal.
export default function ParallaxImage({ src, alt, label, className = "", height = 320 }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = (window.innerHeight / 2) - center;
      setOffset(dist * 0.06);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className={`split-frame relative overflow-hidden border-2 border-ink ${className}`} style={{ height }}>
      <img
        src={src}
        alt={alt}
        style={{ transform: `translateY(${offset}px) scale(1.08)`, filter: "grayscale(100%) contrast(1.05)" }}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />
      {/* Split-frame red sweep on hover */}
      <span className="sf-slat slat-top" />
      <span className="sf-slat slat-bottom" />
      {label && (
        <span className="absolute top-3 left-3 bg-[#E63329] text-white font-mono text-[0.6rem] uppercase tracking-[0.18em] px-1.5 py-0.5 z-10">
          {label}
        </span>
      )}
    </div>
  );
}
