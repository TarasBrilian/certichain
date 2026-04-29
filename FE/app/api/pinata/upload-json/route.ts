import { NextRequest, NextResponse } from "next/server";

const PINATA_API = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export async function POST(request: NextRequest) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    return NextResponse.json({ error: "PINATA_JWT not configured" }, { status: 500 });
  }

  const body = await request.json();
  if (!body.pinataContent) {
    return NextResponse.json({ error: "No pinataContent provided" }, { status: 400 });
  }

  const response = await fetch(PINATA_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: text }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
