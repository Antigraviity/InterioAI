import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Find user by email
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email, password")
    .eq("email", email.toLowerCase())
    .limit(1);

  if (error) {
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ error: "No account found with this email." }, { status: 401 });
  }

  const user = users[0];

  if (user.password !== password) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
}
