"use client";

import { useState } from "react";

import { LearningModule } from "../lib/types";
import { FaceVerificationPanel } from "./FaceVerificationPanel";


const quizPrompt = {
  prompt: "What should happen if a second face appears during a monitored session?",
  options: [
    "Continue playback and add a note later.",
    "Pause the session and raise an integrity alert.",
    "Ignore it unless the learner fails the final exam."
  ],
  correctIndex: 1
};

export function LearningSessionClient({
  courseId,
  modules
}: {
  courseId: string;
  modules: LearningModule[];
}) {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentUnit = modules[0]?.units[0];

  return (
    <section className="sessionLayout">
      <div className="panel videoStage">
        {!quizAnswered && currentUnit?.interrupt_quiz_at_second ? (
          <div className="overlayQuiz">
            <div className="eyebrow">Playback paused at {currentUnit.interrupt_quiz_at_second}s</div>
            <h3>{quizPrompt.prompt}</h3>
            {quizPrompt.options.map((option, index) => (
              <button
                key={option}
                className="option"
                onClick={() => {
                  setSelectedIndex(index);
                  if (index === quizPrompt.correctIndex) {
                    setQuizAnswered(true);
                  }
                }}
              >
                {option}
              </button>
            ))}
            {selectedIndex !== null && selectedIndex !== quizPrompt.correctIndex ? (
              <p className="muted">Correct answer required before playback resumes.</p>
            ) : null}
          </div>
        ) : null}
        <div className="panel" style={{ maxWidth: 380, margin: 22 }}>
          <div className="eyebrow">Session</div>
          <h2 style={{ marginBottom: 6 }}>Course {courseId}</h2>
          <div className="muted">
            Resume-aware playback, random verification prompts, and pause-on-alert behavior are wired into the backend APIs.
          </div>
        </div>
      </div>

      <aside className="rail">
        <section className="panel">
          <div className="eyebrow">Integrity monitor</div>
          <h3>Live learner confidence</h3>
          <div className="metric">91%</div>
          <div className="muted">Single face, liveness pass, attention steady.</div>
          <div className="chipRow" style={{ marginTop: 12 }}>
            <div className="chip">Face match 0.93</div>
            <div className="chip">Attention 0.81</div>
          </div>
        </section>
        <section className="panel">
          <div className="eyebrow">Module rail</div>
          <div className="rail">
            {modules.map((module) => (
              <div key={module.id} className="railItem">
                <strong>
                  {module.sequence}. {module.title}
                </strong>
                <p className="muted">{module.summary}</p>
                {module.units.map((unit) => (
                  <div key={unit.id} className={`railItem ${unit.locked ? "railItem--locked" : ""}`}>
                    <strong>{unit.title}</strong>
                    <div className="muted">{unit.locked ? unit.unlock_reason : `${unit.kind} ready`}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
        <FaceVerificationPanel courseId={courseId} />
      </aside>
    </section>
  );
}
