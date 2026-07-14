import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { supabase } from "./supabaseClient";

// ── Storage ──────────────────────────────────────────────────
// localStorage = cache istantanea locale, sempre scritta.
// Supabase (se configurato via env) = fonte condivisa, sincronizzata tra dispositivi.
const TABLE = "spaziodesk_data";

async function load(key) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from(TABLE).select("value").eq("key", key).maybeSingle();
      if (!error && data) return data.value;
    } catch {}
  }
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
async function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  if (supabase) {
    try { await supabase.from(TABLE).upsert({ key, value: val, updated_at: new Date().toISOString() }); }
    catch {}
  }
}

// ── Logo ─────────────────────────────────────────────────────
const LOGO_B64 = "data:image/png;base64,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";
function Logo({ size = 28, white = false }) {
  return (
    <img src={LOGO_B64} width={size} height={size} alt="SpazioDesk"
      style={{ objectFit:"contain", filter:white?"invert(1)":"none",
               display:"block", flexShrink:0 }} />
  );
}

// ── Costanti ─────────────────────────────────────────────────
const SEED = [
  { id:1, data:"05/01/2026", desc:"Fattura 001 — Consulenza",    cat:"Ricavi",         ent:8500,  usc:0,     met:"Bonifico",    cli:"Cliente Rossi S.r.l.", stato:"Pagato",  note:"" },
  { id:2, data:"08/01/2026", desc:"Affitto uffici Gennaio",       cat:"Costi Fissi",    ent:0,     usc:2200,  met:"Bonifico",    cli:"Immobiliare Centro",   stato:"Pagato",  note:"" },
  { id:3, data:"12/01/2026", desc:"Fattura 002 — Licenza SW",     cat:"Ricavi",         ent:3200,  usc:0,     met:"Carta cred.", cli:"Tech Solutions SpA",  stato:"Pagato",  note:"" },
  { id:4, data:"15/01/2026", desc:"Stipendi Gennaio",             cat:"Costi Fissi",    ent:0,     usc:12500, met:"Bonifico",    cli:"Dipendenti",           stato:"Pagato",  note:"5 collab." },
  { id:5, data:"20/01/2026", desc:"Utenze — Luce e Gas",          cat:"Costi Fissi",    ent:0,     usc:380,   met:"Addebito",    cli:"Enel Energia",         stato:"Scaduto", note:"" },
  { id:6, data:"03/02/2026", desc:"Fattura 003 — Progetto Alpha", cat:"Ricavi",         ent:11700, usc:0,     met:"Bonifico",    cli:"Alpha Corp",           stato:"Pagato",  note:"" },
  { id:7, data:"14/02/2026", desc:"Affitto uffici Febbraio",      cat:"Costi Fissi",    ent:0,     usc:2200,  met:"Bonifico",    cli:"Immobiliare Centro",   stato:"Pagato",  note:"" },
  { id:8, data:"28/02/2026", desc:"Marketing Google Ads",         cat:"Costi Variabili",ent:0,     usc:950,   met:"Carta cred.", cli:"Google",               stato:"Pagato",  note:"" },
];
const CATS   = ["Ricavi","Costi Fissi","Costi Variabili","Investimenti","Tasse & Imposte","Altro"];
const METODI = ["Bonifico","Carta cred.","Contanti","Assegno","RID/SDD","PayPal","Addebito","POS"];
const STATI  = ["Pagato","In attesa","Parziale","Annullato","Scaduto"];
const MESI   = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];

function fmt(n) {
  if (!n) return "—";
  return new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
}
function fmtFull(n) {
  return new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(n||0);
}
function parseDate(s) {
  if (!s) return new Date(0);
  const [d,m,y] = s.split("/");
  return new Date(+y,+m-1,+d);
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  const [movimenti, setMovimenti] = useState([]);
  const [tab, setTab]             = useState("dashboard");
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [filterCat, setFilterCat] = useState("Tutte");
  const [filterMese, setFilterMese] = useState("Tutti");
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [members, setMembers]     = useState([]);
  const EMPTY = { data:"",desc:"",cat:"Ricavi",ent:"",usc:"",
                  met:"Bonifico",cli:"",stato:"Pagato",note:"" };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    (async () => {
      const stored = await load("spazidesk_v3");
      setMovimenti(stored || SEED);
      const storedMembers = await load("spazidesk_members_v1");
      setMembers(storedMembers || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) save("spazidesk_v3", movimenti);
  }, [movimenti, loading]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("spaziodesk_data_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "spaziodesk_data" }, ({ new: row }) => {
        if (!row) return;
        if (row.key === "spazidesk_v3") {
          setMovimenti(prev => JSON.stringify(prev) === JSON.stringify(row.value) ? prev : row.value);
        }
        if (row.key === "spazidesk_members_v1") {
          setMembers(prev => JSON.stringify(prev) === JSON.stringify(row.value) ? prev : row.value);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!loading) save("spazidesk_members_v1", members);
  }, [members, loading]);

  const totalEnt = movimenti.reduce((s,m)=>s+(m.ent||0),0);
  const totalUsc = movimenti.reduce((s,m)=>s+(m.usc||0),0);
  const saldo    = totalEnt - totalUsc;

  const monthlyData = MESI.map((name,i)=>{
    const ms = movimenti.filter(m=>parseDate(m.data).getMonth()===i);
    return { name, ent:ms.reduce((s,m)=>s+(m.ent||0),0), usc:ms.reduce((s,m)=>s+(m.usc||0),0) };
  }).filter(d=>d.ent>0||d.usc>0);

  const catData = CATS.map(cat=>({
    name:cat, val:movimenti.filter(m=>m.cat===cat).reduce((s,m)=>s+(m.usc||0),0)
  })).filter(d=>d.val>0).sort((a,b)=>b.val-a.val);

  const filtered = movimenti
    .filter(m=>filterCat==="Tutte"||m.cat===filterCat)
    .filter(m=>filterMese==="Tutti"||parseDate(m.data).getMonth()===parseInt(filterMese))
    .sort((a,b)=>parseDate(b.data)-parseDate(a.data));

  function openNew()   { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(m) { setForm({...m,ent:m.ent||"",usc:m.usc||""}); setEditId(m.id); setShowForm(true); }
  function submitForm() {
    if (!form.data||!form.desc) return;
    const entry = {...form,id:editId||Date.now(),ent:parseFloat(form.ent)||0,usc:parseFloat(form.usc)||0};
    setMovimenti(prev=>editId?prev.map(m=>m.id===editId?entry:m):[...prev,entry]);
    setShowForm(false); setToast(true); setTimeout(()=>setToast(false),2000);
  }
  function confirmDelete(id){ setMovimenti(prev=>prev.filter(m=>m.id!==id)); setDeleteId(null); }

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      height:"100vh",background:"#0A0A0A",width:"100%"}}>
      <Logo size={48} white />
    </div>
  );

  return (
    <div style={S.root}>
      {/* HEADER */}
      <header style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0,flex:1}}>
          <Logo size={26} white />
          <span style={S.brand}>SPAZIO DESK</span>
        </div>
        <button style={S.addBtn} onClick={openNew}>＋ Nuovo</button>
      </header>

      {/* MAIN */}
      <main style={S.main}>
        {tab==="dashboard" &&
          <Dashboard totalEnt={totalEnt} totalUsc={totalUsc} saldo={saldo}
            n={movimenti.length} monthlyData={monthlyData} catData={catData}
            movimenti={movimenti} />}
        {tab==="movimenti" &&
          <Movimenti filtered={filtered} filterCat={filterCat} setFilterCat={setFilterCat}
            filterMese={filterMese} setFilterMese={setFilterMese}
            onEdit={openEdit} onDelete={id=>setDeleteId(id)} />}
        {tab==="soci" &&
          <Soci totalEnt={totalEnt} members={members} setMembers={setMembers} />}
        {tab==="riepilogo" &&
          <Riepilogo movimenti={movimenti} totalEnt={totalEnt}
            totalUsc={totalUsc} saldo={saldo} />}
      </main>

      {/* NAV */}
      <nav style={S.nav}>
        {[{id:"dashboard",icon:"◈",label:"Dashboard"},
          {id:"movimenti", icon:"☰",label:"Movimenti"},
          {id:"soci",      icon:"%",label:"Soci"},
          {id:"riepilogo", icon:"▦",label:"Riepilogo"}]
        .map(t=>(
          <button key={t.id}
            style={{...S.navBtn,...(tab===t.id?S.navOn:{})}}
            onClick={()=>setTab(t.id)}>
            <span style={{fontSize:20,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.04em",marginTop:2}}>{t.label}</span>
          </button>
        ))}
      </nav>

      {showForm &&
        <FormDrawer form={form} setForm={setForm} onSubmit={submitForm}
          onClose={()=>setShowForm(false)} isEdit={!!editId} />}

      {deleteId && (
        <div style={S.overlay}>
          <div style={S.sheet}>
            <p style={{fontWeight:700,fontSize:15,margin:"0 0 6px"}}>Eliminare questo movimento?</p>
            <p style={{color:"#666",fontSize:13,margin:"0 0 20px"}}>Non è reversibile.</p>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btnGray,flex:1}} onClick={()=>setDeleteId(null)}>Annulla</button>
              <button style={{...S.btnDanger,flex:1}} onClick={()=>confirmDelete(deleteId)}>Elimina</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={S.toast}>✓ Salvato</div>}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ totalEnt, totalUsc, saldo, n, monthlyData, catData, movimenti }) {
  const alerts = movimenti.filter(m=>m.stato==="Scaduto"||m.stato==="In attesa");
  const recent = [...movimenti].sort((a,b)=>parseDate(b.data)-parseDate(a.data)).slice(0,5);

  return (
    <div style={S.page}>
      {/* KPI — 4 card compatte su 2 righe */}
      <div style={S.kpiGrid}>
        <Kpi label="Entrate"    value={fmt(totalEnt)} />
        <Kpi label="Uscite"     value={fmt(totalUsc)} />
        <Kpi label="Saldo netto" value={fmt(saldo)} danger={saldo<0} />
        <Kpi label="Movimenti"  value={String(n)} />
      </div>

      {monthlyData.length>0 && (
        <Card title="Andamento mensile">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthlyData} margin={{top:4,right:4,left:-28,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
              <XAxis dataKey="name" tick={{fontSize:9,fill:"#888"}} />
              <YAxis tick={{fontSize:9,fill:"#888"}}
                tickFormatter={v=>v>=1000?`${Math.round(v/1000)}k`:v} />
              <Tooltip formatter={(v,nm)=>[fmtFull(v),nm==="ent"?"Entrate":"Uscite"]}
                contentStyle={{fontSize:11,borderRadius:8,border:"1px solid #E5E5E5"}} />
              <Line type="monotone" dataKey="ent" stroke="#0A0A0A"
                strokeWidth={2} dot={{r:3}} name="ent" />
              <Line type="monotone" dataKey="usc" stroke="#AAAAAA"
                strokeWidth={2} strokeDasharray="4 2" dot={{r:3}} name="usc" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:6}}>
            <span style={S.leg}><i style={{...S.legDot,background:"#0A0A0A"}}/>Entrate</span>
            <span style={S.leg}><i style={{...S.legDot,background:"#AAAAAA"}}/>Uscite</span>
          </div>
        </Card>
      )}

      {catData.length>0 && (
        <Card title="Uscite per categoria">
          <ResponsiveContainer width="100%" height={Math.max(catData.length*34+8,80)}>
            <BarChart data={catData} layout="vertical"
              margin={{top:0,right:4,left:0,bottom:0}}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name"
                tick={{fontSize:10,fill:"#555"}} width={108} />
              <Tooltip formatter={v=>fmtFull(v)}
                contentStyle={{fontSize:11,borderRadius:8,border:"1px solid #E5E5E5"}} />
              <Bar dataKey="val" radius={[0,4,4,0]}>
                {catData.map((_,i)=>(
                  <Cell key={i}
                    fill={["#0A0A0A","#333","#555","#888","#AAA"][Math.min(i,4)]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {alerts.length>0 && (
        <Card title="⚠ Richiedono attenzione">
          {alerts.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",
              padding:"9px 0",borderBottom:"1px solid #F0F0F0",gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:600,margin:0,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.desc}</p>
                <p style={{fontSize:11,color:"#888",margin:"2px 0 0"}}>{m.data} · {m.stato}</p>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:"#C0392B",
                whiteSpace:"nowrap",flexShrink:0}}>
                {m.usc?`−${fmt(m.usc)}`:`+${fmt(m.ent)}`}
              </span>
            </div>
          ))}
        </Card>
      )}

      <Card title="Ultimi movimenti">
        {recent.map(m=><MovRow key={m.id} m={m} compact />)}
      </Card>
    </div>
  );
}

// ── MOVIMENTI ─────────────────────────────────────────────────
function Movimenti({ filtered, filterCat, setFilterCat, filterMese, setFilterMese, onEdit, onDelete }) {
  return (
    <div style={S.page}>
      <div style={S.filterBox}>
        <Pills items={["Tutte",...CATS]} selected={filterCat} onSelect={setFilterCat} />
        <div style={{height:8}}/>
        <Pills items={["Tutti","0","1","2","3","4","5","6","7","8","9","10","11"]}
          labels={["Tutti",...MESI]} selected={filterMese} onSelect={setFilterMese} />
      </div>
      {filtered.length===0
        ? <div style={S.empty}>
            <p style={{fontSize:32,margin:0}}>◈</p>
            <p style={{fontSize:15,fontWeight:600,margin:"8px 0 4px"}}>Nessun movimento</p>
            <p style={{fontSize:13,color:"#888",margin:0}}>Premi ＋ Nuovo per aggiungere</p>
          </div>
        : filtered.map(m=>(
            <MovRow key={m.id} m={m}
              onEdit={()=>onEdit(m)} onDelete={()=>onDelete(m.id)} />
          ))
      }
    </div>
  );
}

// ── RIEPILOGO ─────────────────────────────────────────────────
function Riepilogo({ movimenti, totalEnt, totalUsc, saldo }) {
  const byMonth = MESI.map((name,i)=>{
    const ms = movimenti.filter(m=>parseDate(m.data).getMonth()===i);
    return { name, ent:ms.reduce((s,m)=>s+(m.ent||0),0), usc:ms.reduce((s,m)=>s+(m.usc||0),0) };
  }).filter(d=>d.ent>0||d.usc>0);
  const maxEnt = Math.max(...byMonth.map(d=>d.ent),1);
  const maxUsc = Math.max(...byMonth.map(d=>d.usc),1);

  const byCat = CATS.map(cat=>{
    const ms = movimenti.filter(m=>m.cat===cat);
    return { cat, ent:ms.reduce((s,m)=>s+(m.ent||0),0), usc:ms.reduce((s,m)=>s+(m.usc||0),0) };
  }).filter(d=>d.ent>0||d.usc>0);

  const byStato = STATI.map(st=>({st,n:movimenti.filter(m=>m.stato===st).length}))
    .filter(d=>d.n>0);
  const sc = {Pagato:"#0A0A0A","In attesa":"#555",Parziale:"#777",Annullato:"#999",Scaduto:"#C0392B"};

  return (
    <div style={S.page}>
      <Card title="Anno 2026">
        {[["Totale Entrate",fmtFull(totalEnt),false,"#0A0A0A"],
          ["Totale Uscite", fmtFull(totalUsc),false,"#555"],
          ["Saldo Netto",   fmtFull(saldo),   true, saldo>=0?"#0A0A0A":"#C0392B"],
          ["N° Movimenti",  movimenti.length, false,"#0A0A0A"],
        ].map(([label,val,bold,color])=>(
          <div key={label} style={S.rieRow}>
            <span style={{fontSize:13,color:"#555"}}>{label}</span>
            <span style={{fontSize:13,fontWeight:bold?800:500,color,
              textAlign:"right"}}>{val}</span>
          </div>
        ))}
      </Card>

      <Card title="Per mese">
        {byMonth.map(d=>(
          <div key={d.name} style={{display:"flex",alignItems:"center",
            gap:8,padding:"7px 0",borderBottom:"1px solid #F5F5F5"}}>
            <span style={{fontWeight:700,fontSize:12,width:26,flexShrink:0}}>{d.name}</span>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:3,minWidth:0}}>
              {d.ent>0 && <div style={{height:5,background:"#F0F0F0",borderRadius:3}}>
                <div style={{height:"100%",background:"#0A0A0A",borderRadius:3,
                  width:`${(d.ent/maxEnt)*100}%`}}/></div>}
              {d.usc>0 && <div style={{height:5,background:"#F0F0F0",borderRadius:3}}>
                <div style={{height:"100%",background:"#BBBBBB",borderRadius:3,
                  width:`${(d.usc/maxUsc)*100}%`}}/></div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0,minWidth:56}}>
              {d.ent>0&&<div style={{fontSize:11,fontWeight:700}}>{fmt(d.ent)}</div>}
              {d.usc>0&&<div style={{fontSize:11,color:"#888"}}>−{fmt(d.usc)}</div>}
            </div>
          </div>
        ))}
      </Card>

      <Card title="Per categoria">
        {byCat.map(d=>(
          <div key={d.cat} style={S.rieRow}>
            <span style={{fontSize:13,color:"#555",flex:1,overflow:"hidden",
              textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8}}>{d.cat}</span>
            <div style={{textAlign:"right",flexShrink:0}}>
              {d.ent>0&&<div style={{fontSize:12,fontWeight:600}}>{fmt(d.ent)}</div>}
              {d.usc>0&&<div style={{fontSize:12,color:"#888"}}>−{fmt(d.usc)}</div>}
            </div>
          </div>
        ))}
      </Card>

      <Card title="Stato pagamenti">
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {byStato.map(({st,n})=>(
            <span key={st} style={{padding:"6px 14px",borderRadius:20,fontSize:12,
              fontWeight:600,color:"#fff",background:sc[st]||"#888"}}>
              {st} ({n})
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── SOCI ─────────────────────────────────────────────────────
const SOCI = [
  { nome:"Dan",           quota:0.30 },
  { nome:"Alberto Lauria",quota:0.30 },
];
const RIPARTIZIONE = [
  { label:"Studio & Attrezzatura", quota:0.30 },
  { label:"Imprevisti",            quota:0.10 },
];

function Soci({ totalEnt, members, setMembers }) {
  const [nome, setNome]         = useState("");
  const [fissa, setFissa]       = useState("");
  const [imponibile, setImponibile] = useState("");

  function addMember() {
    if (!nome) return;
    setMembers(prev=>[...prev,{ id:Date.now(), nome,
      fissa:parseFloat(fissa)||0, imponibile:parseFloat(imponibile)||0 }]);
    setNome(""); setFissa(""); setImponibile("");
  }
  function removeMember(id) { setMembers(prev=>prev.filter(m=>m.id!==id)); }

  const totMembri = members.reduce((s,m)=>s+m.fissa+m.imponibile,0);

  return (
    <div style={S.page}>
      <Card title="Ripartizione ricavi">
        <div style={S.rieRow}>
          <span style={{fontSize:13,color:"#555"}}>Totale Entrate</span>
          <span style={{fontSize:13,fontWeight:800}}>{fmtFull(totalEnt)}</span>
        </div>
        {SOCI.map(s=>(
          <div key={s.nome} style={S.rieRow}>
            <span style={{fontSize:13,color:"#555"}}>{s.nome} · {Math.round(s.quota*100)}%</span>
            <span style={{fontSize:13,fontWeight:600}}>{fmtFull(totalEnt*s.quota)}</span>
          </div>
        ))}
        {RIPARTIZIONE.map(r=>(
          <div key={r.label} style={S.rieRow}>
            <span style={{fontSize:13,color:"#555"}}>{r.label} · {Math.round(r.quota*100)}%</span>
            <span style={{fontSize:13,fontWeight:600}}>{fmtFull(totalEnt*r.quota)}</span>
          </div>
        ))}
      </Card>

      <Card title="Membri occasionali">
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          <input style={S.input} placeholder="Nome collaboratore"
            value={nome} onChange={e=>setNome(e.target.value)}/>
          <div style={{display:"flex",gap:8}}>
            <input style={S.input} type="number" placeholder="Cifra fissa €"
              value={fissa} onChange={e=>setFissa(e.target.value)}/>
            <input style={S.input} type="number" placeholder="Imponibile €"
              value={imponibile} onChange={e=>setImponibile(e.target.value)}/>
          </div>
          <button style={{...S.btnBlack,opacity:nome?1:0.4,
            cursor:nome?"pointer":"not-allowed"}}
            onClick={nome?addMember:undefined}>＋ Aggiungi collaboratore</button>
        </div>

        {members.length===0
          ? <p style={{fontSize:13,color:"#888",margin:0}}>Nessun collaboratore aggiunto</p>
          : members.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,
              padding:"9px 0",borderBottom:"1px solid #F0F0F0"}}>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:600,margin:0,whiteSpace:"nowrap",
                  overflow:"hidden",textOverflow:"ellipsis"}}>{m.nome}</p>
                <p style={{fontSize:11,color:"#888",margin:"2px 0 0"}}>
                  Fissa {fmt(m.fissa)} · Imponibile {fmt(m.imponibile)}</p>
              </div>
              <span style={{fontSize:13,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>
                {fmt(m.fissa+m.imponibile)}
              </span>
              <button style={{background:"none",border:"none",color:"#CCC",
                cursor:"pointer",fontSize:12,padding:"3px 5px",flexShrink:0}}
                onClick={()=>removeMember(m.id)}>✕</button>
            </div>
          ))}

        {members.length>0 && (
          <div style={{...S.rieRow,borderBottom:"none",marginTop:4}}>
            <span style={{fontSize:13,fontWeight:700}}>Totale versato</span>
            <span style={{fontSize:13,fontWeight:800}}>{fmtFull(totMembri)}</span>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── FORM ─────────────────────────────────────────────────────
function FormDrawer({ form, setForm, onSubmit, onClose, isEdit }) {
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const valid = form.data && form.desc;
  return (
    <div style={S.overlay}>
      <div style={S.drawer}>
        <div style={{width:40,height:4,background:"#DDD",borderRadius:2,
          margin:"12px auto 0",flexShrink:0}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"12px 16px 8px",flexShrink:0}}>
          <span style={{fontWeight:700,fontSize:15}}>{isEdit?"Modifica":"Nuovo movimento"}</span>
          <button onClick={onClose} style={{background:"none",border:"none",
            fontSize:18,color:"#888",cursor:"pointer",padding:4}}>✕</button>
        </div>
        <div style={{overflowY:"auto",padding:"4px 16px 0",flex:1}}>
          <Fld label="Data *">
            <input style={S.input} type="date"
              value={form.data?form.data.split("/").reverse().join("-"):""}
              onChange={e=>{const[y,m,d]=e.target.value.split("-");
                if(y&&m&&d)f("data",`${d}/${m}/${y}`);}}/>
          </Fld>
          <Fld label="Descrizione *">
            <input style={S.input} placeholder="Es. Fattura cliente..."
              value={form.desc} onChange={e=>f("desc",e.target.value)}/>
          </Fld>
          <div style={{display:"flex",gap:8}}>
            <Fld label="Entrata €" style={{flex:1}}>
              <input style={S.input} type="number" placeholder="0.00"
                value={form.ent} onChange={e=>f("ent",e.target.value)}/>
            </Fld>
            <Fld label="Uscita €" style={{flex:1}}>
              <input style={S.input} type="number" placeholder="0.00"
                value={form.usc} onChange={e=>f("usc",e.target.value)}/>
            </Fld>
          </div>
          {[["Categoria","cat",CATS],
            ["Metodo pag.","met",METODI],["Stato","stato",STATI]].map(([label,key,opts])=>(
            <Fld key={key} label={label}>
              <select style={S.input} value={form[key]} onChange={e=>f(key,e.target.value)}>
                {opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </Fld>
          ))}
          <Fld label="Fornitore / Cliente">
            <input style={S.input} placeholder="Nome..." value={form.cli}
              onChange={e=>f("cli",e.target.value)}/>
          </Fld>
          <Fld label="Note">
            <input style={S.input} placeholder="Opzionale..." value={form.note}
              onChange={e=>f("note",e.target.value)}/>
          </Fld>
          <div style={{height:8}}/>
        </div>
        <div style={{display:"flex",gap:8,padding:"12px 16px",
          borderTop:"1px solid #F0F0F0",flexShrink:0}}>
          <button style={{...S.btnGray,flex:1}} onClick={onClose}>Annulla</button>
          <button style={{...S.btnBlack,flex:2,opacity:valid?1:0.4,
            cursor:valid?"pointer":"not-allowed"}}
            onClick={valid?onSubmit:undefined}>
            {isEdit?"Salva modifiche":"Registra"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTS ────────────────────────────────────────────────
function Kpi({ label, value, danger }) {
  return (
    <div style={{background:"#fff",borderRadius:12,padding:"12px 14px",
      border:"1.5px solid #E8E8E8",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
      minWidth:0,overflow:"hidden"}}>
      <p style={{fontSize:9,fontWeight:700,color:"#888",margin:"0 0 4px",
        textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</p>
      <p style={{fontSize:16,fontWeight:800,margin:0,letterSpacing:"-0.01em",
        color:danger?"#C0392B":"#0A0A0A",
        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{background:"#fff",borderRadius:14,padding:"14px",marginBottom:12,
      boxShadow:"0 1px 3px rgba(0,0,0,0.04)",border:"1px solid #EBEBEB",
      width:"100%",overflow:"hidden"}}>
      <h3 style={{fontSize:9,fontWeight:700,color:"#888",textTransform:"uppercase",
        letterSpacing:"0.08em",margin:"0 0 10px"}}>{title}</h3>
      {children}
    </div>
  );
}

function MovRow({ m, compact, onEdit, onDelete }) {
  const isEnt = (m.ent||0)>0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0",
      borderBottom:"1px solid #F0F0F0",cursor:onEdit?"pointer":"default",
      width:"100%",overflow:"hidden"}}
      onClick={onEdit}>
      <div style={{width:7,height:7,borderRadius:"50%",flexShrink:0,
        background:isEnt?"#0A0A0A":"#BBBBBB"}}/>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontSize:13,fontWeight:600,margin:0,whiteSpace:"nowrap",
          overflow:"hidden",textOverflow:"ellipsis"}}>{m.desc}</p>
        {!compact
          ? <p style={{fontSize:11,color:"#888",margin:"2px 0 0",whiteSpace:"nowrap",
              overflow:"hidden",textOverflow:"ellipsis"}}>
              {m.data} · {m.cat} · {m.stato}</p>
          : <p style={{fontSize:11,color:"#888",margin:"2px 0 0"}}>{m.data}</p>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
        <span style={{fontSize:13,fontWeight:700,color:"#0A0A0A",whiteSpace:"nowrap"}}>
          {isEnt?"+":"−"}{fmt(isEnt?m.ent:m.usc)}
        </span>
        {onDelete && (
          <button style={{background:"none",border:"none",color:"#CCC",
            cursor:"pointer",fontSize:12,padding:"3px 5px",flexShrink:0}}
            onClick={e=>{e.stopPropagation();onDelete();}}>✕</button>
        )}
      </div>
    </div>
  );
}

function Pills({ items, labels, selected, onSelect }) {
  return (
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,
      scrollbarWidth:"none",msOverflowStyle:"none",width:"100%"}}>
      {items.map((item,i)=>(
        <button key={item} onClick={()=>onSelect(item)} style={{
          padding:"5px 11px",borderRadius:20,border:"1.5px solid",
          borderColor:selected===item?"#0A0A0A":"#E0E0E0",
          background:selected===item?"#0A0A0A":"#fff",
          color:selected===item?"#fff":"#555",
          fontSize:12,fontWeight:600,whiteSpace:"nowrap",
          cursor:"pointer",flexShrink:0,
        }}>{labels?labels[i]:item}</button>
      ))}
    </div>
  );
}

function Fld({ label, children, style:st }) {
  return (
    <div style={{marginBottom:12,...st}}>
      <label style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",
        letterSpacing:"0.06em",display:"block",marginBottom:4}}>{label}</label>
      {children}
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────
const S = {
  // root: occupa ESATTAMENTE 100% della viewport, mai più
  root: {
    width:"100%", maxWidth:"100%",
    overflowX:"hidden",
    minHeight:"100vh",
    display:"flex", flexDirection:"column",
    background:"#F4F4F4",
    fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  },
  header: {
    background:"#0A0A0A",
    padding:"12px 16px",
    display:"flex", justifyContent:"space-between", alignItems:"center",
    position:"sticky", top:0, zIndex:100,
    width:"100%", flexShrink:0,
  },
  brand:  { color:"#fff",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",
            fontWeight:700,fontSize:14,letterSpacing:"-0.04em",
            whiteSpace:"nowrap" },
  addBtn: { background:"#fff",color:"#0A0A0A",border:"none",
            padding:"7px 14px",borderRadius:20,fontSize:13,fontWeight:700,
            cursor:"pointer",flexShrink:0,whiteSpace:"nowrap" },
  main:   { flex:1, overflowY:"auto", overflowX:"hidden",
            paddingBottom:72, width:"100%" },
  page:   { padding:"12px 12px 0", width:"100%" },
  // 4 KPI in griglia 2x2 simmetrica
  kpiGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:8, marginBottom:12, width:"100%" },
  nav:    { position:"fixed", bottom:0, left:0, right:0,
            background:"#fff", borderTop:"1px solid #E5E5E5",
            display:"flex", zIndex:100, width:"100%" },
  navBtn: { flex:1,background:"none",borderLeft:"none",borderRight:"none",
            borderBottom:"none",
            borderTopWidth:"2.5px",borderTopStyle:"solid",borderTopColor:"transparent",
            padding:"10px 0 8px",
            cursor:"pointer",display:"flex",flexDirection:"column",
            alignItems:"center",gap:2,color:"#888" },
  navOn:  { borderTopColor:"#0A0A0A",color:"#0A0A0A" },
  overlay:{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",
            zIndex:200,display:"flex",alignItems:"flex-end" },
  drawer: { background:"#fff",borderRadius:"20px 20px 0 0",
            width:"100%",maxHeight:"92vh",
            display:"flex",flexDirection:"column" },
  sheet:  { background:"#fff",borderRadius:"20px 20px 0 0",
            padding:"24px 16px",width:"100%" },
  input:  { width:"100%",padding:"11px 12px",border:"1.5px solid #E0E0E0",
            borderRadius:10,fontSize:14,background:"#FAFAFA",
            boxSizing:"border-box",outline:"none",fontFamily:"inherit" },
  btnBlack:{ background:"#0A0A0A",color:"#fff",border:"none",
             padding:"13px 16px",borderRadius:12,fontSize:14,
             fontWeight:700,cursor:"pointer" },
  btnGray: { background:"#F0F0F0",color:"#0A0A0A",border:"none",
             padding:"13px 16px",borderRadius:12,fontSize:14,
             fontWeight:600,cursor:"pointer" },
  btnDanger:{ background:"#C0392B",color:"#fff",border:"none",
              padding:"12px 16px",borderRadius:12,fontSize:14,
              fontWeight:700,cursor:"pointer" },
  toast:  { position:"fixed",bottom:88,left:"50%",
            transform:"translateX(-50%)",background:"#0A0A0A",
            color:"#fff",padding:"10px 22px",borderRadius:24,
            fontSize:14,fontWeight:600,zIndex:300,whiteSpace:"nowrap" },
  empty:  { textAlign:"center",padding:"56px 16px",background:"#fff",
            borderRadius:14,marginBottom:12 },
  filterBox:{ background:"#fff",borderRadius:14,padding:"10px 12px",
              marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
              width:"100%",overflow:"hidden" },
  rieRow: { display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"9px 0",borderBottom:"1px solid #F5F5F5",gap:8 },
  leg:    { fontSize:11,display:"flex",alignItems:"center",gap:5 },
  legDot: { width:10,height:3,borderRadius:2,display:"inline-block",
            fontStyle:"normal" },
};
