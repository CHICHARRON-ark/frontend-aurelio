import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Back, Stars, TechPhone } from "../ui";
import { useDemo } from "../demo";

export function Pedidos() {
  const nav = useNavigate();
  const demo = useDemo();
  const tech = demo.myTech;
  const mine = demo.state.orders.filter((o) => o.techId === tech?.id);
  const fresh = mine.filter((o) => o.status === "por aceptar").length;
  return (
    <TechPhone tab="pedidos">
      <div className="row">
        <h1 className="t">Pedidos</h1>
        <span className="pill warn">{fresh} nuevo{fresh === 1 ? "" : "s"}</span>
      </div>
      <p className="lead">{tech?.name} · {tech?.oficio}</p>
      {mine.length === 0 && <p className="note">Cuando un cliente agende contigo, el pedido aparece aquí.</p>}
      {mine.map((o) => (
        <button className="card" key={o.id} onClick={() => nav(o.status === "por aceptar" ? `/tecnico/pedido/${o.id}` : `/tecnico/estado/${o.id}`)}>
          <div className="row"><b>{o.service} · ${o.price}</b><span className={`pill ${statusPill(o.status)}`}>{statusLabel(o.status)}</span></div>
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
  const order = demo.state.orders.find((o) => o.id === id && o.techId === demo.myTech?.id);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  if (!order) return <TechPhone><Back to="/tecnico" label="Pedido" /><p>Ese pedido ya no está por aceptar.</p></TechPhone>;
  return (
    <TechPhone>
      <Back to="/tecnico" label="Pedido nuevo" />
      <div className="card">
        <div className="kicker">Por aceptar</div>
        <h1 className="t" style={{ fontSize: 22 }}>{order.service}</h1>
        <div className="small">{demo.nameOf(order.clientId)} · {order.when}<br />{order.where} · {order.address}</div>
        <div className="price" style={{ marginTop: 4 }}>Precio base ${order.price} · tú recibes ${order.price - Math.round(order.price * 0.1)} si se paga</div>
      </div>
      <div className="label">Motivo, solo si rechazas</div>
      <input className="field" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="No puedo en ese horario" />
      {error && <div className="err">{error}</div>}
      <button className="btn" onClick={() => { const message = demo.acceptOrder(order.id); setError(message); if (!message) nav("/tecnico"); }}>Aceptar pedido</button>
      <button className="btn danger" onClick={() => { const message = demo.rejectOrder(order.id, msg); setError(message); if (!message) nav("/tecnico"); }}>Rechazar</button>
    </TechPhone>
  );
}

export function Estado() {
  const { id } = useParams();
  const demo = useDemo();
  const order = demo.state.orders.find((o) => o.id === id && o.techId === demo.myTech?.id);
  const labels = ["aceptado", "en camino", "en proceso", "terminado"];
  const step = Math.max(0, labels.indexOf(order?.status));
  if (!order) return <TechPhone><Back to="/tecnico" label="Estado" /><p>Esa cita no está en tus pedidos.</p></TechPhone>;
  return (
    <TechPhone>
      <Back to="/tecnico" label="Estado" />
      <h1 className="t" style={{ fontSize: 22 }}>{order.service} · {demo.nameOf(order.clientId)}</h1>
      <p className="lead">{order.when} · {order.address}. Ahora: {statusLabel(order.status)}.</p>
      {labels.map((label, i) => (
        <div className="card" key={label} style={{ opacity: i < step ? 0.7 : 1 }}>
          <div className="row">
            <b>{statusLabel(label)}</b>
            {i === step && <span className="pill info">Actual</span>}
            {i < step && <span className="pill ok">Hecho</span>}
          </div>
        </div>
      ))}
      {labels.includes(order.status) && labels.indexOf(order.status) < 3 ? (
        <button className="btn" onClick={() => demo.advance(order.id)}>Marcar {statusLabel(labels[step + 1])}</button>
      ) : (
        <div className="okbox">{order.status === "pagado" ? "El cliente ya pagó." : "Terminado. El pago lo registra el cliente."}</div>
      )}
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
  const tech = demo.myTech;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mode, setMode] = useState("A domicilio");
  const [place, setPlace] = useState(tech?.place || "");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  return (
    <TechPhone tab="publicar">
      <h1 className="t">Nuevo servicio</h1>
      <p className="lead">Se publica en tu perfil y en la búsqueda de los clientes.</p>
      <div className="label">Nombre</div>
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ejemplo: Cambio de contacto" />
      <div className="label">Precio base</div>
      <input className="field" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="label">Modalidad</div>
      <div className="chips">
        {["A domicilio", "En mi punto de atención"].map((m) => (
          <button key={m} className={mode === m ? "chip on" : "chip"} onClick={() => setMode(m)}>{m}</button>
        ))}
      </div>
      <div className="label">Punto de atención</div>
      <input className="field" value={place} onChange={(e) => setPlace(e.target.value)} />
      <button className="btn" onClick={() => {
        const message = demo.publishService(tech?.id, { name, time: "1 h", home: mode === "A domicilio", price, place });
        setError(message);
        setSaved(message ? "" : `${name.trim()} quedó publicado a $${Number(String(price).replace(/[^0-9.]/g, ""))}.`);
        if (!message) setName("");
      }}>Publicar servicio</button>
      {error && <div className="err">{error}</div>}
      {saved && <div className="okbox">{saved}</div>}
      <button className="btn ghost" onClick={() => nav("/tecnico/refaccion")}>Publicar una refacción</button>
    </TechPhone>
  );
}

export function Refaccion() {
  const demo = useDemo();
  const tech = demo.myTech;
  const [name, setName] = useState("");
  const [category, setCategory] = useState(demo.state.categories[0] || "Electricidad");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [place, setPlace] = useState(tech?.place || "");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  return (
    <TechPhone>
      <Back to="/tecnico/publicar" label="Publicar" />
      <h1 className="t">Nueva refacción</h1>
      <div className="label">Nombre</div>
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="label">Categoría</div>
      <div className="chips">
        {demo.state.categories.map((item) => (
          <button key={item} className={category === item ? "chip on" : "chip"} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <div className="label">Precio</div>
      <input className="field" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="label">Existencias</div>
      <input className="field" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
      <div className="label">Dónde la recogen</div>
      <input className="field" value={place} onChange={(e) => setPlace(e.target.value)} />
      <button className="btn" onClick={() => {
        const message = demo.publishPart(tech?.id, { name, category, price, stock, place });
        setError(message);
        setSaved(message ? "" : `${name.trim()} ya está en la tienda.`);
        if (!message) { setName(""); setPrice(""); setStock(""); }
      }}>Publicar producto</button>
      {error && <div className="err">{error}</div>}
      {saved && <div className="okbox">{saved}</div>}
    </TechPhone>
  );
}

export function Agenda() {
  const demo = useDemo();
  const techId = demo.myTech?.id;
  const rows = demo.state.orders.filter((o) => o.techId === techId && AGENDA.has(o.status));
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
      <h1 className="t">Agenda</h1>
      <p className="lead">Citas abiertas, agrupadas por el día que eligió el cliente.</p>
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
  const techId = demo.myTech?.id;
  const services = demo.state.orders.filter((o) => o.techId === techId && o.paid);
  const parts = demo.state.payments.filter((p) => p.techId === techId && p.kind === "refaccion" && p.status === "Pagado");
  const lines = [
    ...services.map((order) => {
      const commission = Math.round(order.price * 0.1);
      return { id: order.id, title: order.service, who: demo.nameOf(order.clientId), total: order.price, commission, receive: order.price - commission, part: false };
    }),
    ...parts.map((payment) => ({ id: payment.id, title: payment.concept.replace(" · refacción", ""), who: demo.nameOf(payment.clientId), total: payment.total, commission: 0, receive: payment.total, part: true })),
  ];
  const total = lines.reduce((sum, line) => sum + line.receive, 0);
  const reviews = demo.state.reviews.filter((review) => review.techId === techId);
  return (
    <TechPhone tab="ganancias">
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
  const demo = useDemo();
  const tech = demo.myTech;
  const me = demo.me;
  return (
    <TechPhone tab="perfil">
      <h1 className="t">{tech?.name || me?.name}</h1>
      <p className="lead">{tech?.oficio} verificado<br />{me?.email} · {tech?.phone || me?.phone}</p>
      <div className="card">
        <div className="kicker">Zona</div>
        <div>{tech?.zone}</div>
      </div>
      <div className="card">
        <div className="kicker">Punto de atención</div>
        <b>{tech?.place}</b>
        <div className="small">San Luis Río Colorado</div>
      </div>
      <div className="sec">Servicios publicados</div>
      {(tech?.services || []).map((service) => (
        <div className="card" key={service.id}>
          <div className="row"><b>{service.name}</b><span className="price">${service.price}</span></div>
          <div className="small">{service.home ? "A domicilio" : "En su local"} · {service.time}</div>
        </div>
      ))}
      <button className="btn ghost" onClick={() => { demo.logout(); nav("/app/entrar"); }}>Cerrar sesión</button>
    </TechPhone>
  );
}
