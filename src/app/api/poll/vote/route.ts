import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

// Visitors vote on the Community Poll. Tally lives in Sanity as a `votes`
// number array aligned to `options` by index. Server-side (write token); POST
// is never cached.
export async function POST(request: Request) {
  if (!writeClient) {
    return NextResponse.json(
      { error: "Voting is not configured." },
      { status: 503 },
    );
  }

  let body: { id?: unknown; option?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { id, option } = body;
  if (typeof id !== "string" || typeof option !== "number" || !Number.isInteger(option) || option < 0) {
    return NextResponse.json({ error: "Invalid id or option." }, { status: 400 });
  }

  const poll = await writeClient.fetch<{ _type: string; options?: string[] } | null>(
    `*[_id == $id][0]{ _type, options }`,
    { id },
  );
  if (!poll || poll._type !== "poll" || !Array.isArray(poll.options)) {
    return NextResponse.json({ error: "Poll not found." }, { status: 404 });
  }
  if (option >= poll.options.length) {
    return NextResponse.json({ error: "Option out of range." }, { status: 400 });
  }

  // Ensure a votes array of the right length exists, then atomically bump the
  // chosen option.
  const zeros = poll.options.map(() => 0);
  const updated = await writeClient
    .patch(id)
    .setIfMissing({ votes: zeros })
    .inc({ [`votes[${option}]`]: 1 })
    .commit<{ votes: number[] }>();

  return NextResponse.json({ votes: updated.votes ?? [] });
}
