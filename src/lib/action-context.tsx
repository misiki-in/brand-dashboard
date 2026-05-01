"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ActionStatus = "idle" | "loading" | "success" | "error";

export interface ActionLog {
  id: string;
  action: string;
  module: string;
  detail: string;
  status: "success" | "error";
  timestamp: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  module: string;
  enabled: boolean;
  trigger: string;
  action: string;
  lastRun?: string;
  runCount: number;
}

export interface ActionContextType {
  /** Execute an action with toast + logging */
  executeAction: (params: {
    action: string;
    module: string;
    detail: string;
    successMsg?: string;
    loadingMsg?: string;
    simulateDelay?: number;
    undoLabel?: string;
    undoAction?: () => void;
  }) => void;

  /** Get current loading state for an action */
  loadingActions: Set<string>;

  /** Action logs */
  actionLogs: ActionLog[];

  /** Clear action logs */
  clearLogs: () => void;

  /* ---- Automation ---- */
  automations: AutomationRule[];
  toggleAutomation: (id: string) => void;
  addAutomation: (rule: Omit<AutomationRule, "id" | "runCount">) => void;
  removeAutomation: (id: string) => void;

  /* ---- Notifications ---- */
  notifications: ActionLog[];
  notificationCount: number;
  clearNotifications: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Default Automations                                                        */
/* -------------------------------------------------------------------------- */

const defaultAutomations: AutomationRule[] = [
  {
    id: "auto-reorder",
    name: "Auto-Reorder Alerts",
    description: "Automatically create purchase orders when stock falls below reorder point",
    module: "inventory",
    enabled: true,
    trigger: "Stock < Reorder Point",
    action: "Create PO & Notify Procurement",
    lastRun: "2 hours ago",
    runCount: 14,
  },
  {
    id: "auto-liquidate",
    name: "Smart Liquidation",
    description: "Auto-apply AI-suggested markdowns to dead stock after 120 days",
    module: "inventory",
    enabled: false,
    trigger: "Dead Stock > 120 days",
    action: "Apply Markdown Schedule",
    runCount: 3,
  },
  {
    id: "auto-cart-abandon",
    name: "Cart Abandonment Recovery",
    description: "Auto-trigger WhatsApp + Email sequence for abandoned carts",
    module: "journey",
    enabled: true,
    trigger: "Cart Abandoned > 30 min",
    action: "Send Recovery Sequence",
    lastRun: "15 min ago",
    runCount: 342,
  },
  {
    id: "auto-content-decay",
    name: "Content Decay Auto-Fix",
    description: "Create fix tasks when content decay is detected for 2+ weeks",
    module: "seo",
    enabled: true,
    trigger: "Position Drop > 5 ranks",
    action: "Create Fix Task in Pipeline",
    lastRun: "1 day ago",
    runCount: 8,
  },
  {
    id: "auto-budget-pacing",
    name: "Budget Auto-Adjust",
    description: "Shift budget from underperforming to overperforming channels daily",
    module: "ads",
    enabled: false,
    trigger: "Channel ROAS < 2.0x",
    action: "Reallocate Budget",
    runCount: 0,
  },
  {
    id: "auto-nps-trigger",
    name: "Post-Purchase NPS",
    description: "Auto-send NPS survey 7 days after delivery",
    module: "cx",
    enabled: true,
    trigger: "Delivery + 7 days",
    action: "Send NPS Survey",
    lastRun: "3 hours ago",
    runCount: 156,
  },
  {
    id: "auto-winback",
    name: "Win-Back Auto-Trigger",
    description: "Auto-activate win-back sequence for dormant customers (90+ days)",
    module: "journey",
    enabled: true,
    trigger: "Inactive > 90 days",
    action: "Activate Win-Back Flow",
    lastRun: "6 hours ago",
    runCount: 47,
  },
  {
    id: "auto-creative-fatigue",
    name: "Creative Fatigue Auto-Rotate",
    description: "Auto-pause fatigued creatives (frequency > 4x) and rotate replacements",
    module: "creative",
    enabled: false,
    trigger: "Frequency > 4.0x",
    action: "Pause & Rotate Creative",
    runCount: 2,
  },
  {
    id: "auto-restock-alert",
    name: "Restock WhatsApp Alert",
    description: "Auto-notify opted-in customers when back-in-stock for wishlisted items",
    module: "whatsapp",
    enabled: true,
    trigger: "Back in Stock",
    action: "Send WhatsApp Notification",
    lastRun: "4 hours ago",
    runCount: 28,
  },
  {
    id: "auto-sentiment-alert",
    name: "Sentiment Spike Alert",
    description: "Alert marketing team when negative sentiment spikes > 20% in 1 hour",
    module: "sentiment",
    enabled: true,
    trigger: "Negative Sentiment > 20%",
    action: "Send Alert to Marketing Team",
    runCount: 5,
  },
];

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

const ActionContext = createContext<ActionContextType | null>(null);

export function ActionProvider({ children }: { children: React.ReactNode }) {
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [automations, setAutomations] = useState<AutomationRule[]>(defaultAutomations);
  const logIdRef = useRef(0);

  const executeAction = useCallback(
    ({
      action,
      module,
      detail,
      successMsg,
      loadingMsg = "Processing...",
      simulateDelay = 800,
      undoLabel,
      undoAction,
    }: {
      action: string;
      module: string;
      detail: string;
      successMsg?: string;
      loadingMsg?: string;
      simulateDelay?: number;
      undoLabel?: string;
      undoAction?: () => void;
    }) => {
      const key = `${module}:${action}`;
      if (loadingActions.has(key)) return;

      setLoadingActions((prev) => new Set(prev).add(key));

      const toastId = toast.loading(loadingMsg, {
        description: detail,
      });

      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate

        setLoadingActions((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });

        const logEntry: ActionLog = {
          id: `log-${++logIdRef.current}`,
          action,
          module,
          detail,
          status: success ? "success" : "error",
          timestamp: new Date(),
        };

        setActionLogs((prev) => [logEntry, ...prev].slice(0, 50));

        if (success) {
          toast.success(successMsg || action, {
            id: toastId,
            description: detail,
            action: undoLabel
              ? {
                  label: undoLabel,
                  onClick: undoAction || (() => toast.info("Undo simulated")),
                }
              : undefined,
          });
        } else {
          toast.error("Action failed", {
            id: toastId,
            description: "Something went wrong. Please try again.",
          });
        }
      }, simulateDelay);
    },
    [loadingActions]
  );

  const clearLogs = useCallback(() => setActionLogs([]), []);

  const toggleAutomation = useCallback((id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled, lastRun: a.enabled ? a.lastRun : undefined } : a
      )
    );
    toast.success("Automation updated", { description: `Rule ${id} toggled.` });
  }, []);

  const addAutomation = useCallback((rule: Omit<AutomationRule, "id" | "runCount">) => {
    setAutomations((prev) => [
      ...prev,
      { ...rule, id: `custom-${++logIdRef.current}`, runCount: 0 },
    ]);
    toast.success("Automation created", { description: rule.name });
  }, []);

  const removeAutomation = useCallback((id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    toast.success("Automation removed");
  }, []);

  const clearNotifications = useCallback(() => setActionLogs([]), []);

  return (
    <ActionContext.Provider
      value={{
        executeAction,
        loadingActions,
        actionLogs,
        clearLogs,
        automations,
        toggleAutomation,
        addAutomation,
        removeAutomation,
        notifications: actionLogs,
        notificationCount: actionLogs.length,
        clearNotifications,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
}

export function useAction() {
  const ctx = useContext(ActionContext);
  if (!ctx) throw new Error("useAction must be used within ActionProvider");
  return ctx;
}
