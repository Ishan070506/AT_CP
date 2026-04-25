import { CatalogClient } from "../../components/CatalogClient";
import { getCourseCatalog, getMyEnrollments } from "../../lib/api";


export default async function CatalogPage() {
  const [courses, enrollments] = await Promise.all([getCourseCatalog(), getMyEnrollments()]);
  return <CatalogClient courses={courses} enrollments={enrollments} />;
}
