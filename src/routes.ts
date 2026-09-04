@@
 export function createApp(deps: AppDeps): Hono {
@@
   // ─── 站点测速开关 ──────────────────────────────────────
   app.get('/admin/speed-test', async (c) => {
@@
   });
+
+  // ─── 站点测速完整配置（含并发/批次预算/优选延迟） ──────────────────────────────────────
+  app.get('/admin/speedtest-config', async (c) => {
+    if (!verifyAdmin(c.req.raw, config)) {
+      return c.json({ error: 'Unauthorized' }, 401);
+    }
+    try {
+      const enabledRaw = await storage.get(KV_SPEED_TEST_ENABLED);
+      const preferRaw = await storage.get(KV_PREFER_LATENCY);
+      const concurrencyRaw = await storage.get(KV_SPEEDTEST_CONCURRENCY);
+      const batchRaw = await storage.get(KV_SPEEDTEST_BATCH_BUDGET_MS);
+
+      const enabled = enabledRaw !== 'false';
+      const preferLatency = preferRaw === 'true';
+      const concurrency = concurrencyRaw ? parseInt(concurrencyRaw) : DEFAULT_SPEEDTEST_CONCURRENCY;
+      const batchBudgetMs = batchRaw ? parseInt(batchRaw) : DEFAULT_SPEEDTEST_BATCH_BUDGET_MS;
+
+      return c.json({ enabled, preferLatency, concurrency, batchBudgetMs });
+    } catch (err: unknown) {
+      const msg = err instanceof Error ? err.message : String(err);
+      return c.json({ error: msg }, 500);
+    }
+  });
+
+  app.put('/admin/speedtest-config', async (c) => {
+    if (!verifyAdmin(c.req.raw, config)) {
+      return c.json({ error: 'Unauthorized' }, 401);
+    }
+    let body: { enabled?: boolean; preferLatency?: boolean; concurrency?: number; batchBudgetMs?: number };
+    try {
+      body = await c.req.json();
+    } catch {
+      return c.json({ error: 'Invalid JSON' }, 400);
+    }
+
+    const enabled = body.enabled === true;
+    const preferLatency = body.preferLatency === true;
+    const concurrency = typeof body.concurrency === 'number' ? Math.max(1, Math.floor(body.concurrency)) : DEFAULT_SPEEDTEST_CONCURRENCY;
+    const batch = typeof body.batchBudgetMs === 'number' ? Math.max(1000, Math.floor(body.batchBudgetMs)) : DEFAULT_SPEEDTEST_BATCH_BUDGET_MS;
+
+    await storage.put(KV_SPEED_TEST_ENABLED, String(enabled));
+    await storage.put(KV_PREFER_LATENCY, String(preferLatency));
+    await storage.put(KV_SPEEDTEST_CONCURRENCY, String(concurrency));
+    await storage.put(KV_SPEEDTEST_BATCH_BUDGET_MS, String(batch));
+    return c.json({ success: true, enabled, preferLatency, concurrency, batchBudgetMs: batch });
+  });
***
