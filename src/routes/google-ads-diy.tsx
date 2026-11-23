import { createFileRoute } from "@tanstack/react-router";
import { AuthorityOto } from "@/components/site/AuthorityOto";

/**
 * Mini MBA for Your Business — PKR 5,000 downsell for masterclass buyers whose strategy-call
 * application shows they're not a done-for-you fit, or who skip the call (?t=declined).
 * ?t=almost also shows the paid 1:1 session option.
 */
export const Route = createFileRoute("/google-ads-diy")({
  validateSearch: (search: Record<string, unknown>): { lead?: string; t?: string } => ({
    lead: typeof search.lead === "string" ? search.lead : undefined,
    t: typeof search.t === "string" ? search.t : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your Recommended Path — Mini MBA for Your Business" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <AuthorityOto variant="diy" />,
});
