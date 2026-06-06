import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

// Red full-screen curtain. On every route change (and initial load), a new
// curtain mounts already covering the screen (x:0%), shows the TZOUL wordmark
// (letters animate in one-by-one), then wipes off to the right (x:100%).
//
// Timing (total ~2.5s on screen):
//   0.00s  curtain mounted (red fills screen)
//   0.15s  T fades + lifts in
//   0.23s  Z
//   0.31s  O
//   0.39s  U
//   0.47s  L
//   0.95s  cream underline bar scales in from the left (0.45s)
//   1.50s  wipe begins (1.00s ease wipe to the right)
//   2.50s  curtain fully gone
const WORD = ["T", "Z", "O", "U", "L"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <>
      <motion.div
        key={pathname}
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
        className="fixed inset-0 z-[100] bg-[#E63329] pointer-events-none overflow-hidden"
        data-testid="page-curtain"
      >
        <div className="absolute bottom-10 left-10 md:bottom-20 md:left-24 select-none">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-white font-display leading-[0.85] text-[18vw] md:text-[14vw] lg:text-[10rem] tracking-tight flex"
            data-testid="curtain-wordmark"
          >
            {WORD.map((ch, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="inline-block"
                style={{ willChange: "transform, opacity" }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.div>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.95 }}
            style={{ transformOrigin: "left center" }}
            className="h-2 md:h-3 w-16 md:w-24 lg:w-28 bg-[#f5d6d2] mt-3"
          />
        </div>
      </motion.div>
      {children}
    </>
  );
}
