import { motion } from "framer-motion";
import { describeMood } from "@/data/mockData";

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const moodStops = [
  { label: "Needs care", icon: "😞" },
  { label: "Tired", icon: "😕" },
  { label: "Neutral", icon: "😐" },
  { label: "Steady", icon: "🙂" },
  { label: "Thriving", icon: "🤩" },
];

export const MoodSlider = ({ value, onChange }: MoodSliderProps) => (
  <div className="rounded-[24px] border border-white/50 bg-white/60 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted">Today&apos;s mental state</p>
        <p className="mt-1 text-2xl font-semibold text-ink">{describeMood(value)}</p>
      </div>
      <motion.div
        key={value}
        initial={{ scale: 0.92, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl bg-gradient-to-br from-lavender/20 to-coral/20 px-5 py-3 text-3xl shadow-soft"
      >
        {moodStops[Math.min(moodStops.length - 1, Math.floor(value / 21))]?.icon}
      </motion.div>
    </div>
    <input
      aria-label="Mood tracker"
      type="range"
      min={10}
      max={100}
      step={1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-coral/60 via-lavender/60 to-sky/60"
    />
    <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs text-muted">
      {moodStops.map((stop) => (
        <div key={stop.label}>
          <div className="text-lg">{stop.icon}</div>
          <div>{stop.label}</div>
        </div>
      ))}
    </div>
  </div>
);
