export type CourseCard = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  duration_minutes: number;
  difficulty: string;
  hero_image_key: string;
  thumbnail_key: string;
  low_bandwidth_enabled: boolean;
};

export type Enrollment = {
  id: string;
  status: string;
  progress_percent: number;
  last_resume_second: number;
  last_resume_slide: number;
  requires_admin_review: boolean;
  course: CourseCard;
};

export type LearningUnit = {
  id: string;
  title: string;
  sequence: number;
  kind: string;
  asset_key: string;
  duration_seconds: number;
  slide_count: number;
  interrupt_quiz_at_second: number;
  locked: boolean;
  unlock_reason: string;
};

export type LearningModule = {
  id: string;
  title: string;
  sequence: number;
  summary: string;
  drip_unlock_days: number;
  units: LearningUnit[];
};

export type AlertRecord = {
  id: string;
  reason: string;
  severity: string;
  confidence_score: number;
  status: string;
  created_at: string;
  user: string;
  course: string;
};

export type AnalyticsSnapshot = {
  active_learners: number;
  active_enrollments: number;
  avg_progress: number;
  avg_attention: number;
  unresolved_alerts: number;
  expiring_soon: number;
  flagged_for_review: number;
};
