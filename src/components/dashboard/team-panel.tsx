'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/lib/workspace-context';
import {
  getStatusColor,
  getRoleBadgeVariant,
  formatRelativeTime,
  type TeamMember,
  type TeamActivity,
} from '@/lib/workspace-data';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Plus,
  MoreHorizontal,
  Search,
  Crown,
  Shield,
  Pencil,
  BarChart3,
  Eye,
} from 'lucide-react';

// ============================================================
// TeamAvatars — top bar trigger (overlapping avatars + count)
// ============================================================
export function TeamAvatars() {
  const { getOnlineMembers, teamMembers } = useWorkspace();
  const [open, setOpen] = useState(false);

  const onlineMembers = useMemo(
    () => (getOnlineMembers ? getOnlineMembers() : teamMembers.filter((m) => m.status === 'online')),
    [getOnlineMembers, teamMembers]
  );

  const shown = onlineMembers.slice(0, 3);
  const extraCount = onlineMembers.length - 3;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-auto px-1.5 gap-0 hover:bg-accent/60 rounded-lg"
        >
          <div className="flex -space-x-2">
            {shown.map((member, idx) => (
              <span
                key={member.id}
                className={cn(
                  'relative flex items-center justify-center h-7 w-7 rounded-full text-[10px] font-bold text-white ring-2 ring-background',
                  idx === 0 && 'z-30',
                  idx === 1 && 'z-20',
                  idx === 2 && 'z-10'
                )}
                style={{ backgroundColor: getAvatarColor(member.id) }}
              >
                {member.avatar}
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background',
                    getStatusColor(member.status)
                  )}
                />
              </span>
            ))}
            {extraCount > 0 && (
              <span className="relative flex items-center justify-center h-7 w-7 rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-2 ring-background z-40">
                +{extraCount}
              </span>
            )}
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 sm:w-80 p-0 flex flex-col"
      >
        <TeamPanelContent onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

// ============================================================
// TeamPanelContent — the actual panel body
// ============================================================
function TeamPanelContent({ onClose }: { onClose: () => void }) {
  const {
    currentProject,
    teamMembers,
    teamActivity,
    addTeamMember,
    removeTeamMember,
    updateMemberRole,
    hasPermission,
    getProjectMembers,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('editor');

  // Filter members to current project
  const projectMembers = useMemo(() => {
    if (!currentProject) return teamMembers;
    const memberIds = currentProject.members;
    return teamMembers.filter((m) => memberIds.includes(m.id));
  }, [currentProject, teamMembers]);

  // Filter by search
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return projectMembers;
    const q = searchQuery.toLowerCase();
    return projectMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [projectMembers, searchQuery]);

  // Group by status
  const onlineMembers = filteredMembers.filter((m) => m.status === 'online');
  const awayMembers = filteredMembers.filter((m) => m.status === 'away');
  const offlineMembers = filteredMembers.filter((m) => m.status === 'offline');

  // Activity feed for current project (max 15)
  const projectActivity = useMemo(() => {
    if (!currentProject) return [];
    return teamActivity
      .filter((a) => a.projectId === currentProject.id)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 15);
  }, [currentProject, teamActivity]);

  const canManageTeam = hasPermission ? hasPermission('canManageTeam') : false;

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    if (currentProject) {
      const nameParts = inviteEmail.split('@')[0].split(/[._-]/).map(capitalize);
      const initials = nameParts.slice(0, 2).map(n => n[0]).join('').toUpperCase();
      addTeamMember({
        name: nameParts.join(' '),
        email: inviteEmail,
        avatar: initials,
        role: inviteRole as TeamMember['role'],
        status: 'offline',
        projects: [currentProject.id],
      });
      setInviteEmail('');
      setInviteRole('editor');
    }
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    if (updateMemberRole) {
      updateMemberRole(memberId, newRole as TeamMember['role']);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (removeTeamMember) {
      removeTeamMember(memberId);
    }
  };

  return (
    <>
      {/* Header */}
      <SheetHeader className="p-4 pb-3 shrink-0">
        <SheetTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Team
          <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
            {projectMembers.length} members
          </Badge>
        </SheetTitle>
      </SheetHeader>

      {/* Search */}
      <div className="px-4 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="h-8 pl-8 text-xs bg-muted/40 border-border/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Members list */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 pb-4 space-y-4">
          {/* Online */}
          {onlineMembers.length > 0 && (
            <MemberGroup
              label="ONLINE"
              count={onlineMembers.length}
              members={onlineMembers}
              allMembers={teamMembers}
              canManageTeam={canManageTeam}
              onChangeRole={handleChangeRole}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {/* Away */}
          {awayMembers.length > 0 && (
            <MemberGroup
              label="AWAY"
              count={awayMembers.length}
              members={awayMembers}
              allMembers={teamMembers}
              canManageTeam={canManageTeam}
              onChangeRole={handleChangeRole}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {/* Offline */}
          {offlineMembers.length > 0 && (
            <MemberGroup
              label="OFFLINE"
              count={offlineMembers.length}
              members={offlineMembers}
              allMembers={teamMembers}
              canManageTeam={canManageTeam}
              onChangeRole={handleChangeRole}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {/* Invite Section */}
          {canManageTeam && (
            <div className="space-y-2.5 pt-1">
              <Separator />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Invite Member
              </p>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Email address..."
                  className="h-8 text-xs flex-1 min-w-0"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                />
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="h-8 w-[88px] text-xs" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">
                      <span className="flex items-center gap-1.5">
                        <Pencil className="h-3 w-3" /> Editor
                      </span>
                    </SelectItem>
                    <SelectItem value="analyst">
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="h-3 w-3" /> Analyst
                      </span>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-3 w-3" /> Viewer
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" className="h-8 px-3 text-xs shrink-0" onClick={handleInvite}>
                  <Plus className="h-3 w-3" />
                  <span className="hidden sm:inline">Invite</span>
                </Button>
              </div>
            </div>
          )}

          {/* Activity Feed */}
          {projectActivity.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <Separator />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent Activity
              </p>
              <div className="space-y-2">
                {projectActivity.map((activity) => {
                  const member = teamMembers.find((m) => m.id === activity.memberId);
                  return (
                    <div key={activity.id} className="flex items-start gap-2.5 py-1">
                      <span
                        className="flex items-center justify-center h-6 w-6 rounded-full text-[9px] font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: getAvatarColor(activity.memberId) }}
                      >
                        {member?.avatar ?? '??'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/90 leading-snug">
                          <span className="font-medium">{member?.name ?? 'Unknown'}</span>{' '}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}

// ============================================================
// MemberGroup — a section (Online / Away / Offline)
// ============================================================
function MemberGroup({
  label,
  count,
  members,
  allMembers,
  canManageTeam,
  onChangeRole,
  onRemoveMember,
}: {
  label: string;
  count: number;
  members: TeamMember[];
  allMembers: TeamMember[];
  canManageTeam: boolean;
  onChangeRole: (memberId: string, newRole: string) => void;
  onRemoveMember: (memberId: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}{' '}
        <span className="font-normal text-muted-foreground/70">({count})</span>
      </p>
      <div className="space-y-1">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            canManageTeam={canManageTeam}
            onChangeRole={onChangeRole}
            onRemoveMember={onRemoveMember}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MemberCard — individual member row
// ============================================================
function MemberCard({
  member,
  canManageTeam,
  onChangeRole,
  onRemoveMember,
}: {
  member: TeamMember;
  canManageTeam: boolean;
  onChangeRole: (memberId: string, newRole: string) => void;
  onRemoveMember: (memberId: string) => void;
}) {
  const roleIcon = getRoleIcon(member.role);

  return (
    <div className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-accent/40 transition-colors group">
      {/* Avatar with status dot */}
      <div className="relative shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback
            className="text-[10px] font-bold text-white"
            style={{ backgroundColor: getAvatarColor(member.id) }}
          >
            {member.avatar}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background',
            getStatusColor(member.status)
          )}
        />
      </div>

      {/* Name, email, role */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium truncate">{member.name}</span>
          <Badge
            variant={getRoleBadgeVariant(member.role)}
            className={cn(
              'text-[9px] px-1.5 py-0 h-4 gap-0.5 shrink-0',
              member.role === 'owner' && 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
              member.role === 'admin' && 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20'
            )}
          >
            {roleIcon}
            {capitalize(member.role)}
          </Badge>
        </div>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {member.email}
        </p>
      </div>

      {/* More menu */}
      {canManageTeam && member.role !== 'owner' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {/* Change Role */}
            {['editor', 'analyst', 'viewer'].map((role) => (
              <DropdownMenuItem
                key={role}
                className="text-xs gap-2 cursor-pointer"
                onSelect={() => onChangeRole(member.id, role)}
              >
                {getRoleIcon(role as TeamMember['role'])}
                Make {capitalize(role)}
              </DropdownMenuItem>
            ))}
            {member.role !== 'admin' && (
              <DropdownMenuItem
                className="text-xs gap-2 cursor-pointer"
                onSelect={() => onChangeRole(member.id, 'admin')}
              >
                <Shield className="h-3 w-3" />
                Make Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="text-xs gap-2 cursor-pointer"
              onSelect={() => onRemoveMember(member.id)}
            >
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

function getRoleIcon(role: TeamMember['role']) {
  switch (role) {
    case 'owner':
      return <Crown className="h-2.5 w-2.5" />;
    case 'admin':
      return <Shield className="h-2.5 w-2.5" />;
    case 'editor':
      return <Pencil className="h-2.5 w-2.5" />;
    case 'analyst':
      return <BarChart3 className="h-2.5 w-2.5" />;
    case 'viewer':
      return <Eye className="h-2.5 w-2.5" />;
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Deterministic color from member ID for avatars
const AVATAR_COLORS = [
  '#D4A843', '#8B5CF6', '#0EA5E9', '#10B981',
  '#F97316', '#EC4899', '#6366F1', '#14B8A6',
];
function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
