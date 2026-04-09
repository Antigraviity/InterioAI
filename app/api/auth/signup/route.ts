import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  // Check if email already exists
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  // Insert new user
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([{ name, email: email.toLowerCase(), password }])
    .select("id, name, email")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}
