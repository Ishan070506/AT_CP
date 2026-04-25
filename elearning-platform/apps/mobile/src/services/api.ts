const API_BASE = "http://localhost:8000/api";

export async function fetchCourseCatalog(tenantId: string) {
  const response = await fetch(`${API_BASE}/courses/`, {
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status}`);
  }
  return response.json();
}

export async function pushProgressCheckpoint(
  tenantId: string,
  token: string,
  payload: {
    enrollmentId: string;
    unitId: string;
    lastWatchedSecond: number;
    lastSlideIndex: number;
    completionPercent: number;
    attentionScore: number;
  }
) {
  const response = await fetch(`${API_BASE}/progress/checkpoints/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId
    },
    body: JSON.stringify({
      enrollment: payload.enrollmentId,
      unit: payload.unitId,
      last_watched_second: payload.lastWatchedSecond,
      last_slide_index: payload.lastSlideIndex,
      completion_percent: payload.completionPercent,
      attention_score: payload.attentionScore
    })
  });
  if (!response.ok) {
    throw new Error(`Progress sync failed: ${response.status}`);
  }
  return response.json();
}

export async function uploadMasterFace(
  tenantId: string,
  token: string,
  payload: { imageKey?: string; imageBase64?: string; embedding?: number[]; captureDevice: string }
) {
  const response = await fetch(`${API_BASE}/monitoring/master-face/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Tenant-ID": tenantId
    },
    body: JSON.stringify({
      image_key: payload.imageKey,
      image_base64: payload.imageBase64,
      embedding: payload.embedding,
      capture_device: payload.captureDevice
    })
  });
  if (!response.ok) {
    throw new Error(`Master face upload failed: ${response.status}`);
  }
  return response.json();
}
