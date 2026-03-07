"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  FileDown,
  MoreVertical,
  Plus,
  RefreshCcw,
  Settings,
  Upload,
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  onRunAudit?: () => void;
  onUpdateData?: () => void;
  onGenerateReport?: () => void;
  onExport?: () => void;
  onAddProduct?: () => void;
  onSettings?: () => void;
  context?: "dashboard" | "product";
  productId?: string;
}

export function QuickActions({
  onRunAudit,
  onUpdateData,
  onGenerateReport,
  onExport,
  onAddProduct,
  onSettings,
  context = "dashboard",
  productId,
}: QuickActionsProps) {
  if (context === "product") {
    return (
      <div className="flex items-center gap-2">
        {onRunAudit && (
          <Button onClick={onRunAudit}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Re-run Audit
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4 mr-2" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onUpdateData && (
              <DropdownMenuItem onClick={onUpdateData}>
                <Upload className="h-4 w-4 mr-2" />
                Update Survey Data
              </DropdownMenuItem>
            )}
            {onGenerateReport && (
              <DropdownMenuItem onClick={onGenerateReport}>
                <FileDown className="h-4 w-4 mr-2" />
                Generate Report
              </DropdownMenuItem>
            )}
            {onExport && (
              <DropdownMenuItem onClick={onExport}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Report
              </DropdownMenuItem>
            )}
            {onSettings && (
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Product Settings
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Dashboard context
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard/survey"
        className="flex items-center gap-4 border px-4 py-2 rounded-md bg-white hover:from-orange-600 hover:to-amber-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <MoreVertical className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onRunAudit && (
            <DropdownMenuItem onClick={onRunAudit}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Run New Audit
            </DropdownMenuItem>
          )}
          {onGenerateReport && (
            <DropdownMenuItem onClick={onGenerateReport}>
              <FileDown className="h-4 w-4 mr-2" />
              Generate Report
            </DropdownMenuItem>
          )}
          {onExport && (
            <DropdownMenuItem onClick={onExport}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Export All Reports
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
