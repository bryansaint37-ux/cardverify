import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ status: "error", message: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.verifiedSubmission.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Enregistrement introuvable." },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: "success" });
}
