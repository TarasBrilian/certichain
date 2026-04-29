import { NextRequest, NextResponse } from "next/server";

const PINATA_API = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export async function POST(request: NextRequest) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    return NextResponse.json({ error: "PINATA_JWT not configured" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const pinataForm = new FormData();
  pinataForm.append("file", file);

  const filename = file.name || "untitled";
  pinataForm.append(
    "pinataMetadata",
    JSON.stringify({ name: filename })
  );

  const response = await fetch(PINATA_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: pinataForm
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: text }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
