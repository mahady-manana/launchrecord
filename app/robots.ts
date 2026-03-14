import { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/admin/",
          "/survey/",
          "/verify-",
          "/reset-password",
          "/password-setup",
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap/index.xml`,
  };
}
