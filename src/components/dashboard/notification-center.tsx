"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAction } from "@/lib/action-context";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export function NotificationCenter() {
  const { notifications, notificationCount, clearNotifications } = useAction();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[380px] p-0">
        <SheetHeader className="p-4 pb-2 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {notificationCount > 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  {notificationCount}
                </Badge>
              )}
            </SheetTitle>
            {notificationCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={clearNotifications}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Actions you take across the dashboard will appear here
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors",
                    log.status === "error" && "bg-red-500/5"
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      log.status === "success"
                        ? "bg-emerald-500/10"
                        : "bg-red-500/10"
                    )}
                  >
                    {log.status === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium truncate">{log.action}</p>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 shrink-0 capitalize">
                        {log.module}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {log.detail}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-2.5 w-2.5 text-muted-foreground/60" />
                      <span className="text-[10px] text-muted-foreground/60">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
