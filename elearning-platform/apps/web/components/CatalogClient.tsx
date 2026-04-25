"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";

import { CourseCard, Enrollment } from "../lib/types";


export function CatalogClient({
  courses,
  enrollments
}: {
  courses: CourseCard[];
  enrollments: Enrollment[];
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredCourses = courses.filter((course) => {
    const haystack = `${course.title} ${course.summary} ${course.difficulty}`.toLowerCase();
    return haystack.includes(deferredQuery.toLowerCase());
  });

  return (
    <>
      <section className="hero">
        <div className="panel panel--accent">
          <div className="eyebrow">Adaptive Learning Mesh</div>
          <h1 className="title">Modular training that pauses when integrity confidence drops.</h1>
          <p className="subtitle">
            Courses unlock in sequence, checkpoint every learner interaction, and surface admin-review gates before compliance is marked complete.
          </p>
          <div className="ctaRow">
            <Link className="button" href="/catalog">
              Browse live catalog
            </Link>
            <Link className="button button--soft" href="/admin/monitoring">
              Open integrity queue
            </Link>
          </div>
        </div>
        <div className="panel">
          <div className="muted">Continue learning</div>
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="card" style={{ marginTop: 14 }}>
              <strong>{enrollment.course.title}</strong>
              <div className="muted">
                {enrollment.progress_percent}% complete, resume at {Math.floor(enrollment.last_resume_second / 60)}m {enrollment.last_resume_second % 60}s
              </div>
              <Link className="button" href={`/course/${enrollment.course.id}`}>
                Resume session
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="toolbar">
        <input
          className="search"
          value={query}
          onChange={(event) => {
            const nextValue = event.target.value;
            startTransition(() => setQuery(nextValue));
          }}
          placeholder="Search by course title, summary, or difficulty"
        />
        <div className="chipRow">
          <div className="chip">Sequenced paths</div>
          <div className="chip">Drip unlocks</div>
          <div className="chip">Mid-video quizzes</div>
          <div className="chip">Low bandwidth mode</div>
        </div>
      </section>

      <section className="catalog">
        {filteredCourses.map((course) => (
          <article className="card" key={course.id}>
            <div className="card__media" />
            <div className="eyebrow">{course.difficulty}</div>
            <div>
              <h3>{course.title}</h3>
              <p className="muted">{course.summary}</p>
            </div>
            <div className="muted">{course.duration_minutes} minutes</div>
            <Link className="button" href={`/course/${course.id}`}>
              Open course
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
