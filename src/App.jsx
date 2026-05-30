import { useState, useEffect, useCallback } from "react";

// ============================================================
// SISTEMA DE GESTIÓN DE CONTRATACIONES — ITP RED CITE
// ============================================================

// --- DATA LAYER ---
const ORDENES_ASP = [
  { id:1, ano:2026, tipoBien:"S", nOrden:"0000001956", fecha:"29/05/2026", usuarioSiga:"TAPIA ALARCON, YENNY", expSiaf:"0000004169", concepto:"SERVICIO DE ASESORÍA Y DEFENSA LEGAL A FAVOR DE LA EX SERVIDORA", proveedor:"ESTUDIO LEGUA & VILLANUEVA ABOGADOS SAC", monto:16920.00, tipoContratacion:"ASP BIENES Y SERVICIOS", nArmadas:1, estadoCrono:"sinCrono" },
  { id:2, ano:2026, tipoBien:"S", nOrden:"0000001955", fecha:"29/05/2026", usuarioSiga:"VILLEGAS RAMIREZ, ANGELICA CELESTE", expSiaf:"0000004161", concepto:"SERVICIO ESPECIALIZADO PARA LA ELABORACIÓN DE LINEAMIENTOS TÉCNICOS PARA LA SOSTENIBILIDAD DEL SISTEMA DE SEGUIMIENTO", proveedor:"EDDY SANTIAGO ZEVALLOS QUISPE", monto:24000.00, tipoContratacion:"OTROS - DIFERENTE A ASP", nArmadas:2, estadoCrono:"conCrono" },
  { id:3, ano:2026, tipoBien:"S", nOrden:"0000001954", fecha:"29/05/2026", usuarioSiga:"VILLEGAS RAMIREZ, ANGELICA CELESTE", expSiaf:"0000004160", concepto:"SERVICIO PARA LA IMPLEMENTACIÓN DE LA GESTIÓN DEL CONOCIMIENTO, PRIORIZANDO PROCESOS MISIONALES", proveedor:"HERRERA MENDOZA JOSE FREDDI", monto:24000.00, tipoContratacion:"OTROS - DIFERENTE A ASP", nArmadas:2, estadoCrono:"conCrono" },
  { id:4, ano:2026, tipoBien:"S", nOrden:"0000001953", fecha:"29/05/2026", usuarioSiga:"VILLEGAS RAMIREZ, ANGELICA CELESTE", expSiaf:"0000004159", concepto:"SERVICIO PARA EL DISEÑO ESTADÍSTICO Y ANÁLISIS DE DATOS PARA EL SISTEMA DE SEGUIMIENTO BASADO EN COHORTES DEL ITP", proveedor:"CHAVEZ CAMPOMANES YOEL ERICK", monto:12000.00, tipoContratacion:"OTROS - DIFERENTE A ASP", nArmadas:2, estadoCrono:"sinCrono" },
  { id:5, ano:2026, tipoBien:"S", nOrden:"0000001952", fecha:"29/05/2026", usuarioSiga:"VILLEGAS RAMIREZ, ANGELICA CELESTE", expSiaf:"0000004158", concepto:"SERVICIO ESPECIALIZADO PARA LA ELABORACIÓN DE LINEAMIENTOS PARA LA GESTIÓN Y OPERACIÓN DEL PADRÓN NOMINAL", proveedor:"AGURTO CODARLUPO GABY TERESA", monto:20000.00, tipoContratacion:"OTROS - DIFERENTE A ASP", nArmadas:2, estadoCrono:"conCrono" },
  { id:6, ano:2026, tipoBien:"S", nOrden:"0000001951", fecha:"29/05/2026", usuarioSiga:"SICCHE YNGA, JOHANNA JUDITH", expSiaf:"0000004156", concepto:"SERVICIO ESPECIALIZADO EN VIGILANCIA Y FISCALIZACIÓN EN EL CUMPLIMIENTO DE LOS TEMAS AMBIENTALES", proveedor:"MALLMA VIVANCO NATALI SOFIA", monto:10500.00, tipoContratacion:"TERCEROS", nArmadas:2, estadoCrono:"sinCrono" },
  { id:7, ano:2026, tipoBien:"S", nOrden:"0000001950", fecha:"29/05/2026", usuarioSiga:"ALCANTARA SANTILLAN, CARITO STEFANY", expSiaf:"", concepto:"SERVICIO DE MANTENIMIENTO CORRECTIVO DE HOMOGENIZADOR (AGITADOR) PARA EL LABORATORIO DE MICROBIOLOGÍA", proveedor:"LEYD AUTOMATIZACIÓN INDUSTRIAL S.A.C.", monto:4248.00, tipoContratacion:"ASP BIENES Y SERVICIOS", nArmadas:1, estadoCrono:"sinCrono" },
  { id:8, ano:2026, tipoBien:"B", nOrden:"0000000585", fecha:"29/05/2026", usuarioSiga:"SANCHEZ LLUNCOR, JOSE FELIX", expSiaf:"0000004187", concepto:"ADQUISICION DE INDUMENTARIA PARA EL CITE TEXTIL CAMELIDOS PUNO", proveedor:"EFICIENCIA TEXTIL E.I.R.L", monto:6440.00, tipoContratacion:"ASP BIENES Y SERVICIOS", nArmadas:1, estadoCrono:"conCrono" },
  { id:9, ano:2026, tipoBien:"B", nOrden:"0000000584", fecha:"29/05/2026", usuarioSiga:"YUFRA VARGAS, PAOLO", expSiaf:"0000004168", concepto:"ADQUISICION DE TONERS", proveedor:"CORPORACION INTEGRA PERUANA E.I.R.L", monto:1572.94, tipoContratacion:"ACUERDO MARCO - BIENES", nArmadas:1, estadoCrono:"sinCrono" },
  { id:10, ano:2026, tipoBien:"B", nOrden:"0000000583", fecha:"29/05/2026", usuarioSiga:"YUFRA VARGAS, PAOLO", expSiaf:"0000004167", concepto:"ADQUISICION DE TONERS", proveedor:"CORPORACION INTEGRA PERUANA E.I.R.L", monto:1572.94, tipoContratacion:"ACUERDO MARCO - BIENES", nArmadas:1, estadoCrono:"sinCrono" },
];

const CONFORMIDADES_DATA = [
  { id:1, ano:2026, tipoBien:"B", nOrden:"0000000001", fecha:"14/01/2026", concepto:"ADQUISICIÓN DE COMBUSTIBLE DIESEL B5 S50 PARA EL CITE CUERO Y CALZADO AREQUIPA CONTRATO N° 025-2025-ITP/OA-UFABAST", proveedor:"TPA SERVICENTRO S.R.L", centroCosto:"CITE CUERO CALZADO AREQUIPA", monto:2833.50 },
  { id:2, ano:2026, tipoBien:"B", nOrden:"0000000002", fecha:"18/01/2026", concepto:"PC 18 - ADQUISICION DE DIESEL B5 S50 PARA EL CITEAGROINDUSTRIAL OXAPAMPA", proveedor:"ESTACION DE SERVICIOS LAS ORQUIDEAS S.A.C.", centroCosto:"CITE AGROINDUSTRIAL OXAPAMPA", monto:10200.00 },
  { id:3, ano:2026, tipoBien:"B", nOrden:"0000000005", fecha:"20/01/2026", concepto:"AGUA DE MESA CITE FORESTAL MAYNAS", proveedor:"HIDRO SERVICE E I R LTDA", centroCosto:"CITE FORESTAL MAYNAS", monto:240.00 },
  { id:4, ano:2026, tipoBien:"B", nOrden:"0000000007", fecha:"21/01/2026", concepto:"ADQUISICIÓN DE SUMINISTRO DE COMBUSTIBLE CITE FORESTAL MAYNAS", proveedor:"INVERSIONES R. ORTIZ S.A.C.", centroCosto:"CITE FORESTAL MAYNAS", monto:13906.00 },
  { id:5, ano:2026, tipoBien:"B", nOrden:"0000000008", fecha:"21/01/2026", concepto:"PEDIDO 48 49 ADQUISICION DE COMBUSTIBLES PARA EL CITE AGROINDUSTRIAL HUALLAGA", proveedor:"GRIFO INVERSIONES GARCIA SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA", centroCosto:"CITE AGROINDUSTRIAL HUALLAGA", monto:13109.60 },
  { id:6, ano:2026, tipoBien:"B", nOrden:"0000000009", fecha:"21/01/2026", concepto:"ADQUISICION DE MEDIOS DE CULTIVO PARA ANALISIS MICROBIOLOGICO SALMONELLA SPP Y MOHOS-LEVADURAS EN EL CITE AGROINDUSTRIAL CHAVIMOCHIC", proveedor:"BIOGENICS LAB S.A.C.", centroCosto:"CITE AGROINDUSTRIAL CHAVIMOCHIC", monto:1408.00 },
  { id:7, ano:2026, tipoBien:"B", nOrden:"0000000010", fecha:"21/01/2026", concepto:"ADQUISICION DE MEDIOS DE CULTIVO PARA ANALISIS MICROBIOLOGICO SALMONELLA SP Y REACTIVOS PARA EL LAVADO DE MATERIAL", proveedor:"BIOGENICS LAB S.A.C.", centroCosto:"CITE AGROINDUSTRIAL CHAVIMOCHIC", monto:6085.00 },
  { id:8, ano:2026, tipoBien:"B", nOrden:"0000000011", fecha:"22/01/2026", concepto:"ADQUISICION DE ASTAS DE METAL PARA BANDERAS DEL CENTRO DE INNOVACION PRODUCTIVA Y TRANSFERENCIA", proveedor:"METAL MECANICA PUEBLO NUEVO DE COLAN S.A.C.", centroCosto:"CITE CUERO CALZADO LIMA", monto:3140.00 },
];

const CONSTANCIAS_DATA = [
  { id:1, ano:2026, tipoBien:"S", nOrden:"0000000001", fecha:"07/01/2026", usuarioSiga:"ESPECIALISTABAS224", expSiaf:"0000000002", concepto:"SERVICIO DE MANTENIMIENTO Y LIMPIEZA DE INMUEBLES, PARA EL CITEAGROINDUSTRIAL ICA", proveedor:"LOVERA DE LA CRUZ CHRISTIAN EMILIO", monto:9000.00, tipoContratacion:"TERCEROS" },
  { id:2, ano:2026, tipoBien:"S", nOrden:"0000000003", fecha:"07/01/2026", usuarioSiga:"ESPECIALISTABAS108", expSiaf:"0000000004", concepto:"SERVICIO DE ORGANIZACIÓN DE EVENTO PARA LA REALIZACIÓN DE LA CEREMONIA CITE AGROINDUSTRIAL ICA", proveedor:"CLOTILDE CONSUELO ROCHA EURIBE", monto:3800.00, tipoContratacion:"ASP BIENES Y SERVICIOS" },
  { id:3, ano:2026, tipoBien:"S", nOrden:"0000000004", fecha:"07/01/2026", usuarioSiga:"ESPECIALISTABAS225", expSiaf:"0000000005", concepto:"CONTRATACIÓN DEL SERVICIO DE CAMPO PARA EL MANEJO DE LABORES CULTURALES AGRICOLAS CITEAGROICA- ITP CCP-018", proveedor:"LEVANO QUISPE HERMES DANIEL", monto:12000.00, tipoContratacion:"TERCEROS" },
  { id:4, ano:2026, tipoBien:"S", nOrden:"0000000002", fecha:"07/01/2026", usuarioSiga:"ESPECIALISTABAS225", expSiaf:"0000000003", concepto:"CONTRATACIÓN DEL SERVICIO DE LIMPIEZA DE INSTALACIONES PARA EL CITEAGROINDUSTRIAL ICA - ITP CCP-009", proveedor:"ORMEÑO HERNANDEZ MARLENE MARIBEL", monto:9000.00, tipoContratacion:"TERCEROS" },
  { id:5, ano:2026, tipoBien:"S", nOrden:"0000000005", fecha:"07/01/2026", usuarioSiga:"ESPECIALISTABAS224", expSiaf:"0000000006", concepto:"SERVICIO DE MANTENIMIENTO Y DE LIMPIEZA DE LAS INSTALACIONES DEL CITEAGROINDUSTRIAL ICA", proveedor:"YNJANTE AJALCRIÑA LINA MARGOT", monto:8000.00, tipoContratacion:"TERCEROS" },
  { id:6, ano:2026, tipoBien:"S", nOrden:"0000000006", fecha:"07/01/2026", usuarioSiga:"ESPECIALISTABAS198", expSiaf:"0000000007", concepto:"CONTRATACIÓN DEL SERVICIO DE LIMPIEZA DE INSTALACIONES PARA EL CITEAGROINDUSTRIAL ICA, DEL INSTITUTO", proveedor:"CALDERON PEÑA DELIA LILIANA", monto:9000.00, tipoContratacion:"TERCEROS" },
];

// --- COMPONENTS ---

const Logo = () => (
  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
    <div style={{ fontFamily:"'Segoe UI',sans-serif", fontWeight:800, fontSize:18, color:"#c0392b", letterSpacing:1 }}>
      CONTRATACIÓN
    </div>
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
    <div style={{
      width:220, minHeight:"100vh", background:"linear-gradient(180deg,#2c3e6b 0%,#34495e 100%)",
      color:"#fff", paddingTop:8, flexShrink:0, overflowY:"auto",
      boxShadow:"2px 0 12px rgba(0,0,0,0.15)"
    }}>
      {menuItems.map(item => (
        <div key={item.key}>
          <div
            onClick={() => item.sub.length ? toggleMenu(item.key) : setActiveMenu(item.key)}
            style={{
              padding:"12px 18px", cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"space-between", fontSize:13.5, fontWeight:500,
              background: activeMenu === item.key || item.sub.some(s => s.key === activeMenu) ? "rgba(255,255,255,0.12)" : "transparent",
              borderLeft: activeMenu === item.key || item.sub.some(s => s.key === activeMenu) ? "3px solid #e74c3c" : "3px solid transparent",
              transition:"all 0.2s"
            }}
          >
            <span style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:15 }}>{item.icon}</span>
              {item.label}
            </span>
            {item.sub.length > 0 && (
              <span style={{ fontSize:10, transition:"transform 0.2s", transform: expandedMenus[item.key] ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
            )}
          </div>
          {item.sub.length > 0 && expandedMenus[item.key] && (
            <div style={{ background:"rgba(0,0,0,0.15)" }}>
              {item.sub.map(sub => (
                <div
                  key={sub.key}
                  onClick={() => setActiveMenu(sub.key)}
                  style={{
                    padding:"10px 18px 10px 48px", cursor:"pointer", fontSize:12.5,
                    background: activeMenu === sub.key ? "rgba(255,255,255,0.1)" : "transparent",
                    borderLeft: activeMenu === sub.key ? "3px solid #e67e22" : "3px solid transparent",
                    transition:"all 0.15s"
                  }}
                >
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
  <div
    onClick={onClick}
    style={{
      flex:1, minWidth:200, border:"1px solid #e0e0e0", borderRadius:6,
      overflow:"hidden", cursor:"pointer", transition:"box-shadow 0.2s",
      boxShadow:"0 2px 6px rgba(0,0,0,0.06)"
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)"}
  >
    <div style={{ background:color, color:"#fff", padding:"10px 16px", fontSize:11.5, fontWeight:700, textAlign:"center", letterSpacing:0.8, textTransform:"uppercase" }}>
      {title}
    </div>
    <div style={{ padding:"18px 16px", textAlign:"center" }}>
      <div style={{ fontSize:32, fontWeight:700, color:"#2c3e50" }}>{value}</div>
      <div style={{ fontSize:12, color:"#7f8c8d", marginTop:2 }}>{subtitle}</div>
      <div style={{ fontSize:11, color:"#3498db", marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
        🔍 Ver detalle
      </div>
    </div>
  </div>
);

const StatsBlock = ({ title, items, color }) => (
  <div style={{ flex:1, minWidth:220, border:"1px solid #e0e0e0", borderRadius:6, overflow:"hidden" }}>
    <div style={{ background:color, color:"#fff", padding:"10px 16px", fontSize:11, fontWeight:700, textAlign:"center", letterSpacing:0.8, textTransform:"uppercase" }}>
      {title}
    </div>
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
            <select
              value={values[f.key] || ""}
              onChange={e => onChange(f.key, e.target.value)}
              style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, minWidth:130 }}
            >
              {f.options.map((o,j) => <option key={j} value={o === "(TODOS)" ? "" : o}>{o}</option>)}
            </select>
          ) : (
            <input
              value={values[f.key] || ""}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder||""}
              style={{ padding:"6px 10px", border:"1px solid #ccc", borderRadius:4, fontSize:12, width: f.width || 120 }}
            />
          )}
        </div>
      ))}
      <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
        <button onClick={onClear} style={{ padding:"8px 18px", background:"#fff", color:"#555", border:"1px solid #ccc", borderRadius:4, cursor:"pointer", fontSize:12 }}>
          🧹 Limpiar
        </button>
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
            <th key={i} style={{ padding:"10px 8px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign: col.align || "left", whiteSpace:"nowrap" }}>
              {col.label}
            </th>
          ))}
          {actions && <th style={{ padding:"10px 8px", borderBottom:"2px solid #bdc3c7", fontSize:11, fontWeight:700, color:"#2c3e50", textAlign:"center" }}>ACCIONES</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            onClick={() => onRowClick && onRowClick(row)}
            style={{
              background: idx % 2 === 0 ? "#fff" : "#f9fafb",
              cursor: onRowClick ? "pointer" : "default",
              transition:"background 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#eaf2ff"}
            onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f9fafb"}
          >
            <td style={{ padding:"8px", textAlign:"center", borderBottom:"1px solid #eee", color:"#7f8c8d" }}>{idx + 1}</td>
            {columns.map((col, i) => (
              <td key={i} style={{
                padding:"8px", borderBottom:"1px solid #eee",
                textAlign: col.align || "left",
                maxWidth: col.maxWidth || "none",
                overflow:"hidden", textOverflow:"ellipsis",
                color: col.key === "estadoCrono" ? (row[col.key]==="sinCrono"?"#e74c3c":row[col.key]==="conCrono"?"#27ae60":"#e67e22") : "#2c3e50",
                fontWeight: col.key === "monto" ? 600 : 400
              }}>
                {col.format ? col.format(row[col.key], row) : row[col.key]}
              </td>
            ))}
            {actions && (
              <td style={{ padding:"8px", textAlign:"center", borderBottom:"1px solid #eee" }}>
                <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                  {actions.map((a, ai) => (
                    <button key={ai} onClick={(e) => { e.stopPropagation(); a.onClick(row); }}
                      title={a.label}
                      style={{ padding:"4px 8px", background:"#f0f0f0", border:"1px solid #ddd", borderRadius:3, cursor:"pointer", fontSize:13 }}>
                      {a.icon}
                    </button>
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

// --- MODAL ---
const Modal = ({ open, onClose, title, subtitle, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
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

// --- DETAIL FIELD ---
const Field = ({ label, value, color }) => (
  <div style={{ flex:1, minWidth:140 }}>
    <div style={{ fontSize:10, fontWeight:700, color: color || "#2c3e6b", textTransform:"uppercase", letterSpacing:0.3, marginBottom:2 }}>{label}</div>
    <div style={{ fontSize:12.5, color:"#2c3e50", background:"#f5f6fa", padding:"6px 10px", borderRadius:4, border:"1px solid #e8e8e8" }}>{value || "—"}</div>
  </div>
);

// --- FILTER HELPER ---
const useFilters = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const onChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }));
  const onClear = () => setValues(initialValues);
  return { values, onChange, onClear };
};

const applyFilters = (data, values, config) => {
  return data.filter(row => {
    return config.every(({ key, field, match }) => {
      const v = (values[key] || "").trim();
      if (!v) return true;
      const cellVal = String(row[field] || "");
      if (match === "exact") return cellVal === v;
      return cellVal.toLowerCase().includes(v.toLowerCase());
    });
  });
};

// --- PAGES ---

const HomePage = ({ setActiveMenu }) => {
  const today = new Date().toLocaleDateString("es-PE", { day:"2-digit", month:"2-digit", year:"numeric" });
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:12, color:"#555" }}>Materiales para el usuario :</div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ padding:"8px 16px", background:"#27ae60", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:11.5, fontWeight:600 }}>📹 VIDEOTUTORIALES</button>
          <button style={{ padding:"8px 16px", background:"#e74c3c", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:11.5, fontWeight:600 }}>📄 MANUALES DE USUARIO</button>
        </div>
      </div>

      <div style={{ fontSize:14, fontWeight:700, color:"#2c3e50", marginBottom:16 }}>
        ALERTAS AL <span style={{ color:"#e74c3c" }}>{today}</span> – Contrato Menor y Otras modalidades (Diferentes a CM)
      </div>

      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:24 }}>
        <StatCard title="SIN CRONOGRAMA" value="40" subtitle="Órdenes" color="#2c3e6b" onClick={()=>setActiveMenu("actuaciones")} />
        <StatCard title="VENCEN HOY" value="10" subtitle="Órdenes" color="#e74c3c" onClick={()=>setActiveMenu("actuaciones")} />
        <StatCard title="VENCEN PROX. 7 DÍAS" value="61" subtitle="Órdenes" color="#e67e22" onClick={()=>setActiveMenu("actuaciones")} />
      </div>

      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:32 }}>
        <StatCard title="LOCADORES VIGENTES" value="553" subtitle="Órdenes" color="#2c3e6b" onClick={()=>setActiveMenu("actuaciones")} />
        <StatCard title="VENCEN HOY" value="53" subtitle="Entregables" color="#e74c3c" onClick={()=>setActiveMenu("conformidades")} />
        <StatCard title="VENCEN PROX. 7 DÍAS" value="328" subtitle="Entregables" color="#e67e22" onClick={()=>setActiveMenu("conformidades")} />
      </div>

      <div style={{ fontSize:14, fontWeight:700, color:"#2c3e50", marginBottom:16 }}>
        ESTADÍSTICAS AL <span style={{ color:"#e74c3c" }}>{today}</span> – Contrato Menor y Otras modalidades (Diferentes a CM)
      </div>

      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
        <StatsBlock title="CANTIDAD A LA FECHA" color="#2c3e6b" items={[
          { label:"Orden de Compra", value:"504" },
          { label:"Orden de Servicio", value:"1,812" },
          { label:"Total", value:"2,316", bold:true },
        ]} />
        <StatsBlock title="CANTIDAD DEL MES" color="#3498db" items={[
          { label:"Orden de Compra", value:"124" },
          { label:"Orden de Servicio", value:"216" },
          { label:"Total", value:"340", bold:true },
        ]} />
        <StatsBlock title="MONTO A LA FECHA" color="#16a085" items={[
          { label:"Orden de Compra", value:"4,816,915.89" },
          { label:"Orden de Servicio", value:"28,791,884.46" },
          { label:"Total", value:"33,608,800.35", bold:true },
        ]} />
        <StatsBlock title="MONTO AL MES" color="#e67e22" items={[
          { label:"Orden de Compra", value:"1,048,363.34" },
          { label:"Orden de Servicio", value:"2,861,932.26" },
          { label:"Total", value:"3,910,295.60", bold:true },
        ]} />
      </div>
    </div>
  );
};

const ActuacionesPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { values, onChange, onClear } = useFilters({});

  const filterConfig = [
    { key:"ano", field:"ano", match:"contains" },
    { key:"tipoBien", field:"tipoBien", match:"exact" },
    { key:"tipoContratacion", field:"tipoContratacion", match:"exact" },
    { key:"nOrden", field:"nOrden", match:"contains" },
    { key:"concepto", field:"concepto", match:"contains" },
    { key:"proveedor", field:"proveedor", match:"contains" },
    { key:"expSiaf", field:"expSiaf", match:"contains" },
    { key:"usuarioSiga", field:"usuarioSiga", match:"exact" },
  ];

  const uniqueUsuarios = [...new Set(ORDENES_ASP.map(o => o.usuarioSiga))];
  const filtered = applyFilters(ORDENES_ASP, values, filterConfig);

  const columns = [
    { key:"ano", label:"AÑO", align:"center" },
    { key:"tipoBien", label:"TIPO BIEN", align:"center" },
    { key:"nOrden", label:"N° ORDEN" },
    { key:"fecha", label:"FECHA ORDEN", align:"center" },
    { key:"usuarioSiga", label:"USUARIO SIGA" },
    { key:"expSiaf", label:"EXP. SIAF" },
    { key:"concepto", label:"CONCEPTO", maxWidth:280 },
    { key:"proveedor", label:"PROVEEDOR", maxWidth:200 },
    { key:"monto", label:"MONTO (S/)", align:"right", format:v=> v.toLocaleString("es-PE",{minimumFractionDigits:2}) },
    { key:"tipoContratacion", label:"TIPO CONTRATACIÓN" },
    { key:"nArmadas", label:"N° ARMADAS", align:"center" },
  ];

  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>
        Actuaciones Contractuales – Órdenes de Bienes y Servicios de Contratos Menores
      </h2>
      <FilterBar
        values={values}
        onChange={onChange}
        onClear={onClear}
        filters={[
          { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
          { key:"tipoBien", label:"Tipo Bien", type:"select", options:["(TODOS)","B","S"] },
          { key:"tipoContratacion", label:"Tipo Contratación", type:"select", options:["(TODOS)","ASP BIENES Y SERVICIOS","TERCEROS","OTROS - DIFERENTE A ASP","ACUERDO MARCO - BIENES"] },
          { key:"nOrden", label:"N° Orden", type:"input", width:110 },
          { key:"concepto", label:"Concepto", type:"input", width:150 },
          { key:"proveedor", label:"Proveedor", type:"input", width:140 },
          { key:"expSiaf", label:"N° Exp. SIAF", type:"input", width:100 },
          { key:"usuarioSiga", label:"Usuario SIGA", type:"select", options:["(TODOS)", ...uniqueUsuarios] },
        ]}
      />
      <div style={{ marginBottom:8, display:"flex", gap:16, fontSize:11.5, color:"#555", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:16 }}>
          <span>LEYENDA:</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:12, background:"#fff", border:"1px solid #ccc", display:"inline-block" }}></span> Sin Cronograma</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:12, background:"#27ae60", display:"inline-block" }}></span> Con Cronograma</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:12, height:12, background:"#e74c3c", display:"inline-block" }}></span> Anulado</span>
        </div>
        <span style={{ fontSize:12, color:"#2c3e6b", fontWeight:600 }}>{filtered.length} registro(s) encontrado(s)</span>
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", marginBottom:8, background:"#eef2f7", padding:"8px 12px", borderRadius:4 }}>LISTADO</div>
      {filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={setSelectedOrder}
          actions={[
            { icon:"📋", label:"Ver cronograma", onClick: r => setSelectedOrder(r) },
            { icon:"🖨️", label:"Imprimir", onClick: () => {} },
          ]}
        />
      ) : (
        <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
          No se encontraron registros con los filtros aplicados.
        </div>
      )}

      <Modal open={!!selectedOrder} onClose={()=>setSelectedOrder(null)} title="Detalles de la Orden" subtitle="Ingrese los datos para registrar el cronograma">
        {selectedOrder && (
          <div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <Field label="Ejecutora" value="001" />
              <Field label="N° Orden" value={selectedOrder.nOrden} />
              <Field label="Fecha Orden" value={selectedOrder.fecha} />
              <Field label="Monto" value={`S/ ${selectedOrder.monto.toLocaleString("es-PE",{minimumFractionDigits:2})}`} />
              <Field label="RUC" value="20548045399" />
              <Field label="Proveedor" value={selectedOrder.proveedor} />
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <Field label="Exp. SIAF" value={selectedOrder.expSiaf} />
              <Field label="Área Usuaria" value="OFICINA DE ADMINISTRACION" />
              <Field label="Concepto" value={selectedOrder.concepto} />
              <Field label="Especialista Giro" value={selectedOrder.usuarioSiga} />
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", marginBottom:12, borderBottom:"2px solid #2c3e6b", paddingBottom:4 }}>Datos del Cronograma</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20 }}>
              <Field label="Tipo Contratación (*)" value={selectedOrder.tipoContratacion} color="#c0392b" />
              <Field label="Sistema Contratación (*)" value="SUMA ALZADA" color="#c0392b" />
              <Field label="Condición de Inicio (*)" value="DÍA SIGUIENTE DE PERFECCIONADO EL CONTRATO" color="#c0392b" />
              <Field label="Plazo" value="30" />
              <Field label="Total Armadas (*)" value={String(selectedOrder.nArmadas)} color="#c0392b" />
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", marginBottom:12, borderBottom:"2px solid #2c3e6b", paddingBottom:4 }}>Cuotas por pagar</div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, marginBottom:16 }}>
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
                <tr>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"center" }}>1</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"center" }}>001</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"center", background:"#d5f5e3" }}>30</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"center" }}>29/05/2026</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"center" }}>27/06/2026</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"right" }}>100.00</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"right", background:"#d5f5e3", fontWeight:700 }}>{selectedOrder.monto.toLocaleString("es-PE",{minimumFractionDigits:2})}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, alignItems:"center", fontSize:13 }}>
              <span style={{ fontWeight:700, color:"#2c3e50" }}>MONTO TOTAL ARMADAS</span>
              <span style={{ fontWeight:700, color:"#2c3e50" }}>S/</span>
              <span style={{ fontWeight:700, fontSize:16, color:"#2c3e50", background:"#f5f6fa", padding:"4px 12px", borderRadius:4, border:"1px solid #ddd" }}>{selectedOrder.monto.toLocaleString("es-PE",{minimumFractionDigits:2})}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ConformidadesPage = () => {
  const [selectedConf, setSelectedConf] = useState(null);
  const { values, onChange, onClear } = useFilters({});

  const filterConfig = [
    { key:"ano", field:"ano", match:"contains" },
    { key:"tipoBien", field:"tipoBien", match:"exact" },
    { key:"nOrden", field:"nOrden", match:"contains" },
    { key:"proveedor", field:"proveedor", match:"contains" },
    { key:"centroCosto", field:"centroCosto", match:"exact" },
  ];

  const uniqueCentros = [...new Set(CONFORMIDADES_DATA.map(c => c.centroCosto))];
  const filtered = applyFilters(CONFORMIDADES_DATA, values, filterConfig);

  const columns = [
    { key:"ano", label:"AÑO", align:"center" },
    { key:"tipoBien", label:"TIPO BIEN", align:"center" },
    { key:"nOrden", label:"N° ORDEN" },
    { key:"fecha", label:"FECHA ORDEN", align:"center" },
    { key:"concepto", label:"CONCEPTO", maxWidth:320 },
    { key:"proveedor", label:"PROVEEDOR", maxWidth:240 },
    { key:"centroCosto", label:"CENTRO DE COSTO" },
    { key:"monto", label:"MONTO ORDEN (S/)", align:"right", format:v => v.toLocaleString("es-PE",{minimumFractionDigits:2}) },
  ];

  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>
        Conformidades de Bienes y Servicios – Contratos Menores
      </h2>
      <FilterBar
        values={values}
        onChange={onChange}
        onClear={onClear}
        filters={[
          { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
          { key:"centroCosto", label:"Centro de Costo", type:"select", options:["(TODOS)", ...uniqueCentros] },
          { key:"tipoBien", label:"Tipo Orden", type:"select", options:["(TODOS)","B","S"] },
          { key:"nOrden", label:"N° Orden", type:"input", width:110 },
          { key:"proveedor", label:"Proveedor", type:"input", width:140 },
        ]}
      />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", background:"#eef2f7", padding:"8px 12px", borderRadius:4, flex:1 }}>LISTADO</div>
        <span style={{ fontSize:12, color:"#2c3e6b", fontWeight:600, marginLeft:12 }}>{filtered.length} registro(s)</span>
      </div>
      {filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered} onRowClick={setSelectedConf}
          actions={[{ icon:"🔍", label:"Ver detalle", onClick:r => setSelectedConf(r) }]}
        />
      ) : (
        <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
          No se encontraron registros con los filtros aplicados.
        </div>
      )}

      <Modal open={!!selectedConf} onClose={()=>setSelectedConf(null)} title="Registro de conformidad" subtitle="Ingrese los datos para registrar la conformidad de la armada">
        {selectedConf && (
          <div>
            <div style={{ background:"#fef9f0", border:"1px solid #f0d9a0", borderRadius:6, padding:16, marginBottom:20 }}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                <Field label="Año" value={selectedConf.ano} />
                <Field label="Tipo Orden" value={selectedConf.tipoBien} />
                <Field label="N° Orden" value={selectedConf.nOrden} />
                <Field label="Fecha Orden" value={selectedConf.fecha} />
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginTop:12 }}>
                <Field label="N° Armada" value="001" />
                <Field label="Fecha Vencimiento de Producto" value="01/02/2026" />
                <Field label="Concepto" value={selectedConf.concepto} />
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:16 }}>
              <Field label="F. Conformidad" value="27/01/2026" />
              <Field label="F. Entrega Producto (*)" value="14/01/2026" color="#c0392b" />
              <Field label="Días Retraso" value="0" />
              <Field label="Corresponde Penalidad" value="NO" />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:10.5, fontWeight:700, color:"#c0392b", textTransform:"uppercase" }}>NOTA</label>
              <textarea style={{ width:"100%", padding:10, border:"1px solid #ccc", borderRadius:4, fontSize:12, minHeight:60, marginTop:4 }}
                defaultValue="LA ADQUISICIÓN CORRESPONDE AL NOVENO PAGO DEL CONTRATO" />
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#2c3e6b", marginBottom:8, borderBottom:"2px solid #2c3e6b", paddingBottom:4 }}>LISTADO DE ITEMS</div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, marginBottom:16 }}>
              <thead>
                <tr style={{ background:"#ecf0f1" }}>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>#</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>CÓDIGO ITEM</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>DESCRIPCIÓN ITEM</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>UNIDAD MEDIDA</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>CANTIDAD O/C</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>CANTIDAD RECIBIDA</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>PRECIO UNIT (S/)</th>
                  <th style={{ padding:8, border:"1px solid #ddd" }}>IMPORTE TOTAL (S/)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"center" }}>1</td>
                  <td style={{ padding:8, border:"1px solid #ddd" }}>172100070020</td>
                  <td style={{ padding:8, border:"1px solid #ddd" }}>DIESEL B5 S50</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"center" }}>GALON</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"right" }}>150.000</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"right", color:"#27ae60", fontWeight:700 }}>25.750</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"right" }}>18.890000</td>
                  <td style={{ padding:8, border:"1px solid #ddd", textAlign:"right", fontWeight:700 }}>486.42</td>
                </tr>
              </tbody>
            </table>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0" }}>
              <div style={{ display:"flex", gap:16 }}>
                <Field label="Monto Programado del Producto" value="S/ 944.50" />
                <Field label="Monto Total Conformidad" value="S/ 486.42" />
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:16 }}>
              <button style={{ padding:"8px 20px", background:"#fff", border:"1px solid #ccc", borderRadius:4, cursor:"pointer", fontSize:12 }}>✕ Cancelar</button>
              <button style={{ padding:"8px 20px", background:"#27ae60", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:12, fontWeight:600 }}>✓ Guardar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ConstanciasPage = () => {
  const { values, onChange, onClear } = useFilters({});

  const filterConfig = [
    { key:"ano", field:"ano", match:"contains" },
    { key:"tipoBien", field:"tipoBien", match:"exact" },
    { key:"tipoContratacion", field:"tipoContratacion", match:"exact" },
    { key:"nOrden", field:"nOrden", match:"contains" },
    { key:"concepto", field:"concepto", match:"contains" },
    { key:"proveedor", field:"proveedor", match:"contains" },
    { key:"expSiaf", field:"expSiaf", match:"contains" },
    { key:"usuarioSiga", field:"usuarioSiga", match:"exact" },
  ];

  const uniqueUsuarios = [...new Set(CONSTANCIAS_DATA.map(c => c.usuarioSiga))];
  const filtered = applyFilters(CONSTANCIAS_DATA, values, filterConfig);

  const columns = [
    { key:"ano", label:"AÑO", align:"center" },
    { key:"tipoBien", label:"TIPO BIEN", align:"center" },
    { key:"nOrden", label:"N° ORDEN" },
    { key:"fecha", label:"FECHA ORDEN", align:"center" },
    { key:"usuarioSiga", label:"USUARIO SIGA" },
    { key:"expSiaf", label:"EXP. SIAF" },
    { key:"concepto", label:"CONCEPTO", maxWidth:320 },
    { key:"proveedor", label:"PROVEEDOR", maxWidth:200 },
    { key:"monto", label:"MONTO (S/)", align:"right", format:v => v.toLocaleString("es-PE",{minimumFractionDigits:2}) },
    { key:"tipoContratacion", label:"TIPO CONTRATACIÓN" },
  ];

  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>
        Bandeja de Constancias de Órdenes de Bienes y Servicios
      </h2>
      <FilterBar
        values={values}
        onChange={onChange}
        onClear={onClear}
        filters={[
          { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
          { key:"tipoBien", label:"Tipo Bien", type:"select", options:["(TODOS)","B","S"] },
          { key:"tipoContratacion", label:"Tipo Contratación", type:"select", options:["(TODOS)","ASP BIENES Y SERVICIOS","TERCEROS","OTROS - DIFERENTE A ASP"] },
          { key:"nOrden", label:"N° Orden", type:"input", width:110 },
          { key:"concepto", label:"Concepto", type:"input", width:150 },
          { key:"proveedor", label:"Proveedor", type:"input", width:140 },
          { key:"expSiaf", label:"N° Exp. SIAF", type:"input", width:100 },
          { key:"usuarioSiga", label:"Usuario SIGA", type:"select", options:["(TODOS)", ...uniqueUsuarios] },
        ]}
      />
      <div style={{ display:"flex", gap:10, marginBottom:12, justifyContent:"space-between", alignItems:"center" }}>
        <button style={{ padding:"8px 16px", background:"#2c3e6b", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontSize:11.5, fontWeight:600 }}>📄 Constancia múltiple</button>
        <span style={{ fontSize:12, color:"#2c3e6b", fontWeight:600 }}>{filtered.length} registro(s)</span>
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", marginBottom:8, background:"#eef2f7", padding:"8px 12px", borderRadius:4 }}>LISTADO</div>
      {filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered}
          actions={[{ icon:"🖨️", label:"Imprimir constancia", onClick: () => {} }]}
        />
      ) : (
        <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
          No se encontraron registros con los filtros aplicados.
        </div>
      )}
    </div>
  );
};

const PagosPage = () => {
  const { values, onChange, onClear } = useFilters({});
  return (
    <div>
      <h2 style={{ fontSize:15, fontWeight:700, color:"#2c3e50", marginBottom:16, textTransform:"uppercase" }}>Pagos – Contratos Menores</h2>
      <FilterBar
        values={values}
        onChange={onChange}
        onClear={onClear}
        filters={[
          { key:"ano", label:"Año", type:"input", width:70, placeholder:"2026" },
          { key:"centroCosto", label:"Centro de Costo", type:"select", options:["(TODOS)"] },
          { key:"tipoBien", label:"Tipo Orden", type:"select", options:["(TODOS)","B","S"] },
          { key:"nOrden", label:"N° Orden", type:"input", width:110 },
          { key:"proveedor", label:"Proveedor", type:"input", width:140 },
        ]}
      />
      <div style={{ fontSize:12, fontWeight:600, color:"#2c3e6b", marginBottom:8, background:"#eef2f7", padding:"8px 12px", borderRadius:4 }}>LISTADO</div>
      <div style={{ textAlign:"center", padding:40, color:"#95a5a6", fontSize:14, border:"1px solid #eee", borderRadius:6 }}>
        No se encontraron registros. Utilice los filtros para buscar.
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div style={{ textAlign:"center", padding:60 }}>
    <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
    <h2 style={{ fontSize:18, color:"#2c3e50", marginBottom:8 }}>{title}</h2>
    <p style={{ color:"#7f8c8d", fontSize:13 }}>Este módulo está en desarrollo.</p>
  </div>
);


// --- LOGIN PAGE ---
const LoginPage = ({ onLogin }) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!usuario.trim() || !contrasena.trim()) {
      setError("Ingrese su usuario y contraseña");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ nombre: usuario.toUpperCase(), rol: "ESPECIALISTA DE ABASTECIMIENTO" });
    }, 1200);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background:"linear-gradient(135deg, #1a2a4a 0%, #2c3e6b 40%, #34495e 100%)",
      position:"relative", overflow:"hidden"
    }}>
      <div style={{ position:"absolute", top:-120, right:-120, width:400, height:400, borderRadius:"50%", background:"rgba(192,57,43,0.08)" }} />
      <div style={{ position:"absolute", bottom:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(52,152,219,0.06)" }} />
      <div style={{ position:"absolute", top:"30%", left:"10%", width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.02)" }} />

      {/* Left panel */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:60, color:"#fff", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:480, textAlign:"center" }}>
          <div style={{ marginBottom:32, display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
            <div style={{ width:72, height:72, borderRadius:16, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(255,255,255,0.15)", boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
              <span style={{ fontSize:20, fontWeight:900, color:"#e74c3c" }}>ITP</span>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:11, color:"#e74c3c", fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>red CITE</div>
              <div style={{ fontSize:14, fontWeight:300, opacity:0.9 }}>Instituto Tecnológico</div>
              <div style={{ fontSize:14, fontWeight:300, opacity:0.9 }}>de la Producción</div>
            </div>
          </div>
          <h1 style={{ fontSize:28, fontWeight:200, letterSpacing:2, marginBottom:8, lineHeight:1.3 }}>Sistema de Gestión de</h1>
          <h1 style={{ fontSize:36, fontWeight:700, letterSpacing:1, marginBottom:24, color:"#fff" }}>CONTRATACIONES</h1>
          <div style={{ width:60, height:3, background:"linear-gradient(90deg, #e74c3c, #e67e22)", borderRadius:2, margin:"0 auto 24px" }} />
          <p style={{ fontSize:14, lineHeight:1.8, opacity:0.7, fontWeight:300 }}>
            Plataforma integral para la gestión de contratos menores, procedimientos de selección, conformidades y control presupuestal del Instituto Tecnológico de la Producción.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:32, marginTop:40 }}>
            {[{ icon:"📋", label:"Contratos" },{ icon:"✅", label:"Conformidades" },{ icon:"📊", label:"Reportes" }].map((item, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity:0.6 }}>
                <div style={{ width:48, height:48, borderRadius:12, background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, border:"1px solid rgba(255,255,255,0.1)" }}>{item.icon}</div>
                <span style={{ fontSize:11, letterSpacing:0.5 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{ width:480, display:"flex", alignItems:"center", justifyContent:"center", padding:40, position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:380, background:"#fff", borderRadius:16, padding:"48px 40px", boxShadow:"0 24px 80px rgba(0,0,0,0.3)", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:32, right:32, height:4, background:"linear-gradient(90deg, #c0392b, #e74c3c, #e67e22)", borderRadius:"0 0 4px 4px" }} />
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg, #2c3e6b, #34495e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 4px 16px rgba(44,62,107,0.3)" }}>
              <span style={{ fontSize:24 }}>👤</span>
            </div>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#2c3e50", marginBottom:4 }}>Iniciar Sesión</h2>
            <p style={{ fontSize:12, color:"#95a5a6" }}>Ingrese sus credenciales para acceder</p>
          </div>

          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#dc2626" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:6 }}>Usuario</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, opacity:0.4 }}>👤</span>
              <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ingrese su usuario"
                style={{ width:"100%", padding:"12px 14px 12px 42px", border:"2px solid #e8e8e8", borderRadius:10, fontSize:13.5, outline:"none", transition:"border-color 0.2s", background:"#fafbfc", boxSizing:"border-box" }}
                onFocus={e => { e.target.style.borderColor="#2c3e6b"; e.target.style.background="#fff"; }}
                onBlur={e => { e.target.style.borderColor="#e8e8e8"; e.target.style.background="#fafbfc"; }}
              />
            </div>
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#2c3e6b", textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:6 }}>Contraseña</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, opacity:0.4 }}>🔒</span>
              <input type={showPassword ? "text" : "password"} value={contrasena} onChange={e => setContrasena(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ingrese su contraseña"
                style={{ width:"100%", padding:"12px 42px 12px 42px", border:"2px solid #e8e8e8", borderRadius:10, fontSize:13.5, outline:"none", transition:"border-color 0.2s", background:"#fafbfc", boxSizing:"border-box" }}
                onFocus={e => { e.target.style.borderColor="#2c3e6b"; e.target.style.background="#fff"; }}
                onBlur={e => { e.target.style.borderColor="#e8e8e8"; e.target.style.background="#fafbfc"; }}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, opacity:0.5, padding:4 }}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:12, color:"#666" }}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor:"#2c3e6b", width:14, height:14 }} />
              Recordar sesión
            </label>
            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize:12, color:"#2c3e6b", textDecoration:"none", fontWeight:600 }}>¿Olvidó su contraseña?</a>
          </div>

          <button onClick={handleLogin} disabled={loading}
            style={{
              width:"100%", padding:"13px 0", background: loading ? "#95a5a6" : "linear-gradient(135deg, #c0392b, #e74c3c)",
              color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700,
              cursor: loading ? "wait" : "pointer", letterSpacing:0.8,
              boxShadow: loading ? "none" : "0 4px 16px rgba(192,57,43,0.35)",
              transition:"all 0.3s", display:"flex", alignItems:"center", justifyContent:"center", gap:8
            }}>
            {loading ? (<><span style={{ display:"inline-block", width:18, height:18, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />Verificando...</>) : (<>🔐 INGRESAR AL SISTEMA</>)}
          </button>

          <div style={{ textAlign:"center", marginTop:28, paddingTop:20, borderTop:"1px solid #f0f0f0" }}>
            <p style={{ fontSize:10.5, color:"#bdc3c7", lineHeight:1.6 }}>
              Sistema de Gestión de Contrataciones v2.0<br />© 2026 Instituto Tecnológico de la Producción<br />Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};


// --- MAIN APP ---
export default function SGCApp() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [expandedMenus, setExpandedMenus] = useState({ contratoMenor: true });

  const toggleMenu = useCallback((key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleLogout = () => {
    setUser(null);
    setActiveMenu("inicio");
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const renderPage = () => {
    switch(activeMenu) {
      case "inicio": return <HomePage setActiveMenu={(m) => { setActiveMenu(m); setExpandedMenus(p => ({...p, contratoMenor:true})); }} />;
      case "actuaciones": return <ActuacionesPage />;
      case "conformidades": return <ConformidadesPage />;
      case "pagos": return <PagosPage />;
      case "constancias": return <ConstanciasPage />;
      case "contratos": return <PlaceholderPage title="Contratos - Procedimientos de Selección" />;
      case "cronogramas": return <PlaceholderPage title="Cronogramas - Procedimientos de Selección" />;
      case "repOrdenes": return <PlaceholderPage title="Reporte de Órdenes" />;
      case "repConformidades": return <PlaceholderPage title="Reporte de Conformidades" />;
      case "usuarios": return <PlaceholderPage title="Mantenimiento de Usuarios" />;
      case "parametros": return <PlaceholderPage title="Mantenimiento de Parámetros" />;
      default: return <HomePage setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <div style={{ fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight:"100vh", display:"flex", flexDirection:"column", background:"#f4f5f7" }}>
      {/* HEADER */}
      <header style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 20px", height:52, background:"#fff",
        borderBottom:"3px solid #c0392b", boxShadow:"0 2px 8px rgba(0,0,0,0.08)", zIndex:100
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#555" }}>☰</button>
          <Logo />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <select style={{ padding:"6px 12px", border:"1px solid #ccc", borderRadius:4, fontSize:12, background:"#f9f9f9" }}>
            <option>ESPECIALISTA DE ABASTECIMIENTO</option>
            <option>ADMINISTRADOR</option>
            <option>JEFE DE LOGÍSTICA</option>
          </select>
          <span style={{ fontSize:13, fontWeight:600, color:"#2c3e50" }}>Sistema de Gestión de Contrataciones</span>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:30, height:30, borderRadius:"50%", background:"#ecf0f1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</span>
            <span style={{ fontSize:12, color:"#2c3e50", fontWeight:600 }}>{user.nombre}</span>
            <button
              onClick={handleLogout}
              style={{ background:"none", border:"none", color:"#e74c3c", cursor:"pointer", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}
            >
              ⚙️ <span style={{ color:"#e67e22" }}>Salir del sistema</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display:"flex", flex:1 }}>
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          expandedMenus={expandedMenus}
          toggleMenu={toggleMenu}
        />
        <main style={{ flex:1, padding:24, overflowY:"auto", maxHeight:"calc(100vh - 52px)" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}