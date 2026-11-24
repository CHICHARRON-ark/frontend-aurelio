import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Back, Phone } from "../ui";
import { useDemo } from "../demo";

export function Perfil() {
  const nav = useNavigate();
  const demo = useDemo();
  const app = demo.state.applications.find((a) => a.userId === demo.me?.id);
  return (
    <Phone tab="perfil">
      <h1 className="t">Ana García</h1>
      <p className="lead">ana.garcia@gmail.com · 653 120 4488</p>
      <div className="okbox">Sigues como cliente. Aún no eres técnica.</div>
      <div className="sec">Compras de refacciones</div>
      <div className="card">
        <div className="small">Foco LED 9W · 2 piezas · recoges con Carlos · $90 · pagado</div>
      </div>
      <div className="sec">Solicitud de técnico</div>
      <div className="card">
        <span className={`pill ${app?.status === "rechazada" ? "bad" : "warn"}`}>{app?.status || "sin solicitud"}</span>
        <p className="small">{app?.status === "rechazada" ? `Rechazada. Motivo: ${app.reason} Sigues como clienta.` : "La solicitud está en revisión. Sigues como clienta."}</p>
      </div>
      <button className="btn" onClick={() => nav("/app/oficio")}>Corregir solicitud</button>
      <p className="note">Botón de unirse como técnico. Si la solicitud ya fue rechazada, como la de Ana el 14 nov, pasa a Corregir solicitud.</p>
      <button className="btn ghost" onClick={() => nav("/app/entrar")}>Cerrar sesión</button>
    </Phone>
  );
}

export function Oficio() {
  const nav = useNavigate();
  return (
    <Phone>
      <Back to="/app/perfil" label="Ser técnico" />
      <div className="kicker">Paso 1 de 2</div>
      <h1 className="t">Tu oficio</h1>
      <div className="label">Oficio</div>
      <input className="field" defaultValue="Jardinera" />
      <div className="label">Teléfono</div>
      <input className="field" defaultValue="653 120 4488" />
      <div className="label">Zona</div>
      <input className="field" defaultValue="Col. Sonora" />
      <div className="label">Foto de perfil</div>
      <div className="upload">Foto de Ana · lista para enviar</div>
      <div className="label">Identificación oficial</div>
      <div className="upload">INE frente · solo la verá el administrador</div>
      <button className="btn" onClick={() => nav("/app/servicios-tecnico")}>Continuar a servicios</button>
    </Phone>
  );
}

export function ServiciosTecnico() {
  const nav = useNavigate();
  const demo = useDemo();
  const [error, setError] = useState("");
  return (
    <Phone>
      <Back to="/app/oficio" label="Ser técnico" />
      <div className="kicker">Paso 2 de 2</div>
      <h1 className="t">Servicios y precio</h1>
      <p className="lead">Cada servicio lleva precio base y si sales a domicilio o atiendes en tu local.</p>
      <div className="card">
        <div className="row"><b>Corte de pasto</b><span className="pill info">A domicilio</span></div>
        <div className="price">$300</div>
      </div>
      <div className="card">
        <div className="row"><b>Poda de arbustos</b><span className="pill mute">En mi punto de atención</span></div>
        <div className="price">$250</div>
      </div>
      <div className="label">Punto de atención</div>
      <input className="field" defaultValue="Calle 7 215, Col. Sonora, San Luis Río Colorado" />
      {error && <div className="err">{error}</div>}
      <button className="btn" onClick={() => {
        const message = demo.submitApplication({ oficio: "Jardinera", phone: "653 120 4488", zone: "Col. Sonora", place: "Calle 7 215, Col. Sonora", serviceName: "Corte de pasto", price: "300" });
        setError(message);
        if (!message) nav("/app/perfil");
      }}>Enviar solicitud</button>
      <p className="note">Con todo completo queda en Pendiente. Si falta un precio o la identificación, no se envía.</p>
    </Phone>
  );
}

export function Rechazada() {
  const nav = useNavigate();
  return (
    <Phone>
      <div className="avatar" style={{ background: "#a11f1f", margin: "8px 0" }}>!</div>
      <h1 className="t">Solicitud rechazada</h1>
      <div className="card">
        <div className="kicker">Motivo del administrador</div>
        <p className="small">La identificación no se lee. Sube otra foto de la INE, de frente y con buena luz.</p>
        <div className="small">Fernando Velázquez · 14 nov 2026 · 17:55</div>
      </div>
      <p className="lead">Puedes corregir los datos y reenviar. La solicitud vuelve a Pendiente. Mientras tanto sigues como clienta.</p>
      <button className="btn" onClick={() => nav("/app/oficio")}>Corregir y reenviar</button>
      <button className="btn ghost" onClick={() => nav("/app/perfil")}>Volver al perfil</button>
    </Phone>
  );
}

export function Avisos() {
  const nav = useNavigate();
  const items = [
    ["Solicitud en revisión.", "Llegó al enviarla, el 14 nov a las 16:40. A las 17:55 se rechazó: la identificación no se lee.", "/app/rechazada"],
    ["Carlos va en camino.", "Revisión de corto · dom 15 · 10:00. Ya no se puede cancelar.", "/app/citas/camino"],
    ["Diego marcó el servicio como terminado.", "Falta tu confirmación para pagar $500.", "/app/citas/listo"],
    ["Rosa rechazó la poda.", "El pedido quedó en Esperando técnico. Elige otro técnico o cancélalo. Motivo: no puedo en ese horario.", "/app/citas/esperando"],
    ["Tienes un servicio sin pagar.", "No podrás contratar otro hasta pagar la revisión de falla.", "/app/paga-primero"],
  ];
  return (
    <Phone tab="inicio">
      <div className="row">
        <h1 className="t">Avisos</h1>
        <button className="link" onClick={() => nav("/app")}>Inicio</button>
      </div>
      {items.map(([title, body, to]) => (
        <button className="card" key={title} onClick={() => nav(to)}>
          <b>{title}</b>
          <div className="small">{body}</div>
        </button>
      ))}
    </Phone>
  );
}
