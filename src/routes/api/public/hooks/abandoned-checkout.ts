// Cron route — invoked every 15 minutes by pg_cron. Sends any abandoned
// checkout reminders whose scheduled_for is due. No auth required (public
// hook), but the handler does no destructive work other than enqueueing.
//
// Cost control: the deadline-reminder backfill is a relatively expensive
// query, so it only runs on the first tick of each hour instead of every tick.
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/hooks/abandoned-checkout')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { processDueAbandonedReminders, ensureCohortDeadlineReminders } = await import(
            '@/lib/abandoned-checkout.server'
          )
          const url = new URL(request.url)
          const forceBackfill = url.searchParams.get('backfill') === '1'
          const runBackfill = forceBackfill || new Date().getUTCMinutes() < 15
          const backfilled = runBackfill ? await ensureCohortDeadlineReminders() : 0
          const result = await processDueAbandonedReminders({ limit: 100 })
          return Response.json({ ok: true, backfilled, backfillRan: runBackfill, ...result })
        } catch (err: any) {
          console.error('[cron abandoned-checkout] failed', err)
          return Response.json(
            { ok: false, error: err?.message ?? 'unknown' },
            { status: 500 },
          )
        }
      },
      GET: async () => Response.json({ ok: true, hint: 'POST to process queue' }),
    },
  },
})
