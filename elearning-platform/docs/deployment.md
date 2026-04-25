# Deployment Steps

## Local container stack

1. Copy `.env.example` to `.env`.
2. Start core services from [infra/docker-compose.yml](/Users/ishanpande/Documents/New%20project/elearning-platform/infra/docker-compose.yml).
3. Run Django migrations inside the backend container.
4. Create a superuser and seed initial tenants, permissions, and demo courses.

## Production rollout

1. Provision PostgreSQL with PostGIS, Redis, and an S3-compatible bucket.
2. Apply Kubernetes namespace, config, secret, deployment, service, and ingress manifests.
3. Terminate TLS 1.3 at ingress and enforce HSTS.
4. Configure autoscaling for backend API, worker, and web deployments.
5. Point the mobile app to the public API base URL and enable secure storage for refresh tokens.
6. Mount YuNet and SFace ONNX models into the backend container or set `FACE_DETECTOR_MODEL_PATH` and `FACE_RECOGNIZER_MODEL_PATH`.

## Operational notes

- Store encryption and JWT keys in a managed secret store.
- Run certificate generation and monitoring pipelines in worker pods.
- Offload video transcoding and adaptive bitrate packaging to a dedicated media pipeline.
