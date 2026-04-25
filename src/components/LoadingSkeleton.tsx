export const LoadingSkeleton = () => (
  <div className="min-h-screen overflow-hidden bg-[#f6f4ff] px-4 py-6 dark:bg-[#090b17] sm:px-6">
    <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="hidden rounded-[32px] bg-white/70 p-6 shadow-soft backdrop-blur-xl dark:bg-white/5 lg:block">
        <div className="h-10 w-36 rounded-full bg-gradient-to-r from-lavender/20 via-white/70 to-sky/20" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-12 rounded-2xl bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5"
            />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-28 rounded-[32px] bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5" />
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="h-[360px] rounded-[32px] bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5" />
          <div className="space-y-6">
            <div className="h-[170px] rounded-[32px] bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5" />
            <div className="h-[170px] rounded-[32px] bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
