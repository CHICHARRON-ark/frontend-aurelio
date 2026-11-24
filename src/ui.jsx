import { useNavigate } from "react-router-dom";

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  ),
  cal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19" />
    </svg>
  ),
  pay: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 9.5c.6-.8 1.4-1.3 2.5-1.3 1.6 0 2.4.8 2.4 1.8S14 12.6 12 12.6 9.6 13.4 9.6 14.4 10.4 16.2 12 16.2c1.1 0 1.9-.5 2.5-1.2" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 20 7.5 12 12 4 7.5 12 3Z" />
      <path d="M20 7.5V16.5L12 21 4 16.5V7.5" />
    </svg>
  ),
};

export function ModeSwitch({ active }) {
  const nav = useNavigate();
  const items = [
    ["user", "Cliente", "/app"],
    ["tech", "Técnico", "/tecnico"],
    ["admin", "Panel", "/admin"],
  ];
  return (
    <>
      <div className="modes">
        {items.map(([id, label, to]) => (
          <button key={id} className={active === id ? "on" : ""} onClick={() => nav(to)}>
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

function Status() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <b>ServiFix</b>
    </div>
  );
}

const USER_TABS = [
  ["inicio", "Inicio", "/app", "home"],
  ["tienda", "Tienda", "/app/tienda", "bag"],
  ["citas", "Citas", "/app/citas", "cal"],
  ["perfil", "Perfil", "/app/perfil", "user"],
];

const TECH_TABS = [
  ["pedidos", "Pedidos", "/tecnico", "box"],
  ["agenda", "Agenda", "/tecnico/agenda", "cal"],
  ["publicar", "Publicar", "/tecnico/publicar", "bag"],
  ["ganancias", "Ganancias", "/tecnico/ganancias", "pay"],
  ["perfil", "Perfil", "/tecnico/perfil", "user"],
];

function Tabs({ items, active, five }) {
  const nav = useNavigate();
  return (
    <div className={five ? "tabbar five" : "tabbar"}>
      {items.map(([id, label, to, icon]) => (
        <button key={id} className={active === id ? "tab on" : "tab"} onClick={() => nav(to)}>
          {ICONS[icon]}
          {label}
        </button>
      ))}
    </div>
  );
}

export function Phone({ tab, children }) {
  return (
    <div className="stage">
      <ModeSwitch active="user" />
      <div className="phone">
        <div className="screen">
          <Status />
          <div className="content">{children}</div>
          {tab && <Tabs items={USER_TABS} active={tab} />}
        </div>
      </div>
    </div>
  );
}

export function TechPhone({ tab, children }) {
  return (
    <div className="stage">
      <ModeSwitch active="tech" />
      <div className="phone">
        <div className="screen">
          <Status />
          <div className="content">{children}</div>
          {tab && <Tabs items={TECH_TABS} active={tab} five />}
        </div>
      </div>
    </div>
  );
}

export function Back({ to, label }) {
  const nav = useNavigate();
  return (
    <div className="head">
      <button className="back" onClick={() => nav(to)} aria-label="Volver">
        ‹
      </button>
      {label && <b>{label}</b>}
    </div>
  );
}

export function Stars({ value = 5 }) {
  const full = Math.round(value);
  return <span className="star">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

export function Steps({ items }) {
  return items.map((item, i) => (
    <div className="step" key={item.title}>
      <div className="rail">
        <div className={`ball ${item.state || ""}`} />
        {i < items.length - 1 && <div className="line" />}
      </div>
      <div>
        <b>{item.title}</b>
        {item.detail && <div className="small">{item.detail}</div>}
      </div>
    </div>
  ));
}

const ADMIN_NAV = [
  ["/admin", "Dashboard"],
  ["/admin/validacion", "Validación"],
  ["/admin/catalogo", "Catálogo"],
  ["/admin/citas", "Citas"],
  ["/admin/usuarios", "Usuarios"],
  ["/admin/pagos", "Pagos"],
  ["/admin/resenas", "Reseñas"],
  ["/admin/bitacora", "Bitácora"],
  ["/admin/datos", "Base de datos"],
];

export function AdminShell({ active, children }) {
  const nav = useNavigate();
  return (
    <div className="admin">
      <aside className="side">
        <div className="brand">
          <div className="mark">S</div>
          <div>
            ServiFix
            <div style={{ fontWeight: 600, fontSize: 11, color: "#b7cdc9" }}>Administración</div>
          </div>
        </div>
        {ADMIN_NAV.map(([to, label]) => (
          <button key={to} className={active === to ? "navitem on" : "navitem"} onClick={() => nav(to)}>
            {label}
          </button>
        ))}
      </aside>
      <div className="admin-main">
        <div className="topbar">
          <div className="switch">
            <button onClick={() => nav("/app")}>App móvil</button>
            <button onClick={() => nav("/tecnico")}>Técnico</button>
            <button className="on">Administración</button>
          </div>
          <div className="whoami">
            <div className="sq" style={{ width: 34, height: 34, borderRadius: 12, fontSize: 13 }}>
              FV
            </div>
            <div>
              Fernando Velázquez
              <small>Administrador</small>
            </div>
            <button className="link" onClick={() => nav("/admin/entrar")}>Salir</button>
          </div>
        </div>
        <div className="canvas">{children}</div>
      </div>
    </div>
  );
}
