import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Scissors, User, CalendarIcon, ClipboardList, ChevronsRight, X } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { useBooking } from "@/contexts/BookingContext";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STEPS = [
  { label: "Service",     icon: Scissors,      heading: "Service" },
  { label: "Barber",      icon: User,          heading: "Barber" },
  { label: "Date & Time", icon: CalendarIcon,  heading: "Date & Time" },
  { label: "Details",     icon: ClipboardList, heading: "Details" },
];

function fmtDate(d) {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookingModal() {
  const { isBookingOpen, closeBooking, presetServiceId, presetBarberId, presetDate, presetTime } = useBooking();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const scrollRef = useRef(null);

  // Scroll modal to top whenever the step changes (or success screen appears)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, success]);

  useEffect(() => {
    if (isBookingOpen) {
      axios.get(`${API}/services`).then((r) => setServices(r.data)).catch(() => {});
      axios.get(`${API}/barbers`).then((r) => setBarbers(r.data)).catch(() => {});
    }
  }, [isBookingOpen]);

  // Apply preset service when modal opens with a recommended service
  useEffect(() => {
    if (!isBookingOpen) return;

    if (presetServiceId && presetBarberId && presetDate && presetTime) {
      // Full preset from hero quick-book widget → jump straight to contact details
      setServiceId(presetServiceId);
      setBarberId(presetBarberId);
      setDate(new Date(presetDate + "T00:00:00"));
      setTime(presetTime);
      setStep(3);
    } else if (presetServiceId) {
      setServiceId(presetServiceId);
      setStep(1); // jump straight to Barber step
    }
  }, [isBookingOpen, presetServiceId, presetBarberId, presetDate, presetTime]);

  // Lock background scroll while the modal is open
  useEffect(() => {
    if (!isBookingOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isBookingOpen]);

  useEffect(() => {
    if (!date) { setSlots([]); return; }
    setLoadingSlots(true);
    axios.get(`${API}/availability`, { params: { date: fmtDate(date), barber_id: barberId || undefined } })
      .then((r) => setSlots(r.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date, barberId]);

  // Filter barbers by the selected service (a barber with empty/no service_ids is treated as "offers all")
  const eligibleBarbers = serviceId
    ? barbers.filter((b) => !b.service_ids || b.service_ids.length === 0 || b.service_ids.includes(serviceId))
    : barbers;

  // If current barber selection becomes invalid after switching service, clear it
  useEffect(() => {
    if (barberId && !eligibleBarbers.some((b) => b.id === barberId)) {
      setBarberId("");
    }
  }, [serviceId, eligibleBarbers, barberId]);

  const service = services.find((s) => s.id === serviceId);
  const barber = barbers.find((b) => b.id === barberId);

  const canNext = () => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!barberId;
    if (step === 2) return !!date && !!time;
    if (step === 3) return name.length >= 2 && phone.length >= 5;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        service_id: serviceId, barber_id: barberId,
        date: fmtDate(date), time, name, phone,
        email: email || null, notes: notes || null,
      };
      const { data } = await axios.post(`${API}/bookings`, payload);
      setSuccess(data);
      toast.success("Reservation confirmed");
    } catch (e) {
      const detail = e?.response?.data?.detail || "Could not create booking. Please try again.";
      toast.error(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(0);
    setServiceId("");
    setBarberId("");
    setDate(null);
    setTime("");
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    closeBooking();
  };

  const disabled = (d) => {
    const t = new Date(); t.setHours(0,0,0,0);
    if (d < t) return true;
    const wd = d.getDay();
    return wd === 0 || wd === 1;
  };

  if (!isBookingOpen) return null;

  // Shared stagger child variant
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="booking-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <Toaster theme="light" position="top-center" />

        {/* Modal card — dramatic spring entrance */}
        <motion.div
          key="booking-card"
          initial={{ opacity: 0, scale: 0.88, y: -32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 28 }}
          transition={{ type: "spring", stiffness: 340, damping: 26, mass: 0.9 }}
          ref={scrollRef}
          style={{ willChange: "transform, opacity" }}
          className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          data-testid="booking-modal"
        >
          {/* Red accent strip — sweeps in from left */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E63329] via-[#ff5040] to-[#E63329] rounded-t-2xl"
          />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.25, ease: "backOut" }}
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/5 hover:bg-[#E63329] hover:text-white hover:scale-110 active:scale-95 rounded-full transition-all duration-200"
            data-testid="close-modal"
          >
            <X size={20} />
          </motion.button>

          {/* Staggered inner content */}
          <motion.div
            className="p-6 md:p-10"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
          >
            {!success && (
              <>
                {/* Header */}
                <motion.div variants={fadeUp} className="mb-6">
                  <h2 className="title-massive text-4xl md:text-5xl">Book Now<span className="text-[#E63329]">.</span></h2>
                  <p className="mt-2 text-gray-600">Complete your reservation in {STEPS.length} simple steps.</p>
                </motion.div>

                {/* Step tabs */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8" data-testid="booking-stepper">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const active = i === step;
                    const completed = i < step;
                    return (
                      <motion.button
                        key={s.label}
                        data-testid={`step-tab-${i}`}
                        onClick={() => i < step && setStep(i)}
                        whileHover={{ scale: completed || active ? 1 : 1.02 }}
                        className={`flex flex-col items-start gap-1 p-3 rounded-lg transition-colors ${
                          active ? "bg-[#E63329] text-white shadow-lg scale-105" : 
                          completed ? "bg-gray-100 text-gray-700" : 
                          "bg-gray-50 text-gray-400"
                        }`}
                      >
                        <span className={`font-mono text-[0.6rem] uppercase tracking-wider ${active ? "text-white/85" : "text-gray-400"}`}>
                          Step 0{i + 1}
                        </span>
                        <span className="flex items-center gap-2 font-display uppercase text-sm">
                          <Icon size={12} /> {s.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>

                <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
                  <div className="lg:col-span-8">
                    {/* Section heading with step-change slide animation */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`heading-${step}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-5"
                      >
                        <h3 className="title-massive text-2xl md:text-3xl">
                          {STEPS[step].heading}<span className="text-[#E63329]">.</span>
                        </h3>
                      </motion.div>
                    </AnimatePresence>

                    {/* Step content with slide-in/out transition */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`step-content-${step}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >

                    {step === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="step-service">
                        {services.map((s, i) => {
                          const sel = serviceId === s.id;
                          return (
                            <button
                              key={s.id}
                              data-testid={`pick-service-${s.id}`}
                              onClick={() => setServiceId(s.id)}
                              className={`text-left rounded-xl p-4 transition-all ${
                                sel ? "bg-red-50 border-2 border-[#E63329] shadow-md scale-105" : "bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-display uppercase text-base truncate">{s.name}</span>
                                <span className="font-display text-xl text-[#E63329] shrink-0">€{s.price}</span>
                              </div>
                              <div className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 mt-2">
                                {s.category} · {s.duration} min
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="step-barber">
                        {eligibleBarbers.length === 0 && (
                          <div className="col-span-full p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm" data-testid="no-eligible-barbers">
                            No barber currently offers this service. Please go back and choose another service.
                          </div>
                        )}
                        {eligibleBarbers.map((b) => {
                          const sel = barberId === b.id;
                          return (
                            <button
                              key={b.id}
                              data-testid={`pick-barber-${b.id}`}
                              onClick={() => setBarberId(b.id)}
                              className={`text-left rounded-xl overflow-hidden transition-all ${
                                sel ? "ring-2 ring-[#E63329] shadow-lg scale-105" : "hover:shadow-md"
                              }`}
                            >
                              <div className="aspect-[3/4] overflow-hidden bg-gray-900">
                                <img src={b.image} alt={b.name} className="w-full h-full object-cover" style={{ filter: "grayscale(100%)" }} />
                              </div>
                              <div className={`p-3 ${sel ? "bg-[#E63329] text-white" : "bg-gray-50"}`}>
                                <div className="font-display uppercase text-sm leading-tight">{b.name}</div>
                                <div className={`font-mono text-[0.58rem] uppercase tracking-wider mt-1 ${sel ? "text-white/85" : "text-gray-500"}`}>
                                  {b.role}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="step-datetime">
                        <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-gray-50">
                          <div className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-500 mb-3">Pick a date</div>
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setTime(""); }}
                            disabled={disabled}
                            className="text-gray-900"
                            data-testid="booking-calendar"
                          />
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-gray-50">
                          <div className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-500 mb-3">Pick a time</div>
                          {!date && <p className="text-gray-500 text-sm">Select a date first.</p>}
                          {date && loadingSlots && <p className="text-gray-500 text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading slots…</p>}
                          {date && !loadingSlots && slots.length === 0 && <p className="text-gray-500 text-sm">No times available for this day.</p>}
                          {date && !loadingSlots && slots.length > 0 && (
                            <div className="grid grid-cols-3 gap-2" data-testid="time-slots">
                              {slots.map((t) => (
                                <button
                                  key={t}
                                  data-testid={`slot-${t}`}
                                  onClick={() => setTime(t)}
                                  className={`py-3 text-sm font-mono rounded-lg transition-all ${
                                    time === t ? "bg-[#E63329] text-white shadow-md scale-105" : "bg-white border border-gray-200 hover:border-[#E63329] hover:shadow"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="rounded-xl border border-gray-200 p-5 md:p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="step-details">
                        <div className="md:col-span-2">
                          <Label htmlFor="b-name" className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-600">Your name *</Label>
                          <Input id="b-name" data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)}
                                 className="mt-2 bg-white border border-gray-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#E63329] focus-visible:border-[#E63329] px-4 py-2 text-lg" />
                        </div>
                        <div>
                          <Label htmlFor="b-phone" className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-600">Phone *</Label>
                          <Input id="b-phone" data-testid="input-phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                                 className="mt-2 bg-white border border-gray-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#E63329] focus-visible:border-[#E63329] px-4 py-2 text-lg" />
                        </div>
                        <div>
                          <Label htmlFor="b-email" className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-600">Email</Label>
                          <Input id="b-email" data-testid="input-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                 className="mt-2 bg-white border border-gray-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#E63329] focus-visible:border-[#E63329] px-4 py-2 text-lg" />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="b-notes" className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-600">Notes (optional)</Label>
                          <Textarea id="b-notes" data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                                    rows={3} className="mt-2 bg-white border border-gray-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#E63329] focus-visible:border-[#E63329]" />
                        </div>
                      </div>
                    )}

                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Buttons */}
                  <motion.div variants={fadeUp} className="flex items-center gap-3 mt-8 max-w-md mx-auto">
                      <button
                        data-testid="step-back"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-display uppercase text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowLeft size={13} /> Back
                      </button>
                      {step < 3 ? (
                        <Magnetic strength={0.22}>
                          <button
                            data-testid="step-next"
                            disabled={!canNext()}
                            onClick={() => setStep((s) => s + 1)}
                            className="flex-1 px-4 py-3 bg-[#E63329] text-white rounded-lg font-display uppercase text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d62d25] transition-colors shadow-md flex items-center justify-center gap-2"
                          >
                            Next <ArrowRight size={13} />
                          </button>
                        </Magnetic>
                      ) : (
                        <Magnetic strength={0.22}>
                          <button
                            data-testid="confirm-booking"
                            disabled={submitting || !canNext()}
                            onClick={submit}
                            className="flex-1 px-4 py-3 bg-[#E63329] text-white rounded-lg font-display uppercase text-sm disabled:opacity-50 hover:bg-[#d62d25] transition-colors shadow-md flex items-center justify-center gap-2"
                          >
                            {submitting ? <><Loader2 size={13} className="animate-spin" /> Confirming…</> : <>Confirm Booking <Check size={13} /></>}
                          </button>
                        </Magnetic>
                      )}
                    </motion.div>
                  </motion.div>
              </>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <SuccessCard
                  booking={success}
                  onNew={() => resetForm()}
                  onClose={handleClose}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-gray-200 last:border-0">
      <span className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-500">{label}</span>
      <span className="text-right text-gray-900">{value}</span>
    </div>
  );
}

function SumRow({ k, v }) {
  return (
    <div className="flex justify-between gap-3 items-center">
      <span className="font-mono text-[0.66rem] uppercase tracking-wider text-gray-500">{k}</span>
      <span className="font-display uppercase text-right truncate text-gray-900">{v}</span>
    </div>
  );
}

function SuccessCard({ booking, onNew, onClose }) {
  return (
    <div className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-200" data-testid="booking-success">
      <div className="bg-[#E63329] text-white p-6 md:p-8">
        <div className="font-mono text-[0.7rem] uppercase tracking-wider text-white/80">Reservation Confirmed</div>
        <h2 className="title-massive text-4xl md:text-5xl mt-2 leading-tight">
          See you at the house<span className="text-white/80">.</span>
        </h2>
        <p className="mt-2 text-white/90">Thanks, {booking.name.split(" ")[0]}. Your seat is locked in.</p>
      </div>
      <div className="p-6 md:p-8 space-y-3 bg-white">
        <ReviewRow label="Service"   value={`${booking.service_name} · €${booking.price}`} />
        <ReviewRow label="Barber"    value={booking.barber_name} />
        <ReviewRow label="Date"      value={booking.date} />
        <ReviewRow label="Time"      value={booking.time} />
        <ReviewRow label="Reference" value={booking.id.slice(0, 8).toUpperCase()} />
      </div>
      <div className="border-t border-gray-200 p-5 md:p-6 flex flex-wrap items-center gap-3 justify-between bg-gray-50">
        <p className="text-xs text-gray-600 max-w-md">
          To reschedule, call <span className="font-display">+30 21 1218 0303</span>.
        </p>
        <div className="flex gap-3">
          <button data-testid="success-new" onClick={onNew} className="px-4 py-2 border border-gray-300 rounded-lg font-display uppercase text-sm hover:bg-gray-100 transition-colors">New booking</button>
          <button data-testid="success-home" onClick={onClose} className="px-4 py-2 bg-[#E63329] text-white rounded-lg font-display uppercase text-sm hover:bg-[#d62d25] transition-colors shadow-md flex items-center gap-2"><ChevronsRight size={14} /> Close</button>
        </div>
      </div>
    </div>
  );
}
