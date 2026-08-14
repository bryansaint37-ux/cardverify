import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentification du tableau de bord (/dashboard) — mot de passe unique,
 * comparé en temps constant, protégeant les vérifications réellement
 * soumises par les visiteurs. Change ADMIN_PASSWORD et ADMIN_SESSION_SECRET
 * avant toute mise en ligne réelle.
 */

export const ADMIN_SESSION_COOKIE = "admin_session";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Le-king";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "demo-only-secret";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 2; // 2 heures

function computeSessionToken(): string {
  return createHmac("sha256", SESSION_SECRET).update("admin-session").digest("hex");
}

/** Compare deux chaînes en temps constant, sans fuiter leur longueur via le timing. */
function safeEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function checkAdminPassword(input: string): boolean {
  return safeEquals(input, ADMIN_PASSWORD);
}

/**
 * `Secure` doit refléter le protocole réel de la requête, pas seulement
 * `NODE_ENV` : un build de production servi en HTTP simple (test local,
 * hébergeur sans TLS) verrait sinon son cookie systématiquement rejeté par
 * le navigateur, cassant silencieusement la connexion.
 */
export function adminSessionCookieOptions(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps = forwardedProto ? forwardedProto === "https" : new URL(request.url).protocol === "https:";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isHttps,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function getAdminSessionValue(): string {
  return computeSessionToken();
}

/** À appeler uniquement côté serveur (Server Component, Route Handler). */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!value) return false;
  return safeEquals(value, computeSessionToken());
}
