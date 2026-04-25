import Link from "next/link";
import { ReactNode } from "react";


export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <div className="shell__frame">
        <header className="topbar">
          <div className="brand">
            <div className="brand__mark">EL</div>
            <div className="brand__meta">
              <strong>Enterprise Learning Grid</strong>
              <div className="muted">White-label ready, integrity-first delivery</div>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Overview</Link>
            <Link href="/catalog">Catalog</Link>
            <Link href="/admin/monitoring">Integrity</Link>
            <Link href="/admin/analytics">Analytics</Link>
          </nav>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
