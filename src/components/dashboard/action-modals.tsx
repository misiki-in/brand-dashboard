"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Download,
  Loader2,
  Send,
  Calendar,
  Sparkles,
  FileText,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV, exportToJSON, generateId, formatDateISO } from "@/lib/real-actions";
import { campaignData, creativeData } from "@/lib/mock-data";

// ============================================================
// A. CreateCampaignModal
// ============================================================

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (campaign: {
    name: string;
    type: string;
    channels: string[];
    budget: number;
    startDate: string;
    endDate: string;
    targetAudience: string;
    objective: string;
  }) => void;
}

const CAMPAIGN_TYPES = [
  "Brand Awareness",
  "Sales",
  "Retargeting",
  "Event",
] as const;

const CHANNEL_OPTIONS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Google",
  "Email",
  "WhatsApp",
  "Pinterest",
] as const;

const OBJECTIVE_OPTIONS = [
  "Awareness",
  "Traffic",
  "Conversions",
  "Revenue",
] as const;

export function CreateCampaignModal({
  open,
  onOpenChange,
  onCreated,
}: CreateCampaignModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [objective, setObjective] = useState("");

  const toggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const resetForm = () => {
    setName("");
    setType("");
    setChannels([]);
    setBudget("");
    setStartDate("");
    setEndDate("");
    setTargetAudience("");
    setObjective("");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !type || channels.length === 0 || !budget) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    const campaign = {
      name: name.trim(),
      type,
      channels,
      budget: parseFloat(budget) || 0,
      startDate,
      endDate,
      targetAudience,
      objective,
    };
    onCreated?.(campaign);
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isValid =
    name.trim() !== "" &&
    type !== "" &&
    channels.length > 0 &&
    budget !== "" &&
    parseFloat(budget) > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Campaign
          </DialogTitle>
          <DialogDescription>
            Launch a new marketing campaign across your channels.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="campaign-name">Campaign Name *</Label>
            <Input
              id="campaign-name"
              placeholder="e.g., Valentine's Day: Love, Illuminated"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Type + Objective */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Objective</Label>
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {OBJECTIVE_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Channels */}
          <div className="grid gap-2">
            <Label>Channels *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHANNEL_OPTIONS.map((ch) => (
                <label
                  key={ch}
                  className="flex items-center gap-2 text-sm cursor-pointer rounded-md border px-3 py-2 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5"
                >
                  <Checkbox
                    checked={channels.includes(ch)}
                    onCheckedChange={() => toggleChannel(ch)}
                  />
                  {ch}
                </label>
              ))}
            </div>
          </div>

          {/* Budget + Dates */}
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget ($) *</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                placeholder="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="grid gap-2">
            <Label htmlFor="target-audience">Target Audience</Label>
            <Input
              id="target-audience"
              placeholder="e.g., Women 25-40, Gift Shoppers"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!isValid || loading}
            onClick={handleSubmit}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            Create Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// B. SendBroadcastModal
// ============================================================

interface SendBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSent?: () => void;
}

const BROADCAST_CHANNELS = ["WhatsApp", "Email", "SMS"] as const;
const BROADCAST_AUDIENCES = [
  { label: "All Contacts", count: 142000 },
  { label: "VIP Customers", count: 6800 },
  { label: "Cart Abandoners", count: 12400 },
  { label: "Diamond Browsers", count: 12400 },
  { label: "Custom Segment", count: 0 },
] as const;

export function SendBroadcastModal({
  open,
  onOpenChange,
  onSent,
}: SendBroadcastModalProps) {
  const [loading, setLoading] = useState(false);
  const [broadcastName, setBroadcastName] = useState("");
  const [channel, setChannel] = useState("");
  const [audience, setAudience] = useState("");
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState("now");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");

  const estimatedReach = useMemo(() => {
    const found = BROADCAST_AUDIENCES.find((a) => a.label === audience);
    return found ? found.count : 0;
  }, [audience]);

  const resetForm = () => {
    setBroadcastName("");
    setChannel("");
    setAudience("");
    setMessage("");
    setSchedule("now");
    setCustomDate("");
    setCustomTime("");
  };

  const handleSubmit = async () => {
    if (!broadcastName.trim() || !channel || !audience || !message.trim())
      return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onSent?.();
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isValid =
    broadcastName.trim() !== "" &&
    channel !== "" &&
    audience !== "" &&
    message.trim() !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Send Broadcast
          </DialogTitle>
          <DialogDescription>
            Send a message blast to your audience via WhatsApp, Email, or SMS.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="broadcast-name">Broadcast Name *</Label>
            <Input
              id="broadcast-name"
              placeholder="e.g., Valentine's Early Access"
              value={broadcastName}
              onChange={(e) => setBroadcastName(e.target.value)}
            />
          </div>

          {/* Channel + Audience */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Channel *</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {BROADCAST_CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Audience *</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {BROADCAST_AUDIENCES.map((a) => (
                    <SelectItem key={a.label} value={a.label}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Reach */}
          {estimatedReach > 0 && (
            <div className="rounded-md bg-primary/5 border border-primary/20 px-4 py-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Estimated Reach:{" "}
                <span className="text-primary">
                  {estimatedReach.toLocaleString()} contacts
                </span>
              </span>
            </div>
          )}

          {/* Message */}
          <div className="grid gap-2">
            <Label htmlFor="broadcast-message">Message *</Label>
            <Textarea
              id="broadcast-message"
              placeholder="Type your broadcast message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {message.length} characters
            </p>
          </div>

          {/* Schedule */}
          <div className="grid gap-2">
            <Label>Schedule</Label>
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Send Now</SelectItem>
                <SelectItem value="1hour">In 1 hour</SelectItem>
                <SelectItem value="custom">Custom date & time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {schedule === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="custom-date">Date</Label>
                <Input
                  id="custom-date"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom-time">Time</Label>
                <Input
                  id="custom-time"
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || loading} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            {schedule === "now" ? "Send Now" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// C. CreateSegmentModal
// ============================================================

interface SegmentRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface CreateSegmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const SEGMENT_FIELDS = [
  "Purchase Count",
  "Total Spend",
  "Last Purchase",
  "Category",
  "Tier",
] as const;

const SEGMENT_OPERATORS = [
  "equals",
  "greater than",
  "less than",
  "between",
  "contains",
] as const;

export function CreateSegmentModal({
  open,
  onOpenChange,
  onCreated,
}: CreateSegmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [rules, setRules] = useState<SegmentRule[]>([
    { id: generateId(), field: "", operator: "", value: "" },
  ]);

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      { id: generateId(), field: "", operator: "", value: "" },
    ]);
  };

  const removeRule = (id: string) => {
    if (rules.length > 1) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const updateRule = (id: string, key: keyof SegmentRule, val: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: val } : r))
    );
  };

  const resetForm = () => {
    setSegmentName("");
    setRules([{ id: generateId(), field: "", operator: "", value: "" }]);
  };

  const handleSubmit = async () => {
    if (!segmentName.trim()) return;
    const validRules = rules.filter((r) => r.field && r.operator && r.value);
    if (validRules.length === 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onCreated?.();
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isValid =
    segmentName.trim() !== "" &&
    rules.some((r) => r.field && r.operator && r.value);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Create Audience Segment
          </DialogTitle>
          <DialogDescription>
            Define rules to create a targeted customer segment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Segment Name */}
          <div className="grid gap-2">
            <Label htmlFor="segment-name">Segment Name *</Label>
            <Input
              id="segment-name"
              placeholder="e.g., High-Value Diamond Browsers"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </div>

          {/* Rules */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Rules *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={addRule}
              >
                <Plus className="h-3 w-3" /> Add Rule
              </Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end"
                >
                  {idx > 0 && (
                    <div className="col-span-full -mt-1 text-xs text-muted-foreground">
                      AND
                    </div>
                  )}
                  <Select
                    value={rule.field}
                    onValueChange={(v) => updateRule(rule.id, "field", v)}
                  >
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEGMENT_FIELDS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={rule.operator}
                    onValueChange={(v) => updateRule(rule.id, "operator", v)}
                  >
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEGMENT_OPERATORS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value"
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                    className="h-8 text-sm"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRule(rule.id)}
                    disabled={rules.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || loading} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            Create Segment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// D. CreateWorkflowModal
// ============================================================

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const WORKFLOW_TRIGGERS = [
  "Cart Abandoned",
  "Browse Abandoned",
  "Purchase Made",
  "Delivery",
  "Shipped",
  "Win-Back",
  "Birthday",
  "Custom",
] as const;

const WORKFLOW_CHANNELS = ["Email", "WhatsApp", "SMS", "Push"] as const;

export function CreateWorkflowModal({
  open,
  onOpenChange,
  onCreated,
}: CreateWorkflowModalProps) {
  const [loading, setLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [channel, setChannel] = useState("");
  const [steps, setSteps] = useState("");

  const resetForm = () => {
    setWorkflowName("");
    setTrigger("");
    setChannel("");
    setSteps("");
  };

  const handleSubmit = async () => {
    if (!workflowName.trim() || !trigger || !channel) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onCreated?.();
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isValid =
    workflowName.trim() !== "" && trigger !== "" && channel !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Create Automation Workflow
          </DialogTitle>
          <DialogDescription>
            Build an automated sequence triggered by customer actions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="workflow-name">Workflow Name *</Label>
            <Input
              id="workflow-name"
              placeholder="e.g., Cart Abandonment Recovery"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
            />
          </div>

          {/* Trigger + Channel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Trigger *</Label>
              <Select value={trigger} onValueChange={setTrigger}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_TRIGGERS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Channel *</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Steps */}
          <div className="grid gap-2">
            <Label htmlFor="workflow-steps">
              Workflow Steps{" "}
              <span className="text-muted-foreground font-normal">
                (one per line)
              </span>
            </Label>
            <Textarea
              id="workflow-steps"
              placeholder={"1. Send WhatsApp reminder after 30 min\n2. Send follow-up email after 24h\n3. Apply 10% discount after 72h"}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || loading} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            Create Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// E. ExportModal
// ============================================================

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Display name of the module being exported */
  moduleName: string;
  /** The data to export */
  data: Record<string, unknown>[];
  /** Base filename (without extension) */
  filename: string;
}

export function ExportModal({
  open,
  onOpenChange,
  moduleName,
  data,
  filename,
}: ExportModalProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const previewRows = useMemo(() => {
    return data.slice(0, 5);
  }, [data]);

  // Initialize selected columns when data changes or modal opens
  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (v && columns.length > 0) {
        setSelectedColumns(new Set(columns));
      }
      onOpenChange(v);
    },
    [columns, onOpenChange]
  );

  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(col)) {
        next.delete(col);
      } else {
        next.add(col);
      }
      return next;
    });
  };

  const handleExport = async () => {
    if (selectedColumns.size === 0) return;

    setLoading(true);

    // Filter data to selected columns
    const filteredData = data.map((row) => {
      const filtered: Record<string, unknown> = {};
      for (const col of selectedColumns) {
        if (col in row) {
          filtered[col] = row[col];
        }
      }
      return filtered;
    });

    // Small delay to show loading state
    await new Promise((r) => setTimeout(r, 300));

    const exportFilename = `${filename}-${formatDateISO(new Date())}`;

    if (format === "csv") {
      exportToCSV(filteredData, exportFilename);
    } else {
      exportToJSON(filteredData, exportFilename);
    }

    setLoading(false);
    onOpenChange(false);
  };

  const isValid = selectedColumns.size > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export {moduleName} Data
          </DialogTitle>
          <DialogDescription>
            {data.length} records available. Preview the first 5 rows below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Format Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Format</Label>
              <Select
                value={format}
                onValueChange={(v) => setFormat(v as "csv" | "json")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel compatible)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Records</Label>
              <div className="flex items-center h-9 px-3 rounded-md border bg-muted/50 text-sm font-medium">
                {data.length.toLocaleString()} rows
              </div>
            </div>
          </div>

          {/* Column Selection */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Columns</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setSelectedColumns(new Set(columns))}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setSelectedColumns(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-md border">
              {columns.map((col) => (
                <label
                  key={col}
                  className="flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Checkbox
                    checked={selectedColumns.has(col)}
                    onCheckedChange={() => toggleColumn(col)}
                    className="h-3.5 w-3.5"
                  />
                  {col}
                </label>
              ))}
            </div>
          </div>

          {/* Preview Table */}
          {previewRows.length > 0 && (
            <div className="grid gap-2">
              <Label className="text-xs text-muted-foreground">
                Preview (first 5 rows)
              </Label>
              <div className="rounded-md border overflow-auto max-h-48">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {columns
                        .filter((c) => selectedColumns.has(c))
                        .map((col) => (
                          <th
                            key={col}
                            className="px-3 py-2 text-left font-medium whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        {columns
                          .filter((c) => selectedColumns.has(c))
                          .map((col) => (
                            <td
                              key={col}
                              className="px-3 py-1.5 whitespace-nowrap max-w-[200px] truncate"
                            >
                              {String(row[col] ?? "")}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || loading} onClick={handleExport}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Download className="h-4 w-4 mr-1.5" />
            )}
            Download {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// F. SchedulePostModal
// ============================================================

interface SchedulePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}

const POST_PLATFORMS = ["Instagram", "Facebook", "TikTok", "Pinterest"] as const;
const POST_CONTENT_TYPES = ["Post", "Story", "Reel", "Carousel"] as const;

export function SchedulePostModal({
  open,
  onOpenChange,
  onScheduled,
}: SchedulePostModalProps) {
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [caption, setCaption] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const resetForm = () => {
    setPlatform("");
    setContentType("");
    setCaption("");
    setScheduledDate("");
    setScheduledTime("");
  };

  const handleSubmit = async () => {
    if (!platform || !contentType || !scheduledDate || !scheduledTime) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onScheduled?.();
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isValid =
    platform !== "" &&
    contentType !== "" &&
    scheduledDate !== "" &&
    scheduledTime !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Post
          </DialogTitle>
          <DialogDescription>
            Schedule a social media post across platforms.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Platform + Content Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Platform *</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {POST_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Content Type *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {POST_CONTENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Caption */}
          <div className="grid gap-2">
            <Label htmlFor="post-caption">Caption</Label>
            <Textarea
              id="post-caption"
              placeholder="Write your post caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {caption.length} / 2,200 characters
            </p>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="post-date">Date *</Label>
              <Input
                id="post-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-time">Time *</Label>
              <Input
                id="post-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || loading} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// G. CreativeBriefModal
// ============================================================

interface CreativeBriefModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const CREATIVE_TYPES = ["Image", "Video", "Carousel", "Reel"] as const;

export function CreativeBriefModal({
  open,
  onOpenChange,
  onCreated,
}: CreativeBriefModalProps) {
  const [loading, setLoading] = useState(false);
  const [briefName, setBriefName] = useState("");
  const [campaign, setCampaign] = useState("");
  const [creativeType, setCreativeType] = useState("");
  const [style, setStyle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [notes, setNotes] = useState("");

  const campaignOptions = campaignData.campaigns.map((c) => c.name);
  const styleOptions = creativeData.visualStyleAnalysis.map((s) => s.style);

  const resetForm = () => {
    setBriefName("");
    setCampaign("");
    setCreativeType("");
    setStyle("");
    setTargetAudience("");
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!briefName.trim() || !creativeType) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onCreated?.();
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isValid = briefName.trim() !== "" && creativeType !== "";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create Creative Brief
          </DialogTitle>
          <DialogDescription>
            Define creative requirements for your design team.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="brief-name">Brief Name *</Label>
            <Input
              id="brief-name"
              placeholder="e.g., Valentine's Hero Banner"
              value={briefName}
              onChange={(e) => setBriefName(e.target.value)}
            />
          </div>

          {/* Campaign + Creative Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Campaign</Label>
              <Select value={campaign} onValueChange={setCampaign}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaignOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Creative Type *</Label>
              <Select value={creativeType} onValueChange={setCreativeType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CREATIVE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Style */}
          <div className="grid gap-2">
            <Label>Visual Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visual style" />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Audience */}
          <div className="grid gap-2">
            <Label htmlFor="brief-audience">Target Audience</Label>
            <Input
              id="brief-audience"
              placeholder="e.g., Women 25-40, engaged couples"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="brief-notes">Additional Notes</Label>
            <Textarea
              id="brief-notes"
              placeholder="Any specific instructions, references, or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || loading} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            Create Brief
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// H. ABTestModal
// ============================================================

interface ABTestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function ABTestModal({
  open,
  onOpenChange,
  onCreated,
}: ABTestModalProps) {
  const [loading, setLoading] = useState(false);
  const [testName, setTestName] = useState("");
  const [creativeA, setCreativeA] = useState("");
  const [creativeB, setCreativeB] = useState("");
  const [split, setSplit] = useState([50]);
  const [audience, setAudience] = useState("");
  const [duration, setDuration] = useState("7");

  const creativeOptions = creativeData.topPerformingCreatives.map(
    (c) => c.name
  );

  const resetForm = () => {
    setTestName("");
    setCreativeA("");
    setCreativeB("");
    setSplit([50]);
    setAudience("");
    setDuration("7");
  };

  const handleSubmit = async () => {
    if (!testName.trim() || !creativeA || !creativeB) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onCreated?.();
    setLoading(false);
    resetForm();
    onOpenChange(false);
  };

  const isValid =
    testName.trim() !== "" &&
    creativeA !== "" &&
    creativeB !== "" &&
    creativeA !== creativeB;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Launch A/B Test
          </DialogTitle>
          <DialogDescription>
            Compare two creative variants to find the winner.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Test Name */}
          <div className="grid gap-2">
            <Label htmlFor="ab-name">Test Name *</Label>
            <Input
              id="ab-name"
              placeholder="e.g., Valentine's CTA Button Color Test"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          {/* Creative A + B */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Creative A *</Label>
              <Select value={creativeA} onValueChange={setCreativeA}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Variant A" />
                </SelectTrigger>
                <SelectContent>
                  {creativeOptions
                    .filter((c) => c !== creativeB)
                    .map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Creative B *</Label>
              <Select value={creativeB} onValueChange={setCreativeB}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Variant B" />
                </SelectTrigger>
                <SelectContent>
                  {creativeOptions
                    .filter((c) => c !== creativeA)
                    .map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Split Percentage */}
          <div className="grid gap-2">
            <Label>
              Split:{" "}
              <span className="text-primary font-semibold">
                {split[0]}% / {100 - split[0]}%
              </span>
            </Label>
            <Slider
              value={split}
              onValueChange={setSplit}
              min={10}
              max={90}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Variant A: {split[0]}%</span>
              <span>Variant B: {100 - split[0]}%</span>
            </div>
          </div>

          {/* Audience + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="ab-audience">Audience</Label>
              <Input
                id="ab-audience"
                placeholder="e.g., Instagram — Women 25-34"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ab-duration">Duration (days)</Label>
              <Input
                id="ab-duration"
                type="number"
                min="1"
                max="90"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || loading} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            Launch Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
