import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Back, Phone } from "../ui";
import { useDemo } from "../demo";

export function Perfil() {
  const nav = useNavigate();
  const demo = useDemo();
  const me = demo.me;
  const app = demo.state.applications.find((a) => a.userId === me?.id);
  const buys = demo.state.payments.filter((p) => p.clientId === me?.id && p.kind === "refaccion" && p.status === "Pagado");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: me?.name || "", phone: me?.phone || "" });
  const [error, setError] = useState("");
  const rejected = app?.status === "rechazada";
  const pending = app?.status === "pendiente";
  return (
    <Phone tab="perfil">
      <h1 className="t">{me?.name}</h1>
      <p className="lead">{me?.email} · {me?.phone}</p>
      {editing ? (
        <>
          <div className="label">Nombre</div>
          <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="label">Teléfono</div>
          <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {error && <div className="err">{error}</div>}
          <button className="btn" onClick={() => {
            const message = demo.updateProfile(form);
            setError(message);
            if (!message) setEditing(false);
          }}>Guardar</button>
        </>
      ) : (
        <button className="btn ghost" onClick={() => { setForm({ name: me?.name || "", phone: me?.phone || "" }); setEditing(true); }}>Editar datos</button>
      )}
      <div className="sec">Compras de refacciones</div>
      {buys.length === 0 && <p className="note">Todavía no has pagado refacciones.</p>}
      {buys.map((buy) => (
        <div className="card" key={buy.id}>
          <div className="small">{buy.concept} · ${buy.total} · pagado · recoges con {demo.nameOf(buy.techId)}</div>
        </div>
      ))}
      <div className="sec">Trabajar como técnico</div>
      {!app && <p className="lead">Si quieres publicar servicios, envía tu oficio y una identificación.</p>}
      {app && (
        <div className="card">
          <span className={`pill ${rejected ? "bad" : pending ? "warn" : "ok"}`}>{app.status}</span>
          <p className="small">{rejected ? `Rechazada. ${app.reason}` : pending ? "La solicitud está en revisión. Sigues como cliente." : "Tu solicitud fue aprobada. Cierra sesión y entra de nuevo."}</p>
        </div>
      )}
      <button className="btn" onClick={() => nav("/app/oficio")}>{rejected ? "Corregir solicitud" : pending ? "Ver solicitud" : "Quiero ser técnico"}</button>
      <button className="btn ghost" onClick={() => { demo.logout(); nav("/app/entrar"); }}>Cerrar sesión</button>
    </Phone>
  );
}

export function Oficio() {
  const nav = useNavigate();
  const demo = useDemo();
  const saved = demo.state.applicationDraft;
  const [form, setForm] = useState({
    oficio: saved?.oficio || "",
    phone: saved?.phone || demo.me?.phone || "",
    zone: saved?.zone || "",
    photo: saved?.photo || "",
    idFile: saved?.idFile || "",
  });
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  return (
    <Phone>
      <Back to="/app/perfil" label="Ser técnico" />
      <div className="kicker">Paso 1 de 2</div>
      <h1 className="t">Tu oficio</h1>
      <div className="label">Oficio</div>
      <input className="field" value={form.oficio} onChange={set("oficio")} placeholder="Ejemplo: Jardinero" />
      <div className="label">Teléfono</div>
      <input className="field" value={form.phone} onChange={set("phone")} />
      <div className="label">Zona</div>
      <input className="field" value={form.zone} onChange={set("zone")} placeholder="Colonia donde atiendes" />
      <div className="label">Foto de perfil</div>
      <input className="field" type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, photo: e.target.files?.[0]?.name || "" }))} />
      {form.photo && <p className="note">{form.photo}</p>}
      <div className="label">Identificación oficial</div>
      <input className="field" type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, idFile: e.target.files?.[0]?.name || "" }))} />
      {form.idFile && <p className="note">{form.idFile} · solo la ve el administrador</p>}
      {error && <div className="err">{error}</div>}
      <button className="btn" onClick={() => {
        if (!form.oficio.trim() || !form.phone.trim() || !form.zone.trim() || !form.idFile) {
          setError("Faltan el oficio, el teléfono, la zona o la identificación.");
          return;
        }
        demo.setApplicationDraft({ ...saved, ...form });
        nav("/app/servicios-tecnico");
      }}>Continuar a servicios</button>
    </Phone>
  );
}

export function ServiciosTecnico() {
  const nav = useNavigate();
  const demo = useDemo();
  const saved = demo.state.applicationDraft;
  const [place, setPlace] = useState(saved?.place || "");
  const [services, setServices] = useState(saved?.services?.length ? saved.services : [{ name: "", price: "", home: true }]);
  const [error, setError] = useState("");
  const update = (index, patch) => setServices((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  return (
    <Phone>
      <Back to="/app/oficio" label="Ser técnico" />
      <div className="kicker">Paso 2 de 2</div>
      <h1 className="t">Servicios y precio</h1>
      <p className="lead">Cada servicio lleva precio base y si sales a domicilio o atiendes en tu local.</p>
      {services.map((service, index) => (
        <div className="card" key={index}>
          <div className="label">Servicio</div>
          <input className="field" value={service.name} onChange={(e) => update(index, { name: e.target.value })} placeholder="Ejemplo: Corte de pasto" />
          <div className="label">Precio base</div>
          <input className="field" inputMode="numeric" value={service.price} onChange={(e) => update(index, { price: e.target.value.replace(/[^0-9]/g, "") })} />
          <div className="chips">
            <button className={service.home ? "chip on" : "chip"} onClick={() => update(index, { home: true })}>A domicilio</button>
            <button className={!service.home ? "chip on" : "chip"} onClick={() => update(index, { home: false })}>En mi local</button>
          </div>
        </div>
      ))}
      <button className="btn ghost" onClick={() => setServices((rows) => [...rows, { name: "", price: "", home: true }])}>Agregar otro servicio</button>
      <div className="label">Punto de atención</div>
      <input className="field" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Calle y colonia" />
      {error && <div className="err">{error}</div>}
      <button className="btn" onClick={() => {
        const message = demo.submitApplication({ ...saved, place, services });
        setError(message);
        if (!message) nav("/app/perfil");
      }}>Enviar solicitud</button>
    </Phone>
  );
}

export function Rechazada() {
  const nav = useNavigate();
  const demo = useDemo();
  const app = demo.state.applications.find((a) => a.userId === demo.me?.id && a.status === "rechazada");
  return (
    <Phone>
      <div className="avatar" style={{ background: "#a11f1f", margin: "8px 0" }}>!</div>
      <h1 className="t">Solicitud rechazada</h1>
      <div className="card">
        <div className="kicker">Motivo del administrador</div>
        <p className="small">{app?.reason || "No hay una solicitud rechazada en tu cuenta."}</p>
        {app?.at && <div className="small">{app.at}</div>}
      </div>
      <p className="lead">Puedes corregir los datos y reenviar. Mientras tanto sigues como cliente.</p>
      <button className="btn" onClick={() => nav("/app/oficio")}>Corregir y reenviar</button>
      <button className="btn ghost" onClick={() => nav("/app/perfil")}>Volver al perfil</button>
    </Phone>
  );
}

export function Avisos() {
  const nav = useNavigate();
  const demo = useDemo();
  const items = demo.alerts();
  return (
    <Phone tab="inicio">
      <div className="row">
        <h1 className="t">Avisos</h1>
        <button className="link" onClick={() => nav("/app")}>Inicio</button>
      </div>
      {items.length === 0 && <p className="note">No tienes avisos nuevos.</p>}
      {items.map((item) => (
        <button className="card" key={item.id} onClick={() => nav(item.to)}>
          <b>{item.title}</b>
          <div className="small">{item.body}</div>
        </button>
      ))}
    </Phone>
  );
}
