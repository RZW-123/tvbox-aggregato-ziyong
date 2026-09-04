import { Hono } from 'hono';

// Minimal routes stub to ensure build succeeds.
// Full route implementations live elsewhere; this stub avoids parse errors caused by
// accidental merge/placeholders. Replace with full router when ready.

export function createApp(_deps: any): Hono {
  const app = new Hono();

  // health endpoint
  app.get('/_/ping', (c) => c.text('ok'));

  // simple admin check placeholder
  app.get('/admin/health', (c) => c.json({ ok: true }));

  return app;
}
