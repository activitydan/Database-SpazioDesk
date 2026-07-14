import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

// ─── STORAGE HELPERS ────────────────────────────────────────
async function load(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); return true; }
  catch { return false; }
}

// ─── SEED DATA ───────────────────────────────────────────────
const SEED = [
  { id:1, data:"05/01/2026", desc:"Fattura 001 — Consulenza",   cat:"Ricavi",      sub:"Consulenza",  ent:8500,   usc:0,      met:"Bonifico",    fornitore:"Cliente Rossi S.r.l.",  centro:"Commerciale", stato:"Pagato",    note:"Fattura n.001" },
  { id:2, data:"08/01/2026", desc:"Affitto uffici Gennaio",      cat:"Costi Fissi", sub:"Affitti",     ent:0,      usc:2200,   met:"Bonifico",    fornitore:"Immobiliare Centro",    centro:"Generale",    stato:"Pagato",    note:"Mensilità Gen" },
  { id:3, data:"12/01/2026", desc:"Fattura 002 — Licenza SW",    cat:"Ricavi",      sub:"Licenze",     ent:3200,   usc:0,      met:"Carta cred.", fornitore:"Tech Solutions SpA",   centro:"IT",          stato:"Pagato",    note:"" },
  { id:4, data:"15/01/2026", desc:"Stipendi Gennaio",            cat:"Costi Fissi", sub:"Personale",   ent:0,      usc:12500,  met:"Bonifico",    fornitore:"Dipendenti",            centro:"HR",          stato:"Pagato",    note:"5 collaboratori" },
  { id:5, data:"20/01/2026", desc:"Utenze — Luce & Gas",         cat:"Costi Fissi", sub:"Utenze",      ent:0,      usc:380,    met:"Addebito",    fornitore:"Enel Energia",          centro:"Generale",    stato:"Scaduto",   note:"Bolletta Q1" },
  { id:6, data:"03/02/2026", desc:"Fattura 003 — Progetto Alpha",cat:"Ricavi",      sub:"Consulenza",  ent:11700,  usc:0,      met:"Bonifico",    fornitore:"Alpha Corp",            centro:"Commerciale", stato:"Pagato",    note:"" },
  { id:7, data:"14/02/2026", desc:"Affitto uffici Febbraio",     cat:"Costi Fissi", sub:"Affitti",     ent:0,      usc:2200,   met:"Bonifico",    fornitore:"Immobiliare Centro",    centro:"Generale",    stato:"Pagato",    note:"" },
  { id:8, data:"28/02/2026", desc:"Marketing — Google Ads",      cat:"Costi Variabili",sub:"Marketing",ent:0,      usc:950,    met:"Carta cred.", fornitore:"Google",                centro:"Marketing",   stato:"Pagato",    note:"Feb campagna" },
];

const CATS = ["Ricavi","Costi Fissi","Costi Variabili","Investimenti","Tasse & Imposte","Finanziamenti","Rimborsi","Altro"];
const SUBCATS = ["Consulenza","Vendite","Licenze","Affitti","Personale","Utenze","Marketing","Software","Hardware","Viaggi","Formazione","Altro"];
const METODI = ["Bonifico","Carta cred.","Contanti","Assegno","RID/SDD","PayPal","Addebito","POS"];
const STATI  = ["Pagato","In attesa","Parziale","Annullato","Scaduto"];
const CENTRI = ["Commerciale","IT","HR","Generale","Produzione","Marketing","Amministrazione","Direzione"];

// ─── LOGO — pittogramma SpazioDesk reale (embedded PNG) ─────
const LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABgCAYAAACdSWXJAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAGlUlEQVR42u2dXYgcRRDHfzOzu4knYtCL5wcJJMb4gSCCiiAqSCDimz4YEFRE8MUHxSAi+CYIIoLPfmDUB0EUBEMQxJCXcIhI8Ctoosb4gUYNJopGb3dmfOhqtr3c7c5H70x37xYUew+3dzM1/676V3V1DSh5EPgWGAAZkNfQDPgbeBe4VP5+zEzYWdOwo/QIsABEolMtfwkKU8tG/lc+H5X/05lmI3eAOfnZNuJiMfT5MzQPjTEpieRh5tNu7M4EDaAD4HYgAfoV3Ec6YSA0KvkEVRvqdWC+xqrwXqIGEJMJuo8B+yX4jnroSCD9DHgN+L2h6/Qa0VoHFb93GLhYDB3PDF08kRmIry6i/8j33pbrTHwPhk26qTLGiuXhXCXXOfDZhcQeXF8eQmbpsqEjI+FZkJ+7siqKqHP3ljusOoi+UeNhxS6hxmXR9HA/8AJw1HgQo+Q48LlL95l7oFUKXhmwD9jigpv0KYqnFTLFWFB9rdBF2rzfPGDty+dNbXPx0Hc+9Iqdc4He9WVZZgEaWnPwsyokTFYlAdYD16/g+/IRKNE7Mq4nErmA6VzgFcPPm/cySju2fHoCvAesBS4HzihwESY/dT1b02n8ZtRG8SfAiRLGyyoE4FXRqWUeuLAASiNgHXAHavccWxfTABdfAr5GlWHHrYQlYBF4GvjZBkOr47vuYTIbuy6Vag9hYSc/WRY04gJ+S/9eBziA2qraKMaOHXcjVXbyF4SD75V7zqr+c3O5ZAU1NR7OobYTgQq1j6KqDbuprmusi8BcVkWI1NC0Ue1uARtLfa9xIYMSmnpiZIT+JnLdXUF6EU1skYRY/tirDRaL2ipovQj0qrqsyILP00tqO3CDPPFx9HAOuEaQ4oNoengQ2I3amR8Vl3S8OwzskezbWpCpIvcbbiTEUm0OfAhsspn7m1tIRfUjoU/XicFd31rLjLpQUXa2QVZva6KDxa01EwovVkKbCMqNwlQw/XWrJUqdlg0N8INh7LSEv/epBSFKWja07snbDFxdogSg1fW0/7RaR9tB5h2pK8xL1ewP4E/5XE17NXhtKzfpmqwt6PfWA/cBT3B6vXwmIx541Xix0wfWEnm8ymJjBRxFbVc5e4TDxUBSpkEmFZ9+YkxK3LqEcCQtM6jhjHVM8PpT4AJUk8xyxOfMTu1a8+cxsAZ4eZXCjxMFq9Do0BWotoKeBMc7gZsZljlnYgnZK8lzLtC/0BBtNvXEYtwE1cuxsU1kh7acNOVLUbsa2tgH26Z/8ZS4lRmPbsB1RMBlDtd2ggmGz7hA80J7wluBSyQALgi92zajd/aQ3AOel7qHq70j3qfgAE8aRtWdUH0cKp1GnqNZ1zK+RDUiOlu/CcFv6f42a31u00Lvyhb+u8DZrtO3jkPGTSg3Q0nXnx9Abeqm+F/2bdwVjNIOqix6EfA4w969uhMogw6G5imvR4AdqINIUQG3cR5w5gyX5fzsSzR7AGiqEK3PAF4JfGrUJUJsCWs1GGojbWDYJhBqMGu1m1QbNvRxmhkQ2UR0lYQhBW7TT90To5U5gabnQC02nWQsl7ulEOQ8PatRnDoAbLG5ZG9BHRaaY/xhoS7quMGNHi3/GHV4dQ/wC6Orcuag8t0Mp9/UYg5JDXrmOopNJO+iWKer9ZqS9u/3MhyrU0YHHhn5iKxCXVspfaDTRjDcZgSI0PYgtctYZDj/ut84pPHseENNphHZWP5lMy39uzlqj87pEuUKQaqoDBj2X1sb+VNF7iL8wSjfoLpVa6X85hfXoQaujkNnBJwD3A48ZLgNH0b9pBLYBmMQqoeiLAJPAT9i4TxkgtrcPOYJMqsyhzdRA7q6FUBhBUTPVuS/fQ94sEbuvhogtBbol/j/hIGM8EZm7pB77bXl5joGEccDX1slBuXASYOKtlLAign7wLsuwZ5q+z47HiE4M9hDXjBwdYAvUMNJIloeshXqoO4cNUXdiXcq+jR6/gOpEn5fIMPLpZT5sUv36QM9e6sGImcvUygAACRD2ypI7lH8hGyOQ4MPXS5r6k7RnxhOu+37ypJcL2+anfpe09BOwwjNKNfEuAbVXNNn2ATpNal3lZ4dEf/s/Wv2mnxx5HHhtScLBMAUdQhzF/AbsxdHlipRLgQaR1pHtEbyV6ipA1P9ct9JvkpaG1pPm+1iceqsj/RukkUlXRMOfSxmIUOfmlAWpbfof512I2t5bAJBUPPl77CwgxySPIza6bXR1ZmhmvrelyAYDHOoI/8B2QcmjZLDmYIAAAAASUVORK5CYII=";

function Logo({ size = 28, color = "#0A0A0A" }) {
  // color prop: if white, invert the black logo via CSS filter
  const invert = color === "#fff" || color === "#ffffff" || color === "white";
  return (
    <img
      src={LOGO_B64}
      width={size}
      height={size}
      alt="SpazioDesk"
      style={{
        objectFit: "contain",
        filter: invert ? "invert(1)" : "none",
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

// ─── FORMAT ──────────────────────────────────────────────────
function fmt(n) {
  if (n === 0 || n === null || n === undefined) return "—";
  return new Intl.NumberFormat("it-IT", { style:"currency", currency:"EUR", maximumFractionDigits:0 }).format(n);
}
function fmtFull(n) {
  return new Intl.NumberFormat("it-IT", { style:"currency", currency:"EUR" }).format(n || 0);
}
function parseDate(s) {
  if (!s) return new Date(0);
  const [d,m,y] = s.split("/");
  return new Date(+y, +m-1, +d);
}
function monthLabel(m) {
  return ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"][m];
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [movimenti, setMovimenti]   = useState([]);
  const [tab, setTab]               = useState("dashboard");
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [filterCat, setFilterCat]   = useState("Tutte");
  const [filterMese, setFilterMese] = useState("Tutti");
  const [loading, setLoading]       = useState(true);
  const [saved, setSaved]           = useState(false);
  const [deleteId, setDeleteId]     = useState(null);

  const EMPTY_FORM = {
    data:"", desc:"", cat:"Ricavi", sub:"Consulenza",
    ent:"", usc:"", met:"Bonifico", fornitore:"",
    centro:"Generale", stato:"Pagato", note:""
  };
  const [form, setForm] = useState(EMPTY_FORM);

  // Load data
  useEffect(() => {
    (async () => {
      const stored = await load("spazidesk_movimenti");
      setMovimenti(stored || SEED);
      setLoading(false);
    })();
  }, []);

  // Save data
  useEffect(() => {
    if (!loading) save("spazidesk_movimenti", movimenti);
  }, [movimenti, loading]);

  // ── KPI calculations ─────────────────────────────────────
  const totalEnt = movimenti.reduce((s,m) => s + (m.ent||0), 0);
  const totalUsc = movimenti.reduce((s,m) => s + (m.usc||0), 0);
  const saldo    = totalEnt - totalUsc;
  const nMov     = movimenti.length;

  // Monthly chart data
  const monthlyData = Array.from({length:12},(_,i) => {
    const mMovs = movimenti.filter(m => {
      const d = parseDate(m.data);
      return d.getMonth() === i && d.getFullYear() === 2026;
    });
    return {
      name: monthLabel(i),
      entrate: mMovs.reduce((s,m) => s+(m.ent||0),0),
      uscite:  mMovs.reduce((s,m) => s+(m.usc||0),0),
    };
  }).filter(d => d.entrate > 0 || d.uscite > 0);

  // Category data
  const catData = CATS.map(cat => ({
    name: cat,
    value: movimenti.filter(m => m.cat === cat).reduce((s,m) => s+(m.usc||0),0)
  })).filter(d => d.value > 0).sort((a,b) => b.value - a.value);

  // Filtered movimenti
  const filtered = movimenti
    .filter(m => filterCat === "Tutte" || m.cat === filterCat)
    .filter(m => {
      if (filterMese === "Tutti") return true;
      return parseDate(m.data).getMonth() === parseInt(filterMese);
    })
    .sort((a,b) => parseDate(b.data) - parseDate(a.data));

  // ── Form handlers ─────────────────────────────────────────
  function openNew() { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); }
  function openEdit(m) {
    setForm({...m, ent: m.ent||"", usc: m.usc||""});
    setEditId(m.id); setShowForm(true);
  }
  function submitForm() {
    if (!form.data || !form.desc) return;
    const entry = {
      ...form,
      id: editId || Date.now(),
      ent: parseFloat(form.ent)||0,
      usc: parseFloat(form.usc)||0,
    };
    setMovimenti(prev =>
      editId ? prev.map(m => m.id === editId ? entry : m)
             : [...prev, entry]
    );
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  function deleteMovimento(id) {
    setMovimenti(prev => prev.filter(m => m.id !== id));
    setDeleteId(null);
  }

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      height:"100vh",background:"#0A0A0A"}}>
      <Logo size={40} color="#fff" />
    </div>
  );

  return (
    <div style={S.app}>
      {/* ── TOP BAR ── */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <Logo size={24} color="#fff" />
          <span style={S.brand}>SPAZIO DESK</span>
        </div>
        <button style={S.addBtn} onClick={openNew}>＋ Nuovo</button>
      </header>

      {/* ── CONTENT ── */}
      <main style={S.main}>
        {tab === "dashboard" && (
          <Dashboard
            totalEnt={totalEnt} totalUsc={totalUsc}
            saldo={saldo} nMov={nMov}
            monthlyData={monthlyData} catData={catData}
            movimenti={movimenti}
          />
        )}
        {tab === "movimenti" && (
          <Movimenti
            filtered={filtered}
            filterCat={filterCat} setFilterCat={setFilterCat}
            filterMese={filterMese} setFilterMese={setFilterMese}
            onEdit={openEdit}
            onDelete={id => setDeleteId(id)}
          />
        )}
        {tab === "riepilogo" && (
          <Riepilogo movimenti={movimenti} />
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={S.nav}>
        {[
          { id:"dashboard", icon:"◈", label:"Dashboard" },
          { id:"movimenti", icon:"☰", label:"Movimenti" },
          { id:"riepilogo", icon:"▦", label:"Riepilogo" },
        ].map(t => (
          <button key={t.id} style={{...S.navBtn, ...(tab===t.id ? S.navActive : {})}}
            onClick={() => setTab(t.id)}>
            <span style={S.navIcon}>{t.icon}</span>
            <span style={S.navLabel}>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* ── FORM DRAWER ── */}
      {showForm && (
        <FormDrawer
          form={form} setForm={setForm}
          onSubmit={submitForm}
          onClose={() => setShowForm(false)}
          isEdit={!!editId}
        />
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteId && (
        <div style={S.overlay}>
          <div style={S.confirmBox}>
            <p style={{fontWeight:700,fontSize:15,marginBottom:8}}>Eliminare questo movimento?</p>
            <p style={{color:"#666",fontSize:13,marginBottom:20}}>L'operazione non è reversibile.</p>
            <div style={{display:"flex",gap:10}}>
              <button style={S.cancelBtn} onClick={() => setDeleteId(null)}>Annulla</button>
              <button style={S.deleteBtn} onClick={() => deleteMovimento(deleteId)}>Elimina</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {saved && (
        <div style={S.toast}>✓ Salvato</div>
      )}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────
function Dashboard({ totalEnt, totalUsc, saldo, nMov, monthlyData, catData, movimenti }) {
  const scaduti = movimenti.filter(m => m.stato === "Scaduto" || m.stato === "In attesa");

  return (
    <div style={S.page}>
      {/* KPI grid */}
      <div style={S.kpiGrid}>
        <KpiCard label="Entrate" value={fmtFull(totalEnt)} accent="#0A0A0A" />
        <KpiCard label="Uscite"  value={fmtFull(totalUsc)} accent="#0A0A0A" />
        <KpiCard label="Saldo"   value={fmtFull(saldo)}
          accent={saldo >= 0 ? "#0A0A0A" : "#C0392B"} wide />
        <KpiCard label="Movimenti" value={nMov} accent="#0A0A0A" />
      </div>

      {/* Andamento mensile */}
      {monthlyData.length > 0 && (
        <Section title="Andamento mensile">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData} margin={{top:4,right:8,left:-24,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#888"}} />
              <YAxis tick={{fontSize:10,fill:"#888"}}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip formatter={(v,n) => [fmtFull(v), n==="entrate"?"Entrate":"Uscite"]}
                contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E5E5E5"}} />
              <Line type="monotone" dataKey="entrate" stroke="#0A0A0A"
                strokeWidth={2} dot={{r:3}} />
              <Line type="monotone" dataKey="uscite" stroke="#AAAAAA"
                strokeWidth={2} dot={{r:3}} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div style={S.legend}>
            <span style={S.legendDot("#0A0A0A")} /> <span style={{fontSize:11}}>Entrate</span>
            <span style={{...S.legendDot("#AAAAAA"),marginLeft:12}} /> <span style={{fontSize:11}}>Uscite</span>
          </div>
        </Section>
      )}

      {/* Uscite per categoria */}
      {catData.length > 0 && (
        <Section title="Uscite per categoria">
          <ResponsiveContainer width="100%" height={catData.length * 36 + 20}>
            <BarChart data={catData} layout="vertical"
              margin={{top:0,right:8,left:0,bottom:0}}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name"
                tick={{fontSize:11,fill:"#555"}} width={110} />
              <Tooltip formatter={v => fmtFull(v)}
                contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #E5E5E5"}} />
              <Bar dataKey="value" radius={[0,4,4,0]}>
                {catData.map((_,i) => (
                  <Cell key={i} fill={i===0?"#0A0A0A":i===1?"#444":i===2?"#777":"#AAAAAA"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Pagamenti in scadenza */}
      {scaduti.length > 0 && (
        <Section title="⚠ Richiedono attenzione">
          {scaduti.map(m => (
            <div key={m.id} style={S.alertRow}>
              <div>
                <p style={{fontSize:13,fontWeight:600,margin:0}}>{m.desc}</p>
                <p style={{fontSize:11,color:"#888",margin:"2px 0 0"}}>{m.data} · {m.stato}</p>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:"#C0392B"}}>
                {m.usc ? `−${fmt(m.usc)}` : `+${fmt(m.ent)}`}
              </span>
            </div>
          ))}
        </Section>
      )}

      {/* Ultimi movimenti */}
      <Section title="Ultimi movimenti">
        {movimenti
          .sort((a,b) => parseDate(b.data) - parseDate(a.data))
          .slice(0,5)
          .map(m => <MovRow key={m.id} m={m} compact />)
        }
      </Section>
    </div>
  );
}

// ─── MOVIMENTI ───────────────────────────────────────────────
function Movimenti({ filtered, filterCat, setFilterCat, filterMese, setFilterMese, onEdit, onDelete }) {
  const mesi = ["Tutti","0","1","2","3","4","5","6","7","8","9","10","11"];
  const mesiLabel = ["Tutti","Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov"];

  return (
    <div style={S.page}>
      {/* Filtri */}
      <div style={S.filterBar}>
        <ScrollPills
          items={["Tutte",...CATS]}
          selected={filterCat}
          onSelect={setFilterCat}
        />
        <div style={{height:8}} />
        <ScrollPills
          items={mesi}
          labels={mesiLabel}
          selected={filterMese}
          onSelect={setFilterMese}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={S.empty}>
          <p style={{fontSize:32,margin:0}}>◈</p>
          <p style={{fontSize:15,fontWeight:600,margin:"8px 0 4px"}}>Nessun movimento</p>
          <p style={{fontSize:13,color:"#888",margin:0}}>Premi "＋ Nuovo" per aggiungere</p>
        </div>
      ) : (
        <div>
          {filtered.map(m => (
            <MovRow key={m.id} m={m} onEdit={() => onEdit(m)} onDelete={() => onDelete(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RIEPILOGO ───────────────────────────────────────────────
function Riepilogo({ movimenti }) {
  const totEnt = movimenti.reduce((s,m) => s+(m.ent||0),0);
  const totUsc = movimenti.reduce((s,m) => s+(m.usc||0),0);
  const saldo  = totEnt - totUsc;

  const byMonth = Array.from({length:12},(_,i) => {
    const ms = movimenti.filter(m => parseDate(m.data).getMonth() === i);
    return {
      mese: monthLabel(i),
      ent: ms.reduce((s,m) => s+(m.ent||0),0),
      usc: ms.reduce((s,m) => s+(m.usc||0),0),
    };
  }).filter(d => d.ent > 0 || d.usc > 0);

  const byCat = CATS.map(cat => {
    const ms = movimenti.filter(m => m.cat === cat);
    return { cat, ent: ms.reduce((s,m) => s+(m.ent||0),0), usc: ms.reduce((s,m) => s+(m.usc||0),0) };
  }).filter(d => d.ent > 0 || d.usc > 0);

  const byMetodo = METODI.map(met => {
    const ms = movimenti.filter(m => m.met === met);
    return { met, ent: ms.reduce((s,m)=>s+(m.ent||0),0), usc: ms.reduce((s,m)=>s+(m.usc||0),0) };
  }).filter(d => d.ent > 0 || d.usc > 0);

  const byStato = STATI.map(st => ({
    stato: st,
    n: movimenti.filter(m => m.stato === st).length
  })).filter(d => d.n > 0);

  return (
    <div style={S.page}>
      {/* KPI riepilogo */}
      <Section title="Anno 2026">
        <div style={S.riepilogoKpi}>
          <RiepilogoRow label="Totale Entrate" value={fmtFull(totEnt)} />
          <RiepilogoRow label="Totale Uscite"  value={fmtFull(totUsc)} />
          <div style={S.riepilogoDivider} />
          <RiepilogoRow label="Saldo Netto" value={fmtFull(saldo)}
            bold accent={saldo>=0?"#0A0A0A":"#C0392B"} />
          <RiepilogoRow label="Movimenti totali" value={movimenti.length} />
        </div>
      </Section>

      {/* Per mese */}
      <Section title="Per mese">
        {byMonth.map(d => (
          <div key={d.mese} style={S.riepilogoRow}>
            <span style={{fontWeight:600,fontSize:13,width:36}}
