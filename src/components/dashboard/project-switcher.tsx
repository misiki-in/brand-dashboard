'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/lib/workspace-context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Plus, Users } from 'lucide-react';
import type { Project } from '@/lib/workspace-data';

export function ProjectSwitcher() {
  const { currentProject, projects, switchProject, createProject } = useWorkspace();

  if (!currentProject) return null;

  const activeProjects = projects.filter((p) => p.status === 'active');
  const pausedProjects = projects.filter((p) => p.status === 'paused');
  const archivedProjects = projects.filter((p) => p.status === 'archived');

  const getMemberCount = (project: Project) => project.members.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 h-9 px-2 md:px-3 hover:bg-accent/60 transition-all rounded-lg group"
        >
          {/* Project brand circle */}
          <span
            className="flex items-center justify-center h-7 w-7 rounded-lg text-[11px] font-bold text-white shrink-0 shadow-sm"
            style={{ backgroundColor: currentProject.brandColor }}
          >
            {currentProject.shortName}
          </span>
          {/* Project name — hidden on mobile */}
          <span className="hidden md:block text-sm font-medium truncate max-w-[140px] text-foreground">
            {currentProject.name}
          </span>
          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-1.5">
        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
              Active Projects
            </DropdownMenuLabel>
            {activeProjects.map((project) => (
              <ProjectMenuItem
                key={project.id}
                project={project}
                isSelected={project.id === currentProject.id}
                memberCount={getMemberCount(project)}
                onSelect={() => switchProject(project.id)}
              />
            ))}
          </>
        )}

        {/* Paused Projects */}
        {pausedProjects.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
              Paused
            </DropdownMenuLabel>
            {pausedProjects.map((project) => (
              <ProjectMenuItem
                key={project.id}
                project={project}
                isSelected={project.id === currentProject.id}
                memberCount={getMemberCount(project)}
                onSelect={() => switchProject(project.id)}
              />
            ))}
          </>
        )}

        {/* Archived Projects */}
        {archivedProjects.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
              Archived
            </DropdownMenuLabel>
            {archivedProjects.map((project) => (
              <ProjectMenuItem
                key={project.id}
                project={project}
                isSelected={project.id === currentProject.id}
                memberCount={getMemberCount(project)}
                onSelect={() => switchProject(project.id)}
              />
            ))}
          </>
        )}

        {/* Create New Project */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2.5 py-2 px-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          onSelect={() => {
            createProject({
              name: 'New Project',
              shortName: 'NP',
              industry: 'General',
              description: 'New workspace',
              brandColor: '#6366F1',
              status: 'active',
            });
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Create New Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectMenuItem({
  project,
  isSelected,
  memberCount,
  onSelect,
}: {
  project: Project;
  isSelected: boolean;
  memberCount: number;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      className={cn(
        'gap-3 py-2 px-2.5 cursor-pointer items-start',
        isSelected && 'bg-accent/50'
      )}
      onSelect={onSelect}
    >
      {/* Colored circle with shortName */}
      <span
        className={cn(
          'flex items-center justify-center h-7 w-7 rounded-lg text-[10px] font-bold text-white shrink-0 mt-0.5',
          project.status === 'paused' && 'opacity-60',
          project.status === 'archived' && 'opacity-40 grayscale'
        )}
        style={{ backgroundColor: project.brandColor }}
      >
        {project.shortName}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-medium truncate',
              isSelected && 'text-foreground',
              !isSelected && 'text-foreground/90'
            )}
          >
            {project.name}
          </span>
          {isSelected && (
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground truncate">
            {project.industry}
          </span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
            <Users className="h-3 w-3" />
            {memberCount}
          </span>
        </div>
      </div>
    </DropdownMenuItem>
  );
}
