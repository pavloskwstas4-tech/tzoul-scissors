import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Reveal from "@/components/Reveal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Team() {
  const [barbers, setBarbers] = useState([]);
  useEffect(() => { axios.get(`${API}/barbers`).then((r) => setBarbers(r.data)).catch(() => {}); }, []);

  return (
    <section id="team" data-testid="team-section" className="bg-[#0a0a0a] py-28 md:py-40 border-t hairline">
      <Reveal>
        <div className="max-w-[1500px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-5 reveal">
              <p className="eyebrow">— The Hands</p>
              <h2 className="font-display text-5xl md:text-7xl tracking-tighter leading-[0.92] mt-3">
                Master <span className="serif-italic font-light">barbers</span>.
              </h2>
            </div>
            <p className="md:col-span-5 md:col-start-8 text-white/65 reveal self-end">
              Five practitioners. Decades of combined hours behind the chair. Each holds a particular silhouette
              — pick your hand below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {barbers.map((b, i) => (
              <Link
                key={b.id}
                to={`/book?barber=${b.id}`}
                data-testid={`team-card-${b.id}`}
                className={`reveal group relative block ${i % 2 === 1 ? "md:translate-y-12" : ""}`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#111] gallery-tile">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(100%) contrast(1.05)" }}
                  />
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <div className="font-display text-xl tracking-tight">{b.name}</div>
                    <div className="eyebrow mt-1 text-white/45">{b.role}</div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.28em] text-white/55 group-hover:text-[#f5f3ef] transition-colors">Book →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
