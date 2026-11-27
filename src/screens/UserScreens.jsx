import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Back, Phone, Stars } from "../ui";
import { useDemo } from "../demo";

function nextDays(count) {
  const fmt = new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short" });
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const label = fmt.format(date).replace(".", "");
    if (i === 0) return `Hoy · ${label}`;
    if (i === 1) return `Mañana · ${label}`;
    return label;
  });
}

const HOURS = ["9:00", "10:00", "11:00", "16:30", "18:00"];

function routeFor(user) {
  if (window.parent !== window) {
    if (user?.role === "tecnico") return "/tecnico";
    return "/app";
  }
  if (user?.role === "tecnico") return "/tecnico";
  if (user?.role === "admin") return "/admin";
  return "/app";
}

export function Registro() {
  const nav = useNavigate();
  const demo = useDemo();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  return (
    <Phone bare>
      <div className="avatar" style={{ margin: "8px 0" }}>S</div>
      <h1 className="t">Regístrate</h1>
      <p className="lead">Para contratar servicios y comprar refacciones en San Luis Río Colorado.</p>
      <div className="label">Nombre</div>
      <input className="field" value={form.name} onChange={set("name")} autoComplete="name" />
      <div className="label">Correo</div>
      <input className="field" value={form.email} onChange={set("email")} autoComplete="email" />
      {error && <div className="err">{error}</div>}
      <div className="label">Teléfono</div>
      <input className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" />
      <div className="label">Contraseña</div>
      <input className="field" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
      <p className="note">Puedes crear la cuenta con los campos vacíos.</p>
      <button className="btn" onClick={() => {
        const message = demo.register(form);
        setError(message);
        if (!message) nav("/app");
      }}>Crear cuenta</button>
      <button className="btn ghost" onClick={() => nav("/app/entrar")}>Ya tengo cuenta</button>
    </Phone>
  );
}

export function Entrar() {
  const nav = useNavigate();
  const demo = useDemo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <Phone bare>
      <div className="avatar" style={{ margin: "8px 0" }}>S</div>
      <h1 className="t">Entra a ServiFix</h1>
      <p className="lead">Para contratar, comprar y seguir tu servicio.</p>
      <div className="label">Correo</div>
      <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <div className="label">Contraseña</div>
      <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      <button className="btn" onClick={() => {
        const message = demo.login(email, password, false);
        setError(message);
        if (!message) {
          const user = demo.state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
            || demo.state.users.find((u) => u.role === "cliente");
          nav(routeFor(user));
        }
      }}>Entrar</button>
      <button className="btn ghost" onClick={() => nav("/app/registro")}>Crear cuenta</button>
      {error && <div className="err" style={{ marginTop: 8 }}>{error}</div>}
      <p className="note">Cualquier correo y contraseña abre la app. Si el correo existe, entra esa cuenta.</p>
    </Phone>
  );
}

export function Inicio() {
  const nav = useNavigate();
  const demo = useDemo();
  const alerts = demo.alerts();
  const query = demo.state.filters.query.trim();
  const found = query ? demo.searchTechs("Todos") : [];
  const featured = [...demo.state.techs]
    .filter((t) => !demo.state.hiddenTechs.includes(t.id) && t.services.length)
    .sort((a, b) => b.rating - a.rating || b.jobs - a.jobs)
    .slice(0, 3);
  const first = demo.me?.name?.split(" ")[0] || "";
  return (
    <Phone tab="inicio">
      <div className="row">
        <div>
          <p className="hello">Hola, {first}</p>
          <h1 className="t">¿Qué necesitas resolver hoy?</h1>
        </div>
        <button className="sq" onClick={() => nav("/app/avisos")} aria-label="Avisos">
          🔔{alerts.length > 0 && <span className="nbadge">{alerts.length}</span>}
        </button>
      </div>
      <div className="search">
        <input className="input" placeholder="Oficio, servicio o técnico" value={demo.state.filters.query} onChange={(e) => demo.setQuery(e.target.value)} />
        <button className="sq" onClick={() => nav("/app/filtros")} aria-label="Filtros">☰</button>
      </div>
      <p className="small">San Luis Río Colorado</p>
      {found.map((t) => (
        <TechRow key={t.id} initials={t.initials} name={t.name} meta={`${t.oficio} · ${demo.modality(t)}`} stars={Math.round(t.rating)} line={`${t.rating} · desde $${demo.fromPrice(t)}`} onClick={() => nav(`/app/tecnico/${t.id}`)} />
      ))}
      {query && found.length === 0 && <p className="note">Nada coincide con “{query}”.</p>}
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
        <button className="link" onClick={() => nav("/app/lista/Todos")}>Ver todos</button>
      </div>
      {featured.map((t) => (
        <TechRow key={t.id} initials={t.initials} name={t.name} meta={`${t.oficio} · ${demo.modality(t)}`} stars={Math.round(t.rating)} line={`${t.rating} · desde $${demo.fromPrice(t)}`} onClick={() => nav(`/app/tecnico/${t.id}`)} />
      ))}
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
  const pass = demo.state.techs.filter((t) => !demo.state.hiddenTechs.includes(t.id) && t.services.length && demo.fromPrice(t) <= max && t.rating >= min);
  return (
    <Phone>
      <Back to="/app" label="Filtros" />
      <h1 className="t">Afina la búsqueda</h1>
      <p className="lead">El precio y la calificación se aplican a todos los oficios en San Luis Río Colorado.</p>
      <div className="label">Precio base máximo</div>
      <input className="field" inputMode="numeric" value={max} onChange={(e) => demo.setFilters({ maxPrice: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })} />
      <div className="label">Calificación mínima</div>
      <div className="chips">
        {[3, 4, 4.5, 5].map((n) => (
          <button key={n} className={min === n ? "chip on" : "chip"} onClick={() => demo.setFilters({ minRating: n })}>{n.toFixed(1)}</button>
        ))}
      </div>
      <div className="card flat">
        <b>{pass.length} técnico{pass.length === 1 ? "" : "s"} coinciden</b>
        <p className="small">{pass.length ? pass.map((t) => t.name.split(" ")[0]).join(", ") : "Nadie cumple las dos condiciones."}</p>
      </div>
      <button className="btn" onClick={() => { demo.setFilters({ active: true }); nav("/app/lista/Todos"); }}>Aplicar filtros</button>
      <button className="btn ghost" onClick={() => demo.setFilters({ maxPrice: 400, minRating: 4, query: "", active: false })}>Limpiar</button>
    </Phone>
  );
}

export function Listado() {
  const nav = useNavigate();
  const { oficio } = useParams();
  const trade = oficio || "Todos";
  const demo = useDemo();
  const [name, setName] = useState("");
  const list = demo.searchTechs(trade).filter((t) => {
    const q = name.trim().toLowerCase();
    if (!q) return true;
    return [t.name, t.oficio, ...t.services.map((s) => s.name)].join(" ").toLowerCase().includes(q);
  });
  return (
    <Phone>
      <Back to="/app" label={trade === "Todos" ? "Técnicos" : trade} />
      <p className="lead">{demo.state.filters.active ? `${list.length} técnicos. Precio base hasta $${demo.state.filters.maxPrice} y calificación mínima de ${demo.state.filters.minRating.toFixed(1)}.` : `${list.length} técnicos verificados${trade === "Todos" ? "" : " de este oficio"}.`}</p>
      <input className="field" placeholder="Buscar por nombre o servicio" value={name} onChange={(e) => setName(e.target.value)} />
      {demo.state.filters.active && (
        <div className="chips">
          <span className="chip on">Precio base máx. ${demo.state.filters.maxPrice}</span>
          <span className="chip on">Calificación mín. ★ {demo.state.filters.minRating.toFixed(1)}</span>
        </div>
      )}
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
      {list.length === 0 && <p className="note">Nadie coincide con esa búsqueda.</p>}
    </Phone>
  );
}

export function Detalle() {
  const nav = useNavigate();
  const { id } = useParams();
  const demo = useDemo();
  const tech = demo.techById(id);
  const [sel, setSel] = useState(tech?.services[0]);
  const reviews = demo.state.reviews.filter((r) => r.techId === tech?.id);
  if (!tech || !tech.services.length) return <Phone><Back to="/app" label="Técnico" /><p>No se encontró al técnico.</p></Phone>;
  if (!sel) return <Phone><Back to="/app" label="Técnico" /><p>Este técnico todavía no publica servicios.</p></Phone>;
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
      {reviews.length === 0 && <p className="note">Todavía no hay reseñas de servicios pagados.</p>}
      {reviews.map((review) => (
        <div className="card" key={review.id}>
          <b>{demo.nameOf(review.clientId)}</b>
          <div><Stars value={review.stars} /></div>
          <div className="small">{review.text}</div>
        </div>
      ))}
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
  const days = nextDays(4);
  const [day, setDay] = useState(days[1]);
  const [hour, setHour] = useState("10:00");
  const [address, setAddress] = useState(demo.me?.address || "");
  const [error, setError] = useState("");
  const draft = demo.state.draft;
  const tech = demo.techById(draft?.techId);
  if (!draft?.techId) return <Phone><Back to="/app" label="Contratar" /><p>Elige un servicio antes de agendar.</p></Phone>;
  return (
    <Phone>
      <Back to={`/app/tecnico/${draft.techId}`} label="Contratar" />
      <div className="kicker">Paso 1 de 2 · a domicilio</div>
      <h1 className="t">¿Dónde y cuándo?</h1>
      <p className="lead">{draft.service} con {tech?.name}. Precio base ${draft.price}.</p>
      <div className="label">Dirección en San Luis Río Colorado</div>
      <input className="field" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número y colonia" />
      <div className="label">Día</div>
      <div className="chips">
        {days.map((d) => (
          <button key={d} className={day === d ? "chip on" : "chip"} onClick={() => setDay(d)}>{d}</button>
        ))}
      </div>
      <div className="label">Hora</div>
      <div className="chips">
        {HOURS.map((h) => (
          <button key={h} className={hour === h ? "chip on" : "chip"} onClick={() => setHour(h)}>{h}</button>
        ))}
      </div>
      {error && <div className="err">{error}</div>}
      <button className="btn" onClick={() => {
        if (!address.trim()) { setError("Escribe la dirección."); return; }
        demo.setDraft({ address, when: `${day} · ${hour}`, home: true });
        nav("/app/precio");
      }}>Continuar</button>
    </Phone>
  );
}

export function Local() {
  const nav = useNavigate();
  const demo = useDemo();
  const days = nextDays(3);
  const [day, setDay] = useState(days[1]);
  const [hour, setHour] = useState("11:00");
  const draft = demo.state.draft;
  const tech = demo.techById(draft?.techId);
  if (!draft?.techId) return <Phone><Back to="/app" label="Contratar" /><p>Elige un servicio antes de agendar.</p></Phone>;
  return (
    <Phone>
      <Back to={`/app/tecnico/${draft.techId}`} label="Contratar" />
      <div className="kicker">Paso 1 de 2 · en el local</div>
      <h1 className="t">En su punto de atención</h1>
      <p className="lead">{draft.service} con {tech?.name}. Precio base ${draft.price}.</p>
      <div className="card">
        <div className="kicker">El servicio es aquí</div>
        <b>{tech?.place}</b>
        <div className="small">San Luis Río Colorado, Sonora</div>
      </div>
      <div className="label">Día</div>
      <div className="chips">
        {days.map((d) => (
          <button key={d} className={day === d ? "chip on" : "chip"} onClick={() => setDay(d)}>{d}</button>
        ))}
      </div>
      <div className="label">Hora</div>
      <div className="chips">
        {HOURS.map((h) => (
          <button key={h} className={hour === h ? "chip on" : "chip"} onClick={() => setHour(h)}>{h}</button>
        ))}
      </div>
      <button className="btn" onClick={() => { demo.setDraft({ when: `${day} · ${hour}`, home: false, address: tech?.place }); nav("/app/precio"); }}>Continuar</button>
    </Phone>
  );
}

export function Precio() {
  const nav = useNavigate();
  const demo = useDemo();
  const [error, setError] = useState("");
  const draft = demo.state.draft;
  const tech = demo.techById(draft?.techId);
  if (!draft?.service) return <Phone><Back to="/app" label="Contratar" /><p>No hay una cita por confirmar.</p></Phone>;
  const price = draft.price;
  const commission = Math.round(price * 0.1);
  const labor = price - commission;
  return (
    <Phone>
      <Back to={draft.home ? "/app/domicilio" : "/app/local"} label="Contratar" />
      <div className="kicker">Paso 2 de 2</div>
      <h1 className="t">Revisa el precio</h1>
      <div className="card">
        <b>{tech?.name}</b>
        <div className="small">{draft.service} · {draft.home ? "a domicilio" : "en su local"}</div>
        <div className="small">{draft.when}</div>
        <div className="small">{draft.address || tech?.place}</div>
      </div>
      <div className="sec">Desglose del precio base</div>
      <div className="card">
        <div className="row"><span>Mano de obra</span><b>${labor}</b></div>
        <div className="row"><span>Comisión 10%</span><b>${commission}</b></div>
        <div className="row"><b>Total</b><b>${price}</b></div>
      </div>
      <p className="note">Pagas ${price} cuando el trabajo quede terminado. La comisión ya va incluida.</p>
      {demo.debt && <div className="err">Tienes “{demo.debt.service}” terminada y sin pagar. Esta cita no se crea hasta saldarla.</div>}
      {error && <div className="err">{error}</div>}
      <button className="btn" onClick={() => {
        const result = demo.schedule();
        if (result === "debt") { nav("/app/no-agendo"); return; }
        if (result) { setError(result); return; }
        nav("/app/citas");
      }}>Agendar por ${price}</button>
      <button className="btn ghost" onClick={() => nav(draft.home ? "/app/domicilio" : "/app/local")}>Corregir datos</button>
    </Phone>
  );
}

export function NoAgendo() {
  const nav = useNavigate();
  const demo = useDemo();
  const debt = demo.debt;
  if (!debt) return <Phone><Back to="/app/citas" label="Citas" /><p>Ya no tienes un servicio sin pagar.</p><button className="btn" onClick={() => nav("/app")}>Buscar un técnico</button></Phone>;
  return (
    <Phone>
      <Back to="/app" label="Contratar" />
      <h1 className="t">No se agendó.</h1>
      <p className="lead">Primero hay que pagar el servicio que ya quedó terminado.</p>
      <div className="card">
        <div className="kicker">Sigue sin pagar</div>
        <b>{debt.service} · ${debt.price}</b>
        <div className="small">{demo.nameOf(debt.techId)} · {debt.when}</div>
      </div>
      <button className="btn" onClick={() => nav("/app/pago")}>Ir a pagar ${debt.price}</button>
      <button className="btn ghost" onClick={() => nav("/app/citas")}>Volver a mis citas</button>
    </Phone>
  );
}

export function PagaPrimero() {
  const nav = useNavigate();
  const demo = useDemo();
  const debt = demo.debt;
  if (!debt) return <Phone><Back to="/app" label="Contratar" /><p>Ya puedes contratar. No tienes servicios sin pagar.</p><button className="btn" onClick={() => nav("/app")}>Ver técnicos</button></Phone>;
  return (
    <Phone>
      <Back to="/app" label="Contratar" />
      <h1 className="t">Primero paga el servicio terminado.</h1>
      <p className="lead">Tienes “{debt.service}” con {demo.nameOf(debt.techId)} por ${debt.price}. No se crea otro pedido hasta pagarlo.</p>
      <div className="card">
        <div className="row"><b>{debt.service}</b><span className="pill warn">Terminado</span></div>
        <div className="small">{demo.nameOf(debt.techId)} · {debt.when}</div>
        <div className="price">${debt.price}</div>
      </div>
      <button className="btn" onClick={() => nav("/app/pago")}>Ir a pagar ${debt.price}</button>
    </Phone>
  );
}
