import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Back, Phone, Steps } from "../ui";
import { useDemo } from "../demo";

const PILL = {
  "en camino": "info",
  aceptado: "ok",
  "por aceptar": "warn",
  esperando: "warn",
  terminado: "warn",
  pagado: "ok",
  cancelado: "mute",
  "en proceso": "info",
};

const CITAS = [
  { title: "Revisión de corto", meta: "Carlos Méndez · dom 15 · 10:00", price: "$450", pill: "info", state: "En camino", note: "Ya no se puede cancelar", to: "/app/citas/camino" },
  { title: "Cambio de pastilla", meta: "Carlos Méndez · lun 16 · 11:00 · en su local", price: "$280", pill: "ok", state: "Aceptado", action: "Cancelar", to: "/app/citas/pastilla" },
  { title: "Poda de patio", meta: "Sin técnico · mar 17 · 9:00", price: "$300", pill: "warn", state: "Esperando técnico", action: "Elegir otro", to: "/app/citas/esperando" },
  { title: "Revisión de falla", meta: "Diego Ramos · sáb 14 · 11:00", price: "$500", pill: "warn", state: "Terminado", action: "Pagar", to: "/app/citas/listo" },
  { title: "Cambio de llave", meta: "Luis Herrera · lun 2 · 9:00", price: "", pill: "mute", state: "Cancelado" },
  { title: "Revisión de contacto", meta: "Carlos Méndez · lun 2 · 12:00", price: "", pill: "mute", state: "Cancelado" },
];

export function Citas() {
  const nav = useNavigate();
  const demo = useDemo();
  const mine = demo.state.orders.filter((o) => o.clientId === demo.me?.id);
  const canCancel = (status) => ["por aceptar", "aceptado", "esperando"].includes(status);
  return (
    <Phone tab="citas">
      <h1 className="t">Citas</h1>
      <p className="lead">San Luis Río Colorado. Cancelar solo aparece antes de que el técnico vaya en camino.</p>
      {mine.map((o) => (
        <div className="card" key={o.id}>
          <button className="card flat" style={{ padding: 0, margin: 0 }} onClick={() => nav(`/app/citas/${o.id}`)}>
            <div className="row"><b>{o.service}</b><span className="price">${o.price}</span></div>
            <div className="small">{o.status === "esperando" ? "Sin técnico" : demo.nameOf(o.techId)} · {o.when}{o.where === "en su local" ? " · en su local" : ""}</div>
          </button>
          <div className="row" style={{ marginTop: 6 }}>
            <span className={`pill ${PILL[o.status] || "mute"}`}>{o.status[0].toUpperCase() + o.status.slice(1)}</span>
            {o.status === "en camino" && <span className="small">Ya no se puede cancelar</span>}
            {canCancel(o.status) && <button className="link" onClick={() => nav(`/app/citas/cancelar/${o.id}`)}>Cancelar</button>}
            {o.status === "esperando" && <button className="link" onClick={() => nav(`/app/citas/${o.id}`)}>Elegir otro</button>}
            {o.status === "terminado" && !o.paid && <button className="link" onClick={() => nav(`/app/citas/${o.id}`)}>Pagar</button>}
          </div>
        </div>
      ))}
    </Phone>
  );
}

export function Pastilla() {
  const nav = useNavigate();
  return (
    <Phone>
      <Back to="/app/citas" label="Tu servicio" />
      <div className="card">
        <div className="kicker">Lun 16 · 11:00 · en su local</div>
        <h1 className="t" style={{ fontSize: 22 }}>Cambio de pastilla</h1>
        <div className="small">Carlos Méndez · Av. Obregón 410</div>
        <div className="price" style={{ marginTop: 4 }}>Precio base $280</div>
      </div>
      <Steps items={[
        { title: "Por aceptar", state: "done" },
        { title: "Aceptado", state: "on", detail: "Carlos tomó el pedido. Aún no sale." },
        { title: "En camino" },
        { title: "En proceso → Terminado → Pagado", detail: "Pagado lo marca tu pago, no el técnico. Sin mapa." },
      ]} />
      <button className="btn danger" onClick={() => nav("/app/citas/cancelar")}>Cancelar pedido</button>
      <p className="note">Cancelar abre una confirmación. Si Ana acepta, pasa a Cancelado y se avisa a Carlos. En camino, este botón desaparece.</p>
    </Phone>
  );
}

export function Cancelar() {
  const nav = useNavigate();
  const { id } = useParams();
  const demo = useDemo();
  const order = demo.state.orders.find((o) => o.id === (id || "o-pastilla"));
  return (
    <Phone>
      <Back to="/app/citas/pastilla" label="Tu servicio" />
      <div className="card">
        <div className="kicker">Lun 16 · 11:00 · en su local</div>
        <h1 className="t" style={{ fontSize: 22 }}>{order?.service}</h1>
        <div className="small">{demo.nameOf(order?.techId)} · precio base ${order?.price}</div>
      </div>
      <div className="kicker">Confirmación</div>
      <h1 className="t" style={{ fontSize: 22 }}>¿Cancelar la cita?</h1>
      <p className="lead">Pasará a Cancelado y se avisará a Carlos. Si vuelves, el pedido sigue Aceptado. Lo mismo pide la lista cuando el estado es Esperando técnico.</p>
      <button className="btn danger" onClick={() => { demo.cancelOrder(order.id); nav("/app/citas"); }}>Sí, cancelar cita</button>
      <button className="btn ghost" onClick={() => nav(-1)}>No, volver</button>
    </Phone>
  );
}

export function Camino() {
  return (
    <Phone>
      <Back to="/app/citas" label="Tu servicio" />
      <div className="card">
        <div className="kicker">Dom 15 · 10:00 · a domicilio</div>
        <h1 className="t" style={{ fontSize: 22 }}>Revisión de corto</h1>
        <div className="small">Carlos Méndez · Calle 5 y Av. Juárez</div>
        <div className="price" style={{ marginTop: 4 }}>Precio base $450</div>
      </div>
      <Steps items={[
        { title: "Por aceptar", state: "done" },
        { title: "Aceptado", state: "done" },
        { title: "En camino", state: "on", detail: "Carlos va hacia tu domicilio." },
        { title: "En proceso" },
        { title: "Terminado" },
        { title: "Pagado", detail: "Ocurre después de tu confirmación." },
      ]} />
      <p className="note">Ya va en camino. Cancelar no aparece.</p>
    </Phone>
  );
}

export function Esperando() {
  const nav = useNavigate();
  return (
    <Phone>
      <Back to="/app/citas" label="Tu servicio" />
      <div className="err"><b>Esperando técnico.</b> Rosa Núñez, jardinera, rechazó la poda. Motivo: no puedo en ese horario.</div>
      <div className="card">
        <div className="kicker">Mar 17 · 9:00</div>
        <h1 className="t" style={{ fontSize: 22 }}>Poda de patio</h1>
        <div className="small">Precio base $300 · a domicilio<br />Calle 5 y Av. Juárez, Col. Comercial</div>
      </div>
      <button className="card" onClick={() => nav("/app/citas")}>
        <div className="who">
          <div className="avatar sm">LM</div>
          <div>
            <b>Lucía Mora</b>
            <div className="small">Jardinera verificada · sale a domicilio</div>
            <span className="star">★★★★☆</span> <span className="small">4.5 · 38 servicios</span>
          </div>
        </div>
      </button>
      <button className="btn" onClick={() => nav("/app/citas")}>Elegir a Lucía</button>
      <button className="btn danger" onClick={() => nav("/app/citas/cancelar")}>Cancelar pedido</button>
      <p className="note">Elegir a Lucía asigna este mismo pedido. Cancelar pide confirmación.</p>
    </Phone>
  );
}

export function Listo() {
  const nav = useNavigate();
  return (
    <Phone>
      <Back to="/app/citas" label="Tu servicio" />
      <div className="card">
        <div className="kicker">Sáb 14 · 11:00</div>
        <h1 className="t" style={{ fontSize: 22 }}>Revisión de falla</h1>
        <div className="small">Diego Ramos · Av. Juárez 220, Col. Comercial</div>
        <div className="price" style={{ marginTop: 4 }}>Precio base $500</div>
      </div>
      <Steps items={[
        { title: "Aceptado · En camino · En proceso", state: "done" },
        { title: "Terminado", state: "on", detail: "Revisa el resultado y confirma para pagar." },
        { title: "Pagado", detail: "Ocurre después de tu confirmación y del pago." },
      ]} />
      <button className="btn" onClick={() => nav("/app/pago")}>Sí, el trabajo quedó listo</button>
      <p className="note">Solo se puede confirmar si el estado es Terminado. Al confirmar, la app abre el pago de $500. Si aún no está bien, no confirmes.</p>
    </Phone>
  );
}

export function Pago() {
  const nav = useNavigate();
  const demo = useDemo();
  const parts = demo.state.cart && !demo.state.cart.paid ? demo.state.cart : null;
  const order = parts ? null : demo.debt;
  const total = parts ? demo.state.products.find((p) => p.id === parts.productId).price * parts.qty : order?.price || 500;
  const [card, setCard] = useState("4000 0000 0000 0002");
  const [error, setError] = useState("");
  return (
    <Phone>
      <Back to="/app/citas/listo" label="Pago" />
      <div className="total">
        <div className="kicker">Total a pagar</div>
        <div className="big">${total}</div>
        <div className="small">{parts ? "Refacciones · comisión $0" : `${order?.service || "Revisión de falla"} · servicio terminado`}</div>
      </div>
      {error && <div className="err" style={{ marginTop: 8 }}>{error}</div>}
      <p className="note">Stripe en modo de pruebas. ServiFix no guarda el número. Para un pago exitoso usa 4242 4242 4242 4242.</p>
      <div className="label">Número</div>
      <input className="field" value={card} onChange={(e) => setCard(e.target.value)} />
      <div className="grid2">
        <div>
          <div className="label">Vence</div>
          <input className="field" defaultValue="12/28" />
        </div>
        <div>
          <div className="label">CVC</div>
          <input className="field" defaultValue="123" />
        </div>
      </div>
      <button className="btn" onClick={() => {
        const message = demo.pay(parts ? { card, parts } : { card, orderId: order?.id });
        setError(message);
        if (!message) nav(parts ? "/app/carrito" : "/app/calificar");
      }}>Pagar ${total}</button>
      <p className="note">El mismo pago sirve para un pedido de refacciones ya armado. Esas no llevan comisión.</p>
    </Phone>
  );
}

export function Calificar() {
  const nav = useNavigate();
  const demo = useDemo();
  const order = demo.state.orders.find((o) => o.clientId === demo.me?.id && o.paid && !demo.state.reviews.some((r) => r.orderId === o.id));
  const [stars, setStars] = useState(4);
  const [text, setText] = useState("Llegó a tiempo y el precio fue el de la cita.");
  const [error, setError] = useState("");
  return (
    <Phone>
      <Back to="/app/pago" label="Tu servicio" />
      <div className="card">
        <div className="kicker">Sáb 14 · 11:00 · pagado</div>
        <h1 className="t" style={{ fontSize: 22 }}>Revisión de falla</h1>
        <div className="small">Diego Ramos · precio base $500</div>
      </div>
      <h1 className="t" style={{ fontSize: 22 }}>¿Cómo estuvo Diego Ramos?</h1>
      <p className="lead">Una reseña por pedido, de 1 a 5, con un comentario. Solo quien contrató y ya pagó.</p>
      <div className="chips">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} className={stars === n ? "chip on" : "chip"} onClick={() => setStars(n)}>{n} ★</button>
        ))}
      </div>
      <textarea className="field" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      {error && <div className="err">{error}</div>}
      <button className="btn" onClick={() => {
        const message = order ? demo.addReview(order.id, stars, text) : "No se puede crear una reseña si el pedido no está pagado.";
        setError(message);
        if (!message) nav("/app/citas");
      }}>Enviar reseña</button>
      <button className="btn ghost" onClick={() => nav("/app")}>Ahora no</button>
    </Phone>
  );
}

export function CitaDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const demo = useDemo();
  const order = demo.state.orders.find((o) => o.id === id);
  if (!order) return <Phone><Back to="/app/citas" label="Tu servicio" /><p>Esa cita ya no está.</p></Phone>;
  const tech = demo.techById(order.techId);
  const steps = ["por aceptar", "aceptado", "en camino", "en proceso", "terminado", "pagado"];
  const idx = steps.indexOf(order.status);
  if (order.status === "esperando") {
    const options = demo.state.techs.filter((t) => t.oficio === "Jardinero" && t.id !== "rosa");
    return (
      <Phone>
        <Back to="/app/citas" label="Tu servicio" />
        <div className="err"><b>Esperando técnico.</b> {order.reason ? `Motivo: ${order.reason}.` : "El técnico no escribió motivo."}</div>
        <div className="card"><div className="kicker">{order.when}</div><h1 className="t" style={{ fontSize: 22 }}>{order.service}</h1><div className="small">Precio base ${order.price} · {order.where}<br />{order.address}</div></div>
        {options.map((t) => (
          <button className="card" key={t.id} onClick={() => { demo.assignTech(order.id, t.id); nav("/app/citas"); }}>
            <b>Elegir a {t.name}</b>
            <div className="small">{t.oficio} · {t.rating} · {t.jobs} servicios</div>
          </button>
        ))}
        <button className="btn danger" onClick={() => nav(`/app/citas/cancelar/${order.id}`)}>Cancelar pedido</button>
      </Phone>
    );
  }
  return (
    <Phone>
      <Back to="/app/citas" label="Tu servicio" />
      <div className="card">
        <div className="kicker">{order.when} · {order.where}</div>
        <h1 className="t" style={{ fontSize: 22 }}>{order.service}</h1>
        <div className="small">{tech?.name} · {order.address}</div>
        <div className="price">Precio base ${order.price}</div>
      </div>
      {idx >= 0 && <Steps items={steps.map((title, i) => ({ title: title[0].toUpperCase() + title.slice(1), state: i < idx ? "done" : i === idx ? "on" : "" }))} />}
      {order.status === "terminado" && !order.paid && <button className="btn" onClick={() => nav("/app/pago")}>Sí, el trabajo quedó listo</button>}
      {order.paid && !demo.state.reviews.some((r) => r.orderId === order.id) && <button className="btn" onClick={() => nav("/app/calificar")}>Calificar</button>}
      {["por aceptar", "aceptado", "esperando"].includes(order.status) && <button className="btn danger" onClick={() => nav(`/app/citas/cancelar/${order.id}`)}>Cancelar pedido</button>}
      {["en camino", "en proceso", "terminado", "pagado"].includes(order.status) && <p className="note">A partir de En camino ya no existe el botón de cancelar. El seguimiento es por estados, no por mapa.</p>}
    </Phone>
  );
}

export function Tienda() {
  const nav = useNavigate();
  const demo = useDemo();
  const [cat, setCat] = useState("Todo");
  const items = demo.state.products.filter((p) => cat === "Todo" || p.category === cat);
  return (
    <Phone tab="tienda">
      <div className="kicker">Tienda ServiFix</div>
      <h1 className="t">Refacciones</h1>
      <div className="chips">
        {["Todo", "Electricidad", "Plomería", "Jardín", "Mecánica"].map((c) => (
          <button key={c} className={cat === c ? "chip on" : "chip"} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {items.map((p) => (
        <button className="card" key={p.id} onClick={() => nav(`/app/tienda/${p.id}`)}>
          <div className="row"><b>{p.name}</b><span className="price">${p.price.toLocaleString("es-MX")}</span></div>
          <div className="small">{p.stock} disponibles · {p.category}</div>
          <div className="small">Recoge con {demo.nameOf(p.techId)} · {p.place}</div>
        </button>
      ))}
      {items.length === 0 && <p className="note">No hay refacciones de jardín en este ejemplo.</p>}
      <p className="note">Sin entrega a domicilio. Un pedido junta refacciones del mismo técnico.</p>
    </Phone>
  );
}

export function Foco() {
  const nav = useNavigate();
  const { id } = useParams();
  const demo = useDemo();
  const product = demo.state.products.find((p) => p.id === (id || "foco")) || demo.state.products[0];
  const stock = product.stock;
  const [qty, setQty] = useState(Math.min(2, stock || 1));
  return (
    <Phone>
      <Back to="/app/tienda" label="Refacción" />
      <div className="kicker">{product.category} · {demo.nameOf(product.techId)}</div>
      <h1 className="t">{product.name}</h1>
      <p className="lead">{product.detail}</p>
      <div className="price" style={{ fontSize: 28 }}>${product.price.toLocaleString("es-MX")}</div>
      <p className="small">{stock} piezas disponibles</p>
      <div className="qty">
        <button onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
        <b>{qty}</b>
        <button onClick={() => setQty((n) => Math.min(stock, n + 1))}>+</button>
      </div>
      {qty >= stock && <div className="err" style={{ marginTop: 8 }}>No puedes pedir más de {stock}. El tope es el stock.</div>}
      <button className="btn" onClick={() => { demo.setCart({ productId: product.id, qty, paid: false }); nav("/app/carrito"); }}>Ver carrito</button>
    </Phone>
  );
}

export function Carrito() {
  const nav = useNavigate();
  const demo = useDemo();
  const line = demo.state.cart;
  const product = line ? demo.state.products.find((p) => p.id === line.productId) : demo.state.products[0];
  const qty = line?.qty || 2;
  const total = (product?.price || 45) * qty;
  return (
    <Phone>
      <Back to="/app/tienda/foco" label="Carrito" />
      <h1 className="t">Recoges con Carlos Méndez</h1>
      <p className="lead">Av. Obregón 410, Col. Centro<br />San Luis Río Colorado · sin entrega a domicilio</p>
      <div className="card">
        <div className="row"><b>{product?.name}</b><b>${total}</b></div>
        <div className="small">{qty} × ${product?.price}</div>
      </div>
      <div className="total">
        <div className="kicker">Total de refacciones · comisión $0</div>
        <div className="big">${total}</div>
        <div className="small">Producto, cantidad, precio y técnico quedan en el pedido.</div>
      </div>
      <button className="btn" onClick={() => { if (!line || line.paid) return; nav("/app/pago"); }}>{line?.paid ? "Ya está pagado" : `Pagar $${total} con tarjeta`}</button>
      <p className="note">Así se veía el carrito antes de pagar. Después de este pago, Ganancias y Pagos quedan en Pagado y el stock pasa de 24 a 22.</p>
    </Phone>
  );
}
