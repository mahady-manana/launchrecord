import { MetadataRoute } from "next";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://www.launchrecord.com",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://www.launchrecord.com/auth/signin",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://www.launchrecord.com/auth/signup",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    await connectToDatabase();
    const launches = await Launch.find({ isArchived: false }).select("slug").lean();

    const launchPages: MetadataRoute.Sitemap = launches.map((launch) => ({
      url: `https://www.launchrecord.com/app/${launch.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...launchPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
