import { useState, useEffect, useCallback } from "react";

// ============================================================
// SISTEMA DE GESTIÓN DE CONTRATACIONES — ITP RED CITE
// ============================================================

const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3001/api" 
  : "https://victory-pogo-sash.ngrok-free.dev/api";

const api = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
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
    <div style={{ width:220, minHeight:"100vh", background:"linear-gradient(180deg,#2c3e6b 0%,#34495e 100%)", color:"#fff", paddingTop:8, flexShrink:0, overflowY:"auto", boxShadow:"2px 0 12px rgba(0,0,0,0.15)" }}>
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
      <div style={{ fontSize:32, fontWeight:700, color:"#2c3e50" }}>{value}</div>
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
  <div style={{ overflowX:"auto", border:"1px solid #ddd", borderRadius:6 }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
      <thead>
        <tr style={{ background:"linear-gradient(180deg,#ecf0f1,#dfe6e9)" }}>
          <th style={{ padding:"10px 8px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign:"center" }}>#</th>
          {columns.map((col, i) => (
            <th key={i} style={{ padding:"10px 8px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign: col.align || "left", whiteSpace:"nowrap" }}>{col.label}</th>
          ))}
          {actions && <th style={{ padding:"10px 8px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign:"center" }}>ACCIONES</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} onClick={() => onRowClick && onRowClick(row)}
            style={{ background: row.estadoCrono === "conCrono" ? "#e8f5e9" : row.estadoCrono === "anulado" ? "#ffebee" : idx % 2 === 0 ? "#fff" : "#f9fafb", cursor: onRowClick ? "pointer" : "default", transition:"background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#eaf2ff"}
            onMouseLeave={e => e.currentTarget.style.background = row.estadoCrono === "conCrono" ? "#e8f5e9" : row.estadoCrono === "anulado" ? "#ffebee" : idx % 2 === 0 ? "#fff" : "#f9fafb"}>
            <td style={{ padding:"8px", textAlign:"center", borderBottom:"1px solid #eee", color:"#7f8c8d" }}>{idx + 1}</td>
            {columns.map((col, i) => (
              <td key={i} style={{ padding:"8px", borderBottom:"1px solid #eee", textAlign: col.align || "left", maxWidth: col.maxWidth || "none", overflow:"hidden", textOverflow:"ellipsis",
                fontWeight: col.key === "monto" ? 600 : 400 }}>
                {col.format ? col.format(row[col.key], row) : row[col.key] ?? "-"}
              </td>
            ))}
            {actions && (
              <td style={{ padding:"8px", textAlign:"center", borderBottom:"1px solid #eee" }}>
                <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                  {actions.map((a, ai) => (
                    <button key={ai} onClick={(e) => { e.stopPropagation(); a.onClick(row); }} title={a.label}
                      style={{ padding:"4px 8px", background:"#f0f0f0", border:"1px solid #ddd", borderRadius:3, cursor:"pointer", fontSize:13 }}>{a.icon}</button>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
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
      const result = await api("/ordenes/sync", { method: "POST" });
      setSyncResult(result);
      setPage(1);
      fetchData();
    } catch (err) { alert("Error al sincronizar: " + err.message); }
    finally { setSyncing(false); }
  };

  const handleClear = () => { onClear(); setPage(1); };
  const handleSearch = () => { setPage(1); fetchData(); };

  const columns = [
    { key:"ano", label:"AÑO", align:"center" },
    { key:"tipoBien", label:"TIPO BIEN", align:"center" },
    { key:"nOrden", label:"N° ORDEN" },
    { key:"fecha", label:"FECHA ORDEN", align:"center" },
    { key:"usuarioSiga", label:"USUARIO SIGA", maxWidth:180 },
    { key:"expSiaf", label:"EXP. SIAF" },
    { key:"concepto", label:"CONCEPTO", maxWidth:300 },
    { key:"proveedor", label:"PROVEEDOR", maxWidth:220 },
    { key:"monto", label:"MONTO (S/)", align:"right", format: v => fmt(v) },
    { key:"tipoContratacion", label:"TIPO CONTRATACIÓN" },
    { key:"nArmadas", label:"N° ARMADAS", align:"center", format: v => v || 0 },
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
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:12, background:"#27ae60", display:"inline-block" }}></span> Con Cronograma</span>
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
    tipoServicio: "MANTENIMIENTO",
    tipoRegistro: "REGISTRO POR IMPORTES",
  });
  const [armadas, setArmadas] = useState([]);

  useEffect(() => {
    if (!order) return;
    setLoading(true);
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

  // Calcular armadas automáticamente
  const calcularArmadas = () => {
    const n = parseInt(form.totalArmadas) || 1;
    const plazoTotal = parseInt(form.plazo) || 30;
    const plazoPorArmada = Math.floor(plazoTotal / n);
    const monto = ordenData ? parseFloat(ordenData.MONTO_OS) || 0 : 0;
    const montoPorArmada = Math.round((monto / n) * 100) / 100;
    const porcentaje = Math.round((100 / n) * 100) / 100;

    // Parse fecha inicio
    let fechaBase = null;
    if (form.fechaInicio) {
      const p = form.fechaInicio.split('/');
      if (p.length === 3) fechaBase = new Date(p[2], p[1] - 1, p[0]);
    }

    const nuevasArmadas = [];
    for (let i = 0; i < n; i++) {
      let fi = "", ff = "";
      if (fechaBase) {
        const inicio = new Date(fechaBase);
        inicio.setDate(inicio.getDate() + (i * plazoPorArmada));
        const fin = new Date(inicio);
        fin.setDate(fin.getDate() + plazoPorArmada - 1);
        fi = `${String(inicio.getDate()).padStart(2,'0')}/${String(inicio.getMonth()+1).padStart(2,'0')}/${inicio.getFullYear()}`;
        ff = `${String(fin.getDate()).padStart(2,'0')}/${String(fin.getMonth()+1).padStart(2,'0')}/${fin.getFullYear()}`;
      }
      nuevasArmadas.push({
        cuota: i + parseInt(form.armadaInicial || 1),
        plazo: plazoPorArmada,
        fechaInicio: fi,
        fechaFin: ff,
        porcentaje: i === n - 1 ? Math.round((100 - porcentaje * (n - 1)) * 100) / 100 : porcentaje,
        montoArmada: i === n - 1 ? Math.round((monto - montoPorArmada * (n - 1)) * 100) / 100 : montoPorArmada,
      });
    }
    setArmadas(nuevasArmadas);
  };

  useEffect(() => {
    if (ordenData && form.fechaInicio && form.totalArmadas) calcularArmadas();
  }, [form.totalArmadas, form.plazo, form.fechaInicio, form.armadaInicial, ordenData]);

  // Auto-calcular fecha fin cuando cambia fecha inicio y plazo
  useEffect(() => {
    if (form.fechaInicio && form.plazo) {
      const p = form.fechaInicio.split('/');
      if (p.length === 3) {
        const d = new Date(p[2], p[1] - 1, p[0]);
        d.setDate(d.getDate() + parseInt(form.plazo) - 1);
        const ff = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        setForm(f => ({ ...f, fechaFin: ff }));
      }
    }
  }, [form.fechaInicio, form.plazo]);

  const handleSave = async () => {
    if (!form.fechaPerfeccionamiento || !form.fechaInicio) {
      alert("Complete los campos obligatorios: Fecha Perfeccionamiento y Fecha Inicio");
      return;
    }
    setSaving(true);
    try {
      await api(`/ordenes/${order.id}/cronograma`, {
        method: "POST",
        body: JSON.stringify({ ...form, armadas }),
      });
      alert("Cronograma registrado exitosamente.");
      onSaved();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally { setSaving(false); }
  };

  if (!order) return null;

  const S = { label: { fontSize:10, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", display:"block", marginBottom:4 },
    input: { width:"100%", padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, boxSizing:"border-box" },
    select: { width:"100%", padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, boxSizing:"border-box" } };

  return (
    <Modal open={!!order} onClose={onClose} title="Registro de Cronograma" subtitle={`Orden ${order.nOrden} - ${order.tipoBien === "B" ? "BIEN" : "SERVICIO"}`}>
      {loading ? <div style={{ textAlign:"center", padding:40 }}>⏳ Cargando...</div> : (
        <div>
          {/* DETALLES DE LA ORDEN */}
          <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", marginBottom:8, borderBottom:"2px solid #2c3e6b", paddingBottom:4 }}>Detalles de la orden</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20, background:"#f8f9fa", padding:12, borderRadius:6 }}>
            <Field label="Ejecutora" value="001" />
            <Field label="N° Orden" value={order.nOrden} />
            <Field label="Fecha Orden" value={order.fecha} />
            <Field label="Monto" value={`S/ ${fmt(order.monto)}`} />
            <Field label="RUC" value={order.ruc} />
            <Field label="Proveedor" value={order.proveedor} />
            <Field label="Exp. SIAF" value={order.expSiaf} />
            <Field label="Concepto" value={order.concepto} />
            <Field label="Especialista" value={order.usuarioSiga} />
          </div>

          {/* DATOS DEL CRONOGRAMA */}
          <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", marginBottom:8, borderBottom:"2px solid #2c3e6b", paddingBottom:4 }}>Datos del Cronograma</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:12 }}>
            <div style={{ flex:"1 1 180px" }}>
              <label style={S.label}>Tipo Contratación (*)</label>
              <select style={S.select} value={form.tipoContratacion} onChange={e => updateForm("tipoContratacion", e.target.value)}>
                <option>ASP BIENES Y SERVICIOS</option><option>TERCEROS</option><option>OTROS - DIFERENTE A ASP</option><option>ACUERDO MARCO - BIENES</option><option>ACUERDO MARCO - SERVICIOS</option>
              </select>
            </div>
            <div style={{ flex:"1 1 150px" }}>
              <label style={S.label}>Sistema Contratación (*)</label>
              <select style={S.select} value={form.sistemaContratacion} onChange={e => updateForm("sistemaContratacion", e.target.value)}>
                <option>SUMA ALZADA</option><option>PRECIOS UNITARIOS</option><option>TARIFAS</option><option>MIXTO</option>
              </select>
            </div>
            <div style={{ flex:"1 1 280px" }}>
              <label style={S.label}>Condición de Inicio (*)</label>
              <select style={S.select} value={form.condicionInicio} onChange={e => updateForm("condicionInicio", e.target.value)}>
                <option>DÍA SIGUIENTE DE PERFECCIONADO EL CONTRATO</option>
                <option>DÍA SIGUIENTE DE LA NOTIFICACIÓN DE LA ORDEN</option>
                <option>DESDE LA FECHA DE SUSCRIPCIÓN DEL CONTRATO</option>
              </select>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:12 }}>
            <div style={{ flex:"1 1 140px" }}>
              <label style={S.label}>F. Perfecc/Notifica/Acta (*)</label>
              <input style={S.input} value={form.fechaPerfeccionamiento} onChange={e => updateForm("fechaPerfeccionamiento", e.target.value)} placeholder="dd/mm/yyyy" />
            </div>
            <div style={{ flex:"0 0 70px" }}>
              <label style={S.label}>Plazo</label>
              <input style={S.input} type="number" value={form.plazo} onChange={e => updateForm("plazo", e.target.value)} />
            </div>
            <div style={{ flex:"1 1 120px" }}>
              <label style={S.label}>Fecha Inicio (*)</label>
              <input style={S.input} value={form.fechaInicio} onChange={e => updateForm("fechaInicio", e.target.value)} placeholder="dd/mm/yyyy" />
            </div>
            <div style={{ flex:"1 1 120px" }}>
              <label style={S.label}>Fecha Fin (*)</label>
              <input value={form.fechaFin} readOnly style={{ ...S.input, background:"#f0f0f0" }} />
            </div>
            <div style={{ flex:"0 0 90px" }}>
              <label style={S.label}>Total Armadas (*)</label>
              <input style={S.input} type="number" min="1" value={form.totalArmadas} onChange={e => updateForm("totalArmadas", e.target.value)} />
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:16 }}>
            <div style={{ flex:"0 0 90px" }}>
              <label style={S.label}>Armada Inicial (*)</label>
              <input style={S.input} type="number" min="1" value={form.armadaInicial} onChange={e => updateForm("armadaInicial", e.target.value)} />
            </div>
            <div style={{ flex:"1 1 150px" }}>
              <label style={S.label}>Tipo Servicio (*)</label>
              <select style={S.select} value={form.tipoServicio} onChange={e => updateForm("tipoServicio", e.target.value)}>
                <option>MANTENIMIENTO</option><option>DEFENSA LEGAL</option><option>CONSULTORÍA</option><option>SERVICIO EN GENERAL</option><option>SUMINISTRO</option>
              </select>
            </div>
            <div style={{ flex:"1 1 150px" }}>
              <label style={S.label}>Tipo Registro (*)</label>
              <select style={S.select} value={form.tipoRegistro} onChange={e => updateForm("tipoRegistro", e.target.value)}>
                <option>REGISTRO POR IMPORTES</option><option>REGISTRO POR PORCENTAJE</option>
              </select>
            </div>
          </div>

          {/* CUOTAS POR PAGAR */}
          <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", marginBottom:8, borderBottom:"2px solid #2c3e6b", paddingBottom:4 }}>Cuotas por pagar</div>
          <div style={{ overflowX:"auto", marginBottom:12 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ background:"#ecf0f1" }}>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>#</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>ARMADA</th>
                  <th style={{ padding:8, border:"1px solid #ddd", background:"#27ae60", color:"#fff" }}>PLAZO</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>FECHA INICIO</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>FECHA FIN</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>PORCENTAJE</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>MONTO ARMADA (S/)</th>
                </tr>
              </thead>
              <tbody>
                {armadas.map((a, i) => (
                  <tr key={i}>
                    <td style={{ padding:6, border:"1px solid #ddd", textAlign:"center" }}>{i + 1}</td>
                    <td style={{ padding:6, border:"1px solid #ddd", textAlign:"center" }}>{String(a.cuota).padStart(3, '0')}</td>
                    <td style={{ padding:6, border:"1px solid #ddd", textAlign:"center", background:"#d5f5e3" }}>{a.plazo}</td>
                    <td style={{ padding:6, border:"1px solid #ddd", textAlign:"center" }}>{a.fechaInicio}</td>
                    <td style={{ padding:6, border:"1px solid #ddd", textAlign:"center" }}>{a.fechaFin}</td>
                    <td style={{ padding:6, border:"1px solid #ddd", textAlign:"right" }}>{Number(a.porcentaje).toFixed(2)}</td>
                    <td style={{ padding:6, border:"1px solid #ddd", textAlign:"right", background:"#d5f5e3", fontWeight:700 }}>{fmt(a.montoArmada)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:8, marginBottom:20 }}>
            <span style={{ fontWeight:700, fontSize:13 }}>MONTO TOTAL ARMADAS</span>
            <span style={{ fontWeight:700 }}>S/</span>
            <span style={{ fontWeight:700, fontSize:16, background:"#f5f6fa", padding:"4px 12px", borderRadius:4, border:"1px solid #ddd" }}>
              {fmt(armadas.reduce((s, a) => s + (parseFloat(a.montoArmada) || 0), 0))}
            </span>
          </div>

          {/* BOTONES */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, borderTop:"1px solid #eee", paddingTop:16 }}>
            <button onClick={onClose} style={{ padding:"10px 24px", background:"#fff", border:"1px solid #ccc", borderRadius:4, cursor:"pointer", fontSize:13 }}>✕ Cancelar</button>
            <button onClick={handleSave} disabled={saving}
              style={{ padding:"10px 24px", background: saving ? "#95a5a6" : "#27ae60", color:"#fff", border:"none", borderRadius:4, cursor: saving ? "wait" : "pointer", fontSize:13, fontWeight:700 }}>
              {saving ? "⏳ Guardando..." : "✓ Guardar Cronograma"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// --- CONFORMIDAD MODAL ---
const ConformidadModal = ({ armada, orden, onClose, onSaved }) => {
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
  const [detalles, setDetalles] = useState([
    { nombreItem:"", unidadMedida:"UND", nombreUnidad:"UNIDAD", cantidadAdquirido:1, cantidadRecibido:1, precioUnit:0, montoConformidad:0 }
  ]);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const centrosCosto = armada?.centrosCosto || [];

  useEffect(() => {
    if (centrosCosto.length === 1) setCentroCostoSel(centrosCosto[0]);
    else setCentroCostoSel(null);
    setOtraArea(false); setAreaSel(null); setAreaQuery("");
  }, [armada]);

  // Calcular días retraso automático
  useEffect(() => {
    if (form.fechaEntrega && armada?.fechaFin) {
      const p1 = armada.fechaFin.split('/'); const p2 = form.fechaEntrega.split('/');
      if (p1.length===3 && p2.length===3) {
        const fin = new Date(p1[2],p1[1]-1,p1[0]);
        const ent = new Date(p2[2],p2[1]-1,p2[0]);
        const dias = Math.max(0, Math.round((ent-fin)/(1000*60*60*24)));
        upd("diasRetraso", dias); upd("correspondePenalidad", dias>0?"SI":"NO");
      }
    }
  }, [form.fechaEntrega, armada]);

  // Buscar áreas usuarias con debounce
  useEffect(() => {
    if (!otraArea) return;
    const t = setTimeout(() => {
      api(`/areas-usuarias?q=${encodeURIComponent(areaQuery)}`)
        .then(data => { setAreaOpciones(data); setAreaDropOpen(true); })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [areaQuery, otraArea]);

  const updDetalle = (i, k, v) => {
    setDetalles(prev => {
      const next = prev.map((d,idx) => idx===i ? {...d,[k]:v} : d);
      if (k==="cantidadRecibido"||k==="precioUnit") {
        next[i] = {...next[i], montoConformidad: Math.round((parseFloat(next[i].cantidadRecibido)||0)*(parseFloat(next[i].precioUnit)||0)*100)/100};
      }
      return next;
    });
  };
  const addDetalle = () => setDetalles(p => [...p, {nombreItem:"",unidadMedida:"UND",nombreUnidad:"UNIDAD",cantidadAdquirido:1,cantidadRecibido:1,precioUnit:0,montoConformidad:0}]);
  const removeDetalle = (i) => setDetalles(p => p.filter((_,idx)=>idx!==i));
  const montoTotal = detalles.reduce((s,d)=>s+(parseFloat(d.montoConformidad)||0),0);

  const previewNumero = centroCostoSel && orden
    ? `N° [auto]-${orden.TIPO_BIEN}-${orden.ANO_EJE}-ITP/${centroCostoSel.nombreCentroCosto}`
    : "Seleccione un centro de costo...";

  const handleSave = async () => {
    if (!centroCostoSel) { alert("Debe seleccionar un Centro de Costo"); return; }
    if (!form.fechaConformidad||!form.fechaEntrega) { alert("Complete Fecha Conformidad y Fecha Entrega"); return; }
    setSaving(true);
    try {
      await api("/conformidades", { method:"POST", body: JSON.stringify({
        idOrdenArmada: armada.id, secFunc:"0000",
        idCentroCosto: centroCostoSel.idCentroCosto,
        nombreCentroCosto: centroCostoSel.nombreCentroCosto,
        areaOtraConformidad: otraArea && areaSel ? areaSel.nombre : null,
        idAreaOtraConformidad: otraArea && areaSel ? areaSel.id : null,
        ...form, monto: montoTotal, detalles
      })});
      alert("Conformidad registrada exitosamente."); onSaved();
    } catch(err) { alert("Error: "+err.message); }
    finally { setSaving(false); }
  };

  const S = {
    label:{ fontSize:10, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", display:"block", marginBottom:3 },
    input:{ width:"100%", padding:"6px 8px", border:"1px solid #ccc", borderRadius:4, fontSize:12, boxSizing:"border-box", color:"#2c3e50", background:"#fff" }
  };

  return (
    <Modal open={!!armada} onClose={onClose} title="Registro de Conformidad"
      subtitle={`Orden ${orden?.NRO_ORDEN} | Armada ${String(armada?.nroArmada||"").padStart(3,"0")} | Vence: ${armada?.fechaFin||""}`}>
      <div>
        {/* Cabecera */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12, background:"#f8f9fa", padding:10, borderRadius:6, fontSize:12 }}>
          <Field label="Año" value={orden?.ANO_EJE}/><Field label="Tipo" value={orden?.TIPO_BIEN}/>
          <Field label="N° Orden" value={orden?.NRO_ORDEN}/><Field label="Fecha Orden" value={orden?.FECHA_ORDEN}/>
          <Field label="N° Armada" value={String(armada?.nroArmada||"").padStart(3,"0")}/>
          <Field label="Fecha Vencimiento" value={armada?.fechaFin}/>
          <div style={{ flex:"1 1 100%" }}><Field label="Concepto" value={orden?.CONCEPTO}/></div>
        </div>

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
            <button onClick={()=>{setOtraArea(false);setAreaSel(null);setAreaQuery("");}}
              style={{ padding:"5px 18px", fontSize:12, borderRadius:4, border:"2px solid", cursor:"pointer",
                borderColor: !otraArea?"#2563eb":"#ccc", background:!otraArea?"#2563eb":"#fff",
                color:!otraArea?"#fff":"#333", fontWeight:700 }}>NO</button>
            <button onClick={()=>setOtraArea(true)}
              style={{ padding:"5px 18px", fontSize:12, borderRadius:4, border:"2px solid", cursor:"pointer",
                borderColor: otraArea?"#e67e22":"#ccc", background:otraArea?"#e67e22":"#fff",
                color:otraArea?"#fff":"#333", fontWeight:700 }}>SÍ</button>
          </div>
          {otraArea && (
            <div style={{ position:"relative" }}>
              <label style={{ ...S.label, marginTop:4 }}>Buscar área (*)</label>
              <input style={S.input} value={areaQuery}
                placeholder="Escriba nombre o sigla (ej: OTI, almacén...)"
                onChange={e=>{ setAreaQuery(e.target.value); setAreaSel(null); }}
                onFocus={()=>{ if(areaOpciones.length>0) setAreaDropOpen(true); }}
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
                  ✓ Área seleccionada: <strong>{areaSel.sigla}</strong> — {areaSel.nombre}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fechas y retraso */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
          <div style={{ flex:"1 1 120px" }}><label style={S.label}>F. Conformidad (*)</label><input style={S.input} value={form.fechaConformidad} onChange={e=>upd("fechaConformidad",e.target.value)} placeholder="dd/mm/yyyy"/></div>
          <div style={{ flex:"1 1 120px" }}><label style={S.label}>F. Entrega Producto (*)</label><input style={S.input} value={form.fechaEntrega} onChange={e=>upd("fechaEntrega",e.target.value)} placeholder="dd/mm/yyyy"/></div>
          <div style={{ flex:"0 0 80px" }}><label style={S.label}>Días Retraso</label><input style={{...S.input,background:"#f0f0f0"}} value={form.diasRetraso} readOnly/></div>
          <div style={{ flex:"0 0 110px" }}><label style={S.label}>Corresponde Penalidad</label>
            <select style={S.input} value={form.correspondePenalidad} onChange={e=>upd("correspondePenalidad",e.target.value)}>
              <option>NO</option><option>SI</option>
            </select>
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
          <div style={{ flex:"1 1 180px" }}><label style={S.label}>Elaborado por</label><input style={S.input} value={form.elaboradoPor} onChange={e=>upd("elaboradoPor",e.target.value)}/></div>
          <div style={{ flex:"1 1 180px" }}><label style={S.label}>Nombre Responsable</label><input style={S.input} value={form.nombreResponsable} onChange={e=>upd("nombreResponsable",e.target.value)}/></div>
          <div style={{ flex:"1 1 140px" }}><label style={S.label}>Doc. Referencia</label><input style={S.input} value={form.documentoReferencia} onChange={e=>upd("documentoReferencia",e.target.value)}/></div>
        </div>
        <div style={{ marginBottom:12 }}><label style={S.label}>Nota / Glosa</label>
          <textarea style={{...S.input, height:55, resize:"vertical"}} value={form.glosa} onChange={e=>upd("glosa",e.target.value)}/>
        </div>

        {/* Items */}
        <div style={{ fontSize:12, fontWeight:700, color:"#2c3e6b", borderBottom:"2px solid #2c3e6b", paddingBottom:3, marginBottom:8, display:"flex", justifyContent:"space-between" }}>
          <span>Listado de Ítems</span>
          <button onClick={addDetalle} style={{ fontSize:11, padding:"2px 10px", background:"#2563eb", color:"#fff", border:"none", borderRadius:4, cursor:"pointer" }}>+ Agregar Ítem</button>
        </div>
        <div style={{ overflowX:"auto", marginBottom:12 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
            <thead>
              <tr style={{ background:"#2c3e6b", color:"#fff" }}>
                <th style={{ padding:"5px 4px", width:24 }}>#</th>
                <th style={{ padding:"5px 4px" }}>Descripción Ítem</th>
                <th style={{ padding:"5px 4px", width:55 }}>U.M.</th>
                <th style={{ padding:"5px 4px", width:70 }}>Cant. O/C</th>
                <th style={{ padding:"5px 4px", width:80, background:"#1e6b3e" }}>Cant. Recibida</th>
                <th style={{ padding:"5px 4px", width:80 }}>P. Unit (S/)</th>
                <th style={{ padding:"5px 4px", width:90, background:"#1e6b3e" }}>Monto Conf. (S/)</th>
                <th style={{ padding:"5px 4px", width:24 }}></th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #eee" }}>
                  <td style={{ padding:"3px 4px", textAlign:"center", color:"#666" }}>{i+1}</td>
                  <td style={{ padding:"3px 4px" }}><input value={d.nombreItem} onChange={e=>updDetalle(i,"nombreItem",e.target.value)} style={{ width:"100%", border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:11, color:"#2c3e50", background:"#fff" }}/></td>
                  <td style={{ padding:"3px 4px" }}><input value={d.unidadMedida} onChange={e=>updDetalle(i,"unidadMedida",e.target.value)} style={{ width:50, border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:11, textAlign:"center", color:"#2c3e50", background:"#fff" }}/></td>
                  <td style={{ padding:"3px 4px" }}><input type="number" value={d.cantidadAdquirido} onChange={e=>updDetalle(i,"cantidadAdquirido",e.target.value)} style={{ width:65, border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:11, textAlign:"right", color:"#2c3e50", background:"#fff" }}/></td>
                  <td style={{ padding:"3px 4px", background:"#f0fdf4" }}><input type="number" value={d.cantidadRecibido} onChange={e=>updDetalle(i,"cantidadRecibido",e.target.value)} style={{ width:70, border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:11, textAlign:"right", fontWeight:700, color:"#2c3e50", background:"#fff" }}/></td>
                  <td style={{ padding:"3px 4px" }}><input type="number" value={d.precioUnit} onChange={e=>updDetalle(i,"precioUnit",e.target.value)} style={{ width:75, border:"1px solid #ccc", borderRadius:3, padding:"2px 4px", fontSize:11, textAlign:"right", color:"#2c3e50", background:"#fff" }}/></td>
                  <td style={{ padding:"3px 4px", background:"#f0fdf4", textAlign:"right", fontWeight:700, color:"#166534" }}>{(parseFloat(d.montoConformidad)||0).toFixed(2)}</td>
                  <td style={{ padding:"3px 4px", textAlign:"center" }}>{detalles.length>1&&<button onClick={()=>removeDetalle(i)} style={{ background:"none", border:"none", color:"#e74c3c", cursor:"pointer", fontSize:14 }}>✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales y guardar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:"2px solid #eee" }}>
          <div style={{ fontSize:12 }}>
            <span style={{ color:"#666" }}>Monto Programado Armada: </span>
            <strong>S/ {parseFloat(armada?.montoArmada||0).toFixed(2)}</strong>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#2c3e6b" }}>MONTO TOTAL CONFORMIDAD</div>
            <div style={{ background: Math.abs(montoTotal-(parseFloat(armada?.montoArmada||0)))>0.01?"#fef2f2":"#f0fdf4",
              border:`1px solid ${Math.abs(montoTotal-(parseFloat(armada?.montoArmada||0)))>0.01?"#fca5a5":"#86efac"}`,
              padding:"4px 14px", borderRadius:4, fontSize:13, fontWeight:700, color:"#1e3a5f" }}>
              S/ {montoTotal.toFixed(2)}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10, gap:8 }}>
          <input placeholder="Contraseña" type="password" style={{ ...S.input, width:130 }}/>
          <button onClick={handleSave} disabled={saving}
            style={{ padding:"8px 20px", background: saving?"#95a5a6":"#27ae60", color:"#fff", border:"none", borderRadius:4, cursor:saving?"not-allowed":"pointer", fontWeight:700, fontSize:13 }}>
            {saving?"⏳ Guardando...":"✓ Guardar Conformidad"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- CONFORMIDADES PAGE ---
const ConformidadesPage = () => {
  const { values, onChange, onClear } = useFilters({ ano:"2026" });
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [conformModal, setConformModal] = useState(null); // { armada, orden }
  const limit = 30;

  const fetchOrdenes = () => {
    setLoading(true);
    const params = new URLSearchParams({ ...values, page, limit });
    api(`/conformidades?${params}`)
      .then(d => { setOrdenes(d.ordenes||[]); setTotal(d.total||0); })
      .catch(console.error)
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{ fetchOrdenes(); }, [values, page]);

  const openDetalle = (orden) => {
    setSelectedOrden(orden);
    api(`/conformidades/${orden.id}`)
      .then(d => setDetalle(d))
      .catch(console.error);
  };

  const totalPaginas = Math.ceil(total/limit);

  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:12, textTransform:"uppercase" }}>Conformidades de Bienes y Servicios – Contratos Menores</h2>
      <FilterBar values={values} onChange={onChange} onClear={onClear} filters={[
        { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
        { key:"tipoBien", label:"Tipo", type:"select", options:["(TODOS)","B","S"] },
        { key:"nOrden", label:"N° Orden", type:"input", width:110 },
        { key:"proveedor", label:"Proveedor", type:"input", width:160 },
      ]}/>

      {/* Lista de órdenes */}
      <div style={{ display:"flex", gap:12 }}>
        {/* Panel izquierdo: listado */}
        <div style={{ flex:"0 0 380px", minWidth:0 }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#2c3e6b", background:"#eef2f7", padding:"6px 10px", borderRadius:4, marginBottom:6 }}>
            {total} órdenes con cronograma
          </div>
          {loading ? <div style={{ textAlign:"center", padding:30 }}>⏳ Cargando...</div> : (
            <div style={{ border:"1px solid #e2e8f0", borderRadius:6, overflow:"hidden" }}>
              {ordenes.length===0 ? (
                <div style={{ textAlign:"center", padding:30, color:"#95a5a6", fontSize:13 }}>No hay órdenes con cronograma.</div>
              ) : ordenes.map(o=>(
                <div key={o.id} onClick={()=>openDetalle(o)}
                  style={{ padding:"8px 12px", borderBottom:"1px solid #eee", cursor:"pointer", fontSize:12,
                    background: selectedOrden?.id===o.id?"#dbeafe":"#fff" }}
                  onMouseEnter={e=>{ if(selectedOrden?.id!==o.id) e.currentTarget.style.background="#f8f9fa"; }}
                  onMouseLeave={e=>{ if(selectedOrden?.id!==o.id) e.currentTarget.style.background="#fff"; }}>
                  <div style={{ fontWeight:700, color:"#1e40af" }}>{o.tipoBien}-{o.nroOrden}</div>
                  <div style={{ color:"#475569", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{o.proveedor}</div>
                  <div style={{ color:"#64748b", marginTop:2 }}>S/ {parseFloat(o.monto||0).toLocaleString('es-PE',{minimumFractionDigits:2})} | {o.plazo} días</div>
                </div>
              ))}
            </div>
          )}
          {totalPaginas>1 && (
            <div style={{ display:"flex", gap:6, marginTop:8, justifyContent:"center" }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:"3px 10px", fontSize:11 }}>◀</button>
              <span style={{ fontSize:11, padding:"3px 6px" }}>Pág {page}/{totalPaginas}</span>
              <button onClick={()=>setPage(p=>Math.min(totalPaginas,p+1))} disabled={page===totalPaginas} style={{ padding:"3px 10px", fontSize:11 }}>▶</button>
            </div>
          )}
        </div>

        {/* Panel derecho: detalle de armadas */}
        <div style={{ flex:1, minWidth:0 }}>
          {!detalle ? (
            <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:13, border:"1px dashed #ccc", borderRadius:6 }}>
              ← Seleccione una orden para ver sus armadas
            </div>
          ) : (
            <div>
              <div style={{ background:"#1e3a5f", color:"#fff", padding:"8px 12px", borderRadius:"6px 6px 0 0", fontSize:12 }}>
                <strong>{detalle.orden.TIPO_BIEN==="B"?"BIEN":"SERVICIO"} — {detalle.orden.NRO_ORDEN}</strong>
                <span style={{ marginLeft:12, opacity:0.8 }}>{detalle.orden.NOMBRE_PROVEEDOR}</span>
                <span style={{ marginLeft:12, opacity:0.8 }}>S/ {parseFloat(detalle.orden.MONTO_OS||0).toLocaleString('es-PE',{minimumFractionDigits:2})}</span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#2c3e6b", color:"#fff" }}>
                    <th style={{ padding:"6px 8px", textAlign:"left" }}>Armada</th>
                    <th style={{ padding:"6px 8px" }}>Fecha Inicio</th>
                    <th style={{ padding:"6px 8px" }}>Fecha Fin</th>
                    <th style={{ padding:"6px 8px", textAlign:"right" }}>Monto</th>
                    <th style={{ padding:"6px 8px" }}>Estado</th>
                    <th style={{ padding:"6px 8px" }}>N° Conformidad</th>
                    <th style={{ padding:"6px 8px" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.armadas.map(a=>(
                    <tr key={a.id} style={{ borderBottom:"1px solid #eee", background: a.idConformidad?"#f0fdf4":"#fff" }}>
                      <td style={{ padding:"6px 8px", fontWeight:700 }}>{String(a.nroArmada).padStart(3,"0")}</td>
                      <td style={{ padding:"6px 8px", textAlign:"center" }}>{a.fechaInicio}</td>
                      <td style={{ padding:"6px 8px", textAlign:"center" }}>{a.fechaFin}</td>
                      <td style={{ padding:"6px 8px", textAlign:"right" }}>S/ {parseFloat(a.montoArmada||0).toFixed(2)}</td>
                      <td style={{ padding:"6px 8px", textAlign:"center" }}>
                        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:700,
                          background: a.idConformidad?"#bbf7d0":"#fef3c7", color: a.idConformidad?"#166534":"#92400e" }}>
                          {a.idConformidad?"EMITIDO":"PENDIENTE"}
                        </span>
                      </td>
                      <td style={{ padding:"6px 8px", fontSize:11, color:"#1e40af" }}>{a.nroConformidad||"—"}</td>
                      <td style={{ padding:"6px 8px", textAlign:"center" }}>
                        {!a.idConformidad && (
                          <button onClick={()=>setConformModal({ armada:a, orden:detalle.orden })}
                            style={{ fontSize:11, padding:"3px 10px", background:"#2563eb", color:"#fff", border:"none", borderRadius:4, cursor:"pointer" }}>
                            ✓ Registrar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {conformModal && (
        <ConformidadModal
          armada={conformModal.armada}
          orden={conformModal.orden}
          onClose={()=>setConformModal(null)}
          onSaved={()=>{ setConformModal(null); openDetalle(selectedOrden); }}
        />
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

  const handleLogin = () => {
    setError("");
    if (!usuario.trim() || !contrasena.trim()) { setError("Ingrese su usuario y contraseña"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ nombre: usuario.toUpperCase(), rol: "ESPECIALISTA DE ABASTECIMIENTO" }); }, 800);
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
              style={{ width:"100%", padding:"12px 14px", border:"2px solid #e8e8e8", borderRadius:10, fontSize:13.5, outline:"none", background:"#fafbfc", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:28 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", display:"block", marginBottom:6 }}>Contraseña</label>
            <div style={{ position:"relative" }}>
              <input type={showPassword ? "text" : "password"} value={contrasena} onChange={e => setContrasena(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ingrese su contraseña"
                style={{ width:"100%", padding:"12px 42px 12px 14px", border:"2px solid #e8e8e8", borderRadius:10, fontSize:13.5, outline:"none", background:"#fafbfc", boxSizing:"border-box" }} />
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
export default function SGCApp() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [expandedMenus, setExpandedMenus] = useState({ contratoMenor: true });

  const toggleMenu = useCallback((key) => { setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] })); }, []);
  const handleLogout = () => { setUser(null); setActiveMenu("inicio"); };

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
    <div style={{ fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight:"100vh", display:"flex", flexDirection:"column", background:"#f4f5f7" }}>
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
        <main style={{ flex:1, padding:24, overflowY:"auto", maxHeight:"calc(100vh - 52px)" }}>{renderPage()}</main>
      </div>
    </div>
  );
}
