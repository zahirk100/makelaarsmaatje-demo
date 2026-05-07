"use client";

import { useState, useEffect } from "react";
import { team, initialLeads, getMember, Lead } from "./data";

export default function Home() {
  const [view, setView] = useState<string>("dash");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [qStep, setQStep] = useState(0);
  const [search, setSearch] = useState("");
  const [showReassign, setShowReassign] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const getLead = (id: number | null) => leads.find((l) => l.id === id) || null;
  const selectedLead = getLead(selectedId);

  const navigate = (v: string) => {
    setView(v);
    setSelectedId(null);
    setShowReassign(false);
    setShowNote(false);
    window.scrollTo(0, 0);
  };

  const openLead = (id: number) => {
    setSelectedId(id);
    setView("lead");
    window.scrollTo(0, 0);
  };

  const simulate = () => {
    const nl: Lead = {
      id: Date.now(),
      name: "Femke Hendriks",
      email: "femke.h@gmail.com",
      phone: "+31 6 55443322",
      property: "Lindengracht 201, Amsterdam",
      price: "€ 725.000",
      source: "Funda",
      receivedAt: "net binnen",
      status: "new",
      message: "Ik wil graag een bezichtiging inplannen. Wanneer kan dat schikken?",
      avatar: "FH",
      priority: "hot",
      assignedTo: 1,
      isNew: true,
      score: 88,
      channel: "Funda-lead",
      qd: { budget: "€700k tot €800k", financing: "Pre-approval aanwezig", timeline: "Binnen 2 maanden" },
      notes: [],
    };
    setLeads([nl, ...leads]);
    showToast("Nieuwe Funda-lead binnengekomen");
    setTimeout(() => {
      setLeads((prev) => prev.map((l) => (l.id === nl.id ? { ...l, isNew: false } : l)));
    }, 3000);
  };

  const sendLink = (id: number, channel: string) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: "contacted" } : l)));
    setSelectedId(null);
    setView("dash");
    showToast(`Boekingslink verstuurd via ${channel}`);
  };

  const reassign = (memberId: number) => {
    if (!selectedLead) return;
    setLeads(leads.map((l) => (l.id === selectedLead.id ? { ...l, assignedTo: memberId } : l)));
    setShowReassign(false);
    showToast(`Overgedragen aan ${getMember(memberId)?.name}`);
  };

  const saveNote = () => {
    if (!selectedLead || !noteText.trim()) return;
    const note = { id: Date.now(), author: "Sander Vermeulen", text: noteText.trim(), time: "Zojuist" };
    setLeads(leads.map((l) => (l.id === selectedLead.id ? { ...l, notes: [...l.notes, note] } : l)));
    setNoteText("");
    setShowNote(false);
    showToast("Notitie toegevoegd");
  };

  const delNote = (noteId: number) => {
    if (!selectedLead) return;
    setLeads(leads.map((l) => (l.id === selectedLead.id ? { ...l, notes: l.notes.filter((n) => n.id !== noteId) } : l)));
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const ms = !q || l.name.toLowerCase().includes(q) || l.property.toLowerCase().includes(q) || l.phone.includes(q) || l.email.toLowerCase().includes(q);
    const mf = filter === "all" || l.status === filter;
    return ms && mf;
  });

  const statusBadge = (s: string) => {
    if (s === "new") return <span className="badge" style={{ background: "#C8821A", color: "white" }}>NIEUW</span>;
    if (s === "contacted") return <span className="badge" style={{ background: "#FEF3C7", color: "#92400E" }}>VERSTUURD</span>;
    if (s === "booked") return <span className="badge" style={{ background: "#DCF2E3", color: "#15593B" }}>✓ GEBOEKT</span>;
    if (s === "disqualified") return <span className="badge" style={{ background: "#F3F4F6", color: "#6B6B6B" }}>GEFILTERD</span>;
    return null;
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      {toast && (
        <div className="toast-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8C07D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {toast}
        </div>
      )}

      <nav className="nav">
        <div className="nav-in">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L3 10V21H9V15H15V21H21V10L12 3Z" fill="#E8C07D" />
                <circle cx="12" cy="13" r="1.2" fill="#1F3D2B" />
              </svg>
            </div>
            <div>
              <div className="fd" style={{ fontSize: 19, fontWeight: 700 }}>
                Makelaars<span style={{ color: "#C8821A", fontStyle: "italic" }}>maatje</span>
              </div>
              <div style={{ fontSize: 11, color: "#737373", marginTop: -2 }}>Vermeulen Vastgoed</div>
            </div>
          </div>
          <div className="tabs">
            {[
              { id: "dash", label: "Leads" },
              { id: "cal", label: "Agenda" },
              { id: "klant", label: "Klant-view" },
              { id: "verk", label: "Verkoper" },
              { id: "stat", label: "Stats" },
              { id: "set", label: "Instellingen" },
            ].map((t) => (
              <button key={t.id} className={"tab " + (view === t.id ? "active" : "")} onClick={() => navigate(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="main">
        {view === "dash" && renderDashboard()}
        {view === "lead" && selectedLead && renderLead()}
        {view === "klant" && renderKlant()}
        {view === "cal" && renderCal()}
        {view === "verk" && renderVerk()}
        {view === "stat" && renderStat()}
        {view === "set" && renderSet()}
      </main>
    </>
  );

  // ============================================================================
  // DASHBOARD
  // ============================================================================
  function renderDashboard() {
    const m = isMobile;
    const filterLabels: { [key: string]: string } = { all: "Alle", new: "Nieuw", contacted: "Verstuurd", booked: "Geboekt", disqualified: "Gefilterd" };
    return (
      <div className="fade">
        <div style={{ marginBottom: 24 }}>
          <div className="hero-tag">VANDAAG • 18 NIEUWE LEADS</div>
          <h1 className="fd" style={{ fontSize: m ? 30 : 44, lineHeight: 1, fontWeight: 700, color: "#1F3D2B" }}>
            Goedemiddag,
            <br />
            <em style={{ fontWeight: 500 }}>Sander.</em>
          </h1>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(filterLabels).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  background: filter === v ? "#1F3D2B" : "white",
                  color: filter === v ? "white" : "#525252",
                  border: "1px solid " + (filter === v ? "#1F3D2B" : "#E5DFD3"),
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <button onClick={simulate} className="btn btn-gold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Simuleer lead
          </button>
        </div>

        <div style={{ position: "relative", marginBottom: 20 }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A3A3A3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" className="input" placeholder="Zoek op naam, adres, e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid g4" style={{ marginBottom: 22 }}>
          {[
            { value: "4 min", label: "Reactietijd", badge: "-87%" },
            { value: "23", label: "Bezichtigingen", badge: "+145%" },
            { value: "2%", label: "No-shows", badge: "-87%" },
          ].map((s, i) => (
            <div key={i} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{["⏱️", "📅", "🔔"][i]}</span>
                <span className="badge" style={{ background: "#DCF2E3", color: "#15593B" }}>
                  {s.badge}
                </span>
              </div>
              <div className="fd" style={{ fontSize: 26, fontWeight: 700, color: "#1F3D2B" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "#737373", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
          <div style={{ padding: 20, borderRadius: 16, color: "white", background: "linear-gradient(135deg, #1F3D2B 0%, #2F6B45 100%)" }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <div className="fd" style={{ fontSize: 26, fontWeight: 700, marginTop: 10 }}>
              #1
            </div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 3 }}>Top-performer</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 className="fd" style={{ fontSize: m ? 19 : 22, fontWeight: 700, color: "#1F3D2B" }}>
              {search ? `${filteredLeads.length} resultaten` : "Inkomende leads"}
            </h2>
            <div style={{ fontSize: 12, color: "#737373", marginTop: 2 }}>Auto-gekwalificeerd op prioriteit</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#525252" }}>
            <div className="dot" style={{ width: 8, height: 8, borderRadius: 999, background: "#15593B" }}></div>
            Live verbonden met Funda
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Geen leads gevonden</div>
          </div>
        ) : (
          filteredLeads.map((l) => {
            const a = getMember(l.assignedTo);
            const pc = l.priority === "hot" ? "#C8821A" : l.priority === "cold" ? "#9CA3AF" : "#1F3D2B";
            const sbc = l.score >= 80 ? "#15593B" : l.score >= 50 ? "#E8C07D" : "#9CA3AF";
            const sc = l.score >= 80 ? "#15593B" : l.score >= 50 ? "#8B5A2B" : "#6B6B6B";
            return (
              <div key={l.id} className={"lead-row " + (l.isNew ? "new" : "")} onClick={() => openLead(l.id)} style={{ borderColor: l.isNew ? "#C8821A" : "#E5DFD3" }}>
                <div style={{ position: "relative" }}>
                  <div className="avatar" style={{ width: 44, height: 44, background: pc, fontSize: 14 }}>
                    {l.avatar}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: -3,
                      right: -3,
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      background: "white",
                      border: "2px solid " + sbc,
                      color: sc,
                    }}
                  >
                    {l.score}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1F3D2B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</h3>
                    {statusBadge(l.status)}
                    {l.notes.length > 0 && (
                      <span className="badge" style={{ background: "#F5F1E9", color: "#8B5A2B", fontWeight: 500 }}>
                        📝 {l.notes.length}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {l.property}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#1F3D2B", marginTop: 2 }}>{l.price}</div>
                </div>
                {!m && (
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: "#737373", marginBottom: 3 }}>{l.receivedAt}</div>
                    {l.bookingTime ? (
                      <div style={{ fontSize: 11, fontWeight: 500, color: "#15593B" }}>📅 {l.bookingTime}</div>
                    ) : (
                      <div style={{ fontSize: 11, color: "#A3A3A3" }}>{a ? a.name : "Niet toegewezen"}</div>
                    )}
                  </div>
                )}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            );
          })
        )}
      </div>
    );
  }

  // ============================================================================
  // LEAD DETAIL
  // ============================================================================
  function renderLead() {
    if (!selectedLead) return null;
    const l = selectedLead;
    const a = getMember(l.assignedTo);
    const m = isMobile;
    const fn = l.name.split(" ")[0];
    const sbc = l.score >= 80 ? "#15593B" : "#E8C07D";
    const sc = l.score >= 80 ? "#15593B" : "#8B5A2B";

    return (
      <div className="fade">
        <button onClick={() => navigate("dash")} style={{ marginBottom: 14, fontSize: 14, color: "#737373", display: "inline-flex", alignItems: "center", gap: 4 }}>
          ← Terug naar leads
        </button>
        <div className="grid" style={{ gridTemplateColumns: m ? "1fr" : "1fr 2fr", gap: 18 }}>
          <div>
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ position: "relative" }}>
                  <div className="avatar" style={{ width: 56, height: 56, background: "#C8821A", fontSize: 18 }}>
                    {l.avatar}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: -3,
                      right: -3,
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "white",
                      border: "2px solid " + sbc,
                      color: sc,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {l.score}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 className="fd" style={{ fontSize: 19, fontWeight: 700, color: "#1F3D2B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.name}
                  </h2>
                  <div style={{ fontSize: 12, color: "#737373" }}>
                    Via Funda, {l.receivedAt}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#404040", marginBottom: 14 }}>
                <a href={`mailto:${l.email}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  ✉️ <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{l.email}</span>
                </a>
                <a href={`tel:${l.phone}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  📞 {l.phone}
                </a>
              </div>
              <div style={{ borderTop: "1px solid #E5DFD3", paddingTop: 14, marginBottom: 14 }}>
                <div className="section-hdr">GEÏNTERESSEERD IN</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1F3D2B" }}>{l.property}</div>
                <div style={{ fontSize: 13, color: "#525252", marginTop: 3 }}>{l.price}</div>
              </div>
              <div style={{ borderTop: "1px solid #E5DFD3", paddingTop: 14 }}>
                <div className="section-hdr">TOEGEWEZEN AAN</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {a ? (
                      <>
                        <div className="avatar" style={{ width: 26, height: 26, background: a.color, fontSize: 10 }}>
                          {a.initials}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>{a.name}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 13, color: "#737373" }}>Niet toegewezen</span>
                    )}
                  </div>
                  <button onClick={() => setShowReassign(!showReassign)} style={{ fontSize: 12, fontWeight: 500, color: "#C8821A" }}>
                    Overdragen
                  </button>
                </div>
                {showReassign && (
                  <div style={{ marginTop: 10, padding: 8, borderRadius: 8, border: "1px solid #E5DFD3", background: "#FAF6EE" }}>
                    {team.map((tm) => (
                      <button key={tm.id} onClick={() => reassign(tm.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: 7, borderRadius: 6, textAlign: "left" }}>
                        <div className="avatar" style={{ width: 22, height: 22, background: tm.color, fontSize: 9 }}>
                          {tm.initials}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#1F3D2B" }}>{tm.name}</div>
                          <div style={{ fontSize: 10, color: "#737373" }}>{tm.role}</div>
                        </div>
                        {l.assignedTo === tm.id && <span style={{ color: "#15593B" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="section-hdr" style={{ marginBottom: 12 }}>
                ✨ AUTO-KWALIFICATIE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#737373" }}>Budget</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>{l.qd.budget}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#737373" }}>Financiering</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>
                    {l.qd.financing.includes("Pre-approval") ? "✓ " : ""}
                    {l.qd.financing}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#737373" }}>Tijdlijn</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>{l.qd.timeline}</div>
                </div>
                <div style={{ paddingTop: 10, borderTop: "1px solid #E5DFD3" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#525252" }}>Score</span>
                    <span className="fd" style={{ fontSize: 17, fontWeight: 700, color: l.score >= 80 ? "#15593B" : "#E8C07D" }}>
                      {l.score}/100
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, overflow: "hidden", marginTop: 6, background: "#F5F1E9" }}>
                    <div style={{ height: "100%", width: `${l.score}%`, background: l.score >= 80 ? "#15593B" : "#E8C07D" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div className="section-hdr">📝 NOTITIES</div>
                {!showNote && (
                  <button onClick={() => setShowNote(true)} style={{ padding: "4px 8px", borderRadius: 6, color: "#C8821A", fontSize: 18, fontWeight: 700 }}>
                    +
                  </button>
                )}
              </div>
              {showNote && (
                <div style={{ marginBottom: 10 }}>
                  <textarea className="textarea" placeholder="Bijv. 'Gebeld, budget blijkt hoger'" rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} autoFocus />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={saveNote} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, color: "white", background: "#1F3D2B" }}>
                      Opslaan
                    </button>
                    <button onClick={() => { setShowNote(false); setNoteText(""); }} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 500, color: "#737373" }}>
                      Annuleer
                    </button>
                  </div>
                </div>
              )}
              {l.notes.length > 0 ? (
                l.notes.map((nt) => (
                  <div key={nt.id} style={{ borderRadius: 8, padding: 10, border: "1px solid #E5DFD3", background: "#FAF6EE", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#1F3D2B" }}>{nt.author}</div>
                      <button onClick={() => delNote(nt.id)} style={{ color: "#EF4444", fontSize: 12 }}>
                        🗑
                      </button>
                    </div>
                    <div style={{ fontSize: 12, color: "#404040", lineHeight: 1.5 }}>{nt.text}</div>
                    <div style={{ fontSize: 10, color: "#A3A3A3", marginTop: 3 }}>{nt.time}</div>
                  </div>
                ))
              ) : !showNote ? (
                <div style={{ fontSize: 12, color: "#A3A3A3", textAlign: "center", padding: 10 }}>Nog geen notities</div>
              ) : null}
            </div>
          </div>

          <div>
            <div className="card">
              <div className="section-hdr" style={{ marginBottom: 14 }}>
                💬 CONVERSATIE
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div className="avatar" style={{ width: 34, height: 34, background: "#C8821A", fontSize: 13 }}>
                  {l.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1F3D2B" }}>{l.name}</span>
                    <span style={{ fontSize: 10, color: "#A3A3A3" }}>{l.receivedAt}</span>
                    <span className="badge" style={{ background: "#F5F1E9", color: "#8B5A2B", fontWeight: 500 }}>{l.channel}</span>
                  </div>
                  <div className="chat">"{l.message}"</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div className="avatar" style={{ width: 34, height: 34, background: "#1F3D2B", fontSize: 11 }}>
                  SV
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1F3D2B" }}>Sander Vermeulen</span>
                    <span className="badge" style={{ background: "#FFF4D6", color: "#C8821A", fontWeight: 700 }}>
                      ✨ AI CONCEPT
                    </span>
                  </div>
                  <div className="chat-ai">
                    <p>Hallo {fn},</p>
                    <p>Leuk dat je interesse hebt in {l.property}. Ik kan me goed voorstellen dat je snel een bezichtiging wilt inplannen.</p>
                    <p>Via onderstaande link kun je zelf een moment kiezen dat jou schikt. Dat scheelt heen-en-weer mailen.</p>
                    <p style={{ fontWeight: 500, color: "#C8821A" }}>makelaarsmaatje.nl/boek/{fn.toLowerCase()}</p>
                    <p>Tot snel,</p>
                    <p>Sander</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button onClick={() => sendLink(l.id, "WhatsApp")} className="btn btn-whats">
                      💬 Via WhatsApp
                    </button>
                    <button onClick={() => sendLink(l.id, "e-mail")} className="btn btn-out">
                      ✉️ Via e-mail
                    </button>
                    <button onClick={() => showToast("Aanpas-modus geopend")} className="btn" style={{ color: "#737373" }}>
                      ✏️ Aanpassen
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <h3 className="fd" style={{ fontSize: 16, fontWeight: 600, color: "#1F3D2B" }}>
                    Beschikbare slots
                  </h3>
                  <div style={{ fontSize: 11, color: "#737373" }}>Dit ziet de klant op de boekingspagina</div>
                </div>
                <button onClick={() => navigate("set")} style={{ fontSize: 11, fontWeight: 500, padding: "5px 10px", color: "#C8821A" }}>
                  Wijzig →
                </button>
              </div>
              <div className="grid" style={{ gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)", gap: 6 }}>
                {["Do 18/4 10:00", "Do 18/4 14:00", "Vr 19/4 11:00", "Vr 19/4 16:00", "Za 20/4 10:00", "Za 20/4 13:00", "Ma 22/4 09:00", "Ma 22/4 17:30"].map((slot) => (
                  <button key={slot} onClick={() => showToast(`${slot} geselecteerd`)} className="slot">
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-hdr" style={{ marginBottom: 4 }}>
                ⚡ AUTOMATISCHE FLOW
              </div>
              <div style={{ fontSize: 12, color: "#737373", marginBottom: 14 }}>Dit gebeurt automatisch rondom de bezichtiging</div>
              {[
                ["🔔", "#DCF2E3", "24 uur voor bezichtiging", "Herinnering via WhatsApp met bevestigingsknop"],
                ["🔔", "#DCF2E3", "2 uur voor bezichtiging", "Laatste reminder met route en adres"],
                ["💬", "#FEF3C7", "2 uur na bezichtiging", '"Hoe vond je het?" met reactieknoppen'],
                ["❤️", "#FEF3C7", "3 dagen na bezichtiging", "Follow-up: tweede bezichtiging of bod"],
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 999, background: f[1], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>{f[2]}</div>
                    <div style={{ fontSize: 11, color: "#737373" }}>{f[3]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // KLANT VIEW
  // ============================================================================
  function renderKlant() {
    const m = isMobile;
    return (
      <div className="fade">
        <div style={{ marginBottom: 22 }}>
          <div className="hero-tag">KLANT-WEERGAVE</div>
          <h1 className="fd" style={{ fontSize: m ? 26 : 34, fontWeight: 700, color: "#1F3D2B" }}>
            Wat de klant ziet
          </h1>
          <p style={{ fontSize: 14, color: "#525252", marginTop: 6 }}>Zo ziet de boekingservaring eruit op de telefoon van de koper</p>
        </div>
        <div className="grid g2">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="phone">
              <div style={{ width: "100%", height: "100%", background: "white", overflowY: "auto", paddingTop: 34 }}>
                <div style={{ padding: "0 18px 18px" }}>
                  <div
                    style={{
                      height: 100,
                      borderRadius: 10,
                      marginBottom: 10,
                      background: "linear-gradient(135deg, #1F3D2B 0%, #2F6B45 100%)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 10,
                      color: "white",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, opacity: 0.8 }}>TE KOOP</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>€ 875.000</div>
                    </div>
                  </div>
                  <h2 className="fd" style={{ fontSize: 17, fontWeight: 700, color: "#1F3D2B" }}>
                    Prinsengracht 421
                  </h2>
                  <div style={{ fontSize: 11, color: "#737373", marginBottom: 10 }}>Amsterdam Centrum, 112 m²</div>
                  <div style={{ padding: "10px 0", borderTop: "1px solid #E5DFD3", borderBottom: "1px solid #E5DFD3", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="avatar" style={{ width: 28, height: 28, background: "#C8821A", fontSize: 11 }}>
                      SV
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1F3D2B" }}>Sander Vermeulen</div>
                      <div style={{ fontSize: 9, color: "#737373" }}>Vermeulen Vastgoed</div>
                    </div>
                  </div>
                  {qStep === 0 && (
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#C8821A", marginBottom: 6 }}>STAP 1 VAN 3</div>
                      <h3 className="fd" style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: "#1F3D2B" }}>
                        Wat is je budget?
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {["Tot € 750.000", "€ 750k tot € 900k", "€ 900k tot € 1.1M", "Boven € 1.1M"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setQStep(1)}
                            style={{ width: "100%", padding: "9px 10px", borderRadius: 7, border: "1px solid #E5DFD3", fontSize: 11, textAlign: "left", fontWeight: 500, color: "#1F3D2B", background: "white" }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {qStep === 1 && (
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#C8821A", marginBottom: 6 }}>STAP 2 VAN 3</div>
                      <h3 className="fd" style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: "#1F3D2B" }}>
                        Hoe zit je financiering?
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {["Pre-approval aanwezig", "Hypotheek in aanvraag", "Eigen geld, geen hypotheek", "Nog regelen"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setQStep(2)}
                            style={{ width: "100%", padding: "9px 10px", borderRadius: 7, border: "1px solid #E5DFD3", fontSize: 11, textAlign: "left", fontWeight: 500, color: "#1F3D2B", background: "white" }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setQStep(0)} style={{ marginTop: 10, fontSize: 10, color: "#737373", textDecoration: "underline" }}>
                        ← Vorige
                      </button>
                    </div>
                  )}
                  {qStep === 2 && (
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#C8821A", marginBottom: 6 }}>STAP 3 VAN 3</div>
                      <h3 className="fd" style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: "#1F3D2B" }}>
                        Kies een moment
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                        {["Do 18/4 10:00", "Do 18/4 14:00", "Vr 19/4 11:00", "Vr 19/4 16:00", "Za 20/4 10:00", "Za 20/4 13:00"].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setQStep(3)}
                            style={{ padding: 7, borderRadius: 7, border: "1px solid #E5DFD3", fontSize: 10, fontWeight: 500, textAlign: "left", color: "#1F3D2B", background: "white" }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setQStep(1)} style={{ fontSize: 10, color: "#737373", textDecoration: "underline" }}>
                        ← Vorige
                      </button>
                    </div>
                  )}
                  {qStep === 3 && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <div style={{ width: 50, height: 50, borderRadius: 999, background: "#DCF2E3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 24 }}>✓</div>
                      <h3 className="fd" style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "#1F3D2B" }}>
                        Bezichtiging bevestigd
                      </h3>
                      <p style={{ fontSize: 11, color: "#525252" }}>Donderdag 18 april om 14:00</p>
                      <p style={{ fontSize: 11, color: "#525252", marginBottom: 14 }}>Prinsengracht 421, Amsterdam</p>
                      <div style={{ borderRadius: 7, padding: 10, textAlign: "left", fontSize: 11, background: "#FAF6EE" }}>
                        <div style={{ marginBottom: 3 }}>✓ Toegevoegd aan je agenda</div>
                        <div style={{ marginBottom: 3 }}>✓ Herinnering 24u van tevoren</div>
                        <div>✓ WhatsApp geactiveerd</div>
                      </div>
                      <button onClick={() => setQStep(0)} style={{ marginTop: 12, fontSize: 10, color: "#737373", textDecoration: "underline" }}>
                        Opnieuw
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="card">
              <div className="section-hdr">✨ 3-STAPS KWALIFICATIE</div>
              <h3 className="fd" style={{ fontSize: 17, fontWeight: 600, margin: "8px 0 10px", color: "#1F3D2B" }}>
                Alleen serieuze kopers
              </h3>
              <p style={{ fontSize: 13, color: "#404040", lineHeight: 1.6, marginBottom: 12 }}>
                Voordat de koper kan boeken beantwoordt hij drie korte vragen over budget, financiering en tijdlijn. Niet-serieuze kijkers haken af.
              </p>
              <div style={{ borderRadius: 7, padding: 10, fontSize: 13, background: "#FAF6EE" }}>
                <div style={{ fontWeight: 600, fontSize: 11, color: "#15593B", marginBottom: 3 }}>In de praktijk:</div>
                <div style={{ fontSize: 11, color: "#525252" }}>62% van de "leads" haakt af bij de vragen. Alleen echte kopers komen door.</div>
              </div>
            </div>
            <div className="card">
              <div className="section-hdr">📱 MOBIEL EERST</div>
              <h3 className="fd" style={{ fontSize: 17, fontWeight: 600, margin: "8px 0 10px", color: "#1F3D2B" }}>
                Boeken in 30 seconden
              </h3>
              <p style={{ fontSize: 13, color: "#404040", lineHeight: 1.6 }}>De koper klikt een WhatsApp-link, beantwoordt drie vragen, kiest een slot en krijgt direct bevestiging.</p>
            </div>
            <div className="card" style={{ color: "white", background: "linear-gradient(135deg, #C8821A 0%, #E8C07D 100%)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", opacity: 0.9, marginBottom: 6 }}>WAT DE KOPER ERVAART</div>
              <div className="fd" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                9,2 / 10
              </div>
              <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.6 }}>"Heerlijk snel geregeld, binnen een minuut stond de bezichtiging in mijn agenda."</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // CALENDAR
  // ============================================================================
  function renderCal() {
    const m = isMobile;
    const days: Array<[string, Array<[string, string, string, string]>]> = [
      ["Maandag 15 april", [["09:30", "Nadia", "Rob Vermeer", "#8B5A2B"]]],
      ["Dinsdag 16 april", [["11:00", "Lisa", "Mark de Boer", "#1F3D2B"]]],
      ["Woensdag 17 april", [["15:00", "Pieter", "Linda Peters", "#2F6B45"]]],
      [
        "Donderdag 18 april",
        [
          ["14:00", "Sander (jij)", "Sophie van Dijk", "#C8821A"],
          ["16:00", "Nadia", "Emma Visser", "#8B5A2B"],
        ],
      ],
      [
        "Vrijdag 19 april",
        [
          ["10:00", "Sander (jij)", "Aisha Yilmaz", "#C8821A"],
          ["13:30", "Lisa", "Jeroen Smit", "#1F3D2B"],
        ],
      ],
      ["Zaterdag 20 april", [["11:00", "Pieter", "Thomas Bakker", "#2F6B45"]]],
    ];
    return (
      <div className="fade">
        <div style={{ marginBottom: 22 }}>
          <div className="hero-tag">WEEK 16, APRIL 2026</div>
          <h1 className="fd" style={{ fontSize: m ? 26 : 34, fontWeight: 700, color: "#1F3D2B" }}>
            Teamagenda
          </h1>
        </div>
        {days.map(([day, items]) => (
          <div key={day} className="card">
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: "#1F3D2B" }}>{day}</div>
            {items.map((it, i) => (
              <div
                key={i}
                onClick={() => showToast(`Bezichtiging ${it[2]}`)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 8, background: "#FAF6EE", cursor: "pointer", marginBottom: 6 }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: it[3] }}>{it[0]}</div>
                <div style={{ width: 1, height: 28, background: "#E5DFD3" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>{it[2]}</div>
                  <div style={{ fontSize: 10, color: "#737373" }}>{it[1]}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // ============================================================================
  // VERKOPER REPORT
  // ============================================================================
  function renderVerk() {
    const m = isMobile;
    const sellers: Array<[string, string, boolean, number]> = [
      ["Familie De Jong", "Prinsengracht 421", true, 8],
      ["R.W. Janssens", "Keizersgracht 118", false, 3],
      ["Mw. K. Bosman", "Vondelstraat 88", false, 12],
      ["Heren De Wit", "Herengracht 502", false, 5],
    ];
    const buyers: Array<[string, string, string]> = [
      ["S. van Dijk", "Bezichtiging do 18/4", "Pre-approval aanwezig"],
      ["T. Bakker", "Bezichtiging za 20/4", "Cash-koper"],
      ["F. Hendriks", "Nog te boeken", "Zeer gemotiveerd"],
    ];
    return (
      <div className="fade">
        <div style={{ marginBottom: 22 }}>
          <div className="hero-tag">WEKELIJKSE RAPPORTAGE</div>
          <h1 className="fd" style={{ fontSize: m ? 26 : 34, fontWeight: 700, color: "#1F3D2B" }}>
            Rapport voor verkoper
          </h1>
          <p style={{ fontSize: 14, color: "#525252", marginTop: 6 }}>Elke maandag automatisch verstuurd</p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: m ? "1fr" : "1fr 2fr", gap: 18 }}>
          <div className="card">
            <div className="section-hdr" style={{ marginBottom: 10 }}>
              VERKOPERS
            </div>
            {sellers.map((sr, i) => (
              <div
                key={i}
                onClick={() => showToast(`Rapport ${sr[0]}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  borderRadius: 8,
                  cursor: "pointer",
                  background: sr[2] ? "#FAF6EE" : "transparent",
                  border: "1px solid " + (sr[2] ? "#E8C07D" : "transparent"),
                  marginBottom: 6,
                }}
              >
                <div className="avatar" style={{ width: 32, height: 32, background: "#1F3D2B", fontSize: 11 }}>
                  {sr[0].split(" ").pop()?.substring(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sr[0]}</div>
                  <div style={{ fontSize: 11, color: "#737373" }}>{sr[1]}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: sr[2] ? "#C8821A" : "#9CA3AF" }}>{sr[3]}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: 20, borderBottom: "1px solid #E5DFD3", background: "linear-gradient(135deg, #FAF6EE 0%, #FFF 100%)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#C8821A", marginBottom: 4 }}>WEEKRAPPORT, WEEK 15</div>
              <h2 className="fd" style={{ fontSize: 20, fontWeight: 700, color: "#1F3D2B" }}>
                Prinsengracht 421
              </h2>
              <div style={{ fontSize: 13, color: "#525252" }}>Familie De Jong, vraagprijs € 875.000</div>
            </div>
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, textAlign: "center" }}>
              <div>
                <div className="fd" style={{ fontSize: 26, fontWeight: 700, color: "#1F3D2B" }}>
                  47
                </div>
                <div style={{ fontSize: 10, color: "#737373" }}>Leads</div>
              </div>
              <div style={{ borderLeft: "1px solid #E5DFD3", borderRight: "1px solid #E5DFD3" }}>
                <div className="fd" style={{ fontSize: 26, fontWeight: 700, color: "#C8821A" }}>
                  8
                </div>
                <div style={{ fontSize: 10, color: "#737373" }}>Bezichtigingen</div>
              </div>
              <div>
                <div className="fd" style={{ fontSize: 26, fontWeight: 700, color: "#15593B" }}>
                  3
                </div>
                <div style={{ fontSize: 10, color: "#737373" }}>Serieuze kopers</div>
              </div>
            </div>
            <div style={{ padding: "0 20px 20px" }}>
              <div className="section-hdr" style={{ marginBottom: 8 }}>
                SAMENVATTING
              </div>
              <p style={{ fontSize: 13, color: "#404040", lineHeight: 1.6, marginBottom: 14 }}>
                De Prinsengracht 421 ligt goed in de markt. 47 leads, 8 bezichtigingen, 3 serieus geïnteresseerd.
              </p>
              <div className="section-hdr" style={{ marginBottom: 8 }}>
                SERIEUZE KOPERS
              </div>
              {buyers.map((b, i) => (
                <div key={i} style={{ padding: 10, borderRadius: 7, background: "#FAF6EE", marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1F3D2B" }}>{b[0]}</span>
                    <span style={{ fontSize: 10, fontWeight: 500, color: "#C8821A" }}>{b[1]}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#525252" }}>{b[2]}</div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                <button onClick={() => showToast("Rapport verstuurd")} className="btn btn-dark" style={{ flex: 1 }}>
                  ✉️ Verstuur
                </button>
                <button onClick={() => showToast("PDF gedownload")} className="btn btn-out">
                  📄 PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STATS
  // ============================================================================
  function renderStat() {
    const m = isMobile;
    const rows: Array<[string, string, string]> = [
      ["Lead ontvangen", "100%", "#1F3D2B"],
      ["Binnen 5 min gereageerd", "94%", "#2F6B45"],
      ["Bezichtiging geboekt", "67%", "#15593B"],
      ["Tweede bezichtiging", "52%", "#C8821A"],
      ["Deal gesloten", "34%", "#E8C07D"],
    ];
    const bars = [85, 72, 68, 45, 32, 28, 22, 18, 12, 8, 6, 4];
    return (
      <div className="fade">
        <div style={{ marginBottom: 22 }}>
          <div className="hero-tag">INZICHTEN, LAATSTE 30 DAGEN</div>
          <h1 className="fd" style={{ fontSize: m ? 26 : 34, fontWeight: 700, color: "#1F3D2B" }}>
            Impact meten
          </h1>
          <p style={{ fontSize: 14, color: "#525252", marginTop: 6 }}>Hoe Makelaarsmaatje het verschil maakt</p>
        </div>
        <div className="grid g2">
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 className="fd" style={{ fontSize: 16, fontWeight: 600, color: "#1F3D2B" }}>
                Reactietijd
              </h3>
              <span className="badge" style={{ background: "#DCF2E3", color: "#15593B" }}>
                -87%
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "#737373" }}>Voorheen</div>
                <div className="fd" style={{ fontSize: 26, fontWeight: 700, color: "#A3A3A3" }}>
                  31 min
                </div>
              </div>
              <div style={{ color: "#C8821A", fontSize: 20, marginBottom: 8 }}>↗</div>
              <div>
                <div style={{ fontSize: 11, color: "#737373" }}>Nu</div>
                <div className="fd" style={{ fontSize: 26, fontWeight: 700, color: "#C8821A" }}>
                  4 min
                </div>
              </div>
            </div>
            <div style={{ height: 60, display: "flex", alignItems: "flex-end", gap: 3 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3, height: `${h}%`, background: i < 4 ? "#D9CFB8" : "#C8821A", opacity: i < 4 ? 0.5 : 1 }}></div>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 className="fd" style={{ fontSize: 16, fontWeight: 600, color: "#1F3D2B" }}>
                Lead → deal funnel
              </h3>
              <span className="badge" style={{ background: "#DCF2E3", color: "#15593B" }}>
                +38%
              </span>
            </div>
            {rows.map((row) => (
              <div key={row[0]} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: "#525252" }}>{row[0]}</span>
                  <span style={{ fontWeight: 600, color: row[2] }}>{row[1]}</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, overflow: "hidden", background: "#F5F1E9" }}>
                  <div style={{ height: "100%", width: row[1], background: row[2] }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid g3" style={{ marginTop: 14 }}>
          <div className="card">
            <div style={{ fontSize: 18 }}>💶</div>
            <div className="fd" style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: "#1F3D2B" }}>
              € 247.000
            </div>
            <div style={{ fontSize: 12, color: "#525252", marginTop: 3 }}>Extra courtage/maand</div>
          </div>
          <div className="card">
            <div style={{ fontSize: 18 }}>⏰</div>
            <div className="fd" style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: "#1F3D2B" }}>
              18 uur
            </div>
            <div style={{ fontSize: 12, color: "#525252", marginTop: 3 }}>Tijdwinst/week, per makelaar</div>
          </div>
          <div className="card" style={{ color: "white", background: "linear-gradient(135deg, #C8821A 0%, #E8C07D 100%)" }}>
            <div style={{ fontSize: 18 }}>✨</div>
            <div className="fd" style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
              9,2 / 10
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>Klanttevredenheid</div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SETTINGS
  // ============================================================================
  function renderSet() {
    const m = isMobile;
    const avail: Array<[string, string, boolean]> = [
      ["Maandag", "09:00 - 18:00", true],
      ["Dinsdag", "09:00 - 18:00", true],
      ["Woensdag", "09:00 - 18:00", true],
      ["Donderdag", "09:00 - 20:00", true],
      ["Vrijdag", "09:00 - 18:00", true],
      ["Zaterdag", "10:00 - 14:00", true],
      ["Zondag", "Gesloten", false],
    ];
    const ints: Array<[string, string, string, boolean]> = [
      ["🏠", "Funda", "Lead-aanvragen ophalen", true],
      ["📅", "Google Agenda", "Synchronisatie", true],
      ["💬", "WhatsApp Business", "Berichten", true],
      ["🗂️", "Realworks CRM", "Leads doorzetten", false],
    ];
    return (
      <div className="fade">
        <div style={{ marginBottom: 22 }}>
          <div className="hero-tag">CONFIGURATIE</div>
          <h1 className="fd" style={{ fontSize: m ? 26 : 34, fontWeight: 700, color: "#1F3D2B" }}>
            Instellingen
          </h1>
        </div>
        <div className="grid g2">
          <div className="card">
            <h3 className="fd" style={{ fontSize: 16, fontWeight: 600, color: "#1F3D2B", marginBottom: 3 }}>
              Beschikbaarheid
            </h3>
            <p style={{ fontSize: 11, color: "#737373", marginBottom: 12 }}>Wanneer kunnen klanten boeken?</p>
            {avail.map((d) => (
              <div key={d[0]} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #F5F1E9" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>{d[0]}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "#737373" }}>{d[1]}</span>
                  <div onClick={() => showToast("Bijgewerkt")} className="toggle" style={{ background: d[2] ? "#1F3D2B" : "#D9CFB8" }}>
                    <div className="toggle-d" style={{ transform: d[2] ? "translateX(20px)" : "translateX(2px)" }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 className="fd" style={{ fontSize: 16, fontWeight: 600, color: "#1F3D2B", marginBottom: 3 }}>
              E-mailhandtekening
            </h3>
            <p style={{ fontSize: 11, color: "#737373", marginBottom: 12 }}>Automatisch toegevoegd</p>
            <div style={{ borderRadius: 7, padding: 12, fontSize: 12, border: "1px solid #E5DFD3", background: "#FAF6EE" }}>
              <div style={{ fontWeight: 600, marginBottom: 3, color: "#1F3D2B" }}>Sander Vermeulen</div>
              <div style={{ color: "#525252", marginBottom: 3 }}>Eigenaar, Vermeulen Vastgoed</div>
              <div style={{ color: "#525252", marginBottom: 3 }}>06 - 12 34 56 78</div>
              <div style={{ color: "#525252" }}>sander@vermeulenvastgoed.nl</div>
            </div>
            <button onClick={() => showToast("Editor geopend")} style={{ marginTop: 10, fontSize: 12, fontWeight: 500, color: "#C8821A" }}>
              ✏️ Aanpassen
            </button>
          </div>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h3 className="fd" style={{ fontSize: 16, fontWeight: 600, color: "#1F3D2B" }}>
                  Team
                </h3>
                <p style={{ fontSize: 11, color: "#737373" }}>4 makelaars actief</p>
              </div>
              <button onClick={() => showToast("Uitnodiging formulier")} style={{ padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: "#1F3D2B", color: "white" }}>
                + Uitnodigen
              </button>
            </div>
            {team.map((tm) => (
              <div key={tm.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 6, borderRadius: 7, marginBottom: 3 }}>
                <div className="avatar" style={{ width: 32, height: 32, background: tm.color, fontSize: 11 }}>
                  {tm.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2B" }}>{tm.name}</div>
                  <div style={{ fontSize: 10, color: "#737373" }}>{tm.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 className="fd" style={{ fontSize: 16, fontWeight: 600, color: "#1F3D2B", marginBottom: 3 }}>
              Koppelingen
            </h3>
            <p style={{ fontSize: 11, color: "#737373", marginBottom: 12 }}>Verbonden systemen</p>
            {ints.map((int) => (
              <div key={int[1]} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 7, border: "1px solid #E5DFD3", marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, background: "#FAF6EE" }}>{int[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1F3D2B" }}>{int[1]}</div>
                  <div style={{ fontSize: 10, color: "#737373", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{int[2]}</div>
                </div>
                {int[3] ? (
                  <span className="badge" style={{ background: "#DCF2E3", color: "#15593B" }}>
                    ● ACTIEF
                  </span>
                ) : (
                  <button onClick={() => showToast(`${int[1]} koppelen`)} style={{ fontSize: 11, fontWeight: 500, padding: "5px 10px", borderRadius: 6, background: "#1F3D2B", color: "white" }}>
                    Koppelen
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
