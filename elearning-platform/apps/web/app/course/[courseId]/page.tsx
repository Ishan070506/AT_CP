import { LearningSessionClient } from "../../../components/LearningSessionClient";
import { getLearningPath } from "../../../lib/api";


export default async function CourseSessionPage({
  params
}: {
  params: { courseId: string };
}) {
  const modules = await getLearningPath(params.courseId);
  return <LearningSessionClient courseId={params.courseId} modules={modules} />;
}
