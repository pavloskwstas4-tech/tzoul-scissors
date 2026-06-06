// Red horizontal ticker tape.
export default function Ticker({ words, theme = "red" }) {
  const bg = theme === "red" ? "bg-[#E63329] text-white" : "bg-[#0A0A0A] text-white";
  return (
    <div data-testid="ticker" className={`${bg} overflow-hidden border-y-2 border-ink py-4 md:py-5`}>
      <div className="marquee-track">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-12 shrink-0">
            {words.map((w, i) => (
              <span key={`${idx}-${i}`} className="font-display uppercase text-3xl md:text-5xl tracking-tight whitespace-nowrap flex items-center gap-12">
                {w}
                <span className="inline-block w-2 h-2 bg-white" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
