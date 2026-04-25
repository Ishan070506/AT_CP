import Link from "next/link";

import { StatCard } from "../components/StatCard";
import { getAnalytics } from "../lib/api";


export default async function HomePage() {
  const analytics = await getAnalytics();

  return (
    <>
      <section className="hero">
        <div className="panel panel--accent">
          <div className="eyebrow">Enterprise E-Learning Control Plane</div>
          <h1 className="title">Train at scale without loosening compliance.</h1>
          <p className="subtitle">
            The platform combines sequenced learning, adaptive assessment, face verification, review gating, and tenant-level white labeling in one deployment model.
          </p>
          <div className="ctaRow">
            <Link className="button" href="/catalog">
              Enter learner catalog
            </Link>
            <Link className="button button--soft" href="/admin/analytics">
              View admin analytics
            </Link>
          </div>
        </div>
        <div className="panel">
          <div className="eyebrow">Deployment shape</div>
          <p className="subtitle">
            Next.js web, Django API, Redis-backed events, SQLCipher mobile sync, S3 asset storage, and Kubernetes-ready operations.
          </p>
        </div>
      </section>

      <section className="kpiStrip">
        <StatCard label="Active learners" value={`${analytics.active_learners}`} hint="Tenant-wide sessions in progress" />
        <StatCard label="Average progress" value={`${Math.round(analytics.avg_progress)}%`} hint="Resume-aware checkpointed completion" />
        <StatCard label="Attention average" value={`${Math.round(analytics.avg_attention)}%`} hint="Derived from monitoring samples" />
        <StatCard label="Alerts to review" value={`${analytics.unresolved_alerts}`} hint="Requires admin action before pass state" />
      </section>
    </>
  );
}
