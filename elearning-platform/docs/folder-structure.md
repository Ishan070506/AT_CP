# Folder Structure

```text
elearning-platform/
├── .env.example
├── .github/workflows/ci.yml
├── README.md
├── apps/
│   ├── mobile/
│   │   ├── App.tsx
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── components/ScreenCard.tsx
│   │       ├── features/
│   │       │   ├── catalog/CourseCatalogScreen.tsx
│   │       │   ├── profile/MasterFaceCaptureScreen.tsx
│   │       │   └── session/LearningSessionScreen.tsx
│   │       ├── services/
│   │       │   ├── api.ts
│   │       │   └── sync.ts
│   │       ├── storage/encryptedDb.ts
│   │       └── theme.ts
│   └── web/
│       ├── app/
│       │   ├── admin/
│       │   │   ├── analytics/page.tsx
│       │   │   └── monitoring/page.tsx
│       │   ├── catalog/page.tsx
│       │   ├── course/[courseId]/page.tsx
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/
│       │   ├── AlertConsole.tsx
│       │   ├── CatalogClient.tsx
│       │   ├── FaceVerificationPanel.tsx
│       │   ├── LearningSessionClient.tsx
│       │   ├── Shell.tsx
│       │   └── StatCard.tsx
│       ├── lib/
│       │   ├── api.ts
│       │   └── types.ts
│       ├── package.json
│       └── tsconfig.json
├── docs/
│   ├── api-endpoints.md
│   ├── architecture.md
│   ├── database-schema.md
│   ├── deployment.md
│   ├── folder-structure.md
│   ├── key-code-snippets.md
│   └── ui-wireframes.md
├── infra/
│   ├── docker/
│   │   ├── backend.Dockerfile
│   │   ├── web.Dockerfile
│   │   └── worker.Dockerfile
│   ├── docker-compose.yml
│   └── k8s/
│       ├── backend-deployment.yaml
│       ├── configmap.yaml
│       ├── ingress.yaml
│       ├── minio-deployment.yaml
│       ├── namespace.yaml
│       ├── redis-deployment.yaml
│       ├── secrets.example.yaml
│       ├── web-deployment.yaml
│       └── worker-deployment.yaml
├── package.json
├── services/
│   └── backend/
│       ├── apps/
│       │   ├── analytics/
│       │   ├── assessments/
│       │   ├── certificates/
│       │   ├── common/
│       │   ├── courses/
│       │   ├── monitoring/
│       │   └── users/
│       ├── config/
│       │   ├── asgi.py
│       │   ├── realtime.py
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       ├── models/face/README.md
│       ├── manage.py
│       └── requirements.txt
└── sonar-project.properties
```
