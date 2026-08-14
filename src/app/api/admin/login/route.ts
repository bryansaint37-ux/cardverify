import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  checkAdminPassword,
  getAdminSessionValue,
} from "@/lib/admin-auth";

type LoginBody = { password?: unknown };

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Corps de requête JSON invalide." },
      { status: 400 },
    );
  }

  const { password } = body;

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json(
      { status: "error", message: "Mot de passe requis." },
      { status: 400 },
    );
  }

  if (!checkAdminPassword(password)) {
    return NextResponse.json(
      { status: "error", message: "Mot de passe incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ status: "success" });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    getAdminSessionValue(),
    adminSessionCookieOptions(request),
  );
  return response;
}
