"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  website: string;
  tagline: string;
  logo: string;
  slug: string;
}

interface SIOReport {
  _id: string;
  url: string;
  overallScore: number;
  reportBand: string;
  progress: string;
  createdAt: string;
  product: Product | null;
  errorMessage?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const REPORT_BANDS = ["Dominant", "Strong", "Blended", "Weak", "Ghost"];
const PROGRESS_STATES = ["pending", "running", "completed", "failed"];

export default function SIOReportsPage() {
  const [reports, setReports] = useState<SIOReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bandFilter, setBandFilter] = useState("");
  const [progressFilter, setProgressFilter] = useState("");
  const [withoutProduct, setWithoutProduct] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchReports();
  }, [pagination.page, search, bandFilter, progressFilter, withoutProduct]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search ? { search } : {}),
        ...(bandFilter ? { band: bandFilter } : {}),
        ...(progressFilter ? { progress: progressFilter } : {}),
        ...(withoutProduct ? { withoutProduct: "true" } : {}),
      });

      const res = await fetch(`/api/admin/sio-reports?${params}`);
      const data = await res.json();

      if (data.success) {
        setReports(data.data.reports);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch SIO reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBandColor = (band: string) => {
    const colors: Record<string, string> = {
      Dominant: "bg-green-100 text-green-800 border-green-300",
      Strong: "bg-blue-100 text-blue-800 border-blue-300",
      Blended: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Weak: "bg-orange-100 text-orange-800 border-orange-300",
      Ghost: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[band] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    if (score >= 20) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressBadge = (progress: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      running: "default",
      completed: "default",
      failed: "destructive",
    };
    return variants[progress] || "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">SIO Reports</h1>
          <p className="text-muted-foreground">
            All SIO-V5 audit reports (with or without products)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchReports}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports by URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Band:</span>
            <select
              value={bandFilter}
              onChange={(e) => {
                setBandFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Bands</option>
              {REPORT_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <select
              value={progressFilter}
              onChange={(e) => {
                setProgressFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All States</option>
              {PROGRESS_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="withoutProduct"
              checked={withoutProduct}
              onChange={(e) => {
                setWithoutProduct(e.target.checked);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="h-4 w-4"
            />
            <label htmlFor="withoutProduct" className="text-sm">
              Reports without product only
            </label>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report URL</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Band</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No reports found</p>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                        >
                          {report.url}
                        </a>
                        {report.errorMessage && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            <span className="truncate">
                              {report.errorMessage}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.product ? (
                        <Link
                          href={`/products/${report.product.slug}`}
                          className="flex items-center gap-2 hover:opacity-80"
                        >
                          {report.product.logo && (
                            <img
                              src={report.product.logo}
                              alt={report.product.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {report.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {report.product.website}
                            </p>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <AlertCircle className="h-3 w-3" />
                          <span>No product</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {report.overallScore !== null &&
                      report.overallScore !== undefined ? (
                        <span
                          className={`text-xl font-bold ${getScoreColor(report.overallScore)}`}
                        >
                          {report.overallScore}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {report.reportBand ? (
                        <Badge className={`${getBandColor(report.reportBand)}`}>
                          {report.reportBand}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not scored</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.progress}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(report.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {report.product && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/products/${report.product.slug}`}>
                              <Package className="h-4 w-4 mr-1" />
                              Product
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} reports
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.pages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
