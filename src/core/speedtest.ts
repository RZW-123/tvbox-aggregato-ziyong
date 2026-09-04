@@
-const CONCURRENCY = 30;
-const BATCH_BUDGET_MS = 180_000; // 整体测速预算 3 分钟
+// 默认并发与批次预算，可由环境变量或 Admin KV 覆盖
+const DEFAULT_CONCURRENCY = parsePositiveInt(process.env.SPEEDTEST_CONCURRENCY, 30);
+const DEFAULT_BATCH_BUDGET_MS = parsePositiveInt(process.env.SPEEDTEST_BATCH_BUDGET_MS, 180000); // 整体测速预算 3 分钟
@@
-export async function batchSiteSpeedTest(
-  sites: TVBoxSite[],
-  timeoutMs: number,
-  deep = false,
-): Promise<Map<string, SiteProbeResult>> {
+export async function batchSiteSpeedTest(
+  sites: TVBoxSite[],
+  timeoutMs: number,
+  deep = false,
+  opts?: { concurrency?: number; batchBudgetMs?: number },
+): Promise<Map<string, SiteProbeResult>> {
@@
-  logger.infoFields('speedtest', 'batch-start', { sites: tasks.length, deep, concurrency: CONCURRENCY });
+  const CONCURRENCY = opts?.concurrency ?? DEFAULT_CONCURRENCY;
+  const BATCH_BUDGET_MS = opts?.batchBudgetMs ?? DEFAULT_BATCH_BUDGET_MS;
+
+  logger.infoFields('speedtest', 'batch-start', { sites: tasks.length, deep, concurrency: CONCURRENCY, batchBudgetMs: BATCH_BUDGET_MS });
@@
-  const probeMap = new Map<string, SiteProbeResult>();
-  const deadline = Date.now() + BATCH_BUDGET_MS;
+  const probeMap = new Map<string, SiteProbeResult>();
+  const deadline = Date.now() + BATCH_BUDGET_MS;
*** End Patch
