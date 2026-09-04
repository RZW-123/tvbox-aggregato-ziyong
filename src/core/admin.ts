import { sharedStyles } from './shared-styles';
import { sharedUi } from './shared-ui';

export const adminHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TVBox Aggregator - Admin</title>
<style>
${sharedStyles}

/* Admin-specific: action bar in header */
.agg-bar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-top:16px;
  padding:12px 16px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:6px;
  font-family:var(--mono);
  font-size:0.75rem;
  color:var(--text-dim);
}

.agg-bar .status-text{font-family:var(--mono);font-size:0.75rem;color:var(--text-dim)}
.agg-bar .status-text.success{color:var(--green)}
.agg-bar .status-text.error{color:var(--red)}

/* Inline form label */
.form-label{
  font-family:var(--mono);
  font-size:0.65rem;
  color:var(--text-dim);
  text-transform:uppercase;
  letter-spacing:0.1em;
  display:block;
  margin-bottom:4px;
}

/* Name transform grid */
.nt-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-bottom:10px;
}

.nt-input{
  width:100%;
  font-family:var(--mono);
  font-size:0.8rem;
  padding:8px 12px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  outline:none;
  transition:border-color 0.2s;
}

.nt-input:focus{border-color:var(--green)}

.nt-textarea{
  width:100%;
  min-height:60px;
  font-family:var(--mono);
  font-size:0.75rem;
  padding:8px 12px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  resize:vertical;
  outline:none;
}

.nt-textarea:focus{border-color:var(--green)}

/* Cloud login cards */
.cloud-card{
  padding:12px;
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:6px;
  display:flex;
  flex-direction:column;
  gap:8px;
}
.cloud-card-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.cloud-card-name{
  font-weight:600;
  font-size:0.9rem;
  color:var(--text-bright);
}
.cloud-badge{
  font-family:var(--mono);
  font-size:0.65rem;
  padding:2px 8px;
  border-radius:10px;
  text-transform:uppercase;
  letter-spacing:0.05em;
}
.cloud-badge.valid{background:rgba(80,250,123,0.15);color:var(--green)}
.cloud-badge.expired{background:rgba(255,85,85,0.15);color:var(--red)}
.cloud-badge.none{background:rgba(136,136,136,0.15);color:var(--text-dim)}
.cloud-card-actions{display:flex;gap:6px;flex-wrap:wrap}
.cloud-card-time{font-family:var(--mono);font-size:0.7rem;color:var(--text-dim)}

/* Risk badges */
.risk-badge{
  font-family:var(--mono);
  font-size:0.7rem;
  padding:1px 6px;
  border-radius:8px;
}
.risk-badge.safe{background:rgba(80,250,123,0.15);color:var(--green)}
.risk-badge.low{background:rgba(80,250,123,0.1);color:var(--green)}
.risk-badge.high{background:rgba(255,85,85,0.15);color:var(--red)}
.risk-badge.unaudited{background:rgba(241,250,140,0.15);color:var(--yellow)}

/* QR modal */
.qr-modal-overlay{
  position:fixed;top:0;left:0;right:0;bottom:0;
  background:rgba(0,0,0,0.7);
  display:flex;align-items:center;justify-content:center;
  z-index:1000;
}
.qr-modal{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:8px;
  padding:24px;
  min-width:300px;
  max-width:400px;
  text-align:center;
}
.qr-modal h3{margin:0 0 16px;color:var(--text-bright);font-size:1rem}
.qr-modal img{
  max-width:250px;
  max-height:250px;
  border-radius:4px;
  background:#fff;
  padding:8px;
}
.qr-status{
  margin-top:12px;
  font-family:var(--mono);
  font-size:0.8rem;
  color:var(--text-dim);
}
.qr-status.scanned{color:var(--yellow)}
.qr-status.confirmed{color:var(--green)}
.qr-status.expired{color:var(--red)}

/* Import textarea */
.import-textarea{
  width:100%;
  min-height:100px;
  font-family:var(--mono);
  font-size:0.75rem;
  padding:10px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  resize:vertical;
  margin-bottom:8px;
}

/* Batch textarea */
.batch-textarea{
  width:100%;
  margin-top:8px;
  min-height:120px;
  font-family:var(--mono);
  font-size:0.75rem;
  padding:10px;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:4px;
  color:var(--text-bright);
  resize:vertical;
}

/* Source health dot in list items */
.source-health-dot{
  width:8px;height:8px;
  border-radius:50%;
  flex-shrink:0;
  position:relative;
  cursor:default;
}

.source-health-dot.ok{
  background:var(--green);
  box-shadow:0 0 4px var(--green-glow);
}

.source-health-dot.warn{
  background:var(--amber);
  box-shadow:0 0 4px var(--amber-dim);
}

.source-health-dot.error{
  background:var(--red);
  box-shadow:0 0 4px var(--red-dim);
}

.source-health-dot.unknown{
  background:var(--text-dim);
}

.source-health-dot::after{
  content:attr(data-tooltip);
  position:absolute;
  left:50%;
  bottom:calc(100% + 8px);
  transform:translateX(-50%);
  padding:6px 10px;
  background:var(--surface-2);
  border:1px solid var(--border);
  border-radius:4px;
  font-family:var(--mono);
  font-size:0.6rem;
  color:var(--text);
  white-space:nowrap;
  pointer-events:none;
  opacity:0;
  transition:opacity 0.2s;
  z-index:10;
}

.source-health-dot:hover::after{
  opacity:1;
}

@media(max-width:560px){
  .nt-grid{grid-template-columns:1fr}
  .tabs{overflow-x:auto;flex-wrap:nowrap}
  .tab{padding:12px 14px;font-size:0.65rem}
}
</style>
<script>(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)})()</script>
</head>
<body style="opacity:0">

<!-- Login -->
<div class="login-overlay" id="loginOverlay">
  <div class="login-box">
    <h2 data-i18n="loginTitle">Admin Access</h2>
    <p data-i18n="loginSubtitle">TVBox Aggregator Management</p>
    <div class="error-msg" id="loginError" data-i18n="invalidToken">Invalid token</div>
    <input type="password" id="loginInput" placeholder="Enter admin token" data-i18n-placeholder="enterToken" autocomplete="off">
    <button class="btn" style="width:100%" onclick="auth.doLogin()" data-i18n="login">Login</button>
  </div>
</div>

<!-- Main content -->
<div class="container" id="mainContent" style="display:none">
  <header class="header">
    <div class="header-top">
      <div class="header-label" data-i18n="headerLabel">Admin Console</div>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="themeDropdown"></span>
        <button class="lang-toggle" id="langToggle" onclick="doToggleLang()">中文</button>
      </div>
    </div>
    <h1 class="header-title">Source <span>Manager</span></h1>
    <nav class="header-nav">
      <a href="/admin/config-editor" data-i18n="navConfigEditor">Config Editor</a>
      <a href="/builder">Builder</a>
      <a href="/status" data-i18n="navDashboard">Dashboard</a>
    </nav>
    <!-- Aggregation status bar -->
    <div class="agg-bar">
      <span class="status-text" id="aggStatus" data-i18n="loadingStatus">Loading...</span>
      <button class="btn btn-sm" id="refreshBtn" onclick="triggerRefresh()" data-i18n="refresh">Refresh</button>
    </div>
  </header>

  <!-- Tabs -->
  <div class="tabs">
    <div class="tab active" data-tab="sources" onclick="switchTab('sources')"><span data-i18n="tabSources">Sources</span> <span class="badge" id="badgeSources">0</span></div>
    <div class="tab" data-tab="maccms" onclick="switchTab('maccms')"><span data-i18n="tabMacCMS">MacCMS</span> <span class="badge" id="badgeMacCMS">0</span></div>
    <div class="tab" data-tab="live" onclick="switchTab('live')"><span data-i18n="tabLive">Live</span> <span class="badge" id="badgeLive">0</span></div>
    <div class="tab" data-tab="searchQuota" onclick="switchTab('searchQuota')" id="tabSearchQuota" style="display:none"><span data-i18n="tabSearchQuota">Search</span> <span class="badge" id="badg[...]