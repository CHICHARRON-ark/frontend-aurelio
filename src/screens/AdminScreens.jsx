import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminShell, Stars } from "../ui";
import { useDemo } from "../demo";

function Shell({ path, children }) {
  return <AdminShell active={path}>{children}</AdminShell>;
}

export function Acceso() {
  const nav = useNavigate();
  const demo = useDemo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="login-wrap">
      <svg className="login-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="loginSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f6c27a" stopOpacity="0.7" />
            <stop offset="48%" stopColor="#e07a2f" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#e07a2f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="loginHouse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="120" r="260" fill="url(#loginSun)" />
        <circle cx="1310" cy="790" r="300" fill="#ffffff" opacity="0.07" />
        <g fill="#ffffff" opacity="0.16">
          <circle cx="1180" cy="150" r="3" />
          <circle cx="1248" cy="210" r="2" />
          <circle cx="1124" cy="96" r="2.2" />
          <circle cx="980" cy="70" r="1.6" />
          <circle cx="70" cy="250" r="2" />
          <circle cx="140" cy="310" r="1.5" />
        </g>
        <path d="M0 700 C 220 650, 380 760, 640 710 C 940 652, 1140 780, 1440 720 V 900 H 0 Z" fill="#062421" opacity="0.38" />
        <g fill="url(#loginHouse)" stroke="#ffffff" strokeOpacity="0.38" strokeWidth="2" strokeLinejoin="round">
          <path d="M48 690 L150 600 L252 690 V830 H48 Z" />
          <path d="M228 724 L318 646 L408 724 V830 H228 Z" />
          <path d="M1048 250 L1140 172 L1232 250 V390 H1048 Z" />
        </g>
        <g fill="#f6c27a" opacity="0.85">
          <rect x="92" y="718" width="28" height="24" rx="2" />
          <rect x="168" y="718" width="28" height="24" rx="2" />
          <rect x="286" y="748" width="24" height="20" rx="2" />
          <rect x="1100" y="286" width="22" height="18" rx="2" />
          <rect x="1158" y="286" width="22" height="18" rx="2" />
        </g>
        <g fill="#062421" opacity="0.55">
          <path d="M132 760 H168 V830 H132 Z" />
          <path d="M300 772 H334 V830 H300 Z" />
          <path d="M1124 334 H1152 V390 H1124 Z" />
        </g>
        <g fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M150 438 c0 0 -32 36 -32 58 a32 32 0 0 0 64 0 c0 -22 -32 -58 -32 -58 Z" />
          <path d="M1336 70 l-24 44 h18 l-22 46 44 -52 h-18 Z" />
        </g>
      </svg>
      <div className="login-stack">
        <div className="login-card">
          <div className="brand" style={{ color: "#14221f" }}>
            <div className="mark">S</div>
            <div>
              ServiFix
              <div style={{ fontWeight: 600, fontSize: 12, color: "#667774" }}>Panel del administrador</div>
            </div>
          </div>
          <h1 className="t" style={{ marginTop: 8 }}>Entrar al panel</h1>
          <div className="label">Correo</div>
          <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="label">Contraseña</div>
          <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="err">{error}</div>}
          <button className="btn" onClick={() => {
            const message = demo.login(email, password, true);
            setError(message);
            if (!message) nav("/admin");
          }}>Entrar</button>
          <p className="note">Cualquier correo y contraseña abre el panel.</p>
        </div>
      </div>
    </div>
  );
}

function IncomeChart() {
  return (
    <div className="chart">
      <div className="row">
        <span style={{ fontSize: 11, letterSpacing: ".04em", fontWeight: 800, color: "#6b7c79" }}>INGRESOS · ÚLTIMOS 6 MESES</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#e8872a" }}>— Ingresos del mes</span>
      </div>
      <svg viewBox="0 0 500 188" width="100%" height="168" role="img" aria-label="Ingresos de junio a noviembre">
        <line x1="62" y1="28" x2="456" y2="28" stroke="#e6eeec" />
        <line x1="62" y1="70" x2="456" y2="70" stroke="#e6eeec" />
        <line x1="62" y1="112" x2="456" y2="112" stroke="#e6eeec" />
        <line x1="62" y1="154" x2="456" y2="154" stroke="#e6eeec" />
        <text x="56" y="32" textAnchor="end" fontSize="10" fill="#8b9c99">$9 mil</text>
        <text x="56" y="74" textAnchor="end" fontSize="10" fill="#8b9c99">$6 mil</text>
        <text x="56" y="116" textAnchor="end" fontSize="10" fill="#8b9c99">$3 mil</text>
        <text x="56" y="157" textAnchor="end" fontSize="10" fill="#8b9c99">$0</text>
        <polygon fill="#f7e2cc" points="84,118.2 158,67.6 232,99.8 306,56.4 380,83 454,42.2 454,154 84,154" />
        <polyline fill="none" stroke="#e8872a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points="84,118.2 158,67.6 232,99.8 306,56.4 380,83 454,42.2" />
        <g fill="#14221f" fontSize="11" fontWeight="700" textAnchor="middle">
          <text x="84" y="110">$2,800</text>
          <text x="158" y="59">$6,400</text>
          <text x="232" y="91">$4,100</text>
          <text x="306" y="48">$7,200</text>
          <text x="380" y="74">$5,300</text>
          <text x="454" y="34">$8,200</text>
        </g>
        <g fill="#fff" stroke="#e8872a" strokeWidth="2.4">
          <circle cx="84" cy="118.2" r="4.2" />
          <circle cx="158" cy="67.6" r="4.2" />
          <circle cx="232" cy="99.8" r="4.2" />
          <circle cx="306" cy="56.4" r="4.2" />
          <circle cx="380" cy="83" r="4.2" />
          <circle cx="454" cy="42.2" r="4.2" />
        </g>
        <g fill="#6b7c79" fontSize="11" textAnchor="middle">
          <text x="84" y="176">Jun</text>
          <text x="158" y="176">Jul</text>
          <text x="232" y="176">Ago</text>
          <text x="306" y="176">Sep</text>
          <text x="380" y="176">Oct</text>
          <text x="454" y="176">Nov</text>
        </g>
      </svg>
    </div>
  );
}

export function Dashboard() {
  const demo = useDemo();
  const paid = demo.state.payments.filter((p) => p.status === "Pagado");
  const sales = paid.reduce((sum, p) => sum + p.total, 0);
  const services = paid.filter((p) => p.kind !== "refaccion").reduce((sum, p) => sum + p.total, 0);
  const parts = paid.filter((p) => p.kind === "refaccion").reduce((sum, p) => sum + p.total, 0);
  const commission = paid.reduce((sum, p) => sum + p.commission, 0);
  const techs = demo.state.techs.filter((t) => !demo.state.hiddenTechs.includes(t.id));
  const open = demo.state.orders.filter((o) => !["pagado", "cancelado"].includes(o.status)).length;
  const closed = demo.state.orders.length - open;
  const demand = [...techs].sort((a, b) => b.jobs - a.jobs || b.rating - a.rating).slice(0, 4);
  const recent = demo.state.payments.slice(0, 6);
  return (
    <Shell path="/admin">
      <h1>Dashboard</h1>
      <p className="lead">Ventas, comisiones y técnicos con más demanda, con los pedidos que hay ahora.</p>
      <div className="kpis">
        <div className="kpi"><span>VENTAS TOTALES</span><b>{money(sales)}</b><em>Servicios {money(services)} · refacciones {money(parts)}</em></div>
        <div className="kpi"><span>COMISIONES</span><b>{money(commission)}</b><em>10% de los servicios pagados</em></div>
        <div className="kpi"><span>TÉCNICOS ACTIVOS</span><b>{techs.length}</b><em>Con perfil publicado</em></div>
        <div className="kpi"><span>CITAS</span><b>{demo.state.orders.length}</b><em>{open} abiertas · {closed} cerradas</em></div>
      </div>
      <div className="split">
        <div className="panel">
          <h3>Pagos recientes</h3>
          {recent.length === 0 && <p className="small">Todavía no hay pagos.</p>}
          {recent.map((payment) => (
            <div className="row" style={{ margin: "8px 0" }} key={payment.id}>
              <div><b>{payment.concept}</b><div className="small">{demo.nameOf(payment.clientId)}</div></div>
              <b>{money(payment.total)}</b>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3>Más demanda</h3>
          {demand.map((tech) => (
            <div className="row" style={{ margin: "8px 0" }} key={tech.id}>
              <div><b>{tech.name}</b><div className="small">{tech.oficio} · {tech.jobs} servicios</div></div>
              <b>{tech.rating}</b>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Validacion() {
  const demo = useDemo();
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState("");
  const queue = demo.state.applications.filter((a) => a.status !== "aprobada");
  const pending = queue.find((a) => a.status === "pendiente");
  const rejected = queue.filter((a) => a.status === "rechazada");
  return (
    <Shell path="/admin/validacion">
      <h1>Validación de técnicos</h1>
      <p className="lead">Aprobar cambia la cuenta a técnico. Rechazar pide un motivo y la persona sigue como cliente.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Persona</th><th>Oficio</th><th>Solicitud</th><th>Estado</th></tr></thead>
          <tbody>
            {queue.map((a) => (
              <tr key={a.id}><td>{a.name}</td><td>{a.oficio}</td><td>{a.when}</td><td><span className={`pill ${a.status === "pendiente" ? "warn" : "bad"}`}>{a.status}</span></td></tr>
            ))}
            {queue.length === 0 && <tr><td colSpan={4}>No hay solicitudes por revisar.</td></tr>}
          </tbody>
        </table>
      </div>
      {pending && (
        <div className="panel" style={{ marginTop: 10 }}>
          <div className="kicker">Solicitud abierta</div>
          <h3>{pending.name} · {pending.oficio}</h3>
          <p className="small">Teléfono {pending.phone}. Zona: {pending.zone}. Punto de atención: {pending.place}. Servicios: {pending.services}.</p>
          {pending.idFile && <p className="small">Identificación: {pending.idFile}. Solo el administrador ve este dato.</p>}
          <div className="row" style={{ margin: "8px 0", flexWrap: "wrap" }}>
            <button className="btn slim" onClick={() => { demo.approveApplication(pending.id); setFlash(`${pending.name} ya es técnico.`); }}>Aprobar y pasar a técnico</button>
          </div>
          <div className="label">Motivo, obligatorio para rechazar</div>
          <input className="field" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ejemplo: la identificación no se lee." />
          <button className="btn slim danger" onClick={() => setFlash(demo.rejectApplication(pending.id, reason) || `Se rechazó a ${pending.name}.`)}>Rechazar con este motivo</button>
          {flash && <div className="okbox" style={{ marginTop: 8 }}>{flash}</div>}
        </div>
      )}
      {rejected.map((app) => (
        <div className="panel" style={{ marginTop: 10 }} key={app.id}>
          <h3>{app.name} · {app.oficio} · Rechazada</h3>
          <p className="small">{app.services}. Motivo: {app.reason}{app.at ? ` · ${app.at}` : ""}</p>
        </div>
      ))}
    </Shell>
  );
}

const SERVICES = [
  ["Revisión de corto", "Electricidad", "$450", false],
  ["Reparación de fuga", "Plomería", "$420", true],
  ["Corte de pasto", "Jardín", "$300", true],
  ["Revisión de falla", "Mecánica", "$500", false],
];
const PARTS = [
  ["Foco LED 9W", "$45", "22"],
  ["Cinta de teflón", "$18", "40"],
  ["Llave de paso 1/2", "$89", "12"],
  ["Batería 12V", "$1,890", "3"],
];

export function Catalogo() {
  const demo = useDemo();
  const [blocked, setBlocked] = useState("");
  const [catName, setCatName] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", rubro: demo.state.categories[0] || "", price: "" });
  const [editing, setEditing] = useState(null);
  const [price, setPrice] = useState("");
  return (
    <Shell path="/admin/catalogo">
      <h1>Catálogo global</h1>
      <p className="lead">Lo que agregues o cambies se ve en la app de clientes y técnicos.</p>
      {blocked && <div className="err">{blocked}</div>}
      <div className="chips">
        {demo.state.categories.map((c) => <span className="chip" key={c}>{c}</span>)}
      </div>
      <div className="search">
        <input className="field" placeholder="Nueva categoría" value={catName} onChange={(e) => setCatName(e.target.value)} />
        <button className="btn slim" onClick={() => { demo.addCategory(catName); setCatName(""); }}>Agregar</button>
      </div>
      <div className="row"><h3 style={{ margin: "8px 0" }}>Servicios</h3><button className="btn slim" onClick={() => setAdding((v) => !v)}>{adding ? "Cerrar" : "Agregar"}</button></div>
      {adding && (
        <div className="panel" style={{ marginBottom: 8 }}>
          <input className="field" placeholder="Nombre" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <select className="field" value={draft.rubro} onChange={(e) => setDraft({ ...draft, rubro: e.target.value })}>
            {demo.state.categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className="field" placeholder="Precio" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
          <button className="btn slim" onClick={() => {
            const message = demo.addCatalog(draft);
            setBlocked(message);
            if (!message) { setDraft({ name: "", rubro: demo.state.categories[0] || "", price: "" }); setAdding(false); }
          }}>Guardar servicio</button>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Rubro</th><th>Precio</th><th></th></tr></thead>
          <tbody>
            {demo.state.catalog.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.rubro}</td>
                <td>{editing === item.id ? <input className="field" value={price} onChange={(e) => setPrice(e.target.value)} /> : `$${item.price}`}</td>
                <td>
                  {editing === item.id ? (
                    <button className="link" onClick={() => { demo.updateCatalogPrice(item.id, price); setEditing(null); }}>Guardar</button>
                  ) : (
                    <button className="link" onClick={() => { setEditing(item.id); setPrice(String(item.price)); }}>Editar</button>
                  )}
                  {" · "}
                  <button className="link" onClick={() => setBlocked(demo.deleteCatalog(item.id))}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 style={{ margin: "12px 0 8px" }}>Refacciones</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {demo.state.products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>${p.price}</td><td>{p.stock}</td>
                <td><button className="link" onClick={() => demo.deleteProduct(p.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

function statusLabel(status) {
  const labels = {
    "por aceptar": "Por aceptar",
    aceptado: "Aceptado",
    "en camino": "En camino",
    "en proceso": "En proceso",
    terminado: "Terminado",
    pagado: "Pagado",
    cancelado: "Cancelado",
    esperando: "Esperando técnico",
  };
  return labels[status] || status;
}

function statusPill(status) {
  if (status === "pagado" || status === "aceptado") return "ok";
  if (status === "en camino" || status === "en proceso") return "info";
  if (status === "cancelado") return "mute";
  return "warn";
}

function money(value) {
  return `$${Number(value).toLocaleString("es-MX")}`;
}

export function CitasAdmin() {
  const demo = useDemo();
  return (
    <Shell path="/admin/citas">
      <h1>Citas</h1>
      <p className="lead">El estado avanza en orden. Esperando técnico y Cancelado son los otros dos estados del pedido.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Cliente</th><th>Técnico</th><th>Servicio</th><th>Cuándo</th><th>Estado</th><th>Base</th></tr></thead>
          <tbody>
            {demo.state.orders.map((order) => (
              <tr key={order.id}>
                <td>{demo.nameOf(order.clientId)}</td>
                <td>{order.status === "esperando" || !order.techId ? "Esperando técnico" : demo.nameOf(order.techId)}</td>
                <td>{order.service}</td>
                <td>{order.when}</td>
                <td><span className={`pill ${statusPill(order.status)}`}>{statusLabel(order.status)}</span></td>
                <td>{money(order.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

export function Usuarios() {
  const demo = useDemo();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const clients = demo.state.users.filter((user) => user.role === "cliente");
  const techs = demo.state.techs.filter((tech) => !demo.state.hiddenTechs.includes(tech.id));
  const pending = demo.state.applications.filter((app) => app.status === "pendiente" && !techs.some((tech) => tech.id === app.userId));
  return (
    <Shell path="/admin/usuarios">
      <h1>Usuarios</h1>
      <p className="lead">Clientes y técnicos. Un técnico con pedidos activos no se elimina.</p>
      {error && <div className="err">{error}</div>}
      {ok && <div className="okbox">{ok}</div>}
      <h3>Clientes</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Pedidos</th></tr></thead>
          <tbody>
            {clients.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{demo.state.orders.filter((order) => order.clientId === user.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 style={{ marginTop: 12 }}>Técnicos</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Oficio</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {techs.map((tech) => (
              <tr key={tech.id}>
                <td>{tech.name}</td>
                <td>{tech.oficio}</td>
                <td><span className="pill ok">Activo</span></td>
                <td>
                  <button className="link" onClick={() => {
                    const message = demo.deleteTech(tech.id);
                    setError(message);
                    setOk(message ? "" : `${tech.name} salió del listado.`);
                  }}>Eliminar</button>
                </td>
              </tr>
            ))}
            {pending.map((app) => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>{app.oficio}</td>
                <td><span className="pill warn">Pendiente</span></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Un técnico con pedidos activos no se elimina. Una solicitud pendiente sigue apareciendo aquí hasta que se apruebe o se rechace.</p>
    </Shell>
  );
}

export function Pagos() {
  const demo = useDemo();
  const paid = demo.state.payments.filter((payment) => payment.status === "Pagado");
  const due = demo.state.payments.filter((payment) => payment.status !== "Pagado");
  const cobrado = paid.reduce((sum, payment) => sum + payment.total, 0);
  const comision = paid.reduce((sum, payment) => sum + payment.commission, 0);
  const porCobrar = due.reduce((sum, payment) => sum + payment.total, 0);
  return (
    <Shell path="/admin/pagos">
      <h1>Pagos</h1>
      <p className="lead">La comisión es 10% del servicio y $0 en refacciones. El número de tarjeta no se guarda.</p>
      <div className="kpis">
        <div className="kpi"><span>COBRADO</span><b>{money(cobrado)}</b><em>Servicios y refacciones</em></div>
        <div className="kpi"><span>COMISIÓN</span><b>{money(comision)}</b><em>10% solo de servicios</em></div>
        <div className="kpi"><span>POR COBRAR</span><b>{money(porCobrar)}</b><em>Terminado, sin confirmar pago</em></div>
        <div className="kpi"><span>MODO</span><b>Pruebas</b><em>Sin dinero real</em></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Concepto</th><th>Total</th><th>Comisión</th><th>Estado</th></tr></thead>
          <tbody>
            {demo.state.payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{demo.nameOf(payment.clientId)}</td>
                <td>{payment.concept}</td>
                <td>{money(payment.total)}</td>
                <td>{money(payment.commission)}</td>
                <td><span className={`pill ${payment.status === "Pagado" ? "ok" : "warn"}`}>{payment.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Cobrado {money(cobrado)}. Comisión {money(comision)}. Por cobrar {money(porCobrar)}.</p>
    </Shell>
  );
}

export function Resenas() {
  const demo = useDemo();
  const [editing, setEditing] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const unpaid = demo.state.orders.filter((order) => order.status === "terminado" && !order.paid);
  return (
    <Shell path="/admin/resenas">
      <h1>Reseñas</h1>
      <p className="lead">Solo existen reseñas de un pedido pagado, hechas por quien contrató.</p>
      {unpaid.map((order) => <div className="err" key={order.id}>“{order.service}” de {demo.nameOf(order.clientId)} está terminado y todavía no está pagado, así que no puede tener reseña.</div>)}
      {error && <div className="err">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Pedido</th><th>Usuario</th><th>Técnico</th><th>Nota</th><th>Comentario</th><th></th></tr></thead>
          <tbody>
            {demo.state.reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.paymentId || review.orderId} · pagado</td>
                <td>{demo.nameOf(review.clientId)}</td>
                <td>{demo.nameOf(review.techId)}</td>
                <td><Stars value={review.stars} /></td>
                <td>
                  {editing === review.id ? (
                    <input className="field" value={text} onChange={(e) => setText(e.target.value)} />
                  ) : review.text}
                </td>
                <td>
                  {editing === review.id ? (
                    <button className="link" onClick={() => {
                      const message = demo.editReview(review.id, text);
                      setError(message);
                      if (!message) setEditing(null);
                    }}>Guardar</button>
                  ) : (
                    <button className="link" onClick={() => { setEditing(review.id); setText(review.text); setError(""); }}>Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Una reseña solo la escribe quien contrató, después de pagar, y no se puede repetir. Desde aquí se corrige el comentario.</p>
    </Shell>
  );
}

export function Bitacora() {
  const demo = useDemo();
  const rows = demo.state.log.map((r) => [r.date, r.time, r.module, r.action, r.actor]);
  return (
    <Shell path="/admin/bitacora">
      <h1>Bitácora</h1>
      <p className="lead">Solo lectura. No hay editar ni borrar. Entran las aprobaciones, los rechazos, los cambios del catálogo y los intentos bloqueados.</p>
      <div className="okbox">Esta pantalla no permite modificar ni eliminar registros.</div>
      <div className="table-wrap" style={{ marginTop: 8 }}>
        <table>
          <thead><tr><th>Fecha</th><th>Hora</th><th>Administrador</th><th>Módulo</th><th>Acción</th></tr></thead>
          <tbody>
            {rows.map((r, index) => (
              <tr key={`${r[0]}-${r[1]}-${index}`}><td>{r[0]}</td><td>{r[1]}</td><td>{r[4] || "Administración"}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

export function Datos() {
  const demo = useDemo();
  const [tab, setTab] = useState("Usuarios");
  const [saved, setSaved] = useState("");
  const [userId, setUserId] = useState(demo.state.users[0]?.id || "");
  const selected = demo.state.users.find((u) => u.id === userId) || demo.state.users[0];
  const [form, setForm] = useState({ name: selected?.name || "", email: selected?.email || "", phone: selected?.phone || "", role: selected?.role || "cliente" });
  const choose = (id) => {
    const user = demo.state.users.find((u) => u.id === id);
    setUserId(id);
    setSaved("");
    setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", role: user?.role || "cliente" });
  };
  return (
    <Shell path="/admin/datos">
      <h1>Base de datos</h1>
      <p className="lead">Consulta y modifica usuarios, pedidos, pagos y reseñas.</p>
      <div className="chips">
        {["Usuarios", "Pedidos", "Pagos", "Reseñas"].map((t) => (
          <button key={t} className={tab === t ? "chip on" : "chip"} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === "Usuarios" && selected && (
        <div className="panel">
          <div className="label">Registro</div>
          <select className="field" value={selected.id} onChange={(e) => choose(e.target.value)}>
            {demo.state.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <div className="split">
            <div>
              <div className="label">Nombre</div>
              <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="label">Correo</div>
              <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <div className="label">Teléfono</div>
              <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div className="label">Rol</div>
              <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="cliente">cliente</option>
                <option value="tecnico">tecnico</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
          <button className="btn slim" onClick={() => { demo.saveUser(selected.id, form); setSaved(form.name); }}>Guardar cambios</button>
          {saved && <div className="okbox" style={{ marginTop: 8 }}>Se guardaron los datos de {saved}.</div>}
        </div>
      )}
      <div className="table-wrap" style={{ marginTop: 8 }}>
        <table>
          <thead><tr><th>Registro</th><th>Detalle</th></tr></thead>
          <tbody>
            {tab === "Pedidos" && demo.state.orders.map((o) => <tr key={o.id}><td>{o.service}</td><td>{demo.nameOf(o.clientId)} · {o.status} · ${o.price}</td></tr>)}
            {tab === "Pagos" && demo.state.payments.map((p) => <tr key={p.id}><td>{p.concept}</td><td>${p.total} · comisión ${p.commission} · {p.status}</td></tr>)}
            {tab === "Reseñas" && demo.state.reviews.map((r) => <tr key={r.id}><td>{demo.nameOf(r.clientId)}</td><td>{r.stars} estrellas · {r.text}</td></tr>)}
            {tab === "Usuarios" && demo.state.users.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email} · {u.role}</td></tr>)}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
