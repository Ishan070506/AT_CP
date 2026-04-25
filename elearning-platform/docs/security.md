# Security Controls

## Authentication and session handling

- JWT access tokens with rotating refresh tokens via `rest_framework_simplejwt`
- Refresh token blacklist support for logout and token revocation
- Tenant-aware request resolution through `X-Tenant-ID` or subdomain mapping

## Encryption

- AES-256-GCM field encryption utility in [services/backend/apps/common/encryption.py](/Users/ishanpande/Documents/New%20project/elearning-platform/services/backend/apps/common/encryption.py)
- SQLCipher-backed encrypted SQLite in [apps/mobile/src/storage/encryptedDb.ts](/Users/ishanpande/Documents/New%20project/elearning-platform/apps/mobile/src/storage/encryptedDb.ts)
- S3-compatible object storage for course assets and certificate PDFs
- Master face images can be uploaded as frame captures and stored under tenant-scoped object keys while embeddings remain field-encrypted

## Transport and headers

- TLS 1.3 expected at ingress or load balancer
- HSTS configured in [infra/k8s/ingress.yaml](/Users/ishanpande/Documents/New%20project/elearning-platform/infra/k8s/ingress.yaml)
- Secure cookies and SSL redirect enabled outside debug mode

## API protection

- DRF rate throttling defaults in [services/backend/config/settings.py](/Users/ishanpande/Documents/New%20project/elearning-platform/services/backend/config/settings.py)
- Dynamic permission catalog and policy assignment instead of hardcoded roles
- Integrity alerts force admin review before learner pass/certificate release
