# Database Schema

All tables use UUID primary keys and include `tenant_id`.

## Core entities

- `tenant`: branding, theme, white-label metadata, storage prefixes
- `site`: logical deployment site under a tenant
- `user_account`: learner and admin identity
- `permission_definition`: dynamic permission catalog
- `access_policy`: reusable permission bundle per tenant
- `user_policy_assignment`: links users to policies
- `course`: course catalog entry
- `course_module`: sequenced module in a course
- `learning_unit`: video, slide, or document item inside a module
- `module_prerequisite`: prerequisite graph edge
- `enrollment`: learner-course relationship
- `progress_checkpoint`: last watched second / slide / completion state
- `question_bank_item`: adaptive question source
- `assessment_attempt`: quiz or final exam session
- `assessment_response`: per-question answer record
- `face_profile`: master face reference metadata
- `face_verification_log`: verification event with confidence and spoof result
- `integrity_alert`: admin-reviewable discrepancy
- `certificate`: generated certificate artifact
- `learning_analytics_snapshot`: aggregate metrics

## PostGIS usage

- Optional `origin_point` on `face_verification_log` can store coarse geolocation for compliance-sensitive deployments.

## Index guidance

- Composite indexes on `(tenant_id, created_at)` for event tables
- Unique constraints on `(tenant_id, slug)` for courses and policies
- Partial indexes for unresolved alerts and active enrollments
