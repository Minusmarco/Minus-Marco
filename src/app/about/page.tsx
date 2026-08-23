import type { Metadata } from "next";
import AboutContent, { type TeamMember } from "@/components/AboutContent";
import { sanityFetch } from "@/sanity/lib/client";
import { allTeamMembersQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = { title: "About" };
export const revalidate = 60;

export default async function AboutPage() {
  const team = await sanityFetch<TeamMember[]>(allTeamMembersQuery);
  return <AboutContent team={team} />;
}
