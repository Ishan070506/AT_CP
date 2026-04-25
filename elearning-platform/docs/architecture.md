# Architecture Overview

## Services

- `apps/web`: Next.js App Router application for learners and admins.
- `apps/mobile`: React Native client with encrypted offline storage and sync queue.
- `services/backend`: Django API, Channels, Socket.IO ASGI bridge, background tasks, certificate generation.
- `redis`: cache, websocket pub/sub, task queue broker.
- `postgres/postgis`: system of record with tenant-scoped UUID entities.
- `minio`: S3-compatible object storage for course assets and certificates.

## Request flow

1. Clients send `X-Tenant-ID` or tenant-aware hostnames.
2. Django middleware resolves tenant and stores it in request and context-local state.
3. DRF viewsets filter data by tenant automatically.
4. Long-running events such as face verification and alert fanout move through Redis-backed queues.
5. Real-time notifications are published through Socket.IO and Channels.

## Security posture

- JWT access tokens plus rotating refresh tokens
- AES-256-GCM field encryption for sensitive attributes
- SQLCipher-backed AES-256 local mobile storage
- TLS 1.3 and HSTS at the ingress layer
- Rate limiting at API and auth endpoints

## Modular learning flow

1. Learner enrolls in a course.
2. Learning path resolves prerequisites and drip windows.
3. Progress checkpoints persist on every watch or slide event.
4. Mid-video quiz interrupts playback until answered.
5. Monitoring service samples webcam events and emits integrity alerts.
