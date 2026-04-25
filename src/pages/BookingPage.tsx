import { useMemo, useState } from "react";
import { CalendarDays, CreditCard, Video } from "lucide-react";
import { bookingDays, bookingSlots, counselorProfiles } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

export const BookingPage = () => {
  const { bookedSlot, setBookedSlot } = useAppStore((state) => ({
    bookedSlot: state.bookedSlot,
    setBookedSlot: state.setBookedSlot,
  }));

  const [selectedDay, setSelectedDay] = useState(bookingDays[1]);
  const [selectedTime, setSelectedTime] = useState("12:30 PM");
  const [selectedCounselorId, setSelectedCounselorId] = useState(counselorProfiles[0]?.id);

  const selectedCounselor = useMemo(
    () => counselorProfiles.find((counselor) => counselor.id === selectedCounselorId),
    [selectedCounselorId],
  );

  const bookSession = () => {
    if (!selectedCounselor) return;
    setBookedSlot(`${selectedDay} • ${selectedTime} • ${selectedCounselor.name}`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Counsellor Booking"
            title="Choose a support session"
            description="Cal.com style scheduling with clear slot visibility, counsellor context, and video handoff preview."
          />
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-3">
              {bookingDays.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                    selectedDay === day
                      ? "border-lavender/30 bg-lavender/10 text-lavender dark:bg-lavender/15"
                      : "border-white/60 bg-white/70 text-ink shadow-soft dark:border-white/10 dark:bg-white/5",
                  )}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(bookingSlots[selectedDay] ?? []).map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={cn(
                    "rounded-[22px] border px-4 py-4 text-left transition",
                    slot.available
                      ? selectedTime === slot.time
                        ? "border-lavender/30 bg-gradient-to-br from-lavender/15 to-sky/15 text-ink shadow-soft"
                        : "border-white/60 bg-white/70 text-ink shadow-soft hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                      : "cursor-not-allowed border-white/30 bg-white/40 text-muted/60 dark:border-white/5 dark:bg-white/[0.03]",
                  )}
                >
                  <p className="font-semibold">{slot.time}</p>
                  <p className="mt-1 text-sm">{slot.available ? "Available" : "Booked"}</p>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Professionals"
            title="Recommended counsellors"
            description="Profiles surfaced by specialty fit, availability, and student support patterns."
          />
          <div className="grid gap-4">
            {counselorProfiles.map((counselor) => (
              <button
                key={counselor.id}
                onClick={() => setSelectedCounselorId(counselor.id)}
                className={cn(
                  "rounded-[24px] border p-5 text-left shadow-soft transition",
                  selectedCounselorId === counselor.id
                    ? "border-lavender/30 bg-gradient-to-br from-lavender/15 to-coral/10"
                    : "border-white/60 bg-white/70 dark:border-white/10 dark:bg-white/5",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">
                      {counselor.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">{counselor.specialty}</p>
                  </div>
                  <div className="chip">{counselor.rating.toFixed(1)} / 5</div>
                </div>
                <p className="mt-3 text-sm text-lavender">{counselor.availability}</p>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Preview"
            title="Upcoming session summary"
            description="A calm confirmation card before booking and payment handoff."
          />
          <div className="rounded-[28px] border border-white/60 bg-gradient-to-br from-lavender/15 via-white/70 to-sky/15 p-5 shadow-soft dark:border-white/10 dark:from-lavender/10 dark:via-white/5 dark:to-sky/10">
            <div className="chip">
              <CalendarDays className="h-4 w-4 text-lavender" />
              {selectedDay} • {selectedTime}
            </div>
            <p className="mt-4 font-display text-2xl font-semibold text-ink">
              {selectedCounselor?.name}
            </p>
            <p className="mt-2 text-sm text-muted">{selectedCounselor?.specialty}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-muted">Video room</p>
                <p className="mt-2 text-lg font-semibold text-ink">Whereby / Jitsi ready</p>
              </div>
              <div className="rounded-[22px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-muted">Session type</p>
                <p className="mt-2 text-lg font-semibold text-ink">Confidential video therapy</p>
              </div>
            </div>
            <button onClick={bookSession} className="btn-primary mt-6 w-full">
              <CalendarDays className="h-4 w-4" />
              Book Session
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Payment"
            title="Subscription and billing"
            description="UI hooks for Razorpay or Stripe without breaking the calm care flow."
          />
          <div className="space-y-3">
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">Student Care Plus</p>
                <span className="chip">$9/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                Includes two monthly guided sessions, unlimited AI chat, and premium resource packs.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-coral/10 p-2 text-coral">
                  <CreditCard className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted">
                  Secure Razorpay / Stripe checkout appears here during booking confirmation.
                </p>
              </div>
            </div>
            {bookedSlot ? (
              <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                Confirmed: {bookedSlot}
              </div>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Handoff"
            title="Video session integration"
            description="A clean transition into the therapy room with zero friction."
          />
          <div className="rounded-[28px] border border-white/60 bg-slate-950 p-5 text-white shadow-glow dark:border-white/10">
            <div className="flex aspect-video items-center justify-center rounded-[24px] border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950">
              <div className="text-center">
                <Video className="mx-auto h-10 w-10 text-sky" />
                <p className="mt-4 text-lg font-semibold">Secure video room preview</p>
                <p className="mt-2 text-sm text-slate-300">
                  Low-friction launch into Whereby or Jitsi with pre-session notes ready.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
