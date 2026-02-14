"use client";

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
import { useUser } from "@/hooks/use-user";
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react";
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

export default function DashboardPage() {
  const { user, authStatus } = useUser();
  const router = useRouter();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "loading") return;

    if (authStatus !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
      return;
    }

    fetchPlacements();
  }, [authStatus, router]);

  const fetchPlacements = async () => {
    try {
      const response = await fetch("/api/placements/user");
      const data = await response.json();

      if (data.success) {
        setPlacements(data.placements);
      }
    } catch (error) {
      console.error("Error fetching placements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Placements</h1>
        <p className="text-muted-foreground">
          Manage your purchased placements and track their performance
        </p>
      </div>

      {placements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No placements yet</CardTitle>
            <CardDescription>
              You haven't purchased any placements yet. Start promoting your
              product today!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/")}>
                Browse Placement Options
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/placements")}
              >
                Manage All Placements
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {placements.map((placement) => (
            <Card key={placement._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{placement.title}</CardTitle>
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
                      {new Date(placement.startDate).toLocaleDateString()} -{" "}
                      {new Date(placement.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Code: {placement.codeName}</span>
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
    </div>
  );
}
