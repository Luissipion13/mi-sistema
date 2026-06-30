import { useState, useEffect, useCallback } from "react";

// ============================================================
// SISTEMA DE GESTIÓN DE CONTRATACIONES — ITP RED CITE
// ============================================================

const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3001/api" 
  : "https://victory-pogo-sash.ngrok-free.dev/api";

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("sgc_token");
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en la petición");
  return data;
};

// --- COMPONENTS ---
const Logo = () => (
  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
    <div style={{ fontFamily:"'Segoe UI',sans-serif", fontWeight:800, fontSize:18, color:"#c0392b", letterSpacing:1 }}>CONTRATACIÓN</div>
    <div style={{ borderLeft:"2px solid #ddd", paddingLeft:12, display:"flex", alignItems:"center", gap:6 }}>
      <span style={{ fontWeight:800, fontSize:20, color:"#c0392b" }}>ITP</span>
      <div style={{ fontSize:9, lineHeight:1.2, color:"#555" }}>
        <div style={{ color:"#c0392b", fontWeight:700, fontSize:8 }}>red CITE</div>
        <div>Instituto Tecnológico</div>
        <div>de la Producción</div>
      </div>
    </div>
  </div>
);

const Sidebar = ({ activeMenu, setActiveMenu, expandedMenus, toggleMenu }) => {
  const menuItems = [
    { key:"inicio", label:"Inicio", icon:"🏠", sub:[] },
    { key:"contratoMenor", label:"Contrato Menor", icon:"📋", sub:[
      { key:"actuaciones", label:"Actuaciones Contractuales" },
      { key:"conformidades", label:"Conformidades" },
      { key:"pagos", label:"Pagos" },
      { key:"constancias", label:"Constancia de Orden" },
    ]},
    { key:"procedimientos", label:"Procedimientos de Selección", icon:"⚙️", sub:[
      { key:"contratos", label:"Contratos" },
      { key:"cronogramas", label:"Cronogramas" },
    ]},
    { key:"reportes", label:"Reportes", icon:"📊", sub:[
      { key:"repOrdenes", label:"Órdenes" },
      { key:"repConformidades", label:"Conformidades" },
    ]},
    { key:"mantenimiento", label:"Mantenimiento", icon:"🔧", sub:[
      { key:"usuarios", label:"Usuarios" },
      { key:"parametros", label:"Parámetros" },
    ]},
  ];
  return (
    <div style={{ width:190, minHeight:"100vh", background:"linear-gradient(180deg,#2c3e6b 0%,#34495e 100%)", color:"#fff", paddingTop:8, flexShrink:0, overflowY:"auto", boxShadow:"2px 0 12px rgba(0,0,0,0.15)" }}>
      {menuItems.map(item => (
        <div key={item.key}>
          <div onClick={() => item.sub.length ? toggleMenu(item.key) : setActiveMenu(item.key)}
            style={{ padding:"12px 18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:13.5, fontWeight:500,
              background: activeMenu === item.key || item.sub.some(s => s.key === activeMenu) ? "rgba(255,255,255,0.12)" : "transparent",
              borderLeft: activeMenu === item.key || item.sub.some(s => s.key === activeMenu) ? "3px solid #e74c3c" : "3px solid transparent", transition:"all 0.2s" }}>
            <span style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:15 }}>{item.icon}</span>{item.label}</span>
            {item.sub.length > 0 && <span style={{ fontSize:10, transition:"transform 0.2s", transform: expandedMenus[item.key] ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>}
          </div>
          {item.sub.length > 0 && expandedMenus[item.key] && (
            <div style={{ background:"rgba(0,0,0,0.15)" }}>
              {item.sub.map(sub => (
                <div key={sub.key} onClick={() => setActiveMenu(sub.key)}
                  style={{ padding:"10px 18px 10px 48px", cursor:"pointer", fontSize:12.5,
                    background: activeMenu === sub.key ? "rgba(255,255,255,0.1)" : "transparent",
                    borderLeft: activeMenu === sub.key ? "3px solid #e67e22" : "3px solid transparent", transition:"all 0.15s" }}>
                  » {sub.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, subtitle, color, onClick }) => (
  <div onClick={onClick} style={{ flex:1, minWidth:200, border:"1px solid #e0e0e0", borderRadius:6, overflow:"hidden", cursor:"pointer", transition:"box-shadow 0.2s", boxShadow:"0 2px 6px rgba(0,0,0,0.06)" }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)"}>
    <div style={{ background:color, color:"#fff", padding:"10px 16px", fontSize:11.5, fontWeight:700, textAlign:"center", letterSpacing:0.8, textTransform:"uppercase" }}>{title}</div>
    <div style={{ padding:"18px 16px", textAlign:"center" }}>
      <div style={{ fontSize:32, fontWeight:700, color:"#2c3e50", background:"#fff" }}>{value}</div>
      <div style={{ fontSize:12, color:"#7f8c8d", marginTop:2 }}>{subtitle}</div>
    </div>
  </div>
);

const StatsBlock = ({ title, items, color }) => (
  <div style={{ flex:1, minWidth:220, border:"1px solid #e0e0e0", borderRadius:6, overflow:"hidden" }}>
    <div style={{ background:color, color:"#fff", padding:"10px 16px", fontSize:11, fontWeight:700, textAlign:"center", letterSpacing:0.8, textTransform:"uppercase" }}>{title}</div>
    <div style={{ padding:"14px 16px" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"6px 0", borderBottom: i < items.length-1 ? "1px solid #f0f0f0" : "none" }}>
          <span style={{ fontSize:12, color:"#7f8c8d" }}>{item.label}</span>
          <span style={{ fontSize: item.bold ? 18 : 16, fontWeight:700, color: item.bold ? "#2c3e50" : "#34495e" }}>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const FilterBar = ({ filters, values, onChange, onClear }) => (
  <div style={{ background:"#f8f9fa", padding:"16px 20px", borderRadius:6, border:"1px solid #e8e8e8", marginBottom:16 }}>
    <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-end" }}>
      {filters.map((f, i) => (
        <div key={i} style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize:10.5, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", letterSpacing:0.5 }}>{f.label}</label>
          {f.type === "select" ? (
            <select value={values[f.key] || ""} onChange={e => onChange(f.key, e.target.value)}
              style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, minWidth:130 }}>
              {f.options.map((o,j) => <option key={j} value={o === "(TODOS)" ? "" : o}>{o}</option>)}
            </select>
          ) : (
            <input value={values[f.key] || ""} onChange={e => onChange(f.key, e.target.value)} placeholder={f.placeholder||""}
              style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, width: f.width || 120 }} />
          )}
        </div>
      ))}
      <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
        <button onClick={onClear} style={{ padding:"8px 18px", background:"#fff", color:"#555", border:"1px solid #ccc", borderRadius:4, cursor:"pointer", fontSize:12 }}>🧹 Limpiar</button>
      </div>
    </div>
  </div>
);

const DataTable = ({ columns, data, onRowClick, actions }) => (
  <div style={{ border:"1px solid #ddd", borderRadius:6, overflow:"hidden" }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, tableLayout:"fixed" }}>
      <colgroup>
        <col style={{ width:"2%" }} />
        {columns.map((col, i) => <col key={i} style={{ width: col.width || "auto" }} />)}
        {actions && <col style={{ width:"7%" }} />}
      </colgroup>
      <thead>
        <tr style={{ background:"linear-gradient(180deg,#ecf0f1,#dfe6e9)" }}>
          <th style={{ padding:"10px 6px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign:"center" }}>#</th>
          {columns.map((col, i) => (
            <th key={i} style={{ padding:"10px 6px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign: col.align || "left", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{col.label}</th>
          ))}
          {actions && <th style={{ padding:"10px 6px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign:"center" }}>ACCIONES</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => {
          const bgBase = row.estadoCrono === "conCrono" ? "#dbeafe" : row.estadoCrono === "anulado" ? "#ffebee" : idx % 2 === 0 ? "#fff" : "#f9fafb";
          return (
            <tr key={idx} onClick={() => onRowClick && onRowClick(row)}
              style={{ background: bgBase, cursor: onRowClick ? "pointer" : "default", transition:"background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#bfdbfe"}
              onMouseLeave={e => e.currentTarget.style.background = bgBase}>
              <td style={{ padding:"7px 6px", textAlign:"center", borderBottom:"1px solid #eee", color:"#7f8c8d", whiteSpace:"nowrap" }}>{idx + 1}</td>
              {columns.map((col, i) => {
                const val = col.format ? col.format(row[col.key], row) : (row[col.key] ?? "-");
                const rawVal = row[col.key];
                return (
                  <td key={i} title={typeof rawVal === "string" ? rawVal : undefined}
                    style={{ padding:"7px 6px", borderBottom:"1px solid #eee", textAlign: col.align || "left",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                      fontWeight: col.key === "monto" ? 600 : 400 }}>
                    {val}
                  </td>
                );
              })}
              {actions && (
                <td style={{ padding:"7px 6px", textAlign:"center", borderBottom:"1px solid #eee" }}>
                  <div style={{ display:"flex", gap:4, justifyContent:"center" }}>
                    {actions.map((a, ai) => (
                      <button key={ai} onClick={(e) => { e.stopPropagation(); a.onClick(row); }} title={a.label}
                        style={{ padding:"3px 7px", background:"#f0f0f0", border:"1px solid #ddd", borderRadius:3, cursor:"pointer", fontSize:13 }}>{a.icon}</button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const Modal = ({ open, onClose, title, subtitle, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:8, width:"100%", maxWidth:900, maxHeight:"85vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ background:"#2c3e6b", color:"#fff", padding:"16px 24px", borderRadius:"8px 8px 0 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:18, fontWeight:700 }}>{title}</div>
              {subtitle && <div style={{ fontSize:12, opacity:0.8, marginTop:2 }}>{subtitle}</div>}
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:18, fontWeight:700 }}>✕</button>
          </div>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
};

const Field = ({ label, value, color }) => (
  <div style={{ flex:1, minWidth:140 }}>
    <div style={{ fontSize:10, fontWeight:700, color: color || "#2c3e6b", textTransform:"uppercase", letterSpacing:0.3, marginBottom:2 }}>{label}</div>
    <div style={{ fontSize:12.5, color:"#2c3e50", background:"#f5f6fa", padding:"6px 10px", borderRadius:4, border:"1px solid #e8e8e8" }}>{value || "—"}</div>
  </div>
);

const useFilters = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const onChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }));
  const onClear = () => setValues(initialValues);
  return { values, onChange, onClear };
};

const fmt = (v) => v != null ? Number(v).toLocaleString("es-PE", { minimumFractionDigits:2, maximumFractionDigits:2 }) : "-";

// ============================================================
// PAGES
// ============================================================

const HomePage = ({ setActiveMenu }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("es-PE", { day:"2-digit", month:"2-digit", year:"numeric" });

  useEffect(() => {
    api("/dashboard").then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign:"center", padding:60, color:"#7f8c8d" }}>⏳ Cargando estadísticas...</div>;
  if (!stats) return <div style={{ textAlign:"center", padding:60, color:"#e74c3c" }}>Error al cargar estadísticas</div>;

  const { alertas: a, estadisticas: e } = stats;
  return (
    <div>
      <div style={{ fontSize:14, fontWeight:700, color:"#2c3e50", marginBottom:16 }}>
        ALERTAS AL <span style={{ color:"#e74c3c" }}>{today}</span> – Contrato Menor y Otras modalidades
      </div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:24 }}>
        <StatCard title="SIN CRONOGRAMA" value={a.sinCronograma} subtitle="Órdenes" color="#2c3e6b" onClick={()=>setActiveMenu("actuaciones")} />
        <StatCard title="VENCEN HOY" value={a.vencenHoy} subtitle="Órdenes" color="#e74c3c" onClick={()=>setActiveMenu("actuaciones")} />
        <StatCard title="VENCEN PROX. 7 DÍAS" value={a.vencen7Dias} subtitle="Órdenes" color="#e67e22" onClick={()=>setActiveMenu("actuaciones")} />
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:"#2c3e50", marginBottom:16 }}>
        ESTADÍSTICAS AL <span style={{ color:"#e74c3c" }}>{today}</span> – Contrato Menor y Otras modalidades
      </div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        <StatsBlock title="CANTIDAD A LA FECHA" color="#2c3e6b" items={[
          { label:"Orden de Compra", value: e.aLaFecha.ordenCompra.cantidad },
          { label:"Orden de Servicio", value: e.aLaFecha.ordenServicio.cantidad },
          { label:"Total", value: e.aLaFecha.total.cantidad, bold:true },
        ]} />
        <StatsBlock title="CANTIDAD DEL MES" color="#3498db" items={[
          { label:"Orden de Compra", value: e.delMes.ordenCompra.cantidad },
          { label:"Orden de Servicio", value: e.delMes.ordenServicio.cantidad },
          { label:"Total", value: e.delMes.total.cantidad, bold:true },
        ]} />
        <StatsBlock title="MONTO A LA FECHA" color="#16a085" items={[
          { label:"Orden de Compra", value: fmt(e.aLaFecha.ordenCompra.monto) },
          { label:"Orden de Servicio", value: fmt(e.aLaFecha.ordenServicio.monto) },
          { label:"Total", value: fmt(e.aLaFecha.total.monto), bold:true },
        ]} />
        <StatsBlock title="MONTO AL MES" color="#e67e22" items={[
          { label:"Orden de Compra", value: fmt(e.delMes.ordenCompra.monto) },
          { label:"Orden de Servicio", value: fmt(e.delMes.ordenServicio.monto) },
          { label:"Total", value: fmt(e.delMes.total.monto), bold:true },
        ]} />
      </div>
    </div>
  );
};

const ActuacionesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cronoOrder, setCronoOrder] = useState(null);
  const [especialistas, setEspecialistas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(35);
  const { values, onChange, onClear } = useFilters({ ano: "2026" });

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => { if (v) params.append(k, v); });
    params.append("page", page);
    params.append("limit", pageSize);
    api(`/ordenes?${params}`).then(r => {
      setData(r.data || []);
      setTotal(r.total || 0);
      setTotalPages(r.totalPages || 0);
    }).catch(console.error).finally(() => setLoading(false));
  }, [values, page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { api("/ordenes/especialistas").then(setEspecialistas).catch(() => {}); }, []);

  const handleSync = async () => {
    if (!confirm("¿Seguro de realizar la actualización automática de los registros?\nEsto puede tomar algunos minutos.\n\nIMPORTANTE: Solo se están migrando las órdenes que cuenten con Expediente SIAF aprobado en el SIGA.")) return;
    setSyncing(true); setSyncResult(null);
    try {
      const token = localStorage.getItem("sgc_token");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutos
      const res = await fetch(`${API_URL}/ordenes/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true", ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error en la petición");
      setSyncResult(result);
      setPage(1);
      fetchData();
    } catch (err) {
      if (err.name === 'AbortError') alert("El sync tardó más de 3 minutos. Verifique la consola del servidor.");
      else alert("Error al sincronizar: " + err.message);
    }
    finally { setSyncing(false); }
  };

  const handleClear = () => { onClear(); setPage(1); };
  const handleSearch = () => { setPage(1); fetchData(); };

  const columns = [
    { key:"ano",              label:"AÑO",      align:"center", width:"3%" },
    { key:"tipoBien",         label:"TIPO",     align:"center", width:"3%" },
    { key:"nOrden",           label:"N° ORDEN", align:"center", width:"9%" },
    { key:"fecha",            label:"FECHA",    align:"center", width:"7%" },
    { key:"usuarioSiga",      label:"ESPECIALISTA",             width:"10%" },
    { key:"expSiaf",          label:"EXP.SIAF", align:"center", width:"6%" },
    { key:"concepto",         label:"CONCEPTO",                 width:"18%" },
    { key:"proveedor",        label:"PROVEEDOR",                width:"15%" },
    { key:"monto",            label:"MONTO(S/)", align:"right", width:"8%", format: v => fmt(v) },
    { key:"tipoContratacion", label:"CONTRAT.", width:"9%" },
    { key:"nArmadas",         label:"ARM.",     align:"center", width:"3%", format: v => v || 0 },
  ];

  // Pagination component
  const Pagination = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 0", fontSize:12, color:"#555" }}>
      <button onClick={() => setPage(1)} disabled={page <= 1}
        style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page <= 1 ? "#f0f0f0" : "#fff", cursor: page <= 1 ? "default" : "pointer", fontSize:12 }}>⏮</button>
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
        style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page <= 1 ? "#f0f0f0" : "#fff", cursor: page <= 1 ? "default" : "pointer", fontSize:12 }}>◀</button>
      <span style={{ padding:"6px 12px" }}>
        Página <input type="number" value={page} min={1} max={totalPages}
          onChange={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= totalPages) setPage(v); }}
          style={{ width:50, textAlign:"center", border:"1px solid #ccc", borderRadius:4, padding:"4px", fontSize:12 }}
        /> de {totalPages}
      </span>
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
        style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page >= totalPages ? "#f0f0f0" : "#fff", cursor: page >= totalPages ? "default" : "pointer", fontSize:12 }}>▶</button>
      <button onClick={() => setPage(totalPages)} disabled={page >= totalPages}
        style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page >= totalPages ? "#f0f0f0" : "#fff", cursor: page >= totalPages ? "default" : "pointer", fontSize:12 }}>⏭</button>
      <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value)); setPage(1); }}
        style={{ padding:"6px 8px", border:"1px solid #ccc", borderRadius:4, fontSize:12, marginLeft:8 }}>
        <option value={20}>20</option>
        <option value={35}>35</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>
        Actuaciones Contractuales – Órdenes de Bienes y Servicios de Contratos Menores
      </h2>
      <FilterBar values={values} onChange={onChange} onClear={handleClear} filters={[
        { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
        { key:"tipoBien", label:"Tipo Bien", type:"select", options:["(TODOS)","B","S"] },
        { key:"nOrden", label:"N° Orden", type:"input", width:110 },
        { key:"concepto", label:"Concepto", type:"input", width:150 },
        { key:"proveedor", label:"Proveedor", type:"input", width:140 },
        { key:"expSiaf", label:"N° Exp. SIAF", type:"input", width:100 },
        { key:"especialista", label:"Usuario SIGA", type:"select", options:["(TODOS)", ...especialistas] },
      ]} />
      <div style={{ marginBottom:8, display:"flex", gap:16, fontSize:11.5, color:"#555", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <span>LEYENDA:</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:12, background:"#fff", border:"1px solid #ccc", display:"inline-block" }}></span> Sin Cronograma</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:12, background:"#3b82f6", display:"inline-block" }}></span> Con Cronograma</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:12, background:"#e74c3c", display:"inline-block" }}></span> Anulado</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#2c3e6b", fontWeight:600 }}>{total} registro(s)</span>
          <button onClick={handleSearch} style={{ padding:"8px 16px", background:"#2c3e6b", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:11.5, fontWeight:600 }}>🔍 Buscar</button>
          <button onClick={handleSync} disabled={syncing}
            style={{ padding:"8px 16px", background: syncing ? "#95a5a6" : "#27ae60", color:"#fff", border:"none", borderRadius:4, cursor: syncing ? "wait" : "pointer", fontSize:11.5, fontWeight:600 }}>
            {syncing ? "⏳ Sincronizando..." : "⚙️ Actualizar lista"}
          </button>
        </div>
      </div>

      {syncResult && (
        <div style={{ background:"#d4edda", border:"1px solid #c3e6cb", borderRadius:6, padding:"10px 16px", marginBottom:12, fontSize:12, color:"#155724", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span>✅ {syncResult.message} — Total SIGA: {syncResult.totalSIGA} | Insertados: {syncResult.insertados} | Actualizados: {syncResult.actualizados}</span>
          <button onClick={() => setSyncResult(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
      )}

      <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", marginBottom:8, background:"#eef2f7", padding:"8px 12px", borderRadius:4 }}>LISTADO</div>

      {loading ? (
        <div style={{ textAlign:"center", padding:40, color:"#7f8c8d" }}>⏳ Cargando órdenes...</div>
      ) : data.length > 0 ? (
        <DataTable columns={columns} data={data} onRowClick={setSelectedOrder}
          actions={[
            { icon:"📅", label:"Registrar cronograma", onClick: r => setCronoOrder(r) },
            { icon:"📋", label:"Ver detalle", onClick: r => setSelectedOrder(r) },
          ]} />
      ) : (
        <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
          No se encontraron registros. Haz clic en "Actualizar lista" para cargar desde el SIGA.
        </div>
      )}

      {data.length > 0 && <Pagination />}

      <Modal open={!!selectedOrder} onClose={()=>setSelectedOrder(null)} title="Detalles de la Orden" subtitle="Información de la orden de compra/servicio">
        {selectedOrder && (
          <div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <Field label="N° Orden" value={selectedOrder.nOrden} />
              <Field label="Año" value={selectedOrder.ano} />
              <Field label="Tipo Bien" value={selectedOrder.tipoBien === "B" ? "BIEN" : "SERVICIO"} />
              <Field label="Fecha Orden" value={selectedOrder.fecha} />
              <Field label="Monto" value={`S/ ${fmt(selectedOrder.monto)}`} />
              <Field label="RUC" value={selectedOrder.ruc} />
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <Field label="Proveedor" value={selectedOrder.proveedor} />
              <Field label="Exp. SIAF" value={selectedOrder.expSiaf} />
              <Field label="Especialista" value={selectedOrder.usuarioSiga} />
              <Field label="Estado Orden" value={selectedOrder.estadoOrden} />
            </div>
            <div style={{ marginBottom:12 }}>
              <Field label="Concepto" value={selectedOrder.concepto} />
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL CRONOGRAMA */}
      <CronogramaModal order={cronoOrder} onClose={() => setCronoOrder(null)} onSaved={() => { setCronoOrder(null); fetchData(); }} />
    </div>
  );
};

// --- CRONOGRAMA MODAL ---
const CronogramaModal = ({ order, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ordenData, setOrdenData] = useState(null);
  const [form, setForm] = useState({
    tipoContratacion: "ASP BIENES Y SERVICIOS",
    sistemaContratacion: "SUMA ALZADA",
    condicionInicio: "DÍA SIGUIENTE DE PERFECCIONADO EL CONTRATO",
    fechaPerfeccionamiento: "",
    plazo: 30,
    fechaInicio: "",
    fechaFin: "",
    totalArmadas: 1,
    armadaInicial: 1,
    tipoServicio: "SERVICIO EN GENERAL",
    tipoRegistro: "REGISTRO POR IMPORTES",
  });
  const [armadas, setArmadas] = useState([]);

  useEffect(() => {
    if (!order) return;
    setLoading(true);
    setArmadas([]);
    api(`/ordenes/${order.id}/cronograma`)
      .then(r => {
        setOrdenData(r.orden);
        if (r.armadas && r.armadas.length > 0) {
          setArmadas(r.armadas);
          setForm(f => ({
            ...f,
            tipoContratacion: r.orden.TIPO_CONTRATACION || f.tipoContratacion,
            sistemaContratacion: r.orden.SISTEMA_CONTRATACION || f.sistemaContratacion,
            condicionInicio: r.orden.CONDICION_INICIO || f.condicionInicio,
            fechaPerfeccionamiento: r.orden.FECHA_PERFECCIONAMIENTO || "",
            plazo: r.orden.PLAZO_EJECUCION || 30,
            fechaInicio: r.orden.FECHA_INICIO || "",
            fechaFin: r.orden.FECHA_FIN || "",
            totalArmadas: r.orden.TOTAL_ARMADAS || 1,
            armadaInicial: r.orden.ARMADA_INICIAL || 1,
            tipoServicio: r.orden.TIPO_SERVICIO || f.tipoServicio,
            tipoRegistro: r.orden.TIPO_REGISTRO || f.tipoRegistro,
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [order]);

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toDate = (str) => {
    if (!str) return null;
    const p = String(str).split('/');
    return p.length === 3 ? new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])) : null;
  };
  const toStr = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

  // Auto-calcular fecha fin cuando cambia fecha inicio y plazo
  useEffect(() => {
    if (form.fechaInicio && form.plazo) {
      const d = toDate(form.fechaInicio);
      if (d) { d.setDate(d.getDate() + parseInt(form.plazo) - 1); updateForm("fechaFin", toStr(d)); }
    }
  }, [form.fechaInicio, form.plazo]);

  // Generar armadas prorateadas al hacer clic en botón
  const calcularArmadas = () => {
    const n = parseInt(form.totalArmadas) || 1;
    const plazoTotal = parseInt(form.plazo) || 30;
    const plazoPorArmada = Math.floor(plazoTotal / n);
    const montoTotal = ordenData ? parseFloat(ordenData.MONTO_OS) || 0 : parseFloat(order.monto) || 0;
    const base = Math.round((montoTotal / n) * 100) / 100;
    const pctBase = Math.round((100 / n) * 100) / 100;
    const fechaBase = toDate(form.fechaInicio);
    const nuevas = [];
    for (let i = 0; i < n; i++) {
      const isLast = i === n - 1;
      const plazoArmada = isLast ? (plazoTotal - plazoPorArmada * (n - 1)) : plazoPorArmada;
      const montoArmada = isLast ? Math.round((montoTotal - base * (n - 1)) * 100) / 100 : base;
      const porcentaje = isLast ? Math.round((100 - pctBase * (n - 1)) * 100) / 100 : pctBase;
      let fi = "", ff = "";
      if (fechaBase) {
        const ini = new Date(fechaBase); ini.setDate(ini.getDate() + i * plazoPorArmada);
        const fin = new Date(ini); fin.setDate(fin.getDate() + plazoArmada - 1);
        fi = toStr(ini); ff = toStr(fin);
      }
      nuevas.push({ cuota: i + parseInt(form.armadaInicial || 1), plazo: plazoArmada, fechaInicio: fi, fechaFin: ff, porcentaje, montoArmada });
    }
    setArmadas(nuevas);
  };

  // Editar campo de una armada
  const updateArmada = (idx, key, val) => {
    setArmadas(prev => {
      const next = prev.map((a, i) => i === idx ? { ...a, [key]: val } : a);
      const montoTotal = ordenData ? parseFloat(ordenData.MONTO_OS) || 0 : parseFloat(order.monto) || 0;
      // Si cambia monto, recalcular porcentaje
      if (key === "montoArmada") {
        return next.map(a => ({ ...a, porcentaje: montoTotal > 0 ? Math.round((parseFloat(a.montoArmada) / montoTotal * 100) * 100) / 100 : 0 }));
      }
      // Si cambia porcentaje, recalcular monto
      if (key === "porcentaje") {
        return next.map(a => ({ ...a, montoArmada: Math.round((parseFloat(a.porcentaje) / 100 * montoTotal) * 100) / 100 }));
      }
      return next;
    });
  };

  const esPorPorcentaje = form.tipoRegistro === "REGISTRO POR PORCENTAJE";

  // Ajusta la última armada para que la suma cuadre exactamente con el monto/porcentaje y plazo total
  const ajustarRedondeo = () => {
    if (armadas.length === 0) return;
    const montoT = ordenData ? parseFloat(ordenData.MONTO_OS) || 0 : parseFloat(order.monto) || 0;
    const plazoT = parseInt(form.plazo) || 0;
    setArmadas(prev => {
      const next = [...prev];
      const last = next.length - 1;
      if (esPorPorcentaje) {
        const sumPctOtros = next.slice(0, last).reduce((s, a) => s + (parseFloat(a.porcentaje) || 0), 0);
        const pctAjustado = Math.round((100 - sumPctOtros) * 100) / 100;
        next[last] = { ...next[last], porcentaje: pctAjustado, montoArmada: Math.round((pctAjustado / 100 * montoT) * 100) / 100 };
      } else {
        const sumMontoOtros = next.slice(0, last).reduce((s, a) => s + (parseFloat(a.montoArmada) || 0), 0);
        const montoAjustado = Math.round((montoT - sumMontoOtros) * 100) / 100;
        next[last] = { ...next[last], montoArmada: montoAjustado, porcentaje: montoT > 0 ? Math.round((montoAjustado / montoT * 100) * 100) / 100 : 0 };
      }
      const sumPlazoOtros = next.slice(0, last).reduce((s, a) => s + (parseInt(a.plazo) || 0), 0);
      next[last] = { ...next[last], plazo: plazoT - sumPlazoOtros };
      return next;
    });
  };

  const montoTotal = ordenData ? parseFloat(ordenData.MONTO_OS) || 0 : parseFloat(order?.monto) || 0;
  const montoAsignado = armadas.reduce((s, a) => s + (parseFloat(a.montoArmada) || 0), 0);
  const saldoPendiente = Math.round((montoTotal - montoAsignado) * 100) / 100;
  const plazoAsignado = armadas.reduce((s, a) => s + (parseInt(a.plazo) || 0), 0);
  const plazoDiff = (parseInt(form.plazo) || 0) - plazoAsignado;

  const handleSave = async () => {
    if (!form.fechaPerfeccionamiento || !form.fechaInicio) {
      alert("Complete los campos obligatorios: Fecha Perfeccionamiento y Fecha Inicio");
      return;
    }
    if (armadas.length === 0) {
      alert("Debe generar las armadas antes de guardar. Haga clic en 'Generar Armadas'.");
      return;
    }
    if (Math.abs(saldoPendiente) > 0.005) {
      alert(`⚠ No se puede guardar.\n\nEl monto asignado (S/ ${fmt(montoAsignado)}) no coincide con el monto de la orden (S/ ${fmt(montoTotal)}).\nSaldo pendiente: S/ ${fmt(saldoPendiente)}\n\nAjuste los montos/porcentajes de las armadas hasta que el saldo sea S/ 0.00.`);
      return;
    }
    if (plazoDiff !== 0) {
      alert(`⚠ No se puede guardar.\n\nLa suma de los plazos de las armadas (${plazoAsignado} días) no coincide con el Plazo registrado (${form.plazo} días).\nDiferencia: ${plazoDiff} día(s).\n\nAjuste el plazo de las armadas hasta que la suma sea igual a ${form.plazo}.`);
      return;
    }
    setSaving(true);
    try {
      await api(`/ordenes/${order.id}/cronograma`, { method: "POST", body: JSON.stringify({ ...form, armadas }) });
      alert("Cronograma registrado exitosamente.");
      onSaved();
    } catch (err) { alert("Error al guardar: " + err.message); }
    finally { setSaving(false); }
  };

  if (!order) return null;

  const S = {
    label: { fontSize:10, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", display:"block", marginBottom:4 },
    input: { width:"100%", padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, boxSizing:"border-box" },
    select: { width:"100%", padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, boxSizing:"border-box" },
  };

  return (
    <Modal open={!!order} onClose={onClose} title="Registro de Cronograma" subtitle={`Orden ${order.nOrden} — ${order.tipoBien === "B" ? "BIEN" : "SERVICIO"} — S/ ${fmt(montoTotal)}`}>
      {loading ? <div style={{ textAlign:"center", padding:40 }}>⏳ Cargando datos...</div> : (
        <div>
          {/* DETALLES */}
          <div style={{ fontSize:12, fontWeight:700, color:"#2c3e6b", marginBottom:6, borderBottom:"2px solid #2c3e6b", paddingBottom:3 }}>Detalles de la orden</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16, background:"#f8f9fa", padding:10, borderRadius:6 }}>
            <Field label="Ejecutora" value="001" />
            <Field label="N° Orden" value={order.nOrden} />
            <Field label="Fecha Orden" value={order.fecha} />
            <Field label="Monto" value={`S/ ${fmt(montoTotal)}`} />
            <Field label="RUC" value={order.ruc} />
            <Field label="Proveedor" value={order.proveedor} />
            <Field label="Exp. SIAF" value={order.expSiaf} />
            <Field label="Especialista" value={order.usuarioSiga} />
            <div style={{ flex:"1 1 100%" }}><Field label="Concepto" value={order.concepto} /></div>
          </div>

          {/* DATOS DEL CRONOGRAMA */}
          <div style={{ fontSize:12, fontWeight:700, color:"#2c3e6b", marginBottom:6, borderBottom:"2px solid #2c3e6b", paddingBottom:3 }}>Datos del Cronograma</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
            <div style={{ flex:"1 1 160px" }}>
              <label style={S.label}>Tipo Contratación (*)</label>
              <select style={S.select} value={form.tipoContratacion} onChange={e => updateForm("tipoContratacion", e.target.value)}>
                <option>ASP BIENES Y SERVICIOS</option><option>TERCEROS</option><option>OTROS - DIFERENTE A ASP</option><option>ACUERDO MARCO - BIENES</option><option>ACUERDO MARCO - SERVICIOS</option>
              </select>
            </div>
            <div style={{ flex:"1 1 140px" }}>
              <label style={S.label}>Sistema Contratación (*)</label>
              <select style={S.select} value={form.sistemaContratacion} onChange={e => updateForm("sistemaContratacion", e.target.value)}>
                <option>SUMA ALZADA</option><option>PRECIOS UNITARIOS</option><option>TARIFAS</option><option>MIXTO</option>
              </select>
            </div>
            <div style={{ flex:"2 1 220px" }}>
              <label style={S.label}>Condición de Inicio (*)</label>
              <select style={S.select} value={form.condicionInicio} onChange={e => updateForm("condicionInicio", e.target.value)}>
                <option>DÍA SIGUIENTE DE PERFECCIONADO EL CONTRATO</option>
                <option>DÍA SIGUIENTE DE LA NOTIFICACIÓN DE LA ORDEN</option>
                <option>DESDE LA FECHA DE SUSCRIPCIÓN DEL CONTRATO</option>
                <option>FECHA DETERMINADA</option>
              </select>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
            <div style={{ flex:"1 1 130px" }}>
              <label style={S.label}>F. Perfecc/Notifica/Acta (*)</label>
              <input style={S.input} value={form.fechaPerfeccionamiento} onChange={e => updateForm("fechaPerfeccionamiento", e.target.value)} placeholder="dd/mm/yyyy" />
            </div>
            <div style={{ flex:"0 0 65px" }}>
              <label style={S.label}>Plazo (días)</label>
              <input style={S.input} type="number" min="1" value={form.plazo} onChange={e => updateForm("plazo", e.target.value)} />
            </div>
            <div style={{ flex:"1 1 110px" }}>
              <label style={S.label}>Fecha Inicio (*)</label>
              <input style={S.input} value={form.fechaInicio} onChange={e => updateForm("fechaInicio", e.target.value)} placeholder="dd/mm/yyyy" />
            </div>
            <div style={{ flex:"1 1 110px" }}>
              <label style={S.label}>Fecha Fin (auto)</label>
              <input value={form.fechaFin} readOnly style={{ ...S.input, background:"#f0f0f0" }} />
            </div>
            <div style={{ flex:"0 0 80px" }}>
              <label style={S.label}>N° Armadas (*)</label>
              <input style={S.input} type="number" min="1" value={form.totalArmadas} onChange={e => updateForm("totalArmadas", e.target.value)} />
            </div>
            <div style={{ flex:"0 0 80px" }}>
              <label style={S.label}>Armada Inicial</label>
              <input style={S.input} type="number" min="1" value={form.armadaInicial} onChange={e => updateForm("armadaInicial", e.target.value)} />
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
            <div style={{ flex:"1 1 150px" }}>
              <label style={S.label}>Tipo Servicio (*)</label>
              <select style={S.select} value={form.tipoServicio} onChange={e => updateForm("tipoServicio", e.target.value)}>
                <option>MANTENIMIENTO</option><option>DEFENSA LEGAL</option><option>CONSULTORÍA</option><option>SERVICIO EN GENERAL</option><option>SUMINISTRO</option><option>OTROS SERVICIOS</option>
              </select>
            </div>
            <div style={{ flex:"1 1 150px" }}>
              <label style={S.label}>Tipo Registro (*)</label>
              <select style={S.select} value={form.tipoRegistro} onChange={e => updateForm("tipoRegistro", e.target.value)}>
                <option>REGISTRO POR IMPORTES</option><option>REGISTRO POR PORCENTAJE</option>
              </select>
            </div>
            <div style={{ flex:"0 0 auto", display:"flex", alignItems:"flex-end", gap:6 }}>
              <button onClick={calcularArmadas}
                style={{ padding:"7px 18px", background:"#2c3e6b", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                ⚙️ Generar Armadas
              </button>
              {armadas.length > 0 && (Math.abs(saldoPendiente) > 0.005 || plazoDiff !== 0) && (
                <button onClick={ajustarRedondeo} title="Ajusta la última armada para que la suma coincida exactamente con el monto de la orden"
                  style={{ padding:"7px 14px", background:"#e67e22", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                  ⚖️ Ajustar Redondeo
                </button>
              )}
            </div>
          </div>

          {/* CUOTAS POR PAGAR */}
          <div style={{ fontSize:12, fontWeight:700, color:"#2c3e6b", marginBottom:6, borderBottom:"2px solid #2c3e6b", paddingBottom:3, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>Cuotas por pagar</span>
            {armadas.length > 0 && (
              <span style={{ fontSize:11, fontWeight:400 }}>
                <span style={{ color: plazoDiff !== 0 ? "#e74c3c" : "#27ae60" }}>
                  Plazo: {form.plazo} días | Asignado: {plazoAsignado} días
                  {plazoDiff !== 0 && <strong> (Diferencia: {plazoDiff})</strong>}
                </span>
                <span style={{ margin:"0 8px", color:"#ccc" }}>|</span>
                <span style={{ color: Math.abs(saldoPendiente) > 0.005 ? "#e74c3c" : "#27ae60" }}>
                  Monto orden: S/ {fmt(montoTotal)} | Asignado: S/ {fmt(montoAsignado)}
                  {Math.abs(saldoPendiente) > 0.005 && <strong> (Saldo: S/ {fmt(saldoPendiente)})</strong>}
                </span>
              </span>
            )}
          </div>

          {armadas.length === 0 ? (
            <div style={{ textAlign:"center", padding:"20px", color:"#95a5a6", fontSize:12, border:"1px dashed #ccc", borderRadius:6, marginBottom:16 }}>
              Configure los datos del cronograma y haga clic en <strong>⚙️ Generar Armadas</strong>
            </div>
          ) : (
            <div style={{ overflowX:"auto", marginBottom:12 }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#2c3e6b", color:"#fff" }}>
                    <th style={{ padding:"7px 8px", border:"1px solid #ddd", textAlign:"center" }}>#</th>
                    <th style={{ padding:"7px 8px", border:"1px solid #ddd", textAlign:"center" }}>ARMADA</th>
                    <th style={{ padding:"7px 8px", border:"1px solid #ddd", background:"#27ae60", textAlign:"center" }}>PLAZO</th>
                    <th style={{ padding:"7px 8px", border:"1px solid #ddd", textAlign:"center" }}>FECHA INICIO</th>
                    <th style={{ padding:"7px 8px", border:"1px solid #ddd", textAlign:"center" }}>FECHA FIN</th>
                    <th style={{ padding:"7px 8px", border:"1px solid #ddd", textAlign:"right", background: esPorPorcentaje ? "#27ae60" : "#2c3e6b" }}>%</th>
                    <th style={{ padding:"7px 8px", border:"1px solid #ddd", textAlign:"right", background: esPorPorcentaje ? "#2c3e6b" : "#27ae60" }}>MONTO ARMADA (S/)</th>
                  </tr>
                </thead>
                <tbody>
                  {armadas.map((a, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <td style={{ padding:"5px 8px", border:"1px solid #eee", textAlign:"center", color:"#7f8c8d" }}>{i + 1}</td>
                      <td style={{ padding:"5px 8px", border:"1px solid #eee", textAlign:"center", fontWeight:600 }}>{String(a.cuota).padStart(3,'0')}</td>
                      <td style={{ padding:"5px 8px", border:"1px solid #eee", textAlign:"center" }}>
                        <input type="number" value={a.plazo} min="1"
                          onChange={e => updateArmada(i, "plazo", parseInt(e.target.value) || 0)}
                          style={{ width:55, textAlign:"center", border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:12 }} />
                      </td>
                      <td style={{ padding:"5px 8px", border:"1px solid #eee", textAlign:"center" }}>
                        <input value={a.fechaInicio} onChange={e => updateArmada(i, "fechaInicio", e.target.value)} placeholder="dd/mm/yyyy"
                          style={{ width:90, textAlign:"center", border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:12 }} />
                      </td>
                      <td style={{ padding:"5px 8px", border:"1px solid #eee", textAlign:"center" }}>
                        <input value={a.fechaFin} onChange={e => updateArmada(i, "fechaFin", e.target.value)} placeholder="dd/mm/yyyy"
                          style={{ width:90, textAlign:"center", border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:12 }} />
                      </td>
                      <td style={{ padding:"5px 8px", border:"1px solid #eee", textAlign:"right", background: esPorPorcentaje ? "#f0fdf4" : "transparent" }}>
                        {esPorPorcentaje ? (
                          <input type="number" value={a.porcentaje} min="0" max="100" step="0.01"
                            onChange={e => updateArmada(i, "porcentaje", parseFloat(e.target.value) || 0)}
                            style={{ width:"100%", textAlign:"right", border:"1px solid #ccc", borderRadius:3, padding:"2px 6px", fontSize:12, fontWeight:700, boxSizing:"border-box" }} />
                        ) : (
                          <span style={{ color:"#555" }}>{Number(a.porcentaje).toFixed(2)}%</span>
                        )}
                      </td>
                      <td style={{ padding:"5px 8px", border:"1px solid #eee", background: esPorPorcentaje ? "transparent" : "#f0fdf4" }}>
                        {esPorPorcentaje ? (
                          <span style={{ display:"block", textAlign:"right", color:"#555", fontWeight:700 }}>{fmt(a.montoArmada)}</span>
                        ) : (
                          <input type="number" value={a.montoArmada} min="0" step="0.01"
                            onChange={e => updateArmada(i, "montoArmada", parseFloat(e.target.value) || 0)}
                            style={{ width:"100%", textAlign:"right", border:"1px solid #ccc", borderRadius:3, padding:"2px 6px", fontSize:12, fontWeight:700, boxSizing:"border-box" }} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:12, marginBottom:16, padding:"8px 12px", background:"#f8f9fa", borderRadius:6, border:"1px solid #e8e8e8" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#2c3e50", background:"#fff" }}>MONTO TOTAL ARMADAS</span>
            <span style={{ fontSize:16, fontWeight:700, color: Math.abs(saldoPendiente) > 0.005 ? "#e74c3c" : "#27ae60", background:"#fff", padding:"4px 14px", borderRadius:4, border:`2px solid ${Math.abs(saldoPendiente) > 0.005 ? "#e74c3c" : "#27ae60"}` }}>
              S/ {fmt(montoAsignado)}
            </span>
            {Math.abs(saldoPendiente) > 0.005 && (
              <span style={{ fontSize:11, color:"#e74c3c", fontWeight:600 }}>⚠ Saldo sin asignar: S/ {fmt(saldoPendiente)}</span>
            )}
          </div>

          {/* BOTONES */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, borderTop:"1px solid #eee", paddingTop:14 }}>
            <button onClick={onClose} style={{ padding:"9px 22px", background:"#fff", border:"1px solid #ccc", borderRadius:4, cursor:"pointer", fontSize:13 }}>✕ Cancelar</button>
            <button onClick={handleSave} disabled={saving}
              style={{ padding:"9px 22px", background: saving ? "#95a5a6" : "#27ae60", color:"#fff", border:"none", borderRadius:4, cursor: saving ? "wait" : "pointer", fontSize:13, fontWeight:700 }}>
              {saving ? "⏳ Guardando..." : "✓ Guardar Cronograma"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// --- CONFORMIDAD MODAL (Registro por armada) ---
const ConformidadModal = ({ armada, orden, items: itemsOrden, onClose, onSaved }) => {
  const modoEdicion = !!armada?.modoEdicion;
  const [saving, setSaving] = useState(false);
  const [centroCostoSel, setCentroCostoSel] = useState(null);
  const [otraArea, setOtraArea] = useState(false);
  const [areaQuery, setAreaQuery] = useState("");
  const [areaOpciones, setAreaOpciones] = useState([]);
  const [areaSel, setAreaSel] = useState(null);
  const [areaDropOpen, setAreaDropOpen] = useState(false);
  const [form, setForm] = useState({
    fechaConformidad: "", fechaEntrega: "",
    documentoReferencia: "", glosa: "", monto: armada?.montoArmada || 0,
    diasRetraso: 0, correspondePenalidad: "NO", elaboradoPor: "",
    nombreResponsable: "", responsable: "",
  });

  // Ítems precargados desde la orden — solo editar cantidadRecibido
  const [detalles, setDetalles] = useState([]);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const centrosCosto = armada?.centrosCosto || [];

  // Inicializar al abrir modal
  useEffect(() => {
    if (!armada) return;

    if (modoEdicion && armada.idConformidad) {
      // Modo edición: cargar datos existentes de la conformidad
      api(`/conformidades/detalle/${armada.idConformidad}`)
        .then(data => {
          const c = data.conformidad;
          setForm({
            fechaConformidad: c.fechaConformidad || "",
            fechaEntrega: c.fechaEntrega || "",
            documentoReferencia: c.documentoReferencia || "",
            glosa: c.glosa || "",
            monto: c.monto || 0,
            diasRetraso: c.diasRetraso || 0,
            correspondePenalidad: c.correspondePenalidad || "NO",
            elaboradoPor: c.elaboradoPor || "",
            nombreResponsable: c.nombreResponsable || "",
            responsable: c.responsable || "",
          });
          // Preseleccionar centro de costo
          const cc = centrosCosto.find(x => x.idCentroCosto === c.idCentroCosto);
          setCentroCostoSel(cc || centrosCosto[0] || null);
          // Preseleccionar área otra conformidad
          if (c.areaOtraConformidad) {
            setOtraArea(true);
            setAreaSel({ id: c.idAreaOtraConformidad, nombre: c.areaOtraConformidad });
            setAreaQuery(c.areaOtraConformidad);
          }
          // Cargar detalles
          if (data.detalles?.length > 0) {
            setDetalles(data.detalles.map(d => ({
              codigoBien: d.codigoBien || '',
              nombreItem: d.nombreItem || '',
              unidadMedida: d.unidadMedida || 'UND',
              idCentroCosto: '',
              cantidadAdquirido: d.cantidadAdquirido || 1,
              cantidadRecibido: d.cantidadRecibido || 1,
              precioUnit: d.precioUnit || 0,
              montoConformidad: d.montoConformidad || 0,
            })));
          }
        })
        .catch(() => {});
    } else {
      // Modo nuevo
      if (centrosCosto.length === 1) setCentroCostoSel(centrosCosto[0]);
      else setCentroCostoSel(null);
      setOtraArea(false); setAreaSel(null); setAreaQuery("");
      const its = (itemsOrden || []).map(it => ({
        codigoBien: it.codigoBien || '',
        nombreItem: it.descripcionItem || '',
        unidadMedida: 'UND',
        idCentroCosto: it.idCentroCosto || '',
        cantidadAdquirido: 1,
        cantidadRecibido: 1,
        precioUnit: parseFloat(it.montoOrden) || 0,
        montoConformidad: parseFloat(it.montoOrden) || 0,
      }));
      setDetalles(its.length > 0 ? its : [
        { codigoBien:'', nombreItem:'', unidadMedida:'UND', idCentroCosto:'', cantidadAdquirido:1, cantidadRecibido:1, precioUnit:0, montoConformidad:0 }
      ]);
    }
  }, [armada, itemsOrden]);

  // Calcular días de retraso automáticamente
  useEffect(() => {
    if (form.fechaEntrega && armada?.fechaFin) {
      const p1 = armada.fechaFin.split('/'); const p2 = form.fechaEntrega.split('/');
      if (p1.length === 3 && p2.length === 3) {
        const fin = new Date(p1[2], p1[1]-1, p1[0]);
        const entrega = new Date(p2[2], p2[1]-1, p2[0]);
        const dias = Math.max(0, Math.round((entrega - fin) / (1000*60*60*24)));
        upd("diasRetraso", dias);
        upd("correspondePenalidad", dias > 0 ? "SI" : "NO");
      }
    }
  }, [form.fechaEntrega, armada]);

  // Buscar áreas usuarias con debounce
  useEffect(() => {
    if (!otraArea) return;
    const t = setTimeout(() => {
      api(`/areas-usuarias?q=${encodeURIComponent(areaQuery)}`)
        .then(data => { setAreaOpciones(data); if (data.length > 0) setAreaDropOpen(true); })
        .catch(() => {});
    }, 200);
    return () => clearTimeout(t);
  }, [areaQuery, otraArea]);

  // Solo editar cantidad recibida — monto se recalcula
  const updCantidad = (i, v) => {
    setDetalles(prev => prev.map((d, idx) => {
      if (idx !== i) return d;
      const cant = parseFloat(v) || 0;
      return { ...d, cantidadRecibido: v, montoConformidad: Math.round(cant * (parseFloat(d.precioUnit)||0) * 100) / 100 };
    }));
  };

  const montoTotal = detalles.reduce((s,d) => s + (parseFloat(d.montoConformidad)||0), 0);

  const previewNumero = modoEdicion
    ? armada?.nroConformidad || ''
    : (centroCostoSel && orden
      ? `N° [auto]-${orden.TIPO_BIEN}-${orden.ANO_EJE}-ITP/${centroCostoSel.nombreCentroCosto}`
      : "Seleccione un centro de costo...");

  const handleSave = async () => {
    if (!centroCostoSel) { alert("Debe seleccionar un Centro de Costo"); return; }
    if (otraArea && !areaSel) { alert("Debe seleccionar el área que emite la conformidad"); return; }
    if (!form.fechaConformidad || !form.fechaEntrega) { alert("Complete Fecha Conformidad y Fecha Entrega"); return; }
    setSaving(true);
    try {
      if (modoEdicion) {
        await api(`/conformidades/${armada.idConformidad}`, { method:"PUT", body: JSON.stringify({
          idCentroCosto: centroCostoSel.idCentroCosto,
          nombreCentroCosto: centroCostoSel.nombreCentroCosto,
          areaOtraConformidad: otraArea && areaSel ? areaSel.nombre : null,
          idAreaOtraConformidad: otraArea && areaSel ? areaSel.id : null,
          ...form, monto: montoTotal, detalles
        })});
        alert("Conformidad actualizada exitosamente.");
      } else {
        await api("/conformidades", { method:"POST", body: JSON.stringify({
          idOrdenArmada: armada.id, secFunc: "0000",
          idCentroCosto: centroCostoSel.idCentroCosto,
          nombreCentroCosto: centroCostoSel.nombreCentroCosto,
          areaOtraConformidad: otraArea && areaSel ? areaSel.nombre : null,
          idAreaOtraConformidad: otraArea && areaSel ? areaSel.id : null,
          ...form, monto: montoTotal, detalles
        })});
        alert("Conformidad registrada exitosamente.");
      }
      onSaved();
    } catch(err) { alert("Error: " + err.message); }
    finally { setSaving(false); }
  };

  const S = { label:{ fontSize:10, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", display:"block", marginBottom:3 },
    input:{ width:"100%", padding:"6px 8px", border:"1px solid #ccc", borderRadius:4, fontSize:12, boxSizing:"border-box", color:"#2c3e50", background:"#fff" } };

  return (
    <Modal open={!!armada} onClose={onClose} title={modoEdicion ? "✏️ Editar Conformidad" : "Registro de Conformidad"}
      subtitle={`Orden ${orden?.NRO_ORDEN} | Armada ${String(armada?.nroArmada||"").padStart(3,"0")} | Vence: ${armada?.fechaFin}`}>
      <div>
        {/* Cabecera */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12, background:"#f8f9fa", padding:10, borderRadius:6, fontSize:12 }}>
          <Field label="Año" value={orden?.ANO_EJE} /><Field label="Tipo" value={orden?.TIPO_BIEN} />
          <Field label="N° Orden" value={orden?.NRO_ORDEN} /><Field label="Fecha Orden" value={orden?.FECHA_ORDEN} />
          <Field label="N° Armada" value={String(armada?.nroArmada||"").padStart(3,"0")} />
          <Field label="Fecha Vencimiento" value={armada?.fechaFin} />
          <div style={{ flex:"1 1 100%" }}><Field label="Concepto" value={orden?.CONCEPTO} /></div>
        </div>

        {/* Datos conformidad */}
        <div style={{ fontSize:12, fontWeight:700, color:"#2c3e6b", borderBottom:"2px solid #2c3e6b", paddingBottom:3, marginBottom:8 }}>Datos de la Conformidad</div>

        {/* Centro de Costo */}
        <div style={{ marginBottom:10, background:"#eef2f7", padding:10, borderRadius:6 }}>
          <label style={S.label}>Centro de Costo (*)</label>
          {centrosCosto.length===0 ? (
            <div style={{ fontSize:12, color:"#e74c3c", padding:"6px 10px", background:"#fff", borderRadius:4, border:"1px solid #fcc" }}>
              ⚠ No hay centros de costo. Ejecute "Actualizar lista".
            </div>
          ) : centrosCosto.length===1 ? (
            <div style={{ fontSize:12, color:"#27ae60", padding:"6px 10px", background:"#fff", borderRadius:4, border:"1px solid #27ae60" }}>
              ✓ {centrosCosto[0].nombreCentroCosto}
            </div>
          ) : (
            <select style={S.input} value={centroCostoSel?.idCentroCosto||""} onChange={e=>{
              setCentroCostoSel(centrosCosto.find(c=>c.idCentroCosto===e.target.value)||null);
            }}>
              <option value="">-- Seleccione --</option>
              {centrosCosto.map(c=><option key={c.idCentroCosto} value={c.idCentroCosto}>{c.nombreCentroCosto}</option>)}
            </select>
          )}
          {centroCostoSel && (
            <div style={{ marginTop:6, fontSize:11, color:"#1e40af", background:"#dbeafe", padding:"5px 10px", borderRadius:4, fontWeight:600 }}>
              📄 {previewNumero} <span style={{ color:"#64748b", fontWeight:400 }}>(correlativo se asigna al guardar)</span>
            </div>
          )}
        </div>

        {/* Conformidad por otra área */}
        <div style={{ marginBottom:10, background:"#fefce8", border:"1px solid #fde68a", padding:10, borderRadius:6 }}>
          <label style={{ ...S.label, color:"#92400e" }}>¿Conformidad emitida por otra área? (*)</label>
          <div style={{ display:"flex", gap:8, marginBottom: otraArea ? 8 : 0 }}>
            <button onClick={()=>{ setOtraArea(false); setAreaSel(null); setAreaQuery(""); }}
              style={{ padding:"5px 18px", fontSize:12, borderRadius:4, border:"2px solid", cursor:"pointer",
                borderColor:!otraArea?"#2563eb":"#ccc", background:!otraArea?"#2563eb":"#fff",
                color:!otraArea?"#fff":"#333", fontWeight:700 }}>NO</button>
            <button onClick={()=>{ 
                setOtraArea(true);
                api(`/areas-usuarias?q=`)
                  .then(data => { setAreaOpciones(data); })
                  .catch(() => {});
              }}
              style={{ padding:"5px 18px", fontSize:12, borderRadius:4, border:"2px solid", cursor:"pointer",
                borderColor:otraArea?"#e67e22":"#ccc", background:otraArea?"#e67e22":"#fff",
                color:otraArea?"#fff":"#333", fontWeight:700 }}>SÍ</button>
          </div>
          {otraArea && (
            <div style={{ position:"relative" }}>
              <label style={{ ...S.label, marginTop:4 }}>Buscar área (*)</label>
              <input style={S.input} value={areaQuery}
                placeholder="Escriba nombre o sigla (ej: OTI, UA, CITE...)"
                onChange={e=>{ setAreaQuery(e.target.value); setAreaSel(null); }}
                onFocus={()=>{ 
                  if (areaOpciones.length > 0) setAreaDropOpen(true);
                  else api(`/areas-usuarias?q=`).then(data=>{ setAreaOpciones(data); setAreaDropOpen(true); }).catch(()=>{});
                }}
                onBlur={()=>setTimeout(()=>setAreaDropOpen(false), 200)}
              />
              {areaDropOpen && areaOpciones.length>0 && (
                <div style={{ position:"absolute", zIndex:999, background:"#fff", border:"1px solid #ccc",
                  borderRadius:4, maxHeight:200, overflowY:"auto", width:"100%", boxShadow:"0 4px 12px rgba(0,0,0,0.15)" }}>
                  {areaOpciones.map(a=>(
                    <div key={a.id} onClick={()=>{ setAreaSel(a); setAreaQuery(a.nombre); setAreaDropOpen(false); }}
                      style={{ padding:"7px 10px", fontSize:12, cursor:"pointer", borderBottom:"1px solid #f0f0f0" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#eef2f7"}
                      onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                      <strong>{a.sigla}</strong> — {a.nombre}
                    </div>
                  ))}
                </div>
              )}
              {areaSel && (
                <div style={{ marginTop:5, fontSize:11, color:"#065f46", background:"#d1fae5", padding:"5px 10px", borderRadius:4, fontWeight:600 }}>
                  ✓ <strong>{areaSel.sigla}</strong> — {areaSel.nombre}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
          <div style={{ flex:"1 1 120px" }}><label style={S.label}>F. Conformidad (*)</label><input style={S.input} value={form.fechaConformidad} onChange={e=>upd("fechaConformidad",e.target.value)} placeholder="dd/mm/yyyy" /></div>
          <div style={{ flex:"1 1 120px" }}><label style={S.label}>F. Entrega Producto (*)</label><input style={S.input} value={form.fechaEntrega} onChange={e=>upd("fechaEntrega",e.target.value)} placeholder="dd/mm/yyyy" /></div>
          <div style={{ flex:"0 0 80px" }}><label style={S.label}>Días Retraso</label><input style={{...S.input, background:"#f0f0f0"}} value={form.diasRetraso} readOnly /></div>
          <div style={{ flex:"0 0 110px" }}><label style={S.label}>Corresponde Penalidad</label>
            <select style={S.input} value={form.correspondePenalidad} onChange={e=>upd("correspondePenalidad",e.target.value)}>
              <option>NO</option><option>SI</option>
            </select>
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
          <div style={{ flex:"1 1 200px" }}><label style={S.label}>Elaborado por</label><input style={S.input} value={form.elaboradoPor} onChange={e=>upd("elaboradoPor",e.target.value)} /></div>
          <div style={{ flex:"1 1 200px" }}><label style={S.label}>Nombre Responsable</label><input style={S.input} value={form.nombreResponsable} onChange={e=>upd("nombreResponsable",e.target.value)} /></div>
          <div style={{ flex:"1 1 150px" }}><label style={S.label}>Doc. Referencia</label><input style={S.input} value={form.documentoReferencia} onChange={e=>upd("documentoReferencia",e.target.value)} /></div>
        </div>
        <div style={{ marginBottom:12 }}><label style={S.label}>Nota / Glosa</label>
          <textarea style={{...S.input, height:60, resize:"vertical"}} value={form.glosa} onChange={e=>upd("glosa",e.target.value)} />
        </div>

        {/* Items */}
        <div style={{ fontSize:12, fontWeight:700, color:"#2c3e6b", borderBottom:"2px solid #2c3e6b", paddingBottom:3, marginBottom:8 }}>
          Listado de Ítems
          {detalles.length > 0 && itemsOrden?.length > 0 && <span style={{ fontSize:10, fontWeight:400, color:"#64748b", marginLeft:8 }}>(cargados automáticamente desde la orden)</span>}
        </div>
        <div style={{ overflowX:"auto", marginBottom:10 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
            <thead>
              <tr style={{ background:"#2c3e6b", color:"#fff" }}>
                <th style={{ padding:"6px 8px", border:"1px solid #ddd" }}>#</th>
                <th style={{ padding:"6px 8px", border:"1px solid #ddd" }}>CÓD. ÍTEM</th>
                <th style={{ padding:"6px 8px", border:"1px solid #ddd" }}>DESCRIPCIÓN ÍTEM</th>
                <th style={{ padding:"6px 8px", border:"1px solid #ddd" }}>U.M.</th>
                <th style={{ padding:"6px 8px", border:"1px solid #ddd" }}>MONTO O/S (S/)</th>
                <th style={{ padding:"6px 8px", border:"1px solid #ddd", background:"#27ae60" }}>MONTO CONF. (S/)</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, i) => (
                <tr key={i} style={{ background: i%2===0?"#fff":"#f9fafb" }}>
                  <td style={{ padding:"4px 6px", border:"1px solid #eee", textAlign:"center", color:"#7f8c8d" }}>{i+1}</td>
                  <td style={{ padding:"4px 6px", border:"1px solid #eee", fontSize:10, color:"#64748b" }}>{d.codigoBien}</td>
                  <td style={{ padding:"4px 6px", border:"1px solid #eee", color:"#2c3e50" }}>{d.nombreItem}</td>
                  <td style={{ padding:"4px 6px", border:"1px solid #eee", textAlign:"center" }}>{d.unidadMedida}</td>
                  <td style={{ padding:"4px 6px", border:"1px solid #eee", textAlign:"right", color:"#64748b" }}>{fmt(d.precioUnit)}</td>
                  <td style={{ padding:"4px 6px", border:"1px solid #eee", background:"#f0fdf4" }}>
                    <input type="number" value={d.montoConformidad}
                      onChange={e=>{ const v = parseFloat(e.target.value)||0; setDetalles(prev=>prev.map((dd,ii)=>ii===i?{...dd,montoConformidad:v}:dd)); }}
                      style={{ width:"100%", border:"1px solid #86efac", borderRadius:3, padding:"2px 6px", fontSize:11, textAlign:"right", fontWeight:700, color:"#166534", background:"#fff" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, padding:"8px 12px", background:"#f8f9fa", borderRadius:6, border:"1px solid #e8e8e8" }}>
          <div style={{ fontSize:12 }}>
            <span style={{ fontWeight:700, color:"#2c3e50", background:"#fff" }}>Monto Programado Armada: </span>
            <span style={{ color:"#7f8c8d" }}>S/ {fmt(armada?.montoArmada)}</span>
          </div>
          <div style={{ fontSize:14, fontWeight:700 }}>
            <span style={{ color:"#2c3e50", marginRight:8 }}>MONTO TOTAL CONFORMIDAD</span>
            <span style={{ color: Math.abs(montoTotal - (armada?.montoArmada||0)) > 0.01 ? "#e67e22" : "#27ae60", background:"#fff", padding:"4px 14px", borderRadius:4, border:`2px solid ${Math.abs(montoTotal - (armada?.montoArmada||0)) > 0.01 ? "#e67e22" : "#27ae60"}` }}>
              S/ {fmt(montoTotal)}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, borderTop:"1px solid #eee", paddingTop:14 }}>
          <button onClick={onClose} style={{ padding:"9px 22px", background:"#fff", border:"1px solid #ccc", borderRadius:4, cursor:"pointer", fontSize:13 }}>✕ Cancelar</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding:"9px 22px", background: saving?"#95a5a6":"#27ae60", color:"#fff", border:"none", borderRadius:4, cursor: saving?"wait":"pointer", fontSize:13, fontWeight:700 }}>
            {saving ? "⏳ Guardando..." : modoEdicion ? "✏️ Actualizar Conformidad" : "✓ Guardar Conformidad"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- DETALLE ORDEN CONFORMIDADES ---
const ConformidadDetalle = ({ ordenId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedArmada, setSelectedArmada] = useState(null);

  const fetchData = () => {
    setLoading(true);
    api(`/conformidades/${ordenId}`)
      .then(setData).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [ordenId]);

  if (loading) return <div style={{ textAlign:"center", padding:60 }}>⏳ Cargando...</div>;
  if (!data) return <div style={{ textAlign:"center", padding:60, color:"#e74c3c" }}>Error al cargar datos.</div>;

  const { orden, armadas, items } = data;

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom:12, padding:"6px 16px", background:"#2c3e6b", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:12 }}>← Retornar</button>

      {/* Cabecera */}
      <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", borderBottom:"2px solid #2c3e6b", paddingBottom:3, marginBottom:8 }}>Detalles de la orden</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, background:"#f8f9fa", padding:10, borderRadius:6, marginBottom:16, fontSize:12 }}>
        <Field label="Ejecutora" value={orden.EJECUTORA||"001"} />
        <Field label="Objeto" value={orden.TIPO_BIEN==="B"?"BIEN":"SERVICIO"} />
        <Field label="N° Orden" value={orden.NRO_ORDEN} />
        <Field label="Fecha Orden" value={orden.FECHA_ORDEN} />
        <Field label="Monto" value={`S/ ${fmt(orden.MONTO_OS)}`} />
        <Field label="RUC" value={orden.RUC} />
        <Field label="Proveedor" value={orden.NOMBRE_PROVEEDOR} />
        <Field label="Exp. SIAF" value={orden.EXPEDIENTE} />
        <Field label="Tipo Contratación" value={orden.TIPO_CONTRATACION} />
        <Field label="Fecha Inicio" value={orden.FECHA_INICIO} />
        <Field label="Fecha Fin" value={orden.FECHA_FIN} />
        <div style={{ flex:"1 1 100%" }}><Field label="Concepto" value={orden.CONCEPTO} /></div>
      </div>

      {/* Cuotas programadas */}
      <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", borderBottom:"2px solid #2c3e6b", paddingBottom:3, marginBottom:8 }}>Cuotas programadas</div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:"linear-gradient(180deg,#ecf0f1,#dfe6e9)" }}>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}></th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>N° ARMADA</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>FECHA INICIO</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>FECHA FIN</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"right" }}>MONTO PROGRAMADO (S/)</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>N° CONFORMIDAD</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>FECHA CONFORMIDAD</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>FECHA ENTREGA</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"right" }}>MONTO CONFORMIDAD (S/)</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>ESTADO</th>
              <th style={{ padding:"8px", border:"1px solid #ddd", textAlign:"center" }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {armadas.map((a, i) => {
              const tieneConf = !!a.idConformidad;
              return (
                <tr key={i} style={{ background: tieneConf ? "#dbeafe" : i%2===0?"#fff":"#f9fafb" }}>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center", color:"#7f8c8d" }}>{i+1}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center", fontWeight:700 }}>{String(a.nroArmada).padStart(3,"0")}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center" }}>{a.fechaInicio}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center" }}>{a.fechaFin}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"right", fontWeight:600 }}>{fmt(a.montoArmada)}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center" }}>{a.nroConformidad||"-"}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center" }}>{a.fechaConformidad||"-"}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center" }}>{a.fechaEntrega||"-"}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"right", fontWeight:600 }}>{a.montoConformidad ? fmt(a.montoConformidad) : "-"}</td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center" }}>
                    {tieneConf ? <span style={{ background:"#2c3e6b", color:"#fff", borderRadius:3, padding:"2px 8px", fontSize:11 }}>EMITIDO</span>
                      : <span style={{ background:"#f39c12", color:"#fff", borderRadius:3, padding:"2px 8px", fontSize:11 }}>PENDIENTE</span>}
                  </td>
                  <td style={{ padding:"7px 8px", border:"1px solid #eee", textAlign:"center" }}>
                    {!tieneConf && (
                      <button onClick={() => setSelectedArmada(a)} title="Registrar conformidad"
                        style={{ background:"#27ae60", color:"#fff", border:"none", borderRadius:3, cursor:"pointer", padding:"4px 10px", fontSize:12 }}>
                        ✓ Registrar
                      </button>
                    )}
                    {tieneConf && (
                      <div style={{ display:"flex", gap:4, justifyContent:"center", alignItems:"center" }}>
                        <button
                          onClick={() => setSelectedArmada({ ...a, modoEdicion: true })}
                          title="Editar conformidad"
                          style={{ background:"#f39c12", color:"#fff", border:"none", borderRadius:3, cursor:"pointer", padding:"4px 8px", fontSize:13 }}>
                          ✏️
                        </button>
                        <button
                          onClick={() => window.open(`${API_URL}/conformidades/${a.idConformidad}/pdf`, '_blank')}
                          title="Descargar PDF"
                          style={{ background:"#2563eb", color:"#fff", border:"none", borderRadius:3, cursor:"pointer", padding:"4px 8px", fontSize:13 }}>
                          🖨️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background:"#ecf0f1", fontWeight:700 }}>
              <td colSpan={4} style={{ padding:"8px", border:"1px solid #ddd", textAlign:"right" }}>TOTAL</td>
              <td style={{ padding:"8px", border:"1px solid #ddd", textAlign:"right" }}>{fmt(armadas.reduce((s,a)=>s+(parseFloat(a.montoArmada)||0),0))}</td>
              <td colSpan={3} style={{ padding:"8px", border:"1px solid #ddd" }}></td>
              <td style={{ padding:"8px", border:"1px solid #ddd", textAlign:"right" }}>{fmt(armadas.reduce((s,a)=>s+(parseFloat(a.montoConformidad)||0),0))}</td>
              <td colSpan={2} style={{ padding:"8px", border:"1px solid #ddd" }}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {selectedArmada && (
        <ConformidadModal armada={selectedArmada} orden={orden} items={items} onClose={() => setSelectedArmada(null)}
          onSaved={() => { setSelectedArmada(null); fetchData(); }} />
      )}
    </div>
  );
};

// --- CONFORMIDADES PAGE ---
const ConformidadesPage = () => {
  const { values, onChange, onClear } = useFilters({ ano:"2026" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const limit = 30;

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit, ...Object.fromEntries(Object.entries(values).filter(([,v]) => v && v !== "(TODOS)")) });
      const res = await api(`/conformidades?${params}`);
      setData(res.data); setTotal(res.total);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); setPage(1); }, []);

  if (selectedOrden) return <ConformidadDetalle ordenId={selectedOrden} onBack={() => { setSelectedOrden(null); fetchData(); }} />;

  const columns = [
    { key:"ano",      label:"AÑO",       align:"center", width:"4%" },
    { key:"tipoBien", label:"TIPO",      align:"center", width:"4%" },
    { key:"nOrden",   label:"N° ORDEN",  align:"center", width:"9%" },
    { key:"fecha",    label:"FECHA",     align:"center", width:"8%" },
    { key:"concepto", label:"CONCEPTO",  width:"22%" },
    { key:"proveedor",label:"PROVEEDOR", width:"18%" },
    { key:"monto",    label:"MONTO (S/)", align:"right", width:"8%", format: v => fmt(v) },
    { key:"totalArmadas", label:"ARM.", align:"center", width:"4%" },
    { key:"fechaInicio", label:"F. INICIO", align:"center", width:"8%" },
    { key:"fechaFin",    label:"F. FIN",   align:"center", width:"8%" },
  ];

  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:12, textTransform:"uppercase" }}>Conformidades de Bienes y Servicios – Contratos Menores</h2>
      <FilterBar values={values} onChange={onChange} onClear={() => { onClear(); }} filters={[
        { key:"ano",      label:"Año",       type:"input",  width:70, placeholder:"2026" },
        { key:"tipoBien", label:"Tipo Orden", type:"select", options:["(TODOS)","B","S"] },
        { key:"nOrden",   label:"N° Orden",  type:"input",  width:110 },
        { key:"ruc",      label:"RUC",       type:"input",  width:110 },
        { key:"proveedor",label:"Proveedor", type:"input",  width:160 },
        { key:"expSiaf",  label:"N° Exp. SIAF", type:"input", width:110 },
      ]} onSearch={() => { setPage(1); fetchData(1); }} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", background:"#eef2f7", padding:"6px 12px", borderRadius:4 }}>
          LISTADO — {total} registro(s) con cronograma
        </div>
      </div>

      {loading ? <div style={{ textAlign:"center", padding:40 }}>⏳ Cargando...</div> : (
        <>
          <DataTable columns={columns} data={data} onRowClick={row => setSelectedOrden(row.id)}
            actions={[{ icon:"🔍", label:"Ver detalle", onClick: row => setSelectedOrden(row.id) }]} />
          <div style={{ display:"flex", justifyContent:"center", gap:8, padding:"12px 0", fontSize:12 }}>
            <button onClick={() => { setPage(p => Math.max(1,p-1)); fetchData(Math.max(1,page-1)); }} disabled={page<=1}
              style={{ padding:"6px 12px", border:"1px solid #ccc", borderRadius:4, cursor:page<=1?"default":"pointer", background:page<=1?"#f0f0f0":"#fff" }}>◀ Anterior</button>
            <span style={{ padding:"6px 12px" }}>Página {page} de {Math.ceil(total/limit)}</span>
            <button onClick={() => { setPage(p => p+1); fetchData(page+1); }} disabled={page>=Math.ceil(total/limit)}
              style={{ padding:"6px 12px", border:"1px solid #ccc", borderRadius:4, cursor:page>=Math.ceil(total/limit)?"default":"pointer", background:page>=Math.ceil(total/limit)?"#f0f0f0":"#fff" }}>Siguiente ▶</button>
          </div>
        </>
      )}
    </div>
  );
};

const ConstanciasPage = () => {
  const { values, onChange, onClear } = useFilters({});
  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>Bandeja de Constancias de Órdenes de Bienes y Servicios</h2>
      <FilterBar values={values} onChange={onChange} onClear={onClear} filters={[
        { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
        { key:"tipoBien", label:"Tipo Bien", type:"select", options:["(TODOS)","B","S"] },
        { key:"nOrden", label:"N° Orden", type:"input", width:110 },
        { key:"proveedor", label:"Proveedor", type:"input", width:140 },
      ]} />
      <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", marginBottom:8, background:"#eef2f7", padding:"8px 12px", borderRadius:4 }}>LISTADO</div>
      <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
        Módulo de constancias se habilitará cuando se registren conformidades.
      </div>
    </div>
  );
};

const PagosPage = () => (
  <div>
    <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>Pagos – Contratos Menores</h2>
    <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14 }}>Módulo en desarrollo.</div>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div style={{ textAlign:"center", padding:60 }}>
    <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
    <h2 style={{ fontSize:18, color:"#2c3e50", marginBottom:8 }}>{title}</h2>
    <p style={{ color:"#7f8c8d", fontSize:13 }}>Este módulo está en desarrollo.</p>
  </div>
);

// --- LOGIN ---
const LoginPage = ({ onLogin }) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!usuario.trim() || !contrasena.trim()) { setError("Ingrese su usuario y contraseña"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({ usuario: usuario.trim(), contrasena: contrasena.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Usuario o contraseña incorrectos."); return; }
      localStorage.setItem("sgc_token", data.token);
      onLogin(data.user);
    } catch (err) {
      setError("No se pudo conectar al servidor. Verifique que el backend esté activo.");
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background:"linear-gradient(135deg, #1a2a4a 0%, #2c3e6b 40%, #34495e 100%)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-120, right:-120, width:400, height:400, borderRadius:"50%", background:"rgba(192,57,43,0.08)" }} />
      <div style={{ position:"absolute", bottom:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(52,152,219,0.06)" }} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:60, color:"#fff", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:480, textAlign:"center" }}>
          <div style={{ marginBottom:32, display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
            <div style={{ width:72, height:72, borderRadius:16, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(255,255,255,0.15)" }}>
              <span style={{ fontSize:20, fontWeight:900, color:"#e74c3c" }}>ITP</span>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:11, color:"#e74c3c", fontWeight:700, letterSpacing:2 }}>red CITE</div>
              <div style={{ fontSize:14, fontWeight:300, opacity:0.9 }}>Instituto Tecnológico</div>
              <div style={{ fontSize:14, fontWeight:300, opacity:0.9 }}>de la Producción</div>
            </div>
          </div>
          <h1 style={{ fontSize:28, fontWeight:200, letterSpacing:2, marginBottom:8 }}>Sistema de Gestión de</h1>
          <h1 style={{ fontSize:36, fontWeight:700, marginBottom:24 }}>CONTRATACIONES</h1>
          <div style={{ width:60, height:3, background:"linear-gradient(90deg, #e74c3c, #e67e22)", borderRadius:2, margin:"0 auto 24px" }} />
          <p style={{ fontSize:14, lineHeight:1.8, opacity:0.7, fontWeight:300 }}>Plataforma integral para la gestión de contratos menores, procedimientos de selección, conformidades y control presupuestal.</p>
        </div>
      </div>
      <div style={{ width:480, display:"flex", alignItems:"center", justifyContent:"center", padding:40, position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:380, background:"#fff", borderRadius:16, padding:"48px 40px", boxShadow:"0 24px 80px rgba(0,0,0,0.3)", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:32, right:32, height:4, background:"linear-gradient(90deg, #c0392b, #e74c3c, #e67e22)", borderRadius:"0 0 4px 4px" }} />
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg, #2c3e6b, #34495e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <span style={{ fontSize:24 }}>👤</span>
            </div>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#2c3e50", marginBottom:4 }}>Iniciar Sesión</h2>
            <p style={{ fontSize:12, color:"#95a5a6" }}>Ingrese sus credenciales para acceder</p>
          </div>
          {error && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#dc2626" }}>⚠️ {error}</div>}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", display:"block", marginBottom:6 }}>Usuario</label>
            <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ingrese su usuario"
              style={{ width:"100%", padding:"12px 14px", border:"2px solid #e8e8e8", borderRadius:10, fontSize:13.5, outline:"none", background:"#fafbfc", boxSizing:"border-box", color:"#2c3e50" }} />
          </div>
          <div style={{ marginBottom:28 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", display:"block", marginBottom:6 }}>Contraseña</label>
            <div style={{ position:"relative" }}>
              <input type={showPassword ? "text" : "password"} value={contrasena} onChange={e => setContrasena(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ingrese su contraseña"
                style={{ width:"100%", padding:"12px 42px 12px 14px", border:"2px solid #e8e8e8", borderRadius:10, fontSize:13.5, outline:"none", background:"#fafbfc", boxSizing:"border-box", color:"#2c3e50" }} />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, opacity:0.5 }}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button onClick={handleLogin} disabled={loading}
            style={{ width:"100%", padding:"13px 0", background: loading ? "#95a5a6" : "linear-gradient(135deg, #c0392b, #e74c3c)", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor: loading ? "wait" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {loading ? "Verificando..." : "🔐 INGRESAR AL SISTEMA"}
          </button>
          <div style={{ textAlign:"center", marginTop:24, fontSize:10.5, color:"#bdc3c7" }}>Sistema de Gestión de Contrataciones v2.0<br/>© 2026 ITP</div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
// Inject global styles to ensure full-width layout
const GlobalStyle = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body, #root { margin:0; padding:0; width:100%; max-width:100% !important; box-sizing:border-box; }
      * { box-sizing:border-box; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

export default function SGCApp() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [expandedMenus, setExpandedMenus] = useState({ contratoMenor: true });

  const toggleMenu = useCallback((key) => { setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] })); }, []);
  const handleLogout = () => { localStorage.removeItem("sgc_token"); setUser(null); setActiveMenu("inicio"); };

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderPage = () => {
    switch(activeMenu) {
      case "inicio": return <HomePage setActiveMenu={(m) => { setActiveMenu(m); setExpandedMenus(p => ({...p, contratoMenor:true})); }} />;
      case "actuaciones": return <ActuacionesPage />;
      case "conformidades": return <ConformidadesPage />;
      case "pagos": return <PagosPage />;
      case "constancias": return <ConstanciasPage />;
      default: return <PlaceholderPage title={activeMenu} />;
    }
  };

  return (
    <div style={{ fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight:"100vh", display:"flex", flexDirection:"column", background:"#f4f5f7", width:"100%", position:"relative" }}>
      <GlobalStyle />
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", height:52, background:"#fff", borderBottom:"3px solid #c0392b", boxShadow:"0 2px 8px rgba(0,0,0,0.08)", zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#555" }}>☰</button>
          <Logo />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:13, fontWeight:600, color:"#2c3e50" }}>Sistema de Gestión de Contrataciones</span>
          <span style={{ width:30, height:30, borderRadius:"50%", background:"#ecf0f1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</span>
          <span style={{ fontSize:12, color:"#2c3e50", fontWeight:600 }}>{user.nombre}</span>
          <button onClick={handleLogout} style={{ background:"none", border:"none", color:"#e74c3c", cursor:"pointer", fontSize:12, fontWeight:700 }}>
            ⚙️ <span style={{ color:"#e67e22" }}>Salir del sistema</span>
          </button>
        </div>
      </header>
      <div style={{ display:"flex", flex:1 }}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
        <main style={{ flex:1, padding:"16px 12px", overflowY:"auto", maxHeight:"calc(100vh - 52px)", minWidth:0 }}>{renderPage()}</main>
      </div>
    </div>
  );
}
