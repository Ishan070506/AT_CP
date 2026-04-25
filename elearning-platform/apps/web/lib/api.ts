import { AnalyticsSnapshot, AlertRecord, CourseCard, Enrollment, LearningModule } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? "demo-tenant";

async function request<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": TENANT_ID
      },
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  } catch {
    return fallback(path) as T;
  }
}

function fallback(path: string) {
  const courses: CourseCard[] = [
    {
      id: "course-1",
      title: "Clinical Compliance Foundations",
      slug: "clinical-compliance-foundations",
      summary: "Mandatory yearly program with adaptive remediation and integrity checkpoints.",
      duration_minutes: 95,
      difficulty: "intermediate",
      hero_image_key: "",
      thumbnail_key: "",
      low_bandwidth_enabled: true
    },
    {
      id: "course-2",
      title: "Field Safety Escalations",
      slug: "field-safety-escalations",
      summary: "Scenario-driven modules for hazard response, reporting, and follow-up.",
      duration_minutes: 68,
      difficulty: "advanced",
      hero_image_key: "",
      thumbnail_key: "",
      low_bandwidth_enabled: true
    }
  ];

  const enrollments: Enrollment[] = [
    {
      id: "enroll-1",
      status: "active",
      progress_percent: 47,
      last_resume_second: 812,
      last_resume_slide: 0,
      requires_admin_review: false,
      course: courses[0]
    }
  ];

  const learningPath: LearningModule[] = [
    {
      id: "module-1",
      title: "Orientation and policy baseline",
      sequence: 1,
      summary: "Mandatory foundation before advanced content.",
      drip_unlock_days: 0,
      units: [
        {
          id: "unit-1",
          title: "Welcome and compliance scope",
          sequence: 1,
          kind: "video",
          asset_key: "videos/welcome.m3u8",
          duration_seconds: 1240,
          slide_count: 0,
          interrupt_quiz_at_second: 460,
          locked: false,
          unlock_reason: "Available"
        },
        {
          id: "unit-2",
          title: "Case review workbook",
          sequence: 2,
          kind: "slides",
          asset_key: "slides/case-review.pdf",
          duration_seconds: 0,
          slide_count: 22,
          interrupt_quiz_at_second: 0,
          locked: false,
          unlock_reason: "Available"
        }
      ]
    },
    {
      id: "module-2",
      title: "Escalation practice",
      sequence: 2,
      summary: "Unlocks after module 1 completion and next-day drip.",
      drip_unlock_days: 1,
      units: [
        {
          id: "unit-3",
          title: "Simulation lab",
          sequence: 1,
          kind: "video",
          asset_key: "videos/lab.m3u8",
          duration_seconds: 1620,
          slide_count: 0,
          interrupt_quiz_at_second: 710,
          locked: true,
          unlock_reason: "Drip schedule or prerequisite unmet"
        }
      ]
    }
  ];

  const alerts: AlertRecord[] = [
    {
      id: "alert-1",
      reason: "multi_face_detected,attention_drift",
      severity: "critical",
      confidence_score: 0.22,
      status: "open",
      created_at: "2026-04-24T09:00:00Z",
      user: "learner-001",
      course: "Clinical Compliance Foundations"
    },
    {
      id: "alert-2",
      reason: "anti_spoof_failed",
      severity: "high",
      confidence_score: 0.31,
      status: "reviewed",
      created_at: "2026-04-23T15:10:00Z",
      user: "learner-142",
      course: "Field Safety Escalations"
    }
  ];

  const analytics: AnalyticsSnapshot = {
    active_learners: 312,
    active_enrollments: 488,
    avg_progress: 61.4,
    avg_attention: 82.1,
    unresolved_alerts: 14,
    expiring_soon: 39,
    flagged_for_review: 7
  };

  const dropoff = [
    {
      unit__title: "Welcome and compliance scope",
      unit__module__course__title: "Clinical Compliance Foundations",
      drop_count: 18,
      avg_completion: 42.5
    },
    {
      unit__title: "Simulation lab",
      unit__module__course__title: "Field Safety Escalations",
      drop_count: 12,
      avg_completion: 36.9
    }
  ];

  if (path === "/courses/") return courses;
  if (path === "/enrollments/me/") return enrollments;
  if (path.includes("/learning_path/")) return learningPath;
  if (path === "/monitoring/alerts/") return { results: alerts };
  if (path === "/analytics/dashboard/") return analytics;
  if (path === "/analytics/dropoff/") return dropoff;
  return [];
}

export async function getCourseCatalog() {
  return request<CourseCard[]>("/courses/");
}

export async function getMyEnrollments() {
  return request<Enrollment[]>("/enrollments/me/");
}

export async function getLearningPath(courseId: string) {
  return request<LearningModule[]>(`/courses/${courseId}/learning_path/`);
}

export async function getAlerts() {
  const payload = await request<{ results?: AlertRecord[] } | AlertRecord[]>("/monitoring/alerts/");
  return Array.isArray(payload) ? payload : payload.results ?? [];
}

export async function getAnalytics() {
  return request<AnalyticsSnapshot>("/analytics/dashboard/");
}

export async function getDropoffReport() {
  return request<Array<Record<string, string | number>>>("/analytics/dropoff/");
}
