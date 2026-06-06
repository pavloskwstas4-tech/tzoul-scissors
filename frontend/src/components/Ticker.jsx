// Baby blue horizontal ticker tape.
export default function Ticker({ words, theme = "blue" }) {
  const bg = theme === "blue"
    ? "bg-[#38BDF8] text-[#0F172A] border-y-2 border-[#0F172A]"
    : "bg-[#0F172A] text-white border-y-2 border-[#0F172A]";
  return (
    <div data-testid="ticker" className={`${bg} overflow-hidden py-4 md:py-5`}>
      <div className="marquee-track">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-12 shrink-0">
            {words.map((w, i) => (
              <span key={`${idx}-${i}`} className="font-display uppercase text-3xl md:text-5xl tracking-tight whitespace-nowrap flex items-center gap-12">
                {w}
                <span className={`inline-block w-2 h-2 rotate-45 ${theme === "blue" ? "bg-[#0F172A]" : "bg-[#38BDF8]"}`} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
