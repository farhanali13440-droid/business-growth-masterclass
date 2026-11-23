import { createFileRoute } from "@tanstack/react-router";
import { AuthorityOto } from "@/components/site/AuthorityOto";

export const Route = createFileRoute("/authority-oto")({
  validateSearch: (search: Record<string, unknown>): { lead?: string } => ({
    lead: typeof search.lead === "string" ? search.lead : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Special One-Time Offer — Google Ads for Clinics" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <AuthorityOto variant="upsell" />,
});
