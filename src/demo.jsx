import { createContext, useContext, useMemo, useState } from "react";

const ALLOWED = ["gmail.com", "outlook.com", "hotmail.com", "live.com", "icloud.com", "yahoo.com"];
const FLOW = ["por aceptar", "aceptado", "en camino", "en proceso", "terminado", "pagado"];
const OPEN = new Set(["por aceptar", "aceptado", "en camino", "en proceso", "terminado", "esperando"]);

const DemoContext = createContext(null);
export function useDemo() {
  return useContext(DemoContext);
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
}

const initialTechs = [
  {
    id: "carlos", name: "Carlos Méndez", oficio: "Electricista", initials: "CM", rating: 4.9, jobs: 128,
    zone: "Col. Centro", place: "Av. Obregón 410, Col. Centro", phone: "653 330 1944",
    email: "carlos.mendez@gmail.com", bio: "Reviso la falla, te digo el precio y dejo la luz funcionando.",
    services: [
      { id: "corto", name: "Revisión de corto", time: "Cerca de 1 h", home: true, price: 450 },
      { id: "pastilla", name: "Cambio de pastilla", time: "40 min", home: false, price: 280 },
      { id: "contactos", name: "Instalación de contactos", time: "1 h", home: true, price: 350 },
    ],
  },
  {
    id: "andres", name: "Andrés Vidal", oficio: "Electricista", initials: "AV", rating: 4.6, jobs: 54,
    zone: "Col. Comercial", place: "Calle 9 120, Col. Comercial", phone: "653 200 1100",
    email: "andres.vidal@gmail.com", bio: "Atiendo en mi local.",
    services: [{ id: "contacto-local", name: "Revisión de contacto", time: "40 min", home: false, price: 250 }],
  },
  {
    id: "ivan", name: "Iván Cruz", oficio: "Electricista", initials: "IC", rating: 4.8, jobs: 40,
    zone: "Col. Sonora", place: "Calle 4 80", phone: "653 200 2200", email: "ivan.cruz@gmail.com", bio: "Trabajos de instalación.",
    services: [{ id: "tablero", name: "Cambio de tablero", time: "2 h", home: true, price: 520 }],
  },
  {
    id: "luis", name: "Luis Herrera", oficio: "Plomero", initials: "LH", rating: 4.8, jobs: 96,
    zone: "Col. Comercial", place: "Calle 3.ª 90", phone: "653 200 3300", email: "luis.herrera@outlook.com", bio: "Fugas, llaves y destapes.",
    services: [
      { id: "destape", name: "Destape de lavabo", time: "1 h", home: false, price: 320 },
      { id: "llave", name: "Cambio de llave", time: "40 min", home: false, price: 180 },
    ],
  },
  {
    id: "diego", name: "Diego Ramos", oficio: "Mecánico", initials: "DR", rating: 4.6, jobs: 61,
    zone: "Col. Comercial", place: "Av. Juárez 220, Col. Comercial", phone: "653 200 4400",
    email: "diego.ramos@gmail.com", bio: "Batería y fallas.",
    services: [{ id: "falla", name: "Revisión de falla", time: "1 h", home: true, price: 500 }],
  },
  {
    id: "pedro", name: "Pedro Salas", oficio: "Mecánico", initials: "PS", rating: 3.8, jobs: 12,
    zone: "Col. Sonora", place: "Calle 2 10", phone: "653 200 5500", email: "pedro.salas@hotmail.com", bio: "Servicio básico.",
    services: [{ id: "bateria", name: "Cambio de batería", time: "30 min", home: false, price: 200 }],
  },
  {
    id: "rosa", name: "Rosa Núñez", oficio: "Jardinero", initials: "RN", rating: 4.7, jobs: 74,
    zone: "Col. Sonora", place: "Calle 7 215, Col. Sonora", phone: "653 200 6600",
    email: "rosa.nunez@gmail.com", bio: "Poda y pasto.",
    services: [
      { id: "pasto", name: "Corte de pasto", time: "1 h", home: true, price: 300 },
      { id: "poda", name: "Poda de arbustos", time: "1 h", home: false, price: 250 },
    ],
  },
  {
    id: "lucia", name: "Lucía Mora", oficio: "Jardinero", initials: "LM", rating: 4.5, jobs: 38,
    zone: "Col. Comercial", place: "Calle 8 50", phone: "653 200 7700",     email: "lucia.mora@gmail.com",
    bio: "Jardinera verificada. Sale a domicilio.",
    services: [{ id: "poda-lucia", name: "Poda de patio", time: "1 h", home: true, price: 300 }],
  },
  {
    id: "jorge", name: "Jorge Peña", oficio: "Mecánico", initials: "JP", rating: 5, jobs: 0,
    zone: "Col. Comercial", place: "Calle 15 20", phone: "653 200 8800",
    email: "jorge.pena@gmail.com", bio: "Aprobado el 14 nov 2026.",
    services: [{ id: "bateria-jorge", name: "Revisión de batería", time: "40 min", home: false, price: 250 }],
  },
];

const initial = {
  session: { email: "ana.garcia@gmail.com" },
  users: [
    { id: "ana", name: "Ana García", email: "ana.garcia@gmail.com", phone: "653 120 4488", password: "servifix", role: "cliente" },
    { id: "mariana", name: "Mariana Solís", email: "mariana.solis@gmail.com", phone: "653 214 7781", password: "servifix", role: "cliente" },
    { id: "luis-p", name: "Luis P.", email: "luis.perez@outlook.com", phone: "653 111 1111", password: "servifix", role: "cliente" },
    { id: "sofia", name: "Sofía R.", email: "sofia.r@hotmail.com", phone: "653 222 2222", password: "servifix", role: "cliente" },
    { id: "elena", name: "Elena Cruz", email: "elena.cruz@yahoo.com", phone: "653 333 3333", password: "servifix", role: "cliente" },
    { id: "carlos", name: "Carlos Méndez", email: "carlos.mendez@gmail.com", phone: "653 330 1944", password: "servifix", role: "tecnico" },
    { id: "fernando", name: "Fernando Velázquez", email: "fernando.velazquez@gmail.com", phone: "653 100 0001", password: "servifix", role: "admin" },
  ],
  techs: initialTechs,
  products: [
    { id: "foco", name: "Foco LED 9W", category: "Electricidad", price: 45, stock: 22, techId: "carlos", place: "Obregón 410", detail: "Luz blanca, para socket común. Se recoge en Av. Obregón 410, Col. Centro." },
    { id: "cinta", name: "Cinta de teflón", category: "Plomería", price: 18, stock: 40, techId: "luis", place: "Calle 3.ª 90", detail: "Se recoge con Luis Herrera." },
    { id: "llave-paso", name: "Llave de paso 1/2", category: "Plomería", price: 89, stock: 12, techId: "luis", place: "Calle 3.ª 90", detail: "Se recoge con Luis Herrera." },
    { id: "bateria", name: "Batería 12V", category: "Mecánica", price: 1890, stock: 3, techId: "diego", place: "Sonora 15", detail: "Se recoge con Diego Ramos." },
  ],
  catalog: [
    { id: "cat-corto", name: "Revisión de corto", rubro: "Electricidad", price: 450 },
    { id: "cat-fuga", name: "Reparación de fuga", rubro: "Plomería", price: 420 },
    { id: "cat-pasto", name: "Corte de pasto", rubro: "Jardín", price: 300 },
    { id: "cat-falla", name: "Revisión de falla", rubro: "Mecánica", price: 500 },
  ],
  categories: ["Electricidad", "Plomería", "Jardín", "Mecánica"],
  orders: [
    { id: "o-corto", clientId: "ana", techId: "carlos", service: "Revisión de corto", when: "Dom 15 · 10:00", where: "a domicilio", address: "Calle 5 y Av. Juárez", price: 450, status: "en camino", paid: false },
    { id: "o-pastilla", clientId: "ana", techId: "carlos", service: "Cambio de pastilla", when: "Lun 16 · 11:00", where: "en su local", address: "Av. Obregón 410", price: 280, status: "aceptado", paid: false },
    { id: "o-poda", clientId: "ana", techId: "rosa", service: "Poda de patio", when: "Mar 17 · 9:00", where: "a domicilio", address: "Calle 5 y Av. Juárez, Col. Comercial", price: 300, status: "esperando", paid: false, reason: "no puedo en ese horario" },
    { id: "o-falla", clientId: "ana", techId: "diego", service: "Revisión de falla", when: "Sáb 14 · 11:00", where: "a domicilio", address: "Av. Juárez 220, Col. Comercial", price: 500, status: "terminado", paid: false },
    { id: "o-llave", clientId: "ana", techId: "luis", service: "Cambio de llave", when: "Lun 2 · 9:00", where: "en su local", address: "Calle 3.ª 90", price: 180, status: "cancelado", paid: false },
    { id: "o-contacto", clientId: "ana", techId: "carlos", service: "Revisión de contacto", when: "Lun 2 · 12:00", where: "a domicilio", address: "Calle 5 y Av. Juárez", price: 160, status: "cancelado", paid: false },
    { id: "o-sofia", clientId: "sofia", techId: "carlos", service: "Revisión de corto", when: "Lun 16 · 18:00", where: "a domicilio", address: "Calle 9 40, Col. Comercial", price: 450, status: "por aceptar", paid: false },
    { id: "o-elena", clientId: "elena", techId: "carlos", service: "Instalación de contactos", when: "Mié 12 · 9:00", where: "a domicilio", address: "Col. Centro", price: 350, status: "pagado", paid: true },
    { id: "o-pastilla-sofia", clientId: "sofia", techId: "carlos", service: "Cambio de pastilla", when: "Mié 5 · 11:00", where: "en su local", address: "Av. Obregón 410", price: 280, status: "pagado", paid: true },
    { id: "o-destape", clientId: "luis-p", techId: "luis", service: "Destape de lavabo", when: "Mié 12 · 16:00", where: "en su local", address: "Calle 3.ª 90", price: 320, status: "pagado", paid: true },
  ],
  payments: [
    { id: "1040", clientId: "luis-p", techId: "luis", concept: "Destape de lavabo", total: 320, commission: 32, status: "Pagado", kind: "servicio", orderId: "o-destape" },
    { id: "1036", clientId: "sofia", techId: "carlos", concept: "Cambio de pastilla", total: 280, commission: 28, status: "Pagado", kind: "servicio", orderId: "o-pastilla-sofia" },
    { id: "1031", clientId: "elena", techId: "carlos", concept: "Instalación de contactos", total: 350, commission: 35, status: "Pagado", kind: "servicio", orderId: "o-elena" },
    { id: "1038", clientId: "ana", techId: "carlos", concept: "Foco LED 9W · refacción", total: 90, commission: 0, status: "Pagado", kind: "refaccion" },
    { id: "1042", clientId: "ana", techId: "diego", concept: "Revisión de falla", total: 500, commission: 50, status: "Por pagar", kind: "servicio", orderId: "o-falla" },
  ],
  reviews: [
    { id: "r1", orderId: "o-destape", clientId: "luis-p", techId: "luis", stars: 5, text: "Dejó el lavabo funcionando.", paymentId: "1040" },
    { id: "r2", orderId: "o-pastilla-sofia", clientId: "sofia", techId: "carlos", stars: 4, text: "El precio fue el mismo que al agendar.", paymentId: "1036" },
    { id: "r3", orderId: "o-elena", clientId: "elena", techId: "carlos", stars: 5, text: "Llegó a tiempo y explicó la falla.", paymentId: "1031" },
  ],
  applications: [
    { id: "sol-mariana", userId: "mariana", name: "Mariana Solís", oficio: "Jardinera", phone: "653 214 7781", zone: "Col. Comercial", place: "Calle 12 88", when: "12 nov 2026", status: "pendiente", services: "mantenimiento de jardín $480 a domicilio y riego $220 en su local" },
    { id: "sol-ana", userId: "ana", name: "Ana García", oficio: "Jardinera", phone: "653 120 4488", zone: "Col. Sonora", place: "Calle 7 215", when: "14 nov 2026", status: "rechazada", reason: "La identificación no se lee. Sube otra foto de la INE, de frente y con buena luz.", at: "14 nov 2026 · 17:55", services: "Corte de pasto $300 a domicilio y poda $250 en su punto de atención" },
  ],
  log: [
    { date: "14 nov 2026", time: "18:42", module: "Catálogo", action: "Intento bloqueado: eliminar “Revisión de corto”. Tiene pedidos activos." },
    { date: "14 nov 2026", time: "18:40", module: "Catálogo", action: "Intento bloqueado: eliminar “Revisión de falla”. Tiene pedidos activos." },
    { date: "14 nov 2026", time: "18:10", module: "Validación", action: "Aprobó a Jorge Peña. La cuenta pasó a técnico y dejó de ser cliente." },
    { date: "14 nov 2026", time: "17:55", module: "Validación", action: "Rechazó a Ana García. Motivo: la identificación no se lee." },
    { date: "14 nov 2026", time: "17:20", module: "Catálogo", action: "Editó el precio de “Cinta de teflón” a $18." },
    { date: "14 nov 2026", time: "16:05", module: "Usuarios", action: "Intento bloqueado: eliminar al técnico Carlos Méndez. Tiene pedidos activos." },
  ],
  filters: { maxPrice: 400, minRating: 4, query: "", active: false },
  draft: null,
  cart: null,
  hiddenTechs: [],
};

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
  const [state, setState] = useState(initial);

  const api = useMemo(() => {
    const userByEmail = (email) => state.users.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());
    const me = () => userByEmail(state.session?.email) || null;
    const techById = (id) => state.techs.find((t) => t.id === id && !state.hiddenTechs.includes(t.id));
    const nameOf = (id) => state.users.find((u) => u.id === id)?.name || techById(id)?.name || id;

    const log = (module, action) => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      return { date: "24 nov 2026", time: `${hh}:${mm}`, module, action };
    };

    return {
      state,
      me: me(),
      debt: me() ? debtOf(state, me().id) : null,
      techById,
      nameOf,
      fromPrice: (tech) => Math.min(...tech.services.map((s) => s.price)),
      modality: (tech) => (tech.services.some((s) => s.home) ? "a domicilio" : "en su local"),
      searchTechs(oficio) {
        const q = state.filters.query.trim().toLowerCase();
        return state.techs.filter((t) => {
          if (state.hiddenTechs.includes(t.id)) return false;
          if (oficio && t.oficio !== oficio) return false;
          const from = Math.min(...t.services.map((s) => s.price));
          if (state.filters.active && from > state.filters.maxPrice) return false;
          if (state.filters.active && t.rating < state.filters.minRating) return false;
          if (q && !t.name.toLowerCase().includes(q)) return false;
          return true;
        });
      },
      register(form) {
        const name = form.name.trim();
        const email = form.email.trim().toLowerCase();
        const phone = form.phone.trim();
        const password = form.password;
        if (!name || !email || !phone || !password) return "Completa nombre, correo, teléfono y contraseña.";
        const domain = email.split("@")[1];
        if (!ALLOWED.includes(domain)) return "Ese dominio no está permitido. Usa Gmail, Outlook, Hotmail, Live, iCloud o Yahoo. Si el correo ya existe, tampoco se crea la cuenta.";
        if (state.users.some((u) => u.email === email)) return "Ese correo ya está registrado. No se crea la cuenta.";
        if (password.length < 8) return "La contraseña lleva al menos 8 caracteres.";
        setState((s) => ({ ...s, users: [...s.users, { id: uid("u"), name, email, phone, password, role: "cliente" }] }));
        return "";
      },
      login(email, password, panel) {
        const denied = "Acceso denegado. Correo o contraseña incorrectos, o la cuenta no tiene permiso para entrar al panel.";
        const bad = "Correo o contraseña incorrectos. No se abre la app.";
        const user = userByEmail(email);
        if (!user || user.password !== password) return panel ? denied : bad;
        if (panel && user.role !== "admin") return denied;
        setState((s) => ({ ...s, session: { email: user.email } }));
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
        if (!client || !state.draft?.techId) return "Faltan los datos de la cita.";
        if (debtOf(state, client.id)) return "debt";
        const tech = techById(state.draft.techId);
        const order = {
          id: uid("o"),
          clientId: client.id,
          techId: tech.id,
          service: state.draft.service,
          when: state.draft.when,
          where: state.draft.home ? "a domicilio" : "en su local",
          address: state.draft.home ? state.draft.address : tech.place,
          price: state.draft.price,
          status: "por aceptar",
          paid: false,
        };
        setState((s) => ({
          ...s,
          orders: [order, ...s.orders],
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
      pay({ orderId, card, parts }) {
        const digits = String(card || "").replace(/\s/g, "");
        if (digits !== "4242424242424242") return "Tarjeta rechazada. El pago no se registró y el pedido sigue sin pagar.";
        if (parts) {
          const product = state.products.find((p) => p.id === parts.productId);
          if (!product) return "No hay producto en el carrito.";
          if (parts.qty > product.stock) return `No puedes pedir más de ${product.stock}. El tope es el stock.`;
          const total = product.price * parts.qty;
          setState((s) => ({
            ...s,
            products: s.products.map((p) => (p.id === product.id ? { ...p, stock: p.stock - parts.qty } : p)),
            payments: [{ id: uid("p"), clientId: me()?.id, techId: product.techId, concept: `${product.name} · refacción`, total, commission: 0, status: "Pagado", kind: "refaccion" }, ...s.payments],
            cart: { ...parts, paid: true, total },
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
        setState((s) => ({
          ...s,
          reviews: [...s.reviews, { id: uid("r"), orderId, clientId: order.clientId, techId: order.techId, stars, text: text.trim() }],
        }));
        return "";
      },
      acceptOrder(id) {
        setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status: "aceptado" } : o)) }));
      },
      rejectOrder(id, reason) {
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: "esperando", techId: null, reason: reason.trim() } : o)),
        }));
      },
      advance(id) {
        const order = state.orders.find((o) => o.id === id);
        const idx = FLOW.indexOf(order?.status);
        if (idx < 0 || idx >= 4) return "Carlos solo puede marcar el estado que sigue. Pagado lo pone el pago.";
        const next = FLOW[idx + 1];
        setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status: next } : o)) }));
        return "";
      },
      publishService(techId, service) {
        const name = String(service.name || "").trim();
        const price = Number(String(service.price || "").replace(/[^0-9.]/g, ""));
        if (!name || !price) return "Indica nombre y precio base.";
        setState((s) => ({
          ...s,
          techs: s.techs.map((t) => {
            if (t.id !== techId) return t;
            const exists = t.services.some((sv) => sv.name.toLowerCase() === name.toLowerCase());
            const services = exists
              ? t.services.map((sv) => (sv.name.toLowerCase() === name.toLowerCase() ? { ...sv, price, home: !!service.home, time: service.time || sv.time } : sv))
              : [...t.services, { id: uid("sv"), name, time: service.time || "40 min", home: !!service.home, price }];
            return { ...t, place: service.place || t.place, services };
          }),
          catalog: s.catalog.some((c) => c.name.toLowerCase() === name.toLowerCase())
            ? s.catalog.map((c) => (c.name.toLowerCase() === name.toLowerCase() ? { ...c, price } : c))
            : [...s.catalog, { id: uid("cat"), name, rubro: "Electricidad", price }],
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
        const required = [form.oficio, form.phone, form.zone, form.place, form.serviceName, form.price];
        if (required.some((v) => !String(v || "").trim())) return "Sin un campo obligatorio no deja enviar.";
        const client = me();
        setState((s) => ({
          ...s,
          applications: [
            { id: uid("sol"), userId: client?.id, name: client?.name, oficio: form.oficio, phone: form.phone, zone: form.zone, place: form.place, when: "24 nov 2026", status: "pendiente", services: `${form.serviceName} $${form.price}` },
            ...s.applications.filter((a) => a.userId !== client?.id),
          ],
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
            id: app.userId, name: app.name, oficio: app.oficio, initials: app.name.slice(0, 2).toUpperCase(),
            rating: 5, jobs: 0, zone: app.zone, place: app.place, phone: app.phone, email: "", bio: "Técnico recién aprobado.",
            services: [],
          }],
          log: [log("Validación", `Aprobó a ${app.name}. La cuenta pasó a técnico y dejó de ser cliente.`), ...s.log],
        }));
      },
      rejectApplication(id, reason) {
        if (!reason.trim()) return "Sin motivo, Rechazar no guarda.";
        const app = state.applications.find((a) => a.id === id);
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === id ? { ...a, status: "rechazada", reason: reason.trim(), at: "24 nov 2026" } : a)),
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
