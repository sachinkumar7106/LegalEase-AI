import { useState, useRef, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext.jsx";
import Login from "./pages/Login";

const COLORS = {
  bg: "#0B0E14",
  surface: "#111520",
  surfaceAlt: "#161B28",
  border: "#1E2535",
  borderMid: "#2A3349",
  gold: "#C9A84C",
  goldLight: "#E4C47A",
  goldDim: "#8B6F2E",
  text: "#E8E9EE",
  textMuted: "#7B859E",
  textDim: "#4A5268",
  accent: "#3D6AFF",
  danger: "#E05252",
  success: "#3DAA6F",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    min-height: 100vh;
  }

  .serif { font-family: 'Playfair Display', serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }

  .sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; width: 220px;
    background: ${COLORS.surface};
    border-right: 1px solid ${COLORS.border};
    display: flex; flex-direction: column;
    z-index: 100;
  }

  .logo-area {
    padding: 28px 24px 20px;
    border-bottom: 1px solid ${COLORS.border};
  }

  .logo-wordmark {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: ${COLORS.goldLight};
    letter-spacing: 0.02em;
  }

  .logo-sub {
    font-size: 10px;
    color: ${COLORS.textDim};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .nav-section { padding: 16px 12px; flex: 1; overflow-y: auto; }

  .nav-label {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${COLORS.textDim};
    padding: 0 10px;
    margin-bottom: 6px;
    margin-top: 16px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px;
    border-radius: 6px;
    cursor: pointer;
    color: ${COLORS.textMuted};
    font-size: 13px;
    font-weight: 400;
    transition: all 0.15s;
    border: none; background: none; width: 100%; text-align: left;
  }

  .nav-item:hover { background: ${COLORS.surfaceAlt}; color: ${COLORS.text}; }

  .nav-item.active {
    background: linear-gradient(90deg, rgba(201,168,76,0.12) 0%, transparent 100%);
    color: ${COLORS.goldLight};
    border-left: 2px solid ${COLORS.gold};
    padding-left: 8px;
  }

  .nav-icon { width: 16px; height: 16px; flex-shrink: 0; }

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid ${COLORS.border};
  }

  .user-pill {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 8px;
    background: ${COLORS.surfaceAlt};
    cursor: pointer;
  }

  .avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.gold});
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 500; color: #1a1200; flex-shrink: 0;
  }

  .main { margin-left: 220px; min-height: 100vh; }

  .topbar {
    height: 56px;
    border-bottom: 1px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    background: ${COLORS.bg};
    position: sticky; top: 0; z-index: 50;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 500;
    color: ${COLORS.text};
  }

  .topbar-actions { display: flex; align-items: center; gap: 10px; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 6px;
    font-size: 12px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-ghost {
    background: transparent;
    color: ${COLORS.textMuted};
    border: 1px solid ${COLORS.border};
  }
  .btn-ghost:hover { border-color: ${COLORS.borderMid}; color: ${COLORS.text}; }

  .btn-gold {
    background: ${COLORS.gold};
    color: #1a1200;
    font-weight: 500;
  }
  .btn-gold:hover { background: ${COLORS.goldLight}; }

  .content { padding: 32px; }

  /* LANDING PAGE */
  .hero {
    min-height: calc(100vh - 56px);
    display: flex; flex-direction: column; justify-content: center;
    max-width: 860px;
    padding: 60px 32px;
  }

  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: ${COLORS.gold};
    margin-bottom: 28px;
  }

  .hero-eyebrow::before {
    content: ''; width: 28px; height: 1px; background: ${COLORS.gold};
  }

  .hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: 54px;
    font-weight: 600;
    line-height: 1.15;
    color: ${COLORS.text};
    margin-bottom: 20px;
  }

  .hero-h1 em {
    font-style: italic;
    color: ${COLORS.goldLight};
  }

  .hero-sub {
    font-size: 15px;
    line-height: 1.7;
    color: ${COLORS.textMuted};
    max-width: 560px;
    margin-bottom: 36px;
  }

  .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 64px; }

  .btn-hero-primary {
    padding: 12px 28px;
    background: ${COLORS.gold};
    color: #120E00;
    font-size: 13px; font-weight: 500;
    border-radius: 6px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .btn-hero-primary:hover { background: ${COLORS.goldLight}; }

  .btn-hero-secondary {
    padding: 12px 28px;
    background: transparent;
    color: ${COLORS.text};
    font-size: 13px; font-weight: 400;
    border-radius: 6px;
    border: 1px solid ${COLORS.borderMid};
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s;
  }
  .btn-hero-secondary:hover { border-color: ${COLORS.gold}; color: ${COLORS.goldLight}; }

  .stats-row {
    display: flex; gap: 0;
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    overflow: hidden;
    max-width: 560px;
  }

  .stat-cell {
    flex: 1; padding: 20px 24px;
    border-right: 1px solid ${COLORS.border};
  }
  .stat-cell:last-child { border-right: none; }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 600;
    color: ${COLORS.goldLight};
  }

  .stat-label { font-size: 11px; color: ${COLORS.textMuted}; margin-top: 3px; }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1px;
    background: ${COLORS.border};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    overflow: hidden;
    margin-top: 60px;
  }

  .feature-card {
    background: ${COLORS.surface};
    padding: 28px 24px;
  }

  .feature-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    font-size: 16px;
  }

  .feature-title {
    font-size: 14px; font-weight: 500; color: ${COLORS.text};
    margin-bottom: 6px;
  }

  .feature-desc { font-size: 12px; color: ${COLORS.textMuted}; line-height: 1.6; }

  /* DASHBOARD */
  .dash-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .metric-card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    padding: 20px;
  }

  .metric-label { font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.08em; }

  .metric-val {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 500;
    color: ${COLORS.text}; margin-top: 4px;
  }

  .metric-delta {
    font-size: 11px; margin-top: 4px;
  }
  .delta-up { color: ${COLORS.success}; }
  .delta-down { color: ${COLORS.danger}; }

  .dash-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

  .panel {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    overflow: hidden;
  }

  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid ${COLORS.border};
  }

  .panel-title { font-size: 13px; font-weight: 500; color: ${COLORS.text}; }

  .panel-body { padding: 16px 20px; }

  .case-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid ${COLORS.border};
  }
  .case-row:last-child { border-bottom: none; }

  .case-name { font-size: 13px; color: ${COLORS.text}; font-weight: 400; }
  .case-meta { font-size: 11px; color: ${COLORS.textMuted}; margin-top: 2px; }

  .badge {
    padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 500; letter-spacing: 0.04em;
  }

  .badge-active { background: rgba(61,170,111,0.12); color: ${COLORS.success}; }
  .badge-review { background: rgba(201,168,76,0.12); color: ${COLORS.gold}; }
  .badge-pending { background: rgba(61,106,255,0.12); color: #7B9DFF; }
  .badge-closed { background: rgba(74,82,104,0.2); color: ${COLORS.textMuted}; }

  .activity-item {
    display: flex; gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid ${COLORS.border};
  }
  .activity-item:last-child { border-bottom: none; }

  .activity-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${COLORS.goldDim}; margin-top: 4px; flex-shrink: 0;
  }

  .activity-text { font-size: 12px; color: ${COLORS.textMuted}; line-height: 1.5; }
  .activity-text strong { color: ${COLORS.text}; font-weight: 500; }
  .activity-time { font-size: 10px; color: ${COLORS.textDim}; margin-top: 2px; }

  /* CHAT */
  .chat-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    height: calc(100vh - 56px);
  }

  .chat-sidebar {
    background: ${COLORS.surface};
    border-right: 1px solid ${COLORS.border};
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .chat-sidebar-header { padding: 16px; border-bottom: 1px solid ${COLORS.border}; }

  .thread-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid ${COLORS.border};
    transition: background 0.12s;
  }
  .thread-item:hover { background: ${COLORS.surfaceAlt}; }
  .thread-item.active { background: rgba(201,168,76,0.06); border-left: 2px solid ${COLORS.gold}; }

  .thread-title { font-size: 12px; font-weight: 500; color: ${COLORS.text}; }
  .thread-preview { font-size: 11px; color: ${COLORS.textMuted}; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .thread-date { font-size: 10px; color: ${COLORS.textDim}; margin-top: 4px; }

  .chat-main { display: flex; flex-direction: column; }

  .chat-messages {
    flex: 1; overflow-y: auto; padding: 24px 32px;
    display: flex; flex-direction: column; gap: 20px;
  }

  .msg-row { display: flex; gap: 12px; }
  .msg-row.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: ${COLORS.surfaceAlt};
    border: 1px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; flex-shrink: 0; color: ${COLORS.textMuted};
  }

  .msg-avatar.ai {
    background: rgba(201,168,76,0.12);
    border-color: rgba(201,168,76,0.3);
    color: ${COLORS.gold};
    font-family: 'Playfair Display', serif;
    font-size: 13px;
  }

  .msg-bubble {
    max-width: 580px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.65;
  }

  .msg-row:not(.user) .msg-bubble {
    background: ${COLORS.surfaceAlt};
    border: 1px solid ${COLORS.border};
    color: ${COLORS.text};
  }

  .msg-row.user .msg-bubble {
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    color: ${COLORS.text};
  }

  .msg-cite {
    margin-top: 10px; padding: 10px 12px;
    background: ${COLORS.bg};
    border: 1px solid ${COLORS.border};
    border-left: 2px solid ${COLORS.goldDim};
    border-radius: 4px;
    font-size: 11px; color: ${COLORS.textMuted}; line-height: 1.5;
  }

  .chat-input-area {
    padding: 16px 32px 20px;
    border-top: 1px solid ${COLORS.border};
  }

  .chat-input-box {
    display: flex; align-items: flex-end; gap: 10px;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 10px 14px;
    transition: border-color 0.15s;
  }
  .chat-input-box:focus-within { border-color: ${COLORS.borderMid}; }

  .chat-textarea {
    flex: 1; background: none; border: none; outline: none;
    color: ${COLORS.text}; font-size: 13px; font-family: 'DM Sans', sans-serif;
    resize: none; line-height: 1.6; min-height: 20px; max-height: 120px;
  }

  .chat-textarea::placeholder { color: ${COLORS.textDim}; }

  .send-btn {
    width: 32px; height: 32px; border-radius: 6px;
    background: ${COLORS.gold}; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #1a1200; font-size: 14px;
    transition: background 0.15s;
  }
  .send-btn:hover { background: ${COLORS.goldLight}; }

  .suggestion-chips {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;
  }

  .chip {
    padding: 5px 12px;
    background: transparent;
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    font-size: 11px; color: ${COLORS.textMuted};
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.12s;
  }
  .chip:hover { border-color: ${COLORS.goldDim}; color: ${COLORS.goldLight}; }

  /* DOCUMENT UPLOAD */
  .upload-zone {
    border: 1.5px dashed ${COLORS.border};
    border-radius: 12px;
    padding: 56px 32px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .upload-zone:hover {
    border-color: ${COLORS.goldDim};
    background: rgba(201,168,76,0.03);
  }
  .upload-zone.active {
    border-color: ${COLORS.gold};
    background: rgba(201,168,76,0.05);
  }

  .upload-icon { font-size: 36px; margin-bottom: 14px; color: ${COLORS.textDim}; }

  .upload-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px; color: ${COLORS.text}; margin-bottom: 8px;
  }

  .upload-sub { font-size: 12px; color: ${COLORS.textMuted}; }

  .file-list { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }

  .file-item {
    display: flex; align-items: center; gap: 14px;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    padding: 12px 16px;
  }

  .file-icon {
    width: 36px; height: 36px; border-radius: 6px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }

  .file-name { font-size: 13px; color: ${COLORS.text}; font-weight: 400; }
  .file-size { font-size: 11px; color: ${COLORS.textMuted}; margin-top: 2px; }

  .progress-bar {
    height: 2px; background: ${COLORS.border}; border-radius: 1px; margin-top: 8px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: ${COLORS.gold}; border-radius: 1px;
    transition: width 0.3s;
  }

  .analysis-panel {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    margin-top: 24px;
  }

  .analysis-section { padding: 20px; border-bottom: 1px solid ${COLORS.border}; }
  .analysis-section:last-child { border-bottom: none; }

  .analysis-heading {
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: ${COLORS.gold}; margin-bottom: 12px;
  }

  .clause-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 4px;
    background: ${COLORS.surfaceAlt};
    border: 1px solid ${COLORS.border};
    font-size: 11px; color: ${COLORS.textMuted};
    margin: 3px;
  }

  .risk-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid ${COLORS.border};
  }
  .risk-item:last-child { border-bottom: none; }

  .risk-dot {
    width: 6px; height: 6px; border-radius: 50%;
    margin-top: 5px; flex-shrink: 0;
  }
  .risk-high { background: ${COLORS.danger}; }
  .risk-med { background: ${COLORS.gold}; }
  .risk-low { background: ${COLORS.success}; }

  .risk-text { font-size: 12px; color: ${COLORS.textMuted}; line-height: 1.5; }
  .risk-text strong { color: ${COLORS.text}; font-weight: 500; }

  /* CASE MANAGEMENT */
  .case-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }

  .search-input {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 6px;
    padding: 7px 14px 7px 36px;
    color: ${COLORS.text};
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    width: 240px;
    outline: none;
    position: relative;
  }
  .search-input:focus { border-color: ${COLORS.borderMid}; }
  .search-input::placeholder { color: ${COLORS.textDim}; }

  .search-wrap { position: relative; }
  .search-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    color: ${COLORS.textDim}; font-size: 13px;
  }

  .case-table {
    width: 100%; border-collapse: collapse;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    overflow: hidden;
  }

  .case-table thead th {
    padding: 12px 18px;
    text-align: left;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: ${COLORS.textMuted};
    border-bottom: 1px solid ${COLORS.border};
    background: ${COLORS.surfaceAlt};
  }

  .case-table tbody tr {
    border-bottom: 1px solid ${COLORS.border};
    transition: background 0.1s;
    cursor: pointer;
  }
  .case-table tbody tr:last-child { border-bottom: none; }
  .case-table tbody tr:hover { background: ${COLORS.surfaceAlt}; }

  .case-table td {
    padding: 14px 18px;
    font-size: 12px; color: ${COLORS.textMuted};
  }

  .case-table td:first-child { color: ${COLORS.text}; font-weight: 500; }

  .priority-dot {
    display: inline-block; width: 6px; height: 6px;
    border-radius: 50%; margin-right: 6px; vertical-align: middle;
  }
  .p-high { background: ${COLORS.danger}; }
  .p-med { background: ${COLORS.gold}; }
  .p-low { background: ${COLORS.success}; }

  .tab-bar {
    display: flex; gap: 0;
    border-bottom: 1px solid ${COLORS.border};
    margin-bottom: 24px;
  }

  .tab {
    padding: 10px 20px; font-size: 12px; font-weight: 500;
    color: ${COLORS.textMuted}; cursor: pointer;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: color 0.15s;
    background: none; border-top: none; border-left: none; border-right: none;
    font-family: 'DM Sans', sans-serif;
  }
  .tab:hover { color: ${COLORS.text}; }
  .tab.active { color: ${COLORS.goldLight}; border-bottom-color: ${COLORS.gold}; }
`;

// Icons
const Icon = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  cases: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  send: "M22 2L11 13 M22 2L15 22 8 13 2 9z",
  search: "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
  plus: "M12 5v14 M5 12h14",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

const PAGES = ["landing", "dashboard", "chat", "upload", "cases"];

const NavItem = ({ icon, label, page, current, onClick }) => (
  <button className={`nav-item ${current === page ? "active" : ""}`} onClick={() => onClick(page)}>
    <Icon d={ICONS[icon]} size={15} />
    {label}
  </button>
);

// ─── LANDING PAGE ───
function LandingPage({ onNav }) {
  return (
    <div>
      <div className="hero" style={{ paddingLeft: 48, paddingRight: 48 }}>
        <div className="hero-eyebrow">AI-Powered Legal Intelligence</div>
        <h1 className="hero-h1">
          Legal clarity,<br />
          <em>without the complexity.</em>
        </h1>
        <p className="hero-sub">
          LegalEase AI transforms how you interact with legal documents, cases, and research. Powered by large language models built for the legal domain.
        </p>
        <div className="hero-ctas">
          <button className="btn-hero-primary" onClick={() => onNav("landing")}>Sign in to get started</button>
          <button className="btn-hero-secondary" onClick={() => onNav("chat")}>See it in action</button>
        </div>
        <div className="stats-row">
          <div className="stat-cell">
            <div className="stat-num">98%</div>
            <div className="stat-label">Contract accuracy</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">12x</div>
            <div className="stat-label">Faster review</div>
          </div>
          <div className="stat-cell">
            <div className="stat-num">40k+</div>
            <div className="stat-label">Cases analyzed</div>
          </div>
        </div>
        <div className="feature-grid">
          {[
            { icon: "⚖️", title: "Legal Q&A", desc: "Ask anything. Get precise answers grounded in case law, statutes, and your own documents." },
            { icon: "📄", title: "Contract analysis", desc: "Automatically surface clauses, obligations, risks, and inconsistencies in any agreement." },
            { icon: "📁", title: "Case management", desc: "Organize matters, track deadlines, and keep all related documents in one place." },
            { icon: "🔍", title: "Smart research", desc: "Cite-backed answers across millions of legal sources, powered by retrieval-augmented generation." },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───
function Dashboard() {
  const metrics = [
    { label: "Active cases", val: "24", delta: "+3 this week", up: true },
    { label: "Docs reviewed", val: "187", delta: "+12 today", up: true },
    { label: "Avg review time", val: "4.2h", delta: "↓ 18% vs last mo.", up: true },
    { label: "Risk alerts", val: "7", delta: "2 unresolved", up: false },
  ];
  const cases = [
    { name: "Henderson v. Meridian Corp.", type: "Corporate Litigation", status: "active" },
    { name: "Patel Estate Trust Review", type: "Estate Planning", status: "review" },
    { name: "NDA — Orion Ventures", type: "Contract", status: "pending" },
    { name: "Kumar IP Filing #2024-11", type: "Intellectual Property", status: "active" },
    { name: "Retail Lease — Block 44", type: "Real Estate", status: "closed" },
  ];
  const activity = [
    { text: <><strong>AI flagged 3 risk clauses</strong> in Orion Ventures NDA</>, time: "2 min ago" },
    { text: <><strong>Document uploaded:</strong> Henderson deposition transcript</>, time: "41 min ago" },
    { text: <><strong>Case updated:</strong> Patel Estate — court date confirmed</>, time: "2h ago" },
    { text: <><strong>New message</strong> from client Sarah Nguyen</>, time: "3h ago" },
    { text: <><strong>Contract analysis complete</strong> — Block 44 lease review</>, time: "Yesterday" },
  ];

  return (
    <div className="content">
      <div className="dash-grid">
        {metrics.map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-val">{m.val}</div>
            <div className={`metric-delta ${m.up ? "delta-up" : "delta-down"}`}>{m.delta}</div>
          </div>
        ))}
      </div>
      <div className="dash-row">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent cases</span>
            <button className="btn btn-ghost">View all</button>
          </div>
          <div className="panel-body" style={{ padding: "0 20px" }}>
            {cases.map(c => (
              <div className="case-row" key={c.name}>
                <div>
                  <div className="case-name">{c.name}</div>
                  <div className="case-meta">{c.type}</div>
                </div>
                <span className={`badge badge-${c.status}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent activity</span>
          </div>
          <div className="panel-body" style={{ padding: "4px 20px" }}>
            {activity.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" />
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHAT ───
function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Good morning. I'm your LegalEase AI assistant. I can help you analyze contracts, research case law, draft legal memos, and answer questions about your active matters. What can I help you with today?",
    },
    {
      role: "user",
      text: "What are the key risks in the Orion Ventures NDA I uploaded earlier?",
    },
    {
      role: "ai",
      text: "I've reviewed the Orion Ventures NDA (uploaded Oct 14, 2024). Here are the three primary risk areas I identified:",
      cite: "§4.2 — The non-compete clause extends to \"adjacent markets\" without a definition, which could be interpreted broadly to restrict your client's operations in the SaaS sector. §7.1 — The indemnification obligation is mutual but contains an asymmetric carve-out favoring Orion. §9 — The governing law clause selects Delaware courts but the parties are both incorporated in California.",
    },
  ]);
  const threads = [
    { title: "Orion Ventures NDA review", preview: "Three primary risk areas...", date: "Today", active: true },
    { title: "Henderson deposition prep", preview: "Based on the deposition...", date: "Yesterday" },
    { title: "Estate planning research", preview: "Under California probate...", date: "Oct 12" },
    { title: "Retail lease walkthrough", preview: "The lease contains a force...", date: "Oct 8" },
  ];
  const chips = ["Summarize key obligations", "Identify indemnification clauses", "Check jurisdiction", "Draft response memo"];

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
            <Icon d={ICONS.plus} size={13} /> New conversation
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {threads.map(t => (
            <div className={`thread-item ${t.active ? "active" : ""}`} key={t.title}>
              <div className="thread-title">{t.title}</div>
              <div className="thread-preview">{t.preview}</div>
              <div className="thread-date">{t.date}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div className={`msg-row ${m.role === "user" ? "user" : ""}`} key={i}>
              <div className={`msg-avatar ${m.role === "ai" ? "ai" : ""}`}>
                {m.role === "ai" ? "L" : "YO"}
              </div>
              <div className="msg-bubble">
                {m.text}
                {m.cite && <div className="msg-cite">{m.cite}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <div className="suggestion-chips">
            {chips.map(c => (
              <button className="chip" key={c} onClick={() => setInput(c)}>{c}</button>
            ))}
          </div>
          <div className="chat-input-box">
            <textarea
              className="chat-textarea"
              placeholder="Ask a legal question or reference a document..."
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button className="send-btn" onClick={send}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DOCUMENT UPLOAD ───
function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Invalid file type. Please upload a PDF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a file smaller than 10MB.");
      return;
    }

    const fileItem = {
      name: file.name,
      size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + " MB" : (file.size / 1024).toFixed(1) + " KB",
      progress: 0,
      done: false,
      error: null,
      analysis: null,
    };

    setFiles((prev) => [fileItem, ...prev]);
    setSelectedFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    let progressInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        )
      );
    }, 500);

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, progress: 100, done: true, analysis: data.analysis }
            : f
        )
      );
    } catch (err) {
      clearInterval(progressInterval);
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, progress: 0, error: err.message } : f
        )
      );
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => fileInputRef.current?.click();
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const activeFile = files.find(f => f.name === selectedFileName) || files.find(f => f.analysis) || null;

  return (
    <div className="content">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <input 
            type="file" 
            accept=".pdf" 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            onChange={onFileChange} 
          />
          <div
            className={`upload-zone ${dragging ? "active" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className="upload-icon">⬆</div>
            <div className="upload-title">Drop PDF documents here</div>
            <p className="upload-sub">Supports PDF · Up to 10 MB per file</p>
            <button className="btn btn-ghost" style={{ marginTop: 18 }} onClick={handleBrowseClick}>Browse files</button>
          </div>
          <div className="file-list">
            {files.map(f => (
              <div 
                className="file-item" 
                key={f.name} 
                onClick={() => setSelectedFileName(f.name)}
                style={{ cursor: "pointer", border: selectedFileName === f.name ? `1px solid ${COLORS.gold}` : undefined }}
              >
                <div className="file-icon">📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="file-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  <div className="file-size">{f.size}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${f.progress}%`, background: f.error ? COLORS.danger : COLORS.gold }} />
                  </div>
                </div>
                <span style={{ fontSize: 11, color: f.error ? COLORS.danger : f.done ? COLORS.success : COLORS.gold }}>
                  {f.error ? "Failed" : f.done ? "✓ Done" : `${f.progress}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          {activeFile && activeFile.analysis ? (
            <div className="analysis-panel">
              <div className="analysis-section">
                <div className="analysis-heading">Document Summary</div>
                <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>
                  <strong style={{ color: COLORS.text }}>{activeFile.name}</strong> — {activeFile.analysis.summary}
                </p>
              </div>
              
              {activeFile.analysis.risks && activeFile.analysis.risks.length > 0 && (
                <div className="analysis-section">
                  <div className="analysis-heading">Identified Risks & Suggestions</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activeFile.analysis.risks.map((r, idx) => (
                      <div key={idx} style={{ background: COLORS.surfaceAlt, padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500, marginBottom: 8, fontStyle: "italic" }}>"{r.clause}"</div>
                        <div className="risk-item" style={{ padding: 0, border: "none", alignItems: "flex-start", marginBottom: 6 }}>
                          <div className="risk-dot risk-high" style={{ marginTop: 6 }} />
                          <div className="risk-text"><strong>Risk:</strong> {r.risk}</div>
                        </div>
                        <div className="risk-item" style={{ padding: 0, border: "none", alignItems: "flex-start" }}>
                          <div className="risk-dot risk-low" style={{ marginTop: 6, background: COLORS.success }} />
                          <div className="risk-text"><strong>Suggestion:</strong> {r.suggestion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ padding: 16, display: "flex", gap: 10 }}>
                <button className="btn btn-gold" style={{ flex: 1, justifyContent: "center" }}>Analyze in chat</button>
                <button className="btn btn-ghost">Export report</button>
              </div>
            </div>
          ) : activeFile && !activeFile.error ? (
             <div className="analysis-panel" style={{ padding: "60px 40px", textAlign: "center" }}>
               <div style={{ color: COLORS.gold, marginBottom: "16px", fontSize: "28px" }}>⚙️</div>
               <div style={{ fontSize: "15px", color: COLORS.text, fontWeight: 500 }}>Analyzing Document...</div>
               <div style={{ fontSize: "13px", color: COLORS.textMuted, marginTop: "8px", lineHeight: 1.5 }}>Extracting text and identifying key clauses using Gemini AI. This may take a few seconds.</div>
             </div>
          ) : (
            <div className="analysis-panel" style={{ padding: "60px 40px", textAlign: "center", opacity: 0.5 }}>
               Select or upload a document to view analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CASE MANAGEMENT ───
function CasesPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const cases = [
    { id: "2024-001", name: "Henderson v. Meridian Corp.", type: "Corporate Litigation", attorney: "A. Sharma", status: "active", priority: "high", date: "Oct 28, 2024" },
    { id: "2024-002", name: "Patel Estate Trust Review", type: "Estate Planning", attorney: "R. Kapoor", status: "review", priority: "med", date: "Nov 5, 2024" },
    { id: "2024-003", name: "NDA — Orion Ventures", type: "Contract", attorney: "A. Sharma", status: "pending", priority: "med", date: "Oct 14, 2024" },
    { id: "2024-004", name: "Kumar IP Filing #2024-11", type: "Intellectual Property", attorney: "M. Ali", status: "active", priority: "low", date: "Nov 2, 2024" },
    { id: "2024-005", name: "Retail Lease — Block 44", type: "Real Estate", attorney: "R. Kapoor", status: "closed", priority: "low", date: "Sep 30, 2024" },
    { id: "2024-006", name: "Singh Employment Dispute", type: "Labor Law", attorney: "M. Ali", status: "active", priority: "high", date: "Oct 19, 2024" },
    { id: "2024-007", name: "Mehra Divorce Settlement", type: "Family Law", attorney: "A. Sharma", status: "review", priority: "med", date: "Oct 22, 2024" },
  ];

  const filtered = cases.filter(c =>
    (tab === "all" || c.status === tab) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="content">
      <div className="case-toolbar">
        <div className="tab-bar" style={{ marginBottom: 0, borderBottom: "none" }}>
          {["all", "active", "review", "pending", "closed"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search cases..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-gold">
            <Icon d={ICONS.plus} size={13} /> New case
          </button>
        </div>
      </div>
      <table className="case-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Case name</th>
            <th>Type</th>
            <th>Attorney</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id}>
              <td style={{ color: COLORS.textMuted }}>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.type}</td>
              <td>{c.attorney}</td>
              <td>
                <span className={`priority-dot p-${c.priority}`} />
                {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}
              </td>
              <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
              <td>{c.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 14, fontSize: 11, color: COLORS.textDim }}>
        Showing {filtered.length} of {cases.length} cases
      </div>
    </div>
  );
}

// ─── ROOT APP ───
// Auth-wrapped App
function AuthenticatedApp() {
  const [page, setPage] = useState("dashboard");
  const { user, logout } = useAuth();

  const titles = {
    landing: "LegalEase AI",
    dashboard: "Dashboard",
    chat: "AI Legal Assistant",
    upload: "Document Upload",
    cases: "Case Management",
  };

  const noTopbar = page === "chat";

  return (
    <>
      <style>{css}</style>
      <div className="sidebar">
        <div className="logo-area">
          <div className="logo-wordmark">LegalEase</div>
          <div className="logo-sub">AI Legal Platform</div>
        </div>
        <div className="nav-section">
          <div className="nav-label">Main</div>
          <NavItem icon="home" label="Overview" page="landing" current={page} onClick={setPage} />
          <NavItem icon="home" label="Dashboard" page="dashboard" current={page} onClick={setPage} />
          <div className="nav-label">Tools</div>
          <NavItem icon="chat" label="AI Assistant" page="chat" current={page} onClick={setPage} />
          <NavItem icon="upload" label="Documents" page="upload" current={page} onClick={setPage} />
          <NavItem icon="cases" label="Cases" page="cases" current={page} onClick={setPage} />
        </div>
        <div className="sidebar-footer">
          <div className="user-pill" onClick={logout} style={{ cursor: 'pointer' }}>
            <div className="avatar">{user?.email ? user.email[0].toUpperCase() : "U"}</div>
            <div>
              <div style={{ fontSize: 12, color: COLORS.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: 140 }}>{user?.email || "User"}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>JWT Auth</div>
            </div>
            <Icon d={ICONS.logout} size={14} color={COLORS.textMuted} />
          </div>
        </div>
      </div>
      <div className="main">
        {!noTopbar && (
          <div className="topbar">
            <span className="page-title">{titles[page]}</span>
            <div className="topbar-actions">
              <button className="btn btn-ghost">
                <Icon d={ICONS.bell} size={14} /> Alerts
              </button>
              {page === "dashboard" && (
                <button className="btn btn-gold">
                  <Icon d={ICONS.plus} size={13} /> New case
                </button>
              )}
            </div>
          </div>
        )}
        {page === "landing" && <LandingPage onNav={setPage} />}
        {page === "dashboard" && <Dashboard />}
        {page === "chat" && <ChatPage />}
        {page === "upload" && <UploadPage />}
        {page === "cases" && <CasesPage />}
      </div>
    </>
  );
}

// ─── PUBLIC LANDING ───
function PublicLandingPage({ onNavigate }) {
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{css}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid ${COLORS.border}`}}>
         <div className="logo-area" style={{ margin: 0, padding: 0, border: "none" }}>
           <div className="logo-wordmark" style={{ fontSize: 24, letterSpacing: "-0.5px" }}>LegalEase AI</div>
         </div>
         <button className="btn btn-ghost" onClick={() => onNavigate("login")}>Sign in</button>
      </div>

      <div className="hero" style={{ paddingLeft: 48, paddingRight: 48, marginTop: 60, textAlign: "center", border: "none" }}>
        <h1 className="hero-h1" style={{ fontSize: 56 }}>
          AI Legal Document Analyzer
        </h1>
        <p className="hero-sub" style={{ margin: "20px auto", maxWidth: 650, fontSize: 18 }}>
          Transform your contract review process. Upload PDFs, extract text seamlessly, and let AI instantly identify key clauses, critical risks, and actionable insights.
        </p>
        <div className="hero-ctas" style={{ justifyContent: "center", marginTop: 40 }}>
          <button className="btn btn-gold" style={{ fontSize: 16, padding: "14px 28px" }} onClick={() => onNavigate("auth-intro")}>
            Analyze Now
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 16, padding: "14px 28px" }} onClick={() => onNavigate("auth-intro")}>
            Get Started
          </button>
        </div>
      </div>

      <div style={{ padding: "80px 48px", background: COLORS.surface, marginTop: 80, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 40, fontSize: 12, color: COLORS.gold, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>How it works</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap", margin: "0 auto", maxWidth: 1000 }}>
           {[
             { step: "1", title: "Upload PDF", desc: "Drag and drop any legal document directly into abstract secured storage." },
             { step: "2", title: "AI Analysis", desc: "Our models parse every sentence, identifying standard patterns and anomalies." },
             { step: "3", title: "Get Insights", desc: "Instantly view clause tags, a categorized risk summary, and strategic suggestions." }
           ].map(s => (
             <div key={s.step} style={{ textAlign: "center", flex: "1", minWidth: 250, maxWidth: 300 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.2)`, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 20px auto", fontWeight: 600 }}>{s.step}</div>
                <h3 style={{ fontSize: 18, marginBottom: 12, color: COLORS.text, fontWeight: 500 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>{s.desc}</p>
             </div>
           ))}
        </div>
      </div>

      <div style={{ padding: "80px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 60, fontSize: 32, fontFamily: "'Playfair Display', serif" }}>Powerful Features</div>
        <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", maxWidth: 1000, margin: "0 auto" }}>
          {[
            { icon: "📄", title: "Document Analysis", desc: "Extract raw text systematically from thick law PDFs without losing structural intent." },
            { icon: "🏷️", title: "Clause Detection", desc: "Auto-tag standard clauses like governing law, indemnification, or termination natively." },
            { icon: "🛑", title: "Risk Summary", desc: "Color-coded pill states immediately alerting you to high, medium, and low vulnerabilities." },
            { icon: "💡", title: "Smart Suggestions", desc: "Get actionable negotiation feedback tailored to the specific risks detected." },
          ].map(f => (
             <div className="feature-card" key={f.title} style={{ textAlign: "left" }}>
               <div className="feature-icon">{f.icon}</div>
               <div className="feature-title">{f.title}</div>
               <div className="feature-desc">{f.desc}</div>
             </div>
          ))}
        </div>
      </div>

      <footer style={{ padding: "40px", textAlign: "center", borderTop: `1px solid ${COLORS.border}`, color: COLORS.textDim, fontSize: 13 }}>
        © 2026 LegalEase AI. All rights reserved. Built for secure legal analysis.
      </footer>
    </div>
  );
}

// ─── AUTH INTRO ───
function AuthIntroPage({ onNavigate }) {
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{css}</style>
      <div className="panel" style={{ maxWidth: 480, width: "100%", padding: "48px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 24, background: "rgba(201,168,76,0.1)", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", margin: "0 auto 24px auto", color: COLORS.gold }}>🔒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 16 }}>Protecting Your Data</h2>
        <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 36 }}>
          Legal documents contain highly sensitive, confidential information. To ensure maximum security and privacy, we require you to authenticate before accessing the AI analysis tools. Your documents are securely processed and never used to train generalized models.
        </p>
        <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "12px 0" }} onClick={() => onNavigate("login")}>
          Continue to Login
        </button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", margin: "14px auto 0 auto", color: COLORS.textMuted }} onClick={() => onNavigate("landing")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ───
// App with JWT auth
export default function App() {
  const { isLoggedIn } = useAuth();
  const [publicState, setPublicState] = useState("landing"); // 'landing' | 'auth-intro' | 'login'

  if (!isLoggedIn) {
    if (publicState === "landing") return <PublicLandingPage onNavigate={setPublicState} />;
    if (publicState === "auth-intro") return <AuthIntroPage onNavigate={setPublicState} />;
    return <Login />;
  }

  return <AuthenticatedApp />;
}
