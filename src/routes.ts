import { Hono } from 'hono';
import { adminHtml } from './core/admin';

// Minimal routes with admin SPA fallback so /admin and subpaths serve the admin UI.
// This restores the UI page while keeping the temporary build-safe stub for other routes.

export function createApp(_deps: any): Hono {
  const app = new Hono();

  // health endpoint
  app.get('/_/ping', (c) => c.text('ok'));

  // Serve admin HTML for SPA routes
  app.get('/admin', (c) => c.html(adminHtml));
  app.get('/admin/*', (c) => c.html(adminHtml));

  // Optional admin health endpoint
  app.get('/admin/health', (c) => c.json({ ok: true }));

  return app;
}
