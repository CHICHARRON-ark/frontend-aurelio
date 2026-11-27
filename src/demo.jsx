import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createState } from "./data/db";

const FLOW = ["por aceptar", "aceptado", "en camino", "en proceso", "terminado", "pagado"];
const OPEN = new Set(["por aceptar", "aceptado", "en camino", "en proceso", "terminado", "esperando"]);

const DemoContext = createContext(null);
export function useDemo() {
  return useContext(DemoContext);
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
}

const STORAGE_KEY = window.parent !== window ? "servifix-phone-v1" : "servifix-db-v1";

function loadState() {
  const base = createState();
  const phone = window.parent !== window;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) {
      if (phone) {
        const ana = base.users.find((user) => user.id === "ana");
        if (ana) base.session = { email: ana.email, role: ana.role, exp: Date.now() + 7 * 24 * 3600000 };
      }
      return base;
    }
    const session = saved.session && saved.session.exp > Date.now() ? saved.session : null;
    return { ...base, ...saved, session };
  } catch {
    return base;
  }
}

function cardError() {
  return "";
}

function stamp() {
  const now = new Date();
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return { date: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`, time: `${hh}:${mm}` };
}

function debtOf(state, clientId) {
  return state.orders.find((o) => o.clientId === clientId && o.status === "terminado" && !o.paid);
}

function activeOrders(state, techId) {
  return state.orders.filter((o) => o.techId === techId && OPEN.has(o.status));
}

function serviceInUse(state, name) {
  return state.orders.some((o) => o.service === name && OPEN.has(o.status));
}

export function DemoProvider({ children }) {
  const [state, setState] = useState(loadState);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    const userByEmail = (email) => state.users.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());
    const me = () => {
      if (!state.session || state.session.exp < Date.now()) return null;
      return userByEmail(state.session.email) || null;
    };
    const techById = (id) => state.techs.find((t) => t.id === id && !state.hiddenTechs.includes(t.id));
    const nameOf = (id) => state.users.find((u) => u.id === id)?.name || techById(id)?.name || id;

    const log = (module, action) => ({ ...stamp(), module, action, actor: me()?.name || "ServiFix" });
    const techAccount = () => {
      const user = me();
      if (!user) return null;
      return state.techs.find((t) => !state.hiddenTechs.includes(t.id) && (t.id === user.id || t.email?.toLowerCase() === user.email.toLowerCase())) || null;
    };

    return {
      state,
      me: me(),
      myTech: techAccount(),
      debt: me() ? debtOf(state, me().id) : null,
      homeFor(user) {
        const phone = window.parent !== window;
        if (!user) return "/app/entrar";
        if (!phone && user.role === "admin") return "/admin";
        if (user.role === "tecnico") return "/tecnico";
        return "/app";
      },
      alerts() {
        const user = me();
        if (!user || user.role !== "cliente") return [];
        const items = [];
        state.orders.filter((o) => o.clientId === user.id).forEach((o) => {
          const who = nameOf(o.techId);
          if (o.status === "en camino") items.push({ id: `${o.id}-go`, title: `${who} va en camino.`, body: `${o.service} · ${o.when}. Ya no se puede cancelar.`, to: `/app/citas/${o.id}` });
          if (o.status === "terminado" && !o.paid) items.push({ id: `${o.id}-pay`, title: "Confirma y paga el servicio.", body: `${o.service} con ${who} · $${o.price}.`, to: `/app/citas/${o.id}` });
          if (o.status === "esperando") items.push({ id: `${o.id}-wait`, title: "Elige otro técnico.", body: o.reason ? `${o.service}. Motivo: ${o.reason}` : o.service, to: `/app/citas/${o.id}` });
          if (o.status === "aceptado") items.push({ id: `${o.id}-ok`, title: `${who} aceptó tu cita.`, body: `${o.service} · ${o.when}.`, to: `/app/citas/${o.id}` });
          if (o.status === "por aceptar") items.push({ id: `${o.id}-new`, title: "Cita enviada.", body: `${who} todavía no responde ${o.service}.`, to: `/app/citas/${o.id}` });
          if (o.paid && !state.reviews.some((r) => r.orderId === o.id)) items.push({ id: `${o.id}-star`, title: "Puedes calificar el servicio.", body: `${o.service} con ${who}.`, to: `/app/calificar/${o.id}` });
        });
        const app = state.applications.find((a) => a.userId === user.id);
        if (app?.status === "pendiente") items.push({ id: app.id, title: "Solicitud en revisión.", body: "Sigues como cliente hasta que un administrador la apruebe.", to: "/app/perfil" });
        if (app?.status === "rechazada") items.push({ id: app.id, title: "Solicitud rechazada.", body: app.reason || "Puedes corregirla y enviarla otra vez.", to: "/app/rechazada" });
        if (app?.status === "aprobada") items.push({ id: `${app.id}-ok`, title: "Ya puedes trabajar como técnico.", body: "Cierra sesión y entra de nuevo para abrir tus pedidos.", to: "/app/perfil" });
        return items;
      },
      techById,
      nameOf,
      fromPrice: (tech) => Math.min(...tech.services.map((s) => s.price)),
      modality: (tech) => (tech.services.some((s) => s.home) ? "a domicilio" : "en su local"),
      searchTechs(oficio) {
        const q = state.filters.query.trim().toLowerCase();
        return state.techs.filter((t) => {
          if (state.hiddenTechs.includes(t.id)) return false;
          if (!t.services.length) return false;
          const from = Math.min(...t.services.map((s) => s.price));
          if (state.filters.active && from > state.filters.maxPrice) return false;
          if (state.filters.active && t.rating < state.filters.minRating) return false;
          if (oficio && oficio !== "Todos" && t.oficio !== oficio) return false;
          if (q) {
            const blob = [t.name, t.oficio, t.zone, t.bio, ...t.services.map((s) => s.name)].join(" ").toLowerCase();
            if (!blob.includes(q)) return false;
          }
          return true;
        });
      },
      register(form) {
        const email = String(form.email || "").trim().toLowerCase();
        const existing = email ? state.users.find((u) => u.email === email) : null;
        if (existing) {
          setState((s) => ({ ...s, session: { email: existing.email, role: existing.role, exp: Date.now() + 7 * 24 * 3600000 } }));
          return "";
        }
        const name = String(form.name || "").trim() || "Cliente";
        const phone = String(form.phone || "").trim() || "000 000 0000";
        const password = form.password || "servifix";
        const account = email || `cliente-${uid("u")}@gmail.com`;
        setState((s) => ({
          ...s,
          users: [...s.users, { id: uid("u"), name, email: account, phone, password, role: "cliente", address: "" }],
          session: { email: account, role: "cliente", exp: Date.now() + 7 * 24 * 3600000 },
        }));
        return "";
      },
      login(email, _password, panel) {
        const typed = userByEmail(email);
        const user = panel
          ? state.users.find((u) => u.role === "admin")
          : typed || state.users.find((u) => u.role === "cliente");
        if (!user) return "No hay cuentas cargadas.";
        const hours = user.role === "admin" ? 24 : 24 * 7;
        setState((s) => ({ ...s, session: { email: user.email, role: user.role, exp: Date.now() + hours * 3600000 } }));
        return "";
      },
      logout() {
        setState((s) => ({ ...s, session: null }));
      },
      setFilters(patch) {
        setState((s) => ({ ...s, filters: { ...s.filters, ...patch } }));
      },
      setQuery(query) {
        setState((s) => ({ ...s, filters: { ...s.filters, query } }));
      },
      setDraft(draft) {
        setState((s) => ({ ...s, draft: { ...s.draft, ...draft } }));
      },
      schedule() {
        const client = me();
        if (!client || !state.draft?.techId || !state.draft?.service) return "Faltan los datos de la cita.";
        if (!state.draft?.when) return "Elige día y hora.";
        if (state.draft.home && !String(state.draft.address || "").trim()) return "Escribe la dirección donde hay que atenderte.";
        if (debtOf(state, client.id)) return "debt";
        const tech = techById(state.draft.techId);
        if (!tech) return "Ese técnico ya no está disponible.";
        const order = {
          id: uid("o"),
          clientId: client.id,
          techId: tech.id,
          oficio: tech.oficio,
          service: state.draft.service,
          when: state.draft.when,
          where: state.draft.home ? "a domicilio" : "en su local",
          address: state.draft.home ? state.draft.address.trim() : tech.place,
          price: state.draft.price,
          status: "por aceptar",
          paid: false,
        };
        setState((s) => ({
          ...s,
          orders: [order, ...s.orders],
          draft: null,
          users: s.users.map((u) => (u.id === client.id && state.draft.home ? { ...u, address: state.draft.address.trim() } : u)),
          log: [log("Citas", `${client.name} agendó ${order.service} con ${tech.name}.`), ...s.log],
        }));
        return "";
      },
      cancelOrder(id) {
        const order = state.orders.find((o) => o.id === id);
        if (!order || !["por aceptar", "aceptado", "esperando"].includes(order.status)) return "Ya no se puede cancelar.";
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: "cancelado" } : o)),
          log: [log("Citas", `El usuario canceló ${order.service} (${order.when}).`), ...s.log],
        }));
        return "";
      },
      assignTech(orderId, techId) {
        const tech = techById(techId);
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === orderId ? { ...o, techId, status: "aceptado", reason: "" } : o)),
        }));
        return tech;
      },
      pay({ orderId, card, exp, cvc, parts }) {
        const invalid = cardError(card, exp, cvc);
        if (invalid) return invalid;
        if (parts) {
          const product = state.products.find((p) => p.id === parts.productId);
          if (!product) return "No hay producto en el carrito.";
          if (parts.qty > product.stock) return `No puedes pedir más de ${product.stock}. El tope es el stock.`;
          const total = product.price * parts.qty;
          setState((s) => ({
            ...s,
            products: s.products.map((p) => (p.id === product.id ? { ...p, stock: p.stock - parts.qty } : p)),
            payments: [{ id: uid("p"), clientId: me()?.id, techId: product.techId, concept: `${product.name} · refacción`, total, commission: 0, status: "Pagado", kind: "refaccion" }, ...s.payments],
            cart: null,
            log: [log("Pagos", `Se pagó ${product.name} por $${total}. Comisión $0. El stock bajó ${parts.qty}.`), ...s.log],
          }));
          return "";
        }
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return "No hay un pedido para pagar.";
        if (order.status !== "terminado") return "Solo se paga un servicio que ya confirmaste como terminado.";
        const commission = Math.round(order.price * 0.1);
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === order.id ? { ...o, status: "pagado", paid: true } : o)),
          techs: s.techs.map((t) => (t.id === order.techId ? { ...t, jobs: t.jobs + 1 } : t)),
          payments: s.payments.some((p) => p.orderId === order.id)
            ? s.payments.map((p) => (p.orderId === order.id ? { ...p, status: "Pagado", techId: order.techId } : p))
            : [{ id: uid("p"), clientId: order.clientId, techId: order.techId, concept: order.service, total: order.price, commission, status: "Pagado", kind: "servicio", orderId: order.id }, ...s.payments],
          log: [log("Pagos", `${nameOf(order.clientId)} pagó ${order.service} por $${order.price}.`), ...s.log],
        }));
        return "";
      },
      confirmReady(orderId) {
        const order = state.orders.find((o) => o.id === orderId);
        if (!order || order.status !== "terminado") return "Solo se puede confirmar si el estado es Terminado.";
        return "";
      },
      addReview(orderId, stars, text) {
        const order = state.orders.find((o) => o.id === orderId);
        if (!order || !order.paid) return "No se puede crear una reseña si el pedido no está pagado.";
        if (state.reviews.some((r) => r.orderId === orderId)) return "Este pedido ya tiene una reseña.";
        if (stars < 1 || stars > 5 || !text.trim()) return "La reseña es de 1 a 5 y lleva un comentario.";
        const review = { id: uid("r"), orderId, clientId: order.clientId, techId: order.techId, stars, text: text.trim() };
        setState((s) => ({
          ...s,
          reviews: [...s.reviews, review],
          techs: s.techs.map((t) => {
            if (t.id !== order.techId) return t;
            const mine = [...s.reviews.filter((r) => r.techId === t.id), review];
            const rating = Math.round((mine.reduce((sum, r) => sum + r.stars, 0) / mine.length) * 10) / 10;
            return { ...t, rating };
          }),
        }));
        return "";
      },
      acceptOrder(id) {
        const tech = techAccount();
        const order = state.orders.find((o) => o.id === id);
        if (!tech || !order || order.techId !== tech.id || order.status !== "por aceptar") return "Ese pedido ya no está por aceptar.";
        setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status: "aceptado" } : o)) }));
        return "";
      },
      rejectOrder(id, reason) {
        const tech = techAccount();
        const clean = String(reason || "").trim();
        if (!clean) return "Escribe el motivo para que el cliente pueda elegir a otra persona.";
        const order = state.orders.find((o) => o.id === id);
        if (!tech || !order || order.techId !== tech.id || order.status !== "por aceptar") return "Ese pedido ya no está por aceptar.";
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: "esperando", techId: null, oficio: o.oficio || tech.oficio, reason: clean } : o)),
        }));
        return "";
      },
      advance(id) {
        const tech = techAccount();
        const order = state.orders.find((o) => o.id === id);
        if (!tech || !order || order.techId !== tech.id) return "Esa cita no es tuya.";
        const idx = FLOW.indexOf(order.status);
        if (idx < 0 || idx >= 4) return "Solo puedes marcar el estado que sigue. Pagado lo pone el pago del cliente.";
        const next = FLOW[idx + 1];
        setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status: next } : o)) }));
        return "";
      },
      publishService(techId, service) {
        const name = String(service.name || "").trim();
        const price = Number(String(service.price || "").replace(/[^0-9.]/g, ""));
        const owner = state.techs.find((t) => t.id === techId);
        const rubro = { Electricista: "Electricidad", Plomero: "Plomería", Jardinero: "Jardín", Mecánico: "Mecánica" }[owner?.oficio] || owner?.oficio || "General";
        if (!name || !price) return "Indica nombre y precio base.";
        setState((s) => ({
          ...s,
          techs: s.techs.map((t) => {
            if (t.id !== techId) return t;
            const exists = t.services.some((sv) => sv.name.toLowerCase() === name.toLowerCase());
            const services = exists
              ? t.services.map((sv) => (sv.name.toLowerCase() === name.toLowerCase() ? { ...sv, price, home: !!service.home, time: service.time || sv.time } : sv))
              : [...t.services, { id: uid("sv"), name, time: service.time || "1 h", home: !!service.home, price }];
            return { ...t, place: service.place || t.place, services };
          }),
          catalog: s.catalog.some((c) => c.name.toLowerCase() === name.toLowerCase())
            ? s.catalog.map((c) => (c.name.toLowerCase() === name.toLowerCase() ? { ...c, price, rubro } : c))
            : [...s.catalog, { id: uid("cat"), name, rubro, price }],
          log: [log("Catálogo", `Publicó “${name}” a $${price}, ${service.home ? "a domicilio" : "en su local"}.`), ...s.log],
        }));
        return "";
      },
      publishPart(techId, part) {
        const name = String(part.name || "").trim();
        const price = Number(String(part.price || "").replace(/[^0-9.]/g, ""));
        const stock = Number(String(part.stock ?? "").replace(/[^0-9]/g, ""));
        if (!name || !price || Number.isNaN(stock)) return "Faltan nombre, precio o existencias.";
        setState((s) => {
          const existing = s.products.find((p) => p.techId === techId && p.name.toLowerCase() === name.toLowerCase());
          const next = {
            name,
            category: part.category || "Electricidad",
            price,
            stock,
            techId,
            place: part.place,
            detail: part.detail || `Se recoge en ${part.place}. Sin envío a domicilio.`,
          };
          return {
            ...s,
            products: existing
              ? s.products.map((p) => (p.id === existing.id ? { ...p, ...next } : p))
              : [...s.products, { ...next, id: uid("pr") }],
            log: [log("Catálogo", `${existing ? "Actualizó" : "Publicó"} “${name}” a $${price}, stock ${stock}. Comisión $0.`), ...s.log],
          };
        });
        return "";
      },
      submitApplication(form) {
        const services = (form.services || []).filter((sv) => String(sv.name || "").trim() && Number(sv.price) > 0);
        const required = [form.oficio, form.phone, form.zone, form.place, form.idFile];
        if (required.some((v) => !String(v || "").trim()) || !services.length) return "Completa oficio, teléfono, zona, punto de atención, identificación y al menos un servicio con precio.";
        const client = me();
        if (!client) return "Entra a tu cuenta para enviar la solicitud.";
        if (client.role !== "cliente") return "Esta cuenta ya no puede enviar una solicitud de cliente.";
        const summary = services.map((sv) => `${sv.name.trim()} $${sv.price}${sv.home ? " a domicilio" : " en su local"}`).join(" y ");
        setState((s) => ({
          ...s,
          applicationDraft: null,
          applications: [
            {
              id: uid("sol"),
              userId: client.id,
              name: client.name,
              oficio: form.oficio.trim(),
              phone: form.phone.trim(),
              zone: form.zone.trim(),
              place: form.place.trim(),
              when: stamp().date,
              status: "pendiente",
              services: summary,
              serviceList: services.map((sv) => ({ name: sv.name.trim(), price: Number(sv.price), home: !!sv.home })),
              idFile: form.idFile,
            },
            ...s.applications.filter((a) => a.userId !== client.id || a.status === "rechazada"),
          ],
        }));
        return "";
      },
      setApplicationDraft(applicationDraft) {
        setState((s) => ({ ...s, applicationDraft }));
      },
      updateProfile(patch) {
        const user = me();
        if (!user) return "Entra a tu cuenta.";
        const name = String(patch.name ?? user.name).trim();
        const phone = String(patch.phone ?? user.phone).trim();
        if (!name || !phone) return "El nombre y el teléfono no pueden quedar vacíos.";
        setState((s) => ({
          ...s,
          users: s.users.map((u) => (u.id === user.id ? { ...u, name, phone } : u)),
          techs: s.techs.map((t) => (t.id === user.id || t.email === user.email ? { ...t, name, phone, place: patch.place || t.place, zone: patch.zone || t.zone } : t)),
        }));
        return "";
      },
      addCatalog(item) {
        const name = String(item.name || "").trim();
        const price = Number(String(item.price || "").replace(/[^0-9.]/g, ""));
        const rubro = String(item.rubro || "").trim();
        if (!name || !price || !rubro) return "Indica nombre, rubro y precio.";
        if (state.catalog.some((c) => c.name.toLowerCase() === name.toLowerCase())) return "Ese servicio ya está en el catálogo.";
        setState((s) => ({
          ...s,
          catalog: [...s.catalog, { id: uid("cat"), name, rubro, price }],
          log: [log("Catálogo", `Agregó “${name}” a $${price}.`), ...s.log],
        }));
        return "";
      },
      approveApplication(id) {
        const app = state.applications.find((a) => a.id === id);
        if (!app || app.status !== "pendiente") return;
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === id ? { ...a, status: "aprobada" } : a)),
          users: s.users.map((u) => (u.id === app.userId ? { ...u, role: "tecnico" } : u)),
          techs: s.techs.some((t) => t.id === app.userId) ? s.techs : [...s.techs, {
            id: app.userId,
            name: app.name,
            oficio: app.oficio,
            initials: app.name.slice(0, 2).toUpperCase(),
            rating: 5,
            jobs: 0,
            zone: app.zone,
            place: app.place,
            phone: app.phone,
            email: s.users.find((u) => u.id === app.userId)?.email || "",
            bio: "Técnico recién aprobado.",
            services: (app.serviceList || []).map((sv) => ({ id: uid("sv"), name: sv.name, time: "1 h", home: !!sv.home, price: Number(sv.price) })),
          }],
          log: [log("Validación", `Aprobó a ${app.name}. La cuenta pasó a técnico y dejó de ser cliente.`), ...s.log],
        }));
      },
      rejectApplication(id, reason) {
        if (!reason.trim()) return "Sin motivo, Rechazar no guarda.";
        const app = state.applications.find((a) => a.id === id);
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === id ? { ...a, status: "rechazada", reason: reason.trim(), at: `${stamp().date} · ${stamp().time}` } : a)),
          log: [log("Validación", `Rechazó a ${app?.name}. Motivo: ${reason.trim()}`), ...s.log],
        }));
        return "";
      },
      updateCatalogPrice(id, price) {
        const item = state.catalog.find((c) => c.id === id);
        const value = Number(String(price).replace(/[^0-9]/g, ""));
        if (!value) return;
        setState((s) => ({
          ...s,
          catalog: s.catalog.map((c) => (c.id === id ? { ...c, price: value } : c)),
          techs: s.techs.map((t) => ({ ...t, services: t.services.map((sv) => (sv.name === item.name ? { ...sv, price: value } : sv)) })),
          log: [log("Catálogo", `Editó el precio de “${item.name}” a $${value}.`), ...s.log],
        }));
      },
      deleteCatalog(id) {
        const item = state.catalog.find((c) => c.id === id);
        if (serviceInUse(state, item.name)) {
          setState((s) => ({ ...s, log: [log("Catálogo", `Intento bloqueado: eliminar “${item.name}”. Tiene pedidos activos.`), ...s.log] }));
          return `No se eliminó “${item.name}”. Tiene pedidos activos: no están pagados ni cancelados.`;
        }
        setState((s) => ({
          ...s,
          catalog: s.catalog.filter((c) => c.id !== id),
          techs: s.techs.map((t) => ({ ...t, services: t.services.filter((sv) => sv.name !== item.name) })),
          log: [log("Catálogo", `Eliminó “${item.name}”.`), ...s.log],
        }));
        return "";
      },
      deleteProduct(id) {
        setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
      },
      addCategory(name) {
        if (!name.trim()) return;
        setState((s) => ({ ...s, categories: s.categories.includes(name.trim()) ? s.categories : [...s.categories, name.trim()] }));
      },
      deleteTech(id) {
        const tech = state.techs.find((t) => t.id === id);
        if (!tech || state.hiddenTechs.includes(id)) return "Ese técnico ya no está en el listado.";
        if (activeOrders(state, id).length) {
          setState((s) => ({ ...s, log: [log("Usuarios", `Intento bloqueado: eliminar al técnico ${tech.name}. Tiene pedidos activos.`), ...s.log] }));
          return `No se eliminó a ${tech.name}. Tiene pedidos activos: no están pagados ni cancelados.`;
        }
        setState((s) => ({ ...s, hiddenTechs: [...s.hiddenTechs, id], log: [log("Usuarios", `Eliminó al técnico ${tech.name}.`), ...s.log] }));
        return "";
      },
      saveUser(id, patch) {
        setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
      },
      editReview(id, text) {
        const clean = String(text || "").trim();
        if (!clean) return "La reseña lleva un comentario.";
        setState((s) => ({ ...s, reviews: s.reviews.map((r) => (r.id === id ? { ...r, text: clean } : r)) }));
        return "";
      },
      setCart(cart) {
        setState((s) => ({ ...s, cart }));
      },
    };
  }, [state]);

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}
