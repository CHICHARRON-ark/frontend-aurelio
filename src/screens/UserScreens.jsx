import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Back, Phone, Stars } from "../ui";
import { useDemo } from "../demo";

const SERVICES = [
  { id: "corto", name: "Revisión de corto", time: "Cerca de 1 h", where: "A domicilio", price: 450, home: true },
  { id: "pastilla", name: "Cambio de pastilla", time: "40 min", where: "En su local", price: 280, home: false },
  { id: "contactos", name: "Instalación de contactos", time: "1 h", where: "A domicilio", price: 350, home: true },
];

export function Registro() {
  const nav = useNavigate();
  const demo = useDemo();
  const [form, setForm] = useState({ name: "Ana García", email: "ana@empresa.com", phone: "653 120 4488", password: "corta" });
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  return (
    <Phone>
      <Back to="/app/entrar" label="Crear cuenta" />
      <h1 className="t">Regístrate</h1>
      <p className="lead">Para contratar servicios y comprar refacciones en San Luis Río Colorado.</p>
      <div className="label">Nombre</div>
      <input className="field" value={form.name} onChange={set("name")} />
      <div className="label">Correo</div>
      <input className="field" value={form.email} onChange={set("email")} />
      {error && <div className="err">{error}</div>}
      <div className="label">Teléfono</div>
      <input className="field" value={form.phone} onChange={set("phone")} />
      <div className="label">Contraseña</div>
      <input className="field" type="password" value={form.password} onChange={set("password")} />
      <p className="note">Mínimo 8 caracteres. ServiFix no la guarda en texto plano.</p>
      <button className="btn" onClick={() => {
        const message = demo.register(form);
        setError(message);
        if (!message) nav("/app/entrar");
      }}>Crear cuenta</button>
    </Phone>
  );
}

export function Entrar() {
  const nav = useNavigate();
  const demo = useDemo();
  const [email, setEmail] = useState("ana.garcia@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <Phone>
      <div className="avatar" style={{ margin: "8px 0" }}>S</div>
      <h1 className="t">Entra a ServiFix</h1>
      <p className="lead">Para contratar, comprar y seguir tu servicio.</p>
      <div className="label">Correo</div>
      <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="label">Contraseña</div>
      <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <p className="note">La sesión de la app dura 7 días. Después hay que volver a entrar. Demo: ana.garcia@gmail.com · servifix</p>
      <button className="btn" onClick={() => {
        const message = demo.login(email, password, false);
        setError(message);
        if (!message) nav("/app");
      }}>Entrar</button>
      <button className="btn ghost" onClick={() => nav("/app/registro")}>Crear cuenta</button>
      {error && <div className="err" style={{ marginTop: 8 }}>{error}</div>}
    </Phone>
  );
}

export function Inicio() {
  const nav = useNavigate();
  const demo = useDemo();
  const found = demo.state.filters.query.trim() ? demo.searchTechs() : [];
  return (
    <Phone tab="inicio">
      <div className="row">
        <div>
          <p className="hello">Hola, {demo.me?.name?.split(" ")[0] || "Ana"}</p>
          <h1 className="t">¿Qué necesitas resolver hoy?</h1>
        </div>
        <button className="sq" onClick={() => nav("/app/avisos")} aria-label="Avisos">
          🔔<span className="nbadge">5</span>
        </button>
      </div>
      <div className="search">
        <input className="input" placeholder="Ejemplo: fuga, luz, pasto" value={demo.state.filters.query} onChange={(e) => demo.setQuery(e.target.value)} />
        <button className="sq" onClick={() => nav("/app/filtros")} aria-label="Filtros">☰</button>
      </div>
      <p className="small">San Luis Río Colorado</p>
      {found.length > 0 && found.map((t) => (
        <TechRow key={t.id} initials={t.initials} name={t.name} meta={`${t.oficio} · ${demo.modality(t)}`} stars={Math.round(t.rating)} line={`${t.rating} · desde $${demo.fromPrice(t)}`} onClick={() => nav(`/app/tecnico/${t.id}`)} />
      ))}
      {demo.state.filters.query.trim() && found.length === 0 && <p className="note">Ningún técnico coincide con ese nombre.</p>}
      <div className="grid2">
        {[
          ["⚡", "Electricista", "Luz, contactos, cortos"],
          ["🔧", "Mecánico", "Batería y fallas"],
          ["🌿", "Jardinero", "Poda, pasto, riego"],
          ["💧", "Plomero", "Fugas, llaves, destapes"],
        ].map(([ico, name, desc]) => (
          <button className="cat" key={name} onClick={() => nav(`/app/lista/${name}`)}>
            <div className="ico">{ico}</div>
            <b>{name}</b>
            <span className="small">{desc}</span>
          </button>
        ))}
      </div>
      <button className="banner" onClick={() => nav("/app/tienda")}>
        <span>Tienda ServiFix</span>
        <b>Refacciones para recoger</b>
        <span>Precio y piezas visibles. Las recoges con el técnico. Sin envío a domicilio.</span>
      </button>
      <div className="row">
        <div className="sec" style={{ margin: 0 }}>Técnicos destacados</div>
        <button className="link" onClick={() => nav("/app/lista/Electricista")}>Ver todos</button>
      </div>
      <TechRow initials="CM" name="Carlos Méndez" meta="Electricista · a domicilio" stars={5} line="4.9 · desde $280" onClick={() => nav("/app/tecnico/carlos")} />
      <TechRow initials="LH" name="Luis Herrera" meta="Plomero · en su local" stars={4} line="4.8 · desde $320" onClick={() => nav("/app/tecnico/luis")} />
    </Phone>
  );
}

function TechRow({ initials, name, meta, stars, line, onClick }) {
  return (
    <button className="card" onClick={onClick}>
      <div className="who">
        <div className="avatar sm">{initials}</div>
        <div style={{ flex: 1 }}>
          <b>{name}</b>
          <div className="small">{meta}</div>
          <div className="row">
            <Stars value={stars} />
            <span className="small">{line}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function Filtros() {
  const nav = useNavigate();
  const demo = useDemo();
  const max = demo.state.filters.maxPrice;
  const min = demo.state.filters.minRating;
  const pass = demo.searchTechs("Electricista");
  return (
    <Phone>
      <Back to="/app" label="Filtros" />
      <h1 className="t">Afina la búsqueda</h1>
      <p className="lead">El ícono ☰ del inicio abre esta pantalla. La cobertura sigue siendo San Luis Río Colorado.</p>
      <div className="label">Precio base máximo</div>
      <input className="field" value={`$${max}`} onChange={(e) => demo.setFilters({ maxPrice: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })} />
      <p className="note">Solo entran técnicos cuyo precio desde no pase de este monto.</p>
      <div className="label">Calificación mínima</div>
      <div className="chips">
        {[3, 4, 4.5].map((n) => (
          <button key={n} className={min === n ? "chip on" : "chip"} onClick={() => demo.setFilters({ minRating: n })}>{n.toFixed(1)}</button>
        ))}
      </div>
      <div className="card flat">
        <b>Con estos filtros</b>
        <p className="small">{pass.length ? pass.map((t) => `${t.name.split(" ")[0]} (${t.rating} · desde $${demo.fromPrice(t)})`).join(" y ") + " sí entran." : "Nadie cumple las dos condiciones."} Queda fuera quien cobre desde más de ${max} o tenga menos de {min.toFixed(1)}.</p>
      </div>
      <button className="btn" onClick={() => { demo.setFilters({ active: true }); nav("/app/lista/Electricista"); }}>Aplicar filtros</button>
      <button className="btn ghost" onClick={() => demo.setFilters({ maxPrice: 400, minRating: 4, query: "", active: false })}>Limpiar</button>
    </Phone>
  );
}

export function Listado() {
  const nav = useNavigate();
  const { oficio } = useParams();
  const trade = oficio || "Electricista";
  const demo = useDemo();
  const [name, setName] = useState(demo.state.filters.query);
  const list = demo.searchTechs(trade).filter((t) => t.name.toLowerCase().includes(name.trim().toLowerCase()));
  return (
    <Phone>
      <Back to="/app" label={trade} />
      <p className="lead">{demo.state.filters.active ? `${list.length} técnicos verificados. Entran con precio base de hasta $${demo.state.filters.maxPrice} y calificación mínima de ${demo.state.filters.minRating.toFixed(1)}.` : `${list.length} técnicos verificados de este oficio.`}</p>
      <input className="field" placeholder="Buscar por nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="chips">
        <span className="chip on">Precio base máx. ${demo.state.filters.maxPrice}</span>
        <span className="chip on">Calificación mín. ★ {demo.state.filters.minRating.toFixed(1)}</span>
      </div>
      {list.map((t) => (
        <button className="card" key={t.id} onClick={() => nav(`/app/tecnico/${t.id}`)}>
          <div className="who">
            <div className="avatar sm">{t.initials}</div>
            <div>
              <b>{t.name}</b>
              <div className="small">{t.oficio} · {t.services.some((s) => s.home) ? "sale a domicilio" : "solo en su local"}</div>
              <Stars value={Math.round(t.rating)} /> <span className="small">{t.rating} · {t.jobs} servicios</span>
            </div>
          </div>
          <div className="price" style={{ marginTop: 6 }}>Desde ${demo.fromPrice(t)}</div>
        </button>
      ))}
      {list.length === 0 && <p className="note">Nadie coincide con el nombre y los filtros.</p>}
    </Phone>
  );
}

export function Detalle() {
  const nav = useNavigate();
  const { id } = useParams();
  const demo = useDemo();
  const tech = demo.techById(id || "carlos");
  const [sel, setSel] = useState(tech?.services[0]);
  if (!tech || !sel) return <Phone><p>No se encontró al técnico.</p></Phone>;
  const blocked = Boolean(demo.debt);
  return (
    <Phone>
      <Back to={`/app/lista/${tech.oficio}`} label={tech.oficio} />
      <div className="who" style={{ marginBottom: 8 }}>
        <div className="avatar">{tech.initials}</div>
        <div>
          <b>{tech.name}</b>
          <div className="small">Verificado · {tech.oficio}</div>
          <div><Stars value={Math.round(tech.rating)} /> <span className="small">{tech.rating} · {tech.jobs} servicios</span></div>
        </div>
      </div>
      <p className="lead">{tech.bio}</p>
      <div className="sec">Elige un servicio</div>
      {tech.services.map((s) => (
        <button key={s.id} className={sel.id === s.id ? "card sel" : "card"} onClick={() => setSel(s)}>
          <div className="row">
            <b>{s.name}</b>
            <span className="price">${s.price}</span>
          </div>
          <div className="small">{s.time} · {s.home ? "A domicilio" : "En su local"}</div>
        </button>
      ))}
      <div className="sec">Reseñas</div>
      <div className="card">
        <b>Elena Cruz</b>
        <div><Stars value={5} /></div>
        <div className="small">Llegó a tiempo y explicó la falla.</div>
      </div>
      {blocked && <div className="err">Tienes “{demo.debt.service}” terminada y sin pagar. Contratar no crea otro pedido.</div>}
      <button className="btn" onClick={() => {
        if (blocked) { nav("/app/paga-primero"); return; }
        demo.setDraft({ techId: tech.id, serviceId: sel.id, service: sel.name, price: sel.price, home: sel.home });
        nav(sel.home ? "/app/domicilio" : "/app/local");
      }}>
        {blocked ? "Paga primero" : `Contratar · $${sel.price}`}
      </button>
    </Phone>
  );
}

export function Domicilio() {
  const nav = useNavigate();
  const demo = useDemo();
  const [day, setDay] = useState("Mañana · lun 16");
  const [hour, setHour] = useState("10:00");
  const [address, setAddress] = useState("Calle 5 y Av. Juárez, Col. Comercial");
  const draft = demo.state.draft;
  return (
    <Phone>
      <Back to="/app/carlos" label="Contratar" />
      <div className="kicker">Paso 1 de 2 · a domicilio</div>
      <h1 className="t">¿Dónde y cuándo?</h1>
      <p className="lead">{draft?.service || "Revisión de corto"} con {demo.techById(draft?.techId)?.name || "el técnico"}. Precio base ${draft?.price || 450}. Este servicio sí va a tu domicilio.</p>
      <div className="label">Dirección en San Luis Río Colorado</div>
      <input className="field" value={address} onChange={(e) => setAddress(e.target.value)} />
      <div className="label">Día</div>
      <div className="chips">
        {["Hoy · dom 15", "Mañana · lun 16", "Mar 17"].map((d) => (
          <button key={d} className={day === d ? "chip on" : "chip"} onClick={() => setDay(d)}>{d}</button>
        ))}
      </div>
      <div className="label">Hora</div>
      <div className="chips">
        {["9:00", "10:00", "16:30", "18:00"].map((h) => (
          <button key={h} className={hour === h ? "chip on" : "chip"} onClick={() => setHour(h)}>{h}</button>
        ))}
      </div>
      <button className="btn" onClick={() => {
        if (!address.trim()) return;
        demo.setDraft({ address, when: `${day} · ${hour}`, home: true });
        nav("/app/precio");
      }}>Continuar</button>
      <p className="note">Siguiente pantalla: el precio base, antes de agendar. No se cobra ahora.</p>
    </Phone>
  );
}

export function Local() {
  const nav = useNavigate();
  const demo = useDemo();
  const [day, setDay] = useState("Mañana · lun 16");
  const [hour, setHour] = useState("11:00");
  const draft = demo.state.draft;
  const tech = demo.techById(draft?.techId);
  return (
    <Phone>
      <Back to="/app/carlos" label="Contratar" />
      <div className="kicker">Paso 1 de 2 · en el local</div>
      <h1 className="t">En su punto de atención</h1>
      <p className="lead">{draft?.service || "El servicio"} con {tech?.name || "el técnico"}. Precio base ${draft?.price || 280}. No hace falta tu dirección.</p>
      <div className="card">
        <div className="kicker">El servicio es aquí</div>
        <b>Punto de atención de {tech?.name || "el técnico"}</b>
        <div className="small">{tech?.place || "Av. Obregón 410, Col. Centro"}<br />San Luis Río Colorado, Sonora</div>
      </div>
      <div className="label">Día</div>
      <div className="chips">
        {["Hoy · dom 15", "Mañana · lun 16"].map((d) => (
          <button key={d} className={day === d ? "chip on" : "chip"} onClick={() => setDay(d)}>{d}</button>
        ))}
      </div>
      <div className="label">Hora</div>
      <div className="chips">
        {["9:00", "11:00", "16:30"].map((h) => (
          <button key={h} className={hour === h ? "chip on" : "chip"} onClick={() => setHour(h)}>{h}</button>
        ))}
      </div>
      <button className="btn" onClick={() => { demo.setDraft({ when: `${day} · ${hour}`, home: false, address: tech?.place }); nav("/app/precio"); }}>Continuar</button>
      <p className="note">La cita queda con el punto de atención del técnico, no con una dirección tuya.</p>
    </Phone>
  );
}

export function Precio() {
  const nav = useNavigate();
  const demo = useDemo();
  const draft = demo.state.draft;
  const tech = demo.techById(draft?.techId);
  const price = draft?.price || 450;
  const commission = Math.round(price * 0.1);
  const labor = price - commission;
  return (
    <Phone>
      <Back to="/app/domicilio" label="Contratar" />
      <div className="kicker">Paso 2 de 2</div>
      <h1 className="t">Revisa el precio</h1>
      <p className="small">Intento · todavía no es una cita</p>
      <div className="card">
        <b>{tech?.name || "Técnico"}</b>
        <div className="small">{draft?.service || "Servicio"} · {draft?.home ? "a domicilio" : "en su local"}</div>
        <div className="small">{draft?.when || "Lun 16 · 10:00"}</div>
        <div className="small">{draft?.address || tech?.place}</div>
      </div>
      <div className="sec">Desglose del precio base</div>
      <div className="card">
        <div className="row"><span>Mano de obra</span><b>${labor}</b></div>
        <div className="row"><span>Comisión 10%</span><b>${commission}</b></div>
        <div className="row"><b>Total</b><b>${price}</b></div>
      </div>
      <p className="note">Mano de obra ${labor} + comisión ${commission} = ${price}. Tú pagas ese total. No es un cargo aparte y no se cobra ahora.</p>
      <button className="btn" onClick={() => {
        const result = demo.schedule();
        nav(result === "debt" ? "/app/no-agendo" : "/app/citas");
      }}>Agendar por ${price}</button>
      <button className="btn ghost" onClick={() => nav("/app/domicilio")}>Corregir datos</button>
      <div className="err">Ana tiene la revisión de falla terminada y sin pagar. Agendar no crea esta cita.</div>
    </Phone>
  );
}

export function NoAgendo() {
  const nav = useNavigate();
  return (
    <Phone>
      <Back to="/app/precio" label="Contratar" />
      <h1 className="t">No se agendó.</h1>
      <p className="lead">La revisión de corto del lun 16 a las 10:00 no quedó en Por aceptar. Tienes “Revisión de falla” terminada y sin pagar desde el sáb 14.</p>
      <div className="card">
        <div className="kicker">Sigue sin pagar</div>
        <b>Revisión de falla · $500</b>
        <div className="small">Diego Ramos · sáb 14 · 11:00</div>
      </div>
      <button className="btn" onClick={() => nav("/app/pago")}>Ir a pagar $500</button>
      <button className="btn ghost" onClick={() => nav("/app/citas")}>Volver a mis citas</button>
      <p className="note">Sofía R. sí dejó una revisión de corto en Por aceptar, lun 16 a las 18:00. Ella no debe un servicio terminado, y Carlos la ve en Pedidos.</p>
    </Phone>
  );
}

export function PagaPrimero() {
  const nav = useNavigate();
  return (
    <Phone>
      <Back to="/app/carlos" label="Contratar" />
      <h1 className="t">Primero paga el servicio terminado.</h1>
      <p className="lead">Tienes “Revisión de falla” con Diego Ramos en estado Terminado, por $500. No se crea este pedido nuevo.</p>
      <div className="card">
        <div className="kicker">Pedido sin pagar</div>
        <div className="row"><b>Revisión de falla</b><span className="pill warn">Terminado</span></div>
        <div className="small">Diego Ramos · sáb 14 · 11:00</div>
        <div className="price">$500</div>
      </div>
      <button className="btn" onClick={() => nav("/app/pago")}>Ir a pagar $500</button>
      <button className="btn" disabled>Contratar otro servicio · desactivado</button>
      <p className="note">Ese botón está desactivado. Cuando el pedido quede Pagado, vuelve a poder usarse. Cancelado o Pagado no bloquean.</p>
    </Phone>
  );
}
