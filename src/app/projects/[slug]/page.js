import { notFound } from "next/navigation";
import ProjectLanding from "@/components/project/ProjectLanding";
import { getProject } from "@/lib/projects";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.name}, ${project.eyebrow}`;
  return {
    title,
    description: `${project.tagline}. ${project.summary} Download the brochure.`,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.summary,
      images: [{ url: project.hero.src, alt: project.hero.alt }],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectLanding project={project} />;
}
