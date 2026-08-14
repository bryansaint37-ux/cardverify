export type VerificationStatus = "plausible" | "suspect" | "invalid";

export type VerificationRecord = {
  id: string;
  type: string;
  brandLabel: string;
  code: string;
  status: VerificationStatus;
  amount: number;
  currency: string;
  createdAt: string;
};
