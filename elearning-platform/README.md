# AI-Powered E-Learning Platform

Production-oriented monorepo for a multi-tenant e-learning platform with strong integrity monitoring, adaptive learning, offline mobile delivery, and enterprise deployment support.

## Stack

- Web: Next.js + React
- Mobile: React Native + encrypted SQLite (SQLCipher / AES-256)
- Backend: Django + DRF + Channels + Socket.IO bridge
- Data: PostgreSQL + PostGIS
- Cache and queue: Redis
- Storage: S3-compatible object storage
- Auth: JWT access + refresh token rotation
- Infra: Docker Compose + Kubernetes manifests

## Structure

```text
elearning-platform/
├── apps/
│   ├── mobile/
│   └── web/
├── services/
│   └── backend/
├── infra/
│   ├── docker/
│   ├── docker-compose.yml
│   └── k8s/
└── docs/
```

## Core capabilities

- Sequenced, prerequisite-aware modular learning
- Drip content scheduling and resume-from-last-position progress tracking
- AI-assisted face verification, anti-spoof checks, multi-face alerts, and attention monitoring
- Adaptive assessments with remediation mapping and randomized finals
- White-label tenant branding and middleware-based tenancy enforcement
- Offline-first mobile sync backed by encrypted local SQLite
- Real-time alert fanout to admin dashboards

## Quick start

1. Copy `.env.example` to `.env`.
2. Start the platform with Docker Compose from `infra/docker-compose.yml`.
3. Run backend migrations and seed data.
4. Start `apps/web` and `apps/mobile` in their own environments for local development.

Detailed setup lives in [docs/deployment.md](/Users/ishanpande/Documents/New%20project/elearning-platform/docs/deployment.md).
