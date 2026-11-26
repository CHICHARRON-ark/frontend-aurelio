import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminShell, ModeSwitch, Stars } from "../ui";
import { useDemo } from "../demo";

function Shell({ path, children }) {
  return <AdminShell active={path}>{children}</AdminShell>;
}

export function Acceso() {
  const nav = useNavigate();
  const demo = useDemo();
  const [email, setEmail] = useState("ana.garcia@gmail.com");
  const [password, setPassword] = useState("servifix");
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
        <ModeSwitch active="admin" />
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
          <p className="note">Demo del panel: fernando.velazquez@gmail.com · servifix. Ana recibe el mismo aviso que una contraseña incorrecta.</p>
          <button className="btn" onClick={() => {
            const message = demo.login(email, password, true);
            setError(message);
            if (!message) nav("/admin");
          }}>Entrar</button>
          <p className="note">Ana es clienta y la contraseña podría ser la real. El texto es el mismo que si la contraseña estuviera mal: no dice el rol ni si la cuenta existe. La sesión del panel vence a las 24 horas.</p>
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
  const demand = [
    ["Carlos Méndez", "Electricista · 128 servicios", "4.9"],
    ["Luis Herrera", "Plomero · 96 servicios", "4.8"],
    ["Rosa Núñez", "Jardinera · 74 servicios", "4.7"],
    ["Diego Ramos", "Mecánico · 61 servicios", "4.6"],
  ];
  return (
    <Shell path="/admin">
      <h1>Dashboard</h1>
      <p className="lead">Ventas, comisiones y técnicos con más demanda. Números de demostración. Stripe en pruebas.</p>
      <div className="kpis">
        <div className="kpi"><span>VENTAS TOTALES</span><b>$48,200</b><em>Servicios $40,000 · refacciones $8,200</em></div>
        <div className="kpi"><span>COMISIONES</span><b>$4,000</b><em>10% de los servicios pagados</em></div>
        <div className="kpi"><span>TÉCNICOS ACTIVOS</span><b>18</b><em>Con perfil publicado</em></div>
        <div className="kpi"><span>CITAS</span><b>36</b><em>12 abiertas · 24 cerradas</em></div>
      </div>
      <div className="split">
        <IncomeChart />
        <div className="panel">
          <h3>Más demanda</h3>
          {demand.map(([name, meta, score]) => (
            <div className="row" style={{ margin: "8px 0" }} key={name}>
              <div><b>{name}</b><div className="small">{meta}</div></div>
              <b>{score}</b>
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
  return (
    <Shell path="/admin/validacion">
      <h1>Validación de técnicos</h1>
      <p className="lead">Revisa la solicitud antes de aprobar. Rechazar pide un motivo. Aprobar cambia la cuenta a técnico y deja de usarse como cliente.</p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Persona</th><th>Oficio</th><th>Solicitud</th><th>Estado</th></tr></thead>
          <tbody>
            {queue.map((a) => (
              <tr key={a.id}><td>{a.name}</td><td>{a.oficio}</td><td>{a.when}</td><td><span className={`pill ${a.status === "pendiente" ? "warn" : "bad"}`}>{a.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel" style={{ marginTop: 10 }}>
        <div className="kicker">Solicitud abierta</div>
        <h3>Mariana Solís · Jardinera</h3>
        <p className="small">Teléfono 653 214 7781. Zona: Col. Comercial. Servicios: mantenimiento de jardín $480 a domicilio y riego $220 en su local, Calle 12 88.</p>
        <div className="row" style={{ margin: "8px 0", flexWrap: "wrap" }}>
          <button className="btn slim" onClick={() => { const pending = queue.find((a) => a.status === "pendiente"); if (pending) { demo.approveApplication(pending.id); setFlash(`${pending.name} pasó a técnico y dejó de usarse como clienta.`); } }}>Aprobar y pasar a técnico</button>
          <button className="btn slim ghost" onClick={() => setFlash("Identificación visible solo para el administrador. No hay archivo real en esta vista.")}>Ver identificación</button>
          <span className="small">Solo tú puedes ver esta identificación.</span>
        </div>
        <div className="label">Motivo, obligatorio para rechazar</div>
        <input className="field" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ejemplo: la identificación no se lee. Sube otra foto." />
        <button
          className="btn slim danger"
          onClick={() => {
            const pending = queue.find((a) => a.status === "pendiente");
            if (!pending) return;
            setFlash(demo.rejectApplication(pending.id, reason));
          }}
        >
          Rechazar con este motivo
        </button>
        {flash && <div className="okbox" style={{ marginTop: 8 }}>{flash}</div>}
        <p className="note">Sin motivo, Rechazar no guarda. Las disputas de un servicio no se resuelven aquí: están fuera del alcance.</p>
      </div>
      <div className="panel" style={{ marginTop: 10 }}>
        <h3>Ana García · Jardinera · Rechazada</h3>
        <p className="small">Teléfono 653 120 4488. Zona: Col. Sonora. Corte de pasto $300 a domicilio y poda $250 en su punto de atención, Calle 7 215. Motivo del 14 nov 2026 a las 17:55: la identificación no se lee.</p>
        <p className="note">Jorge Peña ya no está en la cola: se aprobó el 14 nov a las 18:10 y pasó a técnico.</p>
      </div>
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
  return (
    <Shell path="/admin/catalogo">
      <h1>Catálogo global</h1>
      <p className="lead">Servicios, productos con existencias y categorías. Crear, editar o eliminar se refleja en la app.</p>
      {blocked && <div className="err">{blocked}</div>}
      <div className="chips">
        {["Electricidad", "Plomería", "Jardín", "Mecánica"].map((c) => <span className="chip" key={c}>{c}</span>)}
        <button className="chip">+ Categoría</button>
      </div>
      <div className="row"><h3 style={{ margin: "8px 0" }}>Servicios</h3><button className="btn slim">Agregar</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Rubro</th><th>Precio</th><th></th></tr></thead>
          <tbody>
            {demo.state.catalog.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.rubro}</td>
                <td>${item.price}</td>
                <td>
                  <button className="link" onClick={() => demo.updateCatalogPrice(item.id, item.price + 10)}>Editar</button>
                  {" · "}
                  <button className="link" onClick={() => setBlocked(demo.deleteCatalog(item.id))}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row"><h3 style={{ margin: "12px 0 8px" }}>Refacciones</h3><button className="btn slim">Agregar</button></div>
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
      <p className="note">Foco LED 9W quedó en 22 piezas: el pedido de 2 ya está pagado. El alta fue de 24.</p>
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
      <p className="note">Mariana sigue como clienta mientras su solicitud está pendiente. Jorge ya está activo: la bitácora lo aprobó a las 18:10. Andrés no tiene pedidos abiertos y sí se puede eliminar. Carlos no.</p>
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
      <p className="lead">Stripe está en modo de pruebas. ServiFix no guarda el número de tarjeta. La comisión es 10% del servicio y $0 en refacciones.</p>
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
      <p className="note">Cobrado {paid.map((payment) => money(payment.total)).join(" + ") || "$0"} = {money(cobrado)}. Comisión {paid.map((payment) => money(payment.commission)).join(" + ") || "$0"} = {money(comision)}. Lo que sigue en Por pagar entra a cobrado cuando el cliente paga con la tarjeta de prueba.</p>
    </Shell>
  );
}

export function Resenas() {
  const demo = useDemo();
  const [editing, setEditing] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const unpaid = demo.state.orders.find((order) => order.id === "o-falla" && !order.paid);
  return (
    <Shell path="/admin/resenas">
      <h1>Reseñas</h1>
      <p className="lead">Solo existen reseñas de un pedido pagado, hechas por quien contrató.</p>
      {unpaid && <div className="err">No se creó la reseña. El pedido 1042 está terminado, pero todavía no está pagado.</div>}
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
      <p className="note">Un intento de reseñar el pedido 1042 se rechaza hasta que Ana lo pague. Después solo ella puede dejar una, de 1 a 5, y no una segunda. Editar guarda el comentario en esta sesión.</p>
    </Shell>
  );
}

export function Bitacora() {
  const demo = useDemo();
  const rows = demo.state.log.map((r) => [r.date, r.time, r.module, r.action]);
  return (
    <Shell path="/admin/bitacora">
      <h1>Bitácora</h1>
      <p className="lead">Solo lectura. No hay editar ni borrar. Entran las aprobaciones, los rechazos, los cambios del catálogo y los intentos bloqueados.</p>
      <div className="okbox">Esta pantalla no permite modificar ni eliminar registros.</div>
      <div className="table-wrap" style={{ marginTop: 8 }}>
        <table>
          <thead><tr><th>Fecha</th><th>Hora</th><th>Administrador</th><th>Módulo</th><th>Acción</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[1] + r[3]}><td>{r[0]}</td><td>{r[1]}</td><td>Fernando Velázquez</td><td>{r[2]}</td><td>{r[3]}</td></tr>
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
  const [saved, setSaved] = useState(false);
  const ana = demo.state.users.find((u) => u.id === "ana");
  return (
    <Shell path="/admin/datos">
      <h1>Base de datos</h1>
      <p className="lead">Consulta y modifica usuarios, pedidos, pagos y reseñas. La identificación de una solicitud no se muestra a nadie más.</p>
      <div className="chips">
        {["Usuarios", "Pedidos", "Pagos", "Reseñas"].map((t) => (
          <button key={t} className={tab === t ? "chip on" : "chip"} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === "Usuarios" && (
        <div className="panel">
          <h3>Editando a Ana García</h3>
          <div className="split">
            <div>
              <div className="label">Nombre</div><input className="field" id="ana-name" defaultValue={ana?.name} />
              <div className="label">Correo</div><input className="field" id="ana-email" defaultValue={ana?.email} />
            </div>
            <div>
              <div className="label">Teléfono</div><input className="field" id="ana-phone" defaultValue={ana?.phone} />
              <div className="label">Rol</div><input className="field" id="ana-role" defaultValue={ana?.role} />
            </div>
          </div>
          <div className="row">
            <button className="btn slim" onClick={() => {
              demo.saveUser("ana", {
                name: document.getElementById("ana-name").value,
                email: document.getElementById("ana-email").value,
                phone: document.getElementById("ana-phone").value,
                role: document.getElementById("ana-role").value,
              });
              setSaved(true);
            }}>Guardar cambios</button>
            <span className="small">Un rol que no es administrador no abre esta pantalla ni el correo de Ana.</span>
          </div>
          {saved && <div className="okbox" style={{ marginTop: 8 }}>Cambios guardados en esta sesión. Otra cuenta no ve el correo de Ana.</div>}
        </div>
      )}
      <div className="table-wrap" style={{ marginTop: 8 }}>
        <table>
          <thead><tr><th>Registro</th><th>Detalle</th><th></th></tr></thead>
          <tbody>
            {tab === "Pedidos" && demo.state.orders.map((o) => <tr key={o.id}><td>{o.service}</td><td>{demo.nameOf(o.clientId)} · {o.status} · ${o.price}</td><td></td></tr>)}
            {tab === "Pagos" && demo.state.payments.map((p) => <tr key={p.id}><td>{p.id}</td><td>{p.concept} · ${p.total} · comisión ${p.commission} · {p.status}</td><td></td></tr>)}
            {tab === "Reseñas" && demo.state.reviews.map((r) => <tr key={r.id}><td>{demo.nameOf(r.clientId)}</td><td>{r.stars} estrellas · {r.text}</td><td></td></tr>)}
            {tab === "Usuarios" && demo.state.users.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email} · {u.role}</td><td></td></tr>)}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
