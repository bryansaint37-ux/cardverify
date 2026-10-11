import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { voucherBrands } from "@/content/vouchers";
import { formatVoucherIssue, validateVoucherFormat } from "@/lib/validate-voucher";
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
  const t = await getTranslations();

  try {
    let body: VerifyRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: t("api.invalidJsonBody"),
        },
        { status: 400 },
      );
    }

    const { type, amount, currency, rechargeCode, email } = body;

    if (typeof type !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: t("api.typeRequired"),
        },
        { status: 400 },
      );
    }

    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        {
          status: "error",
          message: t("api.amountRequired"),
        },
        { status: 400 },
      );
    }

    if (typeof currency !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: t("api.currencyRequired"),
        },
        { status: 400 },
      );
    }

    if (typeof rechargeCode !== "string" || !rechargeCode.trim()) {
      return NextResponse.json(
        {
          status: "error",
          message: t("api.codeRequired"),
        },
        { status: 400 },
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        {
          status: "error",
          message: t("api.emailRequired"),
        },
        { status: 400 },
      );
    }

    const brand = voucherBrands.find((candidate) => candidate.id === type);

    if (!brand) {
      return NextResponse.json(
        {
          status: "error",
          message: t("voucherValidation.unknownType", { type }),
        },
        { status: 400 },
      );
    }

    const format = validateVoucherFormat(type, rechargeCode);
    const demoReference = randomDemoReference();

    if (!format.valid) {
      await prisma.verifiedSubmission.create({
        data: {
          type,
          amount: Math.round(amount),
          reference: demoReference,
          rechargeCode: format.normalized,
          currency,
          email,
          formatValid: false,
          verdict: null,
        },
      });

      return NextResponse.json({
        status: "error",
        message: t("api.formatInvalid"),
        result: {
          type: brand.id,
          formatValid: false,
          issues: format.issues.map((issue) => formatVoucherIssue(t, type, brand.name, issue)),
        },
      });
    }

    const verdict = Math.random() > 0.5 ? "plausible" : "suspect";
    const saved = await prisma.verifiedSubmission.create({
      data: {
        type,
        amount: Math.round(amount),
        reference: demoReference,
        rechargeCode: format.normalized,
        currency,
        email,
        formatValid: true,
        verdict,
      },
    });

    return NextResponse.json({
      status: "success",
      message: t("api.verificationSaved"),
      result: {
        id: saved.id,
        type: brand.id,
        formatValid: true,
        verdict,
        amount: Math.round(amount),
        currency,
        reference: demoReference,
        rechargeCode: format.normalized,
        email,
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: t("api.internalError"),
      },
      { status: 500 },
    );
  }
}
