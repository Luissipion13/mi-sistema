import { useState, useEffect, useCallback } from "react";

// ============================================================
// SISTEMA DE GESTIÓN DE CONTRATACIONES — ITP RED CITE
// ============================================================

const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3001/api" 
  : "https://victory-pogo-sash.ngrok-free.dev/api";

const api = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
	headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },    ...options,
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
            { icon:"📋", label:"Ver detalle", onClick: r => setSelectedOrder(r) },
            { icon:"🖨️", label:"Imprimir", onClick: () => {} },
          ]} />
      ) : (
        <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
          No se encontraron registros. Haz clic en "Actualizar lista" para cargar desde el SIGA.
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 0", fontSize:12, color:"#555", borderTop:"1px solid #eee", marginTop:8 }}>
          <button onClick={() => setPage(1)} disabled={page <= 1} style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page <= 1 ? "#f0f0f0" : "#fff", cursor: page <= 1 ? "default" : "pointer" }}>⏮</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page <= 1 ? "#f0f0f0" : "#fff", cursor: page <= 1 ? "default" : "pointer" }}>◀</button>
          <span>Página <strong>{page}</strong> de <strong>{totalPages}</strong> ({total} registros)</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page >= totalPages ? "#f0f0f0" : "#fff", cursor: page >= totalPages ? "default" : "pointer" }}>▶</button>
          <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, background: page >= totalPages ? "#f0f0f0" : "#fff", cursor: page >= totalPages ? "default" : "pointer" }}>⏭</button>
          <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value)); setPage(1); }} style={{ padding:"4px 8px", border:"1px solid #ccc", borderRadius:4, fontSize:12, marginLeft:8 }}>
            <option value={20}>20</option><option value={35}>35</option><option value={50}>50</option><option value={100}>100</option>
          </select>
        </div>
      )}

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
    </div>
  );
};

const ConformidadesPage = () => {
  const { values, onChange, onClear } = useFilters({});
  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>Conformidades de Bienes y Servicios – Contratos Menores</h2>
      <FilterBar values={values} onChange={onChange} onClear={onClear} filters={[
        { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
        { key:"tipoBien", label:"Tipo Orden", type:"select", options:["(TODOS)","B","S"] },
        { key:"nOrden", label:"N° Orden", type:"input", width:110 },
        { key:"proveedor", label:"Proveedor", type:"input", width:140 },
      ]} />
      <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", marginBottom:8, background:"#eef2f7", padding:"8px 12px", borderRadius:4 }}>LISTADO</div>
      <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
        Módulo de conformidades se habilitará cuando se generen cronogramas en las órdenes.
      </div>
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
