"use client";

import { LaunchModal } from "@/components/launchrecord/launch-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLaunches } from "@/hooks/use-launches";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Rocket,
  ShoppingBag,
  User,
} from "lucide-react";
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
                  You have {placements.length} placements and {launches.length} launches
                </CardDescription>
              </div>
            </div>
          </CardHeader>
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {placements.map((placement) => (
                  <Card key={placement._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {placement.title}
                        </CardTitle>
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
                      <CardDescription>{placement.tagline}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {placement.placementType} - {placement.position}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">${placement.price}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(placement.startDate).toLocaleDateString()}{" "}
                            - {new Date(placement.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            Code: {placement.codeName}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(placement.website, "_blank")}
                      >
                        View Live
                      </Button>
                      {placement.status === "inactive" && (
                        <Button
                          className="w-full"
                          onClick={() =>
                            router.push(`/dashboard/placement/${placement._id}`)
                          }
                        >
                          Set Up Placement
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
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
              <div className="grid gap-4 md:grid-cols-2">
                {launches.slice(0, 4).map((launch) => (
                  <Card
                    key={launch._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{launch.name}</CardTitle>
                      <CardDescription>{launch.tagline}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{launch.category}</span>
                        <span>
                          {new Date(launch.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push(`/app/${launch.slug}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
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
