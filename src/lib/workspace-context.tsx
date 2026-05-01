"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  TeamMember, Project, TeamActivity,
  defaultTeamMembers, defaultProjects, defaultTeamActivity,
  type RolePermissions, rolePermissions,
} from "./workspace-data";
import { generateId } from "./real-actions";

export interface WorkspaceContextType {
  // Current state
  currentProject: Project;
  currentUser: TeamMember;
  projects: Project[];
  teamMembers: TeamMember[];
  teamActivity: TeamActivity[];

  // Project actions
  switchProject: (projectId: string) => void;
  createProject: (project: Omit<Project, "id" | "createdAt" | "members" | "modules">) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  archiveProject: (projectId: string) => void;

  // Team actions
  addTeamMember: (member: Omit<TeamMember, "id">) => void;
  removeTeamMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: TeamMember["role"]) => void;
  getProjectMembers: () => TeamMember[];
  getOnlineMembers: () => TeamMember[];

  // Activity
  addActivity: (activity: Omit<TeamActivity, "id" | "timestamp" | "memberId" | "projectId">) => void;

  // Permissions
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [teamActivity, setTeamActivity] = useState<TeamActivity[]>(defaultTeamActivity);
  const [currentProjectId, setCurrentProjectId] = useState("proj-1");
  const [currentUserId] = useState("tm-1"); // Arjun Mehta is always the logged-in user

  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];
  const currentUser = teamMembers.find(m => m.id === currentUserId) || teamMembers[0];
  const permissions = rolePermissions[currentUser.role];

  const switchProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectId(projectId);
      toast.success(`Switched to ${project.name}`, {
        description: project.description,
      });
    }
  }, [projects]);

  const createProject = useCallback((data: Omit<Project, "id" | "createdAt" | "members" | "modules">) => {
    const newProject: Project = {
      ...data,
      id: `proj-${generateId()}`,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      members: [currentUserId],
      modules: ["overview", "social", "content", "email", "revenue"], // default modules
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    toast.success("Project created", { description: `${data.name} is ready to use` });
  }, [currentUserId]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  }, []);

  const archiveProject = useCallback((projectId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: "archived" as const } : p));
    const project = projects.find(p => p.id === projectId);
    toast.success("Project archived", { description: project?.name || projectId });
    if (projectId === currentProjectId) {
      const nextActive = projects.find(p => p.id !== projectId && p.status === "active");
      if (nextActive) setCurrentProjectId(nextActive.id);
    }
  }, [projects, currentProjectId]);

  const addTeamMember = useCallback((data: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = {
      ...data,
      id: `tm-${generateId()}`,
    };
    setTeamMembers(prev => [...prev, newMember]);
    toast.success("Team member added", { description: `${data.name} joined as ${data.role}` });
  }, []);

  const removeTeamMember = useCallback((memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    // Also remove from project member lists
    setProjects(prev => prev.map(p => ({
      ...p,
      members: p.members.filter(id => id !== memberId),
    })));
    if (member) toast.success("Member removed", { description: member.name });
  }, [teamMembers]);

  const updateMemberRole = useCallback((memberId: string, role: TeamMember["role"]) => {
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role } : m));
    const member = teamMembers.find(m => m.id === memberId);
    if (member) toast.success("Role updated", { description: `${member.name} is now ${role}` });
  }, [teamMembers]);

  const getProjectMembers = useCallback(() => {
    return teamMembers.filter(m => currentProject.members.includes(m.id));
  }, [teamMembers, currentProject]);

  const getOnlineMembers = useCallback(() => {
    return teamMembers.filter(m => currentProject.members.includes(m.id) && m.status === "online" && m.id !== currentUserId);
  }, [teamMembers, currentProject, currentUserId]);

  const addActivity = useCallback((activity: Omit<TeamActivity, "id" | "timestamp" | "memberId" | "projectId">) => {
    const newActivity: TeamActivity = {
      ...activity,
      id: `ta-${generateId()}`,
      memberId: currentUserId,
      projectId: currentProjectId,
      timestamp: new Date(),
    };
    setTeamActivity(prev => [newActivity, ...prev].slice(0, 100));
  }, [currentUserId, currentProjectId]);

  const hasPermission = useCallback((permission: keyof RolePermissions) => {
    return permissions[permission];
  }, [permissions]);

  return (
    <WorkspaceContext.Provider value={{
      currentProject,
      currentUser,
      projects,
      teamMembers,
      teamActivity,
      switchProject,
      createProject,
      updateProject,
      archiveProject,
      addTeamMember,
      removeTeamMember,
      updateMemberRole,
      getProjectMembers,
      getOnlineMembers,
      addActivity,
      permissions,
      hasPermission,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
