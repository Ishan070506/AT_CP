import { AlertRecord } from "../lib/types";


export function AlertConsole({ alerts }: { alerts: AlertRecord[] }) {
  const selected = alerts[0];

  return (
    <section className="alertLayout">
      <div className="panel">
        <div className="eyebrow">Integrity alerts</div>
        <div className="rail">
          {alerts.map((alert) => (
            <article className="alertItem" key={alert.id}>
              <div className="severity">{alert.severity}</div>
              <h3>{alert.reason.replaceAll(",", " / ")}</h3>
              <div className="muted">
                User {alert.user}, confidence gap {Math.round(alert.confidence_score * 100)}%, status {alert.status}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="eyebrow">Review panel</div>
        {selected ? (
          <>
            <h2>{selected.course}</h2>
            <p className="muted">
              Prioritize flagged users before final pass state. This view is designed to pair with `/api/monitoring/alerts/{'{alert_id}'}/review/`.
            </p>
            <div className="kpiStrip">
              <div className="card">
                <div className="muted">Confidence score</div>
                <div className="metric">{Math.round(selected.confidence_score * 100)}%</div>
              </div>
              <div className="card">
                <div className="muted">Status</div>
                <div className="metric" style={{ fontSize: "1.4rem" }}>
                  {selected.status}
                </div>
              </div>
            </div>
            <button className="button">Approve or block learner</button>
          </>
        ) : null}
      </div>
    </section>
  );
}
