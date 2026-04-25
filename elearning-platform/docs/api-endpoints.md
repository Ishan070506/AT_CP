# API Endpoints

## Auth

- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`

## Tenant and branding

- `GET /api/tenants/current/`
- `GET /api/sites/`

## Courses

- `GET /api/courses/`
- `POST /api/courses/{course_id}/enroll/`
- `GET /api/courses/{course_id}/learning-path/`
- `POST /api/progress/checkpoints/`
- `GET /api/enrollments/me/`

## Assessments

- `GET /api/question-bank/`
- `POST /api/assessments/adaptive/start/`
- `POST /api/assessments/adaptive/answer/`
- `POST /api/assessments/final/start/`
- `GET /api/leaderboard/`

## Monitoring

- `POST /api/monitoring/master-face/`
- `POST /api/monitoring/verify/`
- `POST /api/monitoring/attention/`
- `GET /api/monitoring/alerts/`
- `POST /api/monitoring/alerts/{alert_id}/review/`

## Face AI payloads

- `POST /api/monitoring/master-face/`: accepts `image_base64` for server-side embedding extraction or a trusted `embedding` for SDK-driven clients.
- `POST /api/monitoring/verify/`: accepts `image_base64` and optional `challenge_frames[]` for liveness estimation, then derives embedding, face count, attention score, and spoof suspicion server-side.

## Analytics and certificates

- `GET /api/analytics/dashboard/`
- `GET /api/analytics/dropoff/`
- `POST /api/certificates/{enrollment_id}/generate/`
- `GET /api/certificates/me/`
