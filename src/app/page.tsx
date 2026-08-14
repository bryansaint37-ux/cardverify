import { redirect } from "next/navigation";

export const metadata = {
  title: "Vérifier un coupon",
  robots: { index: false, follow: false },
};

export default function HomePage() {
  redirect("/verifier");
}
