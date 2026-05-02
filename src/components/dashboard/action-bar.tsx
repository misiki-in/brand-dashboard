"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  Zap,
  FileText,
  BarChart3,
  RefreshCw,
  Send,
  ShoppingCart,
  Tag,
  Megaphone,
  Users,
  CalendarDays,
  Sparkles,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { useAction, type AutomationRule } from "@/lib/action-context";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  badge?: string;
}

export interface ActionBarProps {
  /** Module ID for action logging */
  module: string;
  /** Primary action (prominent button) */
  primary?: ActionItem;
  /** Secondary actions shown as icon buttons */
  actions?: ActionItem[];
  /** Automation rules relevant to this module */
  relevantAutomations?: AutomationRule[];
  /** Extra content on the right side */
  extra?: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Icon map for common actions                                                */
/* -------------------------------------------------------------------------- */

const actionIconMap: Record<string, LucideIcon> = {
  download: Download,
  plus: Plus,
  play: Play,
  pause: Pause,
  refresh: RefreshCw,
  send: Send,
  chart: BarChart3,
  file: FileText,
  cart: ShoppingCart,
  tag: Tag,
  megaphone: Megaphone,
  users: Users,
  calendar: CalendarDays,
  sparkles: Sparkles,
  settings: Settings2,
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ActionBar({ module, primary, actions = [], relevantAutomations = [], extra }: ActionBarProps) {
  const { loadingActions, executeAction } = useAction();

  const isLoading = (label: string) => loadingActions.has(`${module}:${label}`);

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Primary Action */}
        {primary && (
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            disabled={primary.disabled || isLoading(primary.label)}
            onClick={primary.onClick}
          >
            {isLoading(primary.label) ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : primary.icon ? (
              <primary.icon className="h-3.5 w-3.5" />
            ) : null}
            {primary.label}
            {primary.badge && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1 h-4">
                {primary.badge}
              </Badge>
            )}
          </Button>
        )}

        {/* Secondary Actions */}
        {actions.map((item, i) => {
          const Icon = item.icon || actionIconMap[item.label.toLowerCase()] || Zap;
          const loading = isLoading(item.label);
          return (
            <Button
              key={i}
              variant={item.variant || "outline"}
              size="sm"
              className="h-8 text-xs gap-1.5"
              disabled={item.disabled || loading}
              onClick={item.onClick}
            >
              {loading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Icon className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          );
        })}

        {/* Automation Dropdown */}
        {relevantAutomations.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Automate</span>
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                  {relevantAutomations.filter((a) => a.enabled).length}/{relevantAutomations.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel className="text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Automation Rules
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {relevantAutomations.map((rule) => (
                <DropdownMenuCheckboxItem
                  key={rule.id}
                  checked={rule.enabled}
                  onCheckedChange={() => {
                    executeAction({
                      action: `Toggle ${rule.name}`,
                      module,
                      detail: rule.enabled ? `Disabling: ${rule.description}` : `Enabling: ${rule.description}`,
                      successMsg: rule.enabled ? `${rule.name} disabled` : `${rule.name} enabled`,
                      simulateDelay: 400,
                    });
                  }}
                  className="py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">{rule.name}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{rule.description}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Extra content */}
      {extra && <div className="flex items-center gap-2">{extra}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline Action Button (for tables, cards, etc.)                             */
/* -------------------------------------------------------------------------- */

interface InlineActionProps {
  module: string;
  label: string;
  detail: string;
  successMsg?: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "xs";
  className?: string;
}

export function InlineAction({
  module,
  label,
  detail,
  successMsg,
  icon: Icon = Zap,
  variant = "outline",
  size = "sm",
  className,
}: InlineActionProps) {
  const { loadingActions, executeAction } = useAction();
  const loading = loadingActions.has(`${module}:${label}`);

  return (
    <Button
      variant={variant}
      size={size === "xs" ? "sm" : "sm"}
      className={cn(
        "gap-1",
        size === "xs" && "h-6 text-[10px] px-2",
        size === "sm" && "h-7 text-xs",
        className
      )}
      disabled={loading}
      onClick={() =>
        executeAction({
          action: label,
          module,
          detail,
          successMsg,
          simulateDelay: 600,
        })
      }
    >
      {loading ? (
        <RefreshCw className={cn("animate-spin", size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      ) : (
        <Icon className={cn(size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      )}
      {label}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*  More Actions Dropdown (for card headers)                                   */
/* -------------------------------------------------------------------------- */

interface MoreActionsProps {
  module: string;
  actions: {
    label: string;
    detail: string;
    successMsg?: string;
    icon?: LucideIcon;
    variant?: "default" | "destructive";
  }[];
}

export function MoreActionsDropdown({ module, actions }: MoreActionsProps) {
  const { executeAction } = useAction();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {actions.map((item, i) => {
          const Icon = item.icon || Zap;
          return (
            <DropdownMenuItem
              key={i}
              variant={item.variant}
              onClick={() =>
                executeAction({
                  action: item.label,
                  module,
                  detail: item.detail,
                  successMsg: item.successMsg,
                  simulateDelay: 600,
                })
              }
            >
              <Icon className="h-3.5 w-3.5 mr-2" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
