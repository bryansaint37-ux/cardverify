import { NextResponse } from "next/server";
import { voucherBrands } from "@/content/vouchers";
import { validateVoucherFormat } from "@/lib/validate-voucher";
import { prisma } from "@/lib/prisma";

type VerifyRequestBody = {
  type?: unknown;
  amount?: unknown;
  currency?: unknown;
  rechargeCode?: unknown;
  email?: unknown;
};

function randomDemoReference() {
  const block = () => String(Math.floor(1000 + Math.random() * 9000));
  return `TEST-${block()}-${block()}`;
}

export async function POST(request: Request) {
  try {
    let body: VerifyRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Corps de requête JSON invalide.",
        },
        { status: 400 },
      );
    }

    const { type, amount, currency, rechargeCode, email } = body;

    if (typeof type !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "Le type de coupon est requis et doit être une chaîne.",
        },
        { status: 400 },
      );
    }

    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Le montant est requis et doit être un nombre supérieur à zéro.",
        },
        { status: 400 },
      );
    }

    if (typeof currency !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "La devise est requise et doit être une chaîne.",
        },
        { status: 400 },
      );
    }

    if (typeof rechargeCode !== "string" || !rechargeCode.trim()) {
      return NextResponse.json(
        {
          status: "error",
          message: "Le code de recharge est requis.",
        },
        { status: 400 },
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        {
          status: "error",
          message: "L'adresse e-mail est requise et doit être valide.",
        },
        { status: 400 },
      );
    }

    const brand = voucherBrands.find((candidate) => candidate.id === type);

    if (!brand) {
      return NextResponse.json(
        {
          status: "error",
          message: `Type de coupon inconnu : « ${type} ».`,
        },
        { status: 400 },
      );
    }

    const format = validateVoucherFormat(brand, rechargeCode);
    const demoReference = randomDemoReference();

    if (!format.valid) {
      await prisma.verifiedSubmission.create({
        data: {
          type,
          amount: Math.round(amount),
          reference: demoReference,
          rechargeCode,
          currency,
          email,
          formatValid: false,
          verdict: null,
        },
      });

      return NextResponse.json({
        status: "error",
        message: "Format invalide du code de recharge.",
        result: {
          type: brand.id,
          formatValid: false,
          issues: format.issues.map((issue) => issue.message),
        },
      });
    }

    const verdict = Math.random() > 0.5 ? "plausible" : "suspect";
    const saved = await prisma.verifiedSubmission.create({
      data: {
        type,
        amount: Math.round(amount),
        reference: demoReference,
        rechargeCode,
        currency,
        email,
        formatValid: true,
        verdict,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Vérification enregistrée.",
      result: {
        id: saved.id,
        type: brand.id,
        formatValid: true,
        verdict,
        amount: Math.round(amount),
        currency,
        reference: demoReference,
        rechargeCode,
        email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Erreur interne du serveur.",
      },
      { status: 500 },
    );
  }
}
