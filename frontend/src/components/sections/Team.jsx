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
    <section id="team" data-testid="team-section" className="bg-[#F8FAFC] py-28 md:py-40 border-t-2 border-[#0F172A]">
      <Reveal>
        <div className="max-w-[1500px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-5 reveal">
              <p className="eyebrow">— The Hands</p>
              <h2 className="font-display text-5xl md:text-7xl tracking-tighter leading-[0.92] mt-3 text-[#0F172A]">
                Master <span className="text-[#38BDF8]">barbers</span>.
              </h2>
            </div>
            <p className="md:col-span-5 md:col-start-8 text-slate-500 reveal self-end">
              Practitioners with decades of combined hours behind the chair. Pick your hand below.
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
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 rounded-xl border-2 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_#0F172A] transition-all">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <div className="font-display text-xl tracking-tight text-[#0F172A]">{b.name}</div>
                    <div className="eyebrow mt-1 text-slate-400">{b.role}</div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.28em] text-sky-500 group-hover:text-[#F97316] transition-colors">Book →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
