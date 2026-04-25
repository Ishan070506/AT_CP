import { AlertConsole } from "../../../components/AlertConsole";
import { getAlerts } from "../../../lib/api";


export default async function MonitoringPage() {
  const alerts = await getAlerts();
  return (
    <>
      <section className="hero">
        <div className="panel panel--accent">
          <div className="eyebrow">Integrity operations</div>
          <h1 className="title">Review discrepancies before a learner can pass.</h1>
          <p className="subtitle">
            Face mismatches, spoof signals, multi-face detections, and attention drift are surfaced in one review queue with realtime notifications.
          </p>
        </div>
        <div className="panel">
          <div className="eyebrow">Realtime channel</div>
          <p className="subtitle">Socket.IO room fanout per tenant broadcasts alert creation to active admin consoles.</p>
        </div>
      </section>
      <AlertConsole alerts={alerts} />
    </>
  );
}
