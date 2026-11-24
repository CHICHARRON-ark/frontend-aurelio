import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Back, Stars, TechPhone } from "../ui";
import { useDemo } from "../demo";

export function Pedidos() {
  const nav = useNavigate();
  const demo = useDemo();
  const mine = demo.state.orders.filter((o) => o.techId === "carlos" || (o.status === "esperando" && !o.techId));
  const fresh = mine.filter((o) => o.status === "por aceptar").length;
  return (
    <TechPhone tab="pedidos">
      <span className="mode">App del técnico</span>
      <div className="row">
        <h1 className="t">Pedidos</h1>
        <span className="pill warn">{fresh} nuevo{fresh === 1 ? "" : "s"}</span>
      </div>
      <p className="lead">Carlos Méndez · el aviso entra en cuanto el usuario agenda.</p>
      <div className="card flat">
        <div className="row"><b>Pedido cancelado</b><span className="pill mute">Cancelado</span></div>
        <div className="small">Ana García canceló Revisión de contacto (lun 2 · 12:00). Estaba Aceptado y aún no ibas en camino. Es un trabajo de electricidad.</div>
      </div>
      {mine.filter((o) => o.techId === "carlos" || o.status === "por aceptar").map((o) => (
        <button className="card" key={o.id} onClick={() => nav(o.status === "por aceptar" ? `/tecnico/pedido/${o.id}` : `/tecnico/estado/${o.id}`)}>
          <div className="row"><b>{o.service} · ${o.price}</b><span className="pill warn">{o.status}</span></div>
          <div className="small">{demo.nameOf(o.clientId)} · {o.when} · {o.where}<br />{o.address}</div>
        </button>
      ))}
    </TechPhone>
  );
}

export function PedidoNuevo() {
  const nav = useNavigate();
  const { id } = useParams();
  const demo = useDemo();
  const order = demo.state.orders.find((o) => o.id === id) || demo.state.orders.find((o) => o.status === "por aceptar");
  const [msg, setMsg] = useState("");
  if (!order) return <TechPhone><Back to="/tecnico" label="Pedido" /><p>No hay pedidos por aceptar.</p></TechPhone>;
  return (
    <TechPhone>
      <Back to="/tecnico" label="Pedido nuevo" />
      <span className="mode">App del técnico</span>
      <div className="card">
        <div className="kicker">Por aceptar</div>
        <h1 className="t" style={{ fontSize: 22 }}>{order.service}</h1>
        <div className="small">{demo.nameOf(order.clientId)} · {order.when}<br />{order.where} · {order.address}</div>
        <div className="price" style={{ marginTop: 4 }}>Precio base ${order.price} · comisión ${Math.round(order.price * 0.1)} si se paga</div>
      </div>
      <div className="label">Motivo, solo si rechazas</div>
      <input className="field" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="No puedo en ese horario" />
      <button className="btn" onClick={() => { demo.acceptOrder(order.id); nav("/tecnico"); }}>Aceptar pedido</button>
      <button className="btn danger" onClick={() => { demo.rejectOrder(order.id, msg); nav("/tecnico"); }}>Rechazar</button>
      {msg && <p className="note">Motivo listo: {msg}</p>}
      <p className="note">Aceptar lo pasa a Aceptado y Sofía lo ve. Rechazar lo pasa a Esperando técnico y se le avisa. El motivo es opcional.</p>
    </TechPhone>
  );
}

export function Estado() {
  const { id } = useParams();
  const demo = useDemo();
  const order = demo.state.orders.find((o) => o.id === id) || demo.state.orders.find((o) => o.id === "o-pastilla");
  const labels = ["aceptado", "en camino", "en proceso", "terminado"];
  const step = Math.max(0, labels.indexOf(order?.status));
  return (
    <TechPhone>
      <Back to="/tecnico" label="Estado" />
      <span className="mode">App del técnico</span>
      <h1 className="t" style={{ fontSize: 22 }}>{order?.service} · {demo.nameOf(order?.clientId)}</h1>
      <p className="lead">Ahora: {order?.status}. El siguiente paso es el único que puedes marcar. Es la cita del {order?.when}.</p>
      {labels.map((label, i) => (
        <div className="card" key={label} style={{ opacity: i < step ? 0.7 : 1 }}>
          <div className="row">
            <b>{label}</b>
            {i === step && <span className="pill info">Actual</span>}
            {i < step && <span className="pill ok">Hecho</span>}
          </div>
          {i === 0 && step === 0 && <div className="small">Estado actual. No se puede regresar.</div>}
        </div>
      ))}
      {order && labels.indexOf(order.status) >= 0 && labels.indexOf(order.status) < 3 ? (
        <button className="btn" onClick={() => demo.advance(order.id)}>Marcar {labels[step + 1]}</button>
      ) : (
        <div className="okbox">Terminado. Pagado lo pone el pago de Ana, no este botón.</div>
      )}
      <p className="note">Los estados avanzan en orden: aceptado, en camino, en proceso y terminado. No se saltan ni se regresan.</p>
    </TechPhone>
  );
}

const AGENDA = new Set(["por aceptar", "aceptado", "en camino", "en proceso", "terminado", "esperando"]);

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

export function Publicar() {
  const nav = useNavigate();
  const demo = useDemo();
  const [name, setName] = useState("Revisión de corto");
  const [price, setPrice] = useState("450");
  const [mode, setMode] = useState("A domicilio");
  const [place, setPlace] = useState("Av. Obregón 410, Col. Centro");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  return (
    <TechPhone tab="publicar">
      <span className="mode">App del técnico</span>
      <h1 className="t">Nuevo servicio</h1>
      <div className="label">Nombre</div>
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="label">Precio base</div>
      <input className="field" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="label">Modalidad</div>
      <div className="chips">
        {["A domicilio", "En mi punto de atención"].map((m) => (
          <button key={m} className={mode === m ? "chip on" : "chip"} onClick={() => setMode(m)}>{m}</button>
        ))}
      </div>
      <div className="label">Tu punto de atención, por si eliges el local</div>
      <input className="field" value={place} onChange={(e) => setPlace(e.target.value)} />
      <button className="btn" onClick={() => {
        const message = demo.publishService("carlos", { name, time: "40 min", home: mode === "A domicilio", price, place });
        setError(message);
        setSaved(message ? "" : `${name.trim()} quedó en tu perfil a $${Number(String(price).replace(/[^0-9.]/g, ""))}, ${mode === "A domicilio" ? "a domicilio" : "en tu local"}.`);
      }}>Publicar servicio</button>
      {error && <div className="err">{error}</div>}
      {saved && <div className="okbox">{saved} Ana lo ve al abrir tu perfil. Esta sesión no usa base de datos.</div>}
      <button className="btn ghost" onClick={() => nav("/tecnico/refaccion")}>Publicar una refacción</button>
      <p className="note">Al publicarse aparece en la búsqueda del usuario con su precio y su modalidad. Si publicas el mismo nombre, se actualiza el precio.</p>
    </TechPhone>
  );
}

export function Refaccion() {
  const demo = useDemo();
  const [name, setName] = useState("Foco LED 9W");
  const [category, setCategory] = useState("Electricidad");
  const [price, setPrice] = useState("45");
  const [stock, setStock] = useState("24");
  const [place, setPlace] = useState("Av. Obregón 410, Col. Centro");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  return (
    <TechPhone>
      <Back to="/tecnico/publicar" label="Publicar" />
      <span className="mode">App del técnico</span>
      <h1 className="t">Nueva refacción</h1>
      <div className="upload">Foto del foco · lista</div>
      <div className="label">Nombre</div>
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="label">Categoría</div>
      <div className="chips">
        {["Electricidad", "Plomería"].map((item) => (
          <button key={item} className={category === item ? "chip on" : "chip"} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <div className="label">Precio</div>
      <input className="field" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="label">Existencias</div>
      <input className="field" value={stock} onChange={(e) => setStock(e.target.value)} />
      <div className="label">Punto de atención para recoger</div>
      <input className="field" value={place} onChange={(e) => setPlace(e.target.value)} />
      <p className="note">Al publicarse entra a la tienda con tu nombre y este stock. La refacción no paga comisión y no se envía a domicilio.</p>
      <button className="btn" onClick={() => {
        const message = demo.publishPart("carlos", { name, category, price, stock, place });
        setError(message);
        setSaved(message ? "" : `${name.trim()} está en la tienda con ${stock} piezas a $${Number(String(price).replace(/[^0-9.]/g, ""))}.`);
      }}>Publicar producto</button>
      {error && <div className="err">{error}</div>}
      {saved && <div className="okbox">{saved} Comisión $0. Esta sesión no usa base de datos.</div>}
    </TechPhone>
  );
}

export function Agenda() {
  const demo = useDemo();
  const rows = demo.state.orders.filter((o) => o.techId === "carlos" && AGENDA.has(o.status));
  const groups = [];
  rows.forEach((order) => {
    const [day, time] = String(order.when).split(" · ");
    const found = groups.find((group) => group.day === day);
    const item = { ...order, time: time || order.when };
    if (found) found.items.push(item);
    else groups.push({ day, items: [item] });
  });
  return (
    <TechPhone tab="agenda">
      <span className="mode">App del técnico</span>
      <h1 className="t">Agenda</h1>
      <p className="lead">Citas de hoy y las próximas, por fecha y hora. Si aceptas, avanzas o el usuario cancela, esta lista cambia.</p>
      {groups.length === 0 && <div className="card">No tienes citas abiertas.</div>}
      {groups.map((group) => (
        <div key={group.day}>
          <div className="sec">{group.day}</div>
          {group.items.map((order) => (
            <div className="card" key={order.id}>
              <div className="row"><b>{order.time} · {order.service}</b><span className={`pill ${statusPill(order.status)}`}>{statusLabel(order.status)}</span></div>
              <div className="small">{demo.nameOf(order.clientId)} · {order.where} · {order.address} · ${order.price}</div>
            </div>
          ))}
        </div>
      ))}
    </TechPhone>
  );
}

export function Ganancias() {
  const demo = useDemo();
  const services = demo.state.orders.filter((o) => o.techId === "carlos" && o.paid);
  const parts = demo.state.payments.filter((p) => p.techId === "carlos" && p.kind === "refaccion" && p.status === "Pagado");
  const lines = [
    ...services.map((order) => {
      const commission = Math.round(order.price * 0.1);
      return { id: order.id, title: order.service, who: demo.nameOf(order.clientId), total: order.price, commission, receive: order.price - commission, part: false };
    }),
    ...parts.map((payment) => ({ id: payment.id, title: payment.concept.replace(" · refacción", ""), who: demo.nameOf(payment.clientId), total: payment.total, commission: 0, receive: payment.total, part: true })),
  ];
  const total = lines.reduce((sum, line) => sum + line.receive, 0);
  const reviews = demo.state.reviews.filter((review) => review.techId === "carlos");
  return (
    <TechPhone tab="ganancias">
      <span className="mode">App del técnico</span>
      <h1 className="t">Ganancias</h1>
      <div className="total">
        <div className="kicker">Por recibir de lo ya pagado</div>
        <div className="big">{money(total)}</div>
        <div className="small">{lines.map((line) => line.receive).join(" + ") || "0"}. La comisión es 10% del servicio y $0 en refacciones.</div>
      </div>
      {lines.map((line) => (
        <div className="card" key={line.id} style={{ marginTop: 8 }}>
          <div className="row"><b>{line.title}</b><span className="pill ok">Pagado</span></div>
          <div className="small">{line.who} · ${line.total}{line.part ? " · refacción" : ""} · comisión ${line.commission} · tú recibes ${line.receive}</div>
        </div>
      ))}
      <div className="sec">Reseñas</div>
      {reviews.length === 0 && <div className="card">Todavía no hay reseñas de pedidos pagados.</div>}
      {reviews.map((review) => (
        <div className="card" key={review.id}>
          <Stars value={review.stars} />
          <b> {demo.nameOf(review.clientId)}</b>
          <div className="small">{review.text}</div>
        </div>
      ))}
    </TechPhone>
  );
}

export function PerfilTecnico() {
  const nav = useNavigate();
  return (
    <TechPhone tab="perfil">
      <span className="mode">App del técnico</span>
      <h1 className="t">Carlos Méndez</h1>
      <p className="lead">Electricista verificado<br />carlos.mendez@gmail.com · 653 330 1944</p>
      <div className="card">
        <div className="kicker">Zona</div>
        <div>Col. Centro. La zona es la colonia donde atiende.</div>
      </div>
      <div className="card">
        <div className="kicker">Punto de atención</div>
        <b>Av. Obregón 410, Col. Centro</b>
        <div className="small">San Luis Río Colorado</div>
      </div>
      <div className="card">
        <div className="kicker">Sesión</div>
        <div className="small">Cerrar sesión está en Perfil. Esa pestaña va siempre en la barra de abajo.</div>
      </div>
      <button className="btn ghost" onClick={() => nav("/app/entrar")}>Cerrar sesión</button>
    </TechPhone>
  );
}
