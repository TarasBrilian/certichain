import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { uuid, tokenId, walletAddress, name, university } = await req.json();

    if (!uuid || !walletAddress) {
      return NextResponse.json(
        { error: "UUID and walletAddress are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('certificates')
      .upsert({
        uuid,
        tokenId: tokenId || null,
        walletAddress,
        name: name || null,
        university: university || null
      }, { onConflict: 'uuid' });

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save certificate:", error);
    return NextResponse.json(
      { error: "Failed to save certificate" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uuid = searchParams.get("uuid");

    // If UUID is provided, fetch specific certificate
    if (uuid) {
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('uuid', uuid)
        .single();

      if (error || !certificate) {
        return NextResponse.json(
          { error: "Certificate not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ certificate });
    }

    // Otherwise, fetch all certificates
    const { data: certificates, error } = await supabase
      .from('certificates')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
