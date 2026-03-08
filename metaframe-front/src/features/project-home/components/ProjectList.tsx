// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { Empty } from 'antd'

import { ProjectCard } from '@/features/project-home/components/ProjectCard'
import type { ProjectSummary } from '@/types/project.types'

interface ProjectListProps {
  projects: ProjectSummary[]
  onOpen: (projectId: string) => void
  onDeleteRestore: (project: ProjectSummary) => void
}

export function ProjectList({ projects, onOpen, onDeleteRestore }: ProjectListProps) {
  if (projects.length === 0) {
    return <Empty description="No projects match the current filter." />
  }

  return (
    <div className="projects-home__grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.projectId}
          project={project}
          onOpen={onOpen}
          onDeleteRestore={onDeleteRestore}
        />
      ))}
    </div>
  )
}
