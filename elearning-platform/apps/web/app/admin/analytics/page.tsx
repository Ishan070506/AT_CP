import { StatCard } from "../../../components/StatCard";
import { getAnalytics, getDropoffReport } from "../../../lib/api";


export default async function AnalyticsPage() {
  const [analytics, dropoff] = await Promise.all([getAnalytics(), getDropoffReport()]);

  return (
    <>
      <section className="kpiStrip">
        <StatCard label="Active enrollments" value={`${analytics.active_enrollments}`} hint="Course-user assignments under this tenant" />
        <StatCard label="Flagged for review" value={`${analytics.flagged_for_review}`} hint="Cannot be auto-passed until reviewed" />
        <StatCard label="Expiry window" value={`${analytics.expiring_soon}`} hint="Completions approaching re-enrollment threshold" />
        <StatCard label="Open alerts" value={`${analytics.unresolved_alerts}`} hint="Integrity queue backlog" />
      </section>

      <section className="grid2" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div className="panel">
          <div className="eyebrow">Drop-off analytics</div>
          <div className="rail">
            {dropoff.map((row, index) => (
              <div className="railItem" key={`${row.unit__title}-${index}`}>
                <strong>{row.unit__title as string}</strong>
                <div className="muted">{row.unit__module__course__title as string}</div>
                <div className="muted">
                  {row.drop_count as number} drops, average completion {Math.round(Number(row.avg_completion))}%
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="eyebrow">Compliance outlook</div>
          <p className="subtitle">
            Use this panel to trigger scheduled re-enrollment jobs, monitor learning velocity, and confirm review approval before certificate release.
          </p>
        </div>
      </section>
    </>
  );
}
