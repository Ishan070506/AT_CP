import type { PropsWithChildren } from "react";

interface SectionHeaderProps extends PropsWithChildren {
  eyebrow?: string;
  title: string;
  description?: string;
}

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  children,
}: SectionHeaderProps) => (
  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-lavender dark:text-sky">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
    </div>
    {children ? <div className="flex shrink-0 items-center gap-3">{children}</div> : null}
  </div>
);
