"use client";

import { LaunchModal } from "@/components/launchrecord/launch-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLaunches } from "@/hooks/use-launches";
import { Calendar, DollarSign, MapPin, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Placement {
  _id: string;
  title: string;
  tagline: string;
  website: string;
  placementType: string;
  position: string;
  startDate: string;
  endDate: string;
  price: number;
  status: string;
  codeName: string;
  createdAt: string;
}

interface Launch {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website: string;
  category: string;
  status: "draft" | "prelaunch" | "launched";
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLaunchModalOpen, setLaunchModalOpen] = useState(false);
  const launchStore = useLaunches();

  useEffect(() => {
    fetchPlacements();
    fetchLaunches();
  }, []);

  const fetchPlacements = async () => {
    try {
      const response = await fetch("/api/placements/user");
      const data = await response.json();

      if (data.success) {
        setPlacements(data.placements);
      }
    } catch (error) {
      console.error("Error fetching placements:", error);
    }
  };

  const fetchLaunches = async () => {
    try {
      const response = await fetch("/api/launches/user");
      const data = await response.json();

      if (data.success) {
        setLaunches(data.launches);
      }
    } catch (error) {
      console.error("Error fetching launches:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* User Info Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">Welcome back!</CardTitle>
                <CardDescription>
                  You have {placements.length} placements and {launches.length}{" "}
                  launches
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Recent Launches */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Launches</CardTitle>
                <CardDescription>
                  Manage your submitted launches
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setLaunchModalOpen(true)}
              >
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {launches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You haven't submitted any launches yet
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setLaunchModalOpen(true)}
                >
                  Submit Your First Launch
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {launches.slice(0, 4).map((launch) => (
                  <div
                    key={launch._id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors p-2 rounded-md -mx-2 px-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">{launch.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {launch.tagline}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          {launch.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(launch.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          launch.status === "launched"
                            ? "default"
                            : launch.status === "prelaunch"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {launch.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/app/${launch.slug}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Placements */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Placements</CardTitle>
                <CardDescription>
                  Manage your purchased placements
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/placements")}
              >
                Manage All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {placements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You don't have any active placements yet
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/dashboard/placements")}
                >
                  Buy a Placement
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {placements.map((placement) => (
                  <div
                    key={placement._id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors p-2 rounded-md -mx-2 px-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">
                          {placement.title}
                        </h3>
                        <Badge
                          variant={
                            placement.status === "active"
                              ? "default"
                              : placement.status === "inactive"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {placement.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {placement.tagline}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {placement.placementType} - {placement.position}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />$
                          {placement.price}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(
                            placement.startDate,
                          ).toLocaleDateString()} -{" "}
                          {new Date(placement.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(placement.website, "_blank")}
                      >
                        View Live
                      </Button>
                      {placement.status === "inactive" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/placement/${placement._id}`)
                          }
                        >
                          Set Up
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <LaunchModal
        open={isLaunchModalOpen}
        onOpenChange={setLaunchModalOpen}
        onSubmit={launchStore.createLaunch}
        onCompleteDetails={launchStore.updateLaunch}
      />
    </>
  );
}
