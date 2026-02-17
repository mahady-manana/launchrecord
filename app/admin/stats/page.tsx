"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Launch {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website: string;
  category: string | string[];
  businessModel: string;
  pricingModel: string;
  status: string;
  claimed: boolean;
  claimKey?: string;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [bulkResult, setBulkResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_auth");
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    fetchLaunches(page);
  }, [page, router]);

  const fetchLaunches = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/stats?page=${pageNum}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setLaunches(data.launches);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch launches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleBulkImport = async () => {
    setIsBulkLoading(true);
    setBulkResult(null);

    try {
      const launches = JSON.parse(bulkJson);

      if (!Array.isArray(launches)) {
        throw new Error("JSON must be an array of launches");
      }

      const response = await fetch("/api/launches/bulk-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ launches }),
      });

      const data = await response.json();

      if (data.success) {
        setBulkResult({
          success: true,
          message: `Successfully created ${data.createdCount} launches. ${data.errorCount} failed.`,
        });
        setBulkJson("");
        fetchLaunches(1);
      } else {
        setBulkResult({
          success: false,
          message: data.message || "Failed to import launches",
        });
      }
    } catch (error) {
      setBulkResult({
        success: false,
        message: error instanceof Error ? error.message : "Invalid JSON format",
      });
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/10">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <h1 className="text-xl font-semibold">Admin Panel - Launch Stats</h1>
          <div className="flex items-center gap-2">
            <Button variant="default" onClick={() => setIsBulkModalOpen(true)}>
              Add Bulk
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>All Launches</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : launches.length === 0 ? (
              <p>No launches found.</p>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Claimed</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {launches.map((launch) => (
                        <TableRow
                          key={launch._id}
                          className="cursor-pointer"
                          onClick={() => setSelectedLaunch(launch)}
                        >
                          <TableCell>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                          </TableCell>
                          <TableCell className="font-medium">
                            {launch.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {launch.slug}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{launch.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={launch.claimed ? "default" : "secondary"}
                            >
                              {launch.claimed ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {Array.isArray(launch.category)
                              ? launch.category.join(", ")
                              : launch.category || "-"}
                          </TableCell>
                          <TableCell>{launch.commentCount}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(launch.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {pagination && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(page * pagination.limit, pagination.total)} of{" "}
                      {pagination.total} launches
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!pagination.hasPreviousPage}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Launch Detail Modal */}
      <Dialog
        open={!!selectedLaunch}
        onOpenChange={() => setSelectedLaunch(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLaunch?.name}</DialogTitle>
            <DialogDescription>{selectedLaunch?.tagline}</DialogDescription>
          </DialogHeader>
          {selectedLaunch && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>Slug:</strong>
                <p className="text-sm text-muted-foreground">
                  {selectedLaunch.slug}
                </p>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="text-sm text-muted-foreground">
                  {selectedLaunch.description || "-"}
                </p>
              </div>
              <div>
                <strong>Website:</strong>
                <p className="text-sm text-muted-foreground">
                  <a
                    href={selectedLaunch.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedLaunch.website || "-"}
                  </a>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Business Model:</strong>
                  <p className="text-sm text-muted-foreground">
                    {selectedLaunch.businessModel || "-"}
                  </p>
                </div>
                <div>
                  <strong>Pricing Model:</strong>
                  <p className="text-sm text-muted-foreground">
                    {selectedLaunch.pricingModel || "-"}
                  </p>
                </div>
              </div>
              <div>
                <strong>Category:</strong>
                <p className="text-sm text-muted-foreground">
                  {Array.isArray(selectedLaunch.category)
                    ? selectedLaunch.category.join(", ")
                    : selectedLaunch.category || "-"}
                </p>
              </div>
              <div>
                <strong>Status:</strong>
                <Badge variant="outline" className="ml-2">
                  {selectedLaunch.status}
                </Badge>
              </div>
              <div>
                <strong>Claimed:</strong>
                <Badge
                  variant={selectedLaunch.claimed ? "default" : "secondary"}
                  className="ml-2"
                >
                  {selectedLaunch.claimed ? "Yes" : "No"}
                </Badge>
              </div>
              {!selectedLaunch.claimed && selectedLaunch.claimKey && (
                <div>
                  <strong>Claim Key:</strong>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="rounded bg-background px-2 py-1 text-sm font-mono">
                      {selectedLaunch.claimKey}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedLaunch.claimKey!)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground border-t pt-4">
                <div>
                  <strong>ID:</strong> {selectedLaunch._id}
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedLaunch.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Updated:</strong>{" "}
                  {new Date(selectedLaunch.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Import Modal */}
      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Import Launches</DialogTitle>
            <DialogDescription>
              Paste JSON array of launches to import. Each launch should have at
              least a name field.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bulkJson">JSON Array</Label>
              <Textarea
                id="bulkJson"
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder={`[
  { "name": "Launch 1", "tagline": "Cool app" },
  { "name": "Launch 2", "website": "https://example.com" }
]`}
                className="min-h-[200px] font-mono text-sm"
                disabled={isBulkLoading}
              />
              {bulkResult && (
                <p
                  className={`text-sm ${
                    bulkResult.success ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {bulkResult.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsBulkModalOpen(false);
                setBulkJson("");
                setBulkResult(null);
              }}
              disabled={isBulkLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkImport} disabled={isBulkLoading}>
              {isBulkLoading ? "Importing..." : "Import Launches"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
