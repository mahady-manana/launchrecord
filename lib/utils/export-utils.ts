import { Launch } from "@/types";

interface CleanLaunch {
  id: string;
  name: string;
  description: string;
  website: string;
  category: string;
  makerName: string;
  x: string;
  linkedin: string;
  placement: string;
  createdAt: string;
}

export function cleanLaunchData(launches: any[]): CleanLaunch[] {
  return launches.map((launch) => ({
    id: launch._id,
    name: launch.name,
    description: launch.description,
    website: launch.website,
    category: launch.category,
    makerName: launch.name || launch.authorName,
    x: launch.x || launch.authorX,
    linkedin: launch.linkedin || launch.authorLinkedIn,
    placement: launch.placement,
    createdAt: launch.createdAt,
  }));
}

export function launchesToCsv(launches: Launch[]): string {
  const cleanData = cleanLaunchData(launches);

  if (cleanData.length === 0) {
    return "";
  }

  const headers = Object.keys(cleanData[0]);
  const csvHeader = headers.join(",");

  const csvRows = cleanData.map((launch) =>
    headers
      .map((header) => {
        const value = launch[header as keyof CleanLaunch] ?? "";

        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      })
      .join(","),
  );

  return [csvHeader, ...csvRows].join("\n");
}

export function exportLaunches(launches: Launch[], format: "csv" | "json") {
  const cleanData = cleanLaunchData(launches);

  if (format === "json") {
    return JSON.stringify(cleanData, null, 2);
  }

  return launchesToCsv(launches);
}
