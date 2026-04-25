export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <section className="card">
      <div className="muted">{label}</div>
      <div className="metric">{value}</div>
      <div className="muted">{hint}</div>
    </section>
  );
}
