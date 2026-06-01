import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

// Visitors vote on the Debate of the Week. The tally lives in Sanity, so this
// runs server-side with a write token. Not cached (POST never is).
export async function POST(request: Request) {
  if (!writeClient) {
    return NextResponse.json(
      { error: "Voting is not configured." },
      { status: 503 },
    );
  }

  let body: { id?: unknown; side?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { id, side } = body;
  if (typeof id !== "string" || (side !== "A" && side !== "B")) {
    return NextResponse.json({ error: "Invalid id or side." }, { status: 400 });
  }

  // Only allow voting on actual debate documents.
  const type = await writeClient.fetch<string | null>(
    `*[_id == $id][0]._type`,
    { id },
  );
  if (type !== "debate") {
    return NextResponse.json({ error: "Debate not found." }, { status: 404 });
  }

  const field = side === "A" ? "votesA" : "votesB";

  const updated = await writeClient
    .patch(id)
    .setIfMissing({ votesA: 0, votesB: 0 })
    .inc({ [field]: 1 })
    .commit<{ votesA: number; votesB: number }>();

  return NextResponse.json({
    votesA: updated.votesA ?? 0,
    votesB: updated.votesB ?? 0,
  });
}
