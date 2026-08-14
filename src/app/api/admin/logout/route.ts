import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
