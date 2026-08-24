import { NextResponse } from "next/server";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

const searchQuery = groq`
  *[_type in ["article", "video"] && title match $pattern] | order(_type asc, coalesce(publishedAt, _createdAt) desc) [0...8] {
    _type,
    title,
    "href": select(_type == "article" => "/articles/" + slug.current, "/videos")
  }
`;

type Hit = { _type: "article" | "video"; title: string; href: string };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const hits = await sanityFetch<Hit[]>(searchQuery, { pattern: `${q}*` });
  return NextResponse.json({
    results: hits.map((h) => ({ type: h._type, title: h.title, href: h.href })),
  });
}
