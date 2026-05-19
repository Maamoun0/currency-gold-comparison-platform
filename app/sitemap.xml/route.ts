import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://egp-market.com'}/</loc>
        <changefreq>always</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://egp-market.com'}/gold</loc>
        <changefreq>hourly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://egp-market.com'}/usdt</loc>
        <changefreq>hourly</changefreq>
        <priority>0.8</priority>
      </url>
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
