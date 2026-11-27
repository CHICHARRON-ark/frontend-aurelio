import { Navigate, Route, Routes } from "react-router-dom";
import { useDemo } from "./demo";
import {
  Detalle,
  Domicilio,
  Entrar,
  Filtros,
  Inicio,
  Listado,
  Local,
  NoAgendo,
  PagaPrimero,
  Precio,
  Registro,
} from "./screens/UserScreens";
import { Avisos, Oficio, Perfil, Rechazada, ServiciosTecnico } from "./screens/ProfileScreens";
import {
  Calificar,
  Cancelar,
  Carrito,
  CitaDetalle,
  Citas,
  Foco,
  Pago,
  Tienda,
} from "./screens/CitasScreens";
import {
  Agenda,
  Estado,
  Ganancias,
  PedidoNuevo,
  Pedidos,
  PerfilTecnico,
  Publicar,
  Refaccion,
} from "./screens/TechScreens";
import {
  Acceso,
  Bitacora,
  Catalogo,
  CitasAdmin,
  Dashboard,
  Datos,
  Pagos,
  Resenas,
  Usuarios,
  Validacion,
} from "./screens/AdminScreens";
import { Emulador } from "./screens/Emulator";

function inPhone() {
  return window.parent !== window;
}

function WebOnly({ children }) {
  if (inPhone()) return <Navigate to="/app" replace />;
  return children;
}

function Need({ role, children }) {
  const demo = useDemo();
  if (inPhone() && role === "admin") return <Navigate to="/app" replace />;
  if (!demo.me) return <Navigate to={role === "admin" ? "/admin/entrar" : "/app/entrar"} replace />;
  if (inPhone() && role === "cliente" && demo.me.role !== "tecnico") return children;
  if (role === "admin" && demo.me.role !== "admin") return <Navigate to="/admin/entrar" replace />;
  if (demo.me.role !== role) return <Navigate to={demo.homeFor(demo.me)} replace />;
  return children;
}

function Start() {
  const demo = useDemo();
  return <Navigate to={demo.homeFor(demo.me)} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/emulador" element={<Emulador />} />
      <Route path="/app" element={<Need role="cliente"><Inicio /></Need>} />
      <Route path="/app/registro" element={<Registro />} />
      <Route path="/app/entrar" element={<Entrar />} />
      <Route path="/app/filtros" element={<Need role="cliente"><Filtros /></Need>} />
      <Route path="/app/lista/:oficio" element={<Need role="cliente"><Listado /></Need>} />
      <Route path="/app/tecnico/:id" element={<Need role="cliente"><Detalle /></Need>} />
      <Route path="/app/domicilio" element={<Need role="cliente"><Domicilio /></Need>} />
      <Route path="/app/local" element={<Need role="cliente"><Local /></Need>} />
      <Route path="/app/precio" element={<Need role="cliente"><Precio /></Need>} />
      <Route path="/app/no-agendo" element={<Need role="cliente"><NoAgendo /></Need>} />
      <Route path="/app/paga-primero" element={<Need role="cliente"><PagaPrimero /></Need>} />
      <Route path="/app/citas" element={<Need role="cliente"><Citas /></Need>} />
      <Route path="/app/citas/cancelar/:id" element={<Need role="cliente"><Cancelar /></Need>} />
      <Route path="/app/citas/:id" element={<Need role="cliente"><CitaDetalle /></Need>} />
      <Route path="/app/tienda/:id" element={<Need role="cliente"><Foco /></Need>} />
      <Route path="/app/pago" element={<Need role="cliente"><Pago /></Need>} />
      <Route path="/app/calificar/:id" element={<Need role="cliente"><Calificar /></Need>} />
      <Route path="/app/calificar" element={<Need role="cliente"><Calificar /></Need>} />
      <Route path="/app/tienda" element={<Need role="cliente"><Tienda /></Need>} />
      <Route path="/app/carrito" element={<Need role="cliente"><Carrito /></Need>} />
      <Route path="/app/perfil" element={<Need role="cliente"><Perfil /></Need>} />
      <Route path="/app/oficio" element={<Need role="cliente"><Oficio /></Need>} />
      <Route path="/app/servicios-tecnico" element={<Need role="cliente"><ServiciosTecnico /></Need>} />
      <Route path="/app/rechazada" element={<Need role="cliente"><Rechazada /></Need>} />
      <Route path="/app/avisos" element={<Need role="cliente"><Avisos /></Need>} />

      <Route path="/tecnico" element={<Need role="tecnico"><Pedidos /></Need>} />
      <Route path="/tecnico/pedido/:id" element={<Need role="tecnico"><PedidoNuevo /></Need>} />
      <Route path="/tecnico/estado/:id" element={<Need role="tecnico"><Estado /></Need>} />
      <Route path="/tecnico/publicar" element={<Need role="tecnico"><Publicar /></Need>} />
      <Route path="/tecnico/refaccion" element={<Need role="tecnico"><Refaccion /></Need>} />
      <Route path="/tecnico/agenda" element={<Need role="tecnico"><Agenda /></Need>} />
      <Route path="/tecnico/ganancias" element={<Need role="tecnico"><Ganancias /></Need>} />
      <Route path="/tecnico/perfil" element={<Need role="tecnico"><PerfilTecnico /></Need>} />

      <Route path="/admin/entrar" element={<WebOnly><Acceso /></WebOnly>} />
      <Route path="/admin" element={<WebOnly><Need role="admin"><Dashboard /></Need></WebOnly>} />
      <Route path="/admin/validacion" element={<WebOnly><Need role="admin"><Validacion /></Need></WebOnly>} />
      <Route path="/admin/catalogo" element={<WebOnly><Need role="admin"><Catalogo /></Need></WebOnly>} />
      <Route path="/admin/citas" element={<WebOnly><Need role="admin"><CitasAdmin /></Need></WebOnly>} />
      <Route path="/admin/usuarios" element={<WebOnly><Need role="admin"><Usuarios /></Need></WebOnly>} />
      <Route path="/admin/pagos" element={<WebOnly><Need role="admin"><Pagos /></Need></WebOnly>} />
      <Route path="/admin/resenas" element={<WebOnly><Need role="admin"><Resenas /></Need></WebOnly>} />
      <Route path="/admin/bitacora" element={<WebOnly><Need role="admin"><Bitacora /></Need></WebOnly>} />
      <Route path="/admin/datos" element={<WebOnly><Need role="admin"><Datos /></Need></WebOnly>} />
      <Route path="*" element={<Start />} />
    </Routes>
  );
}
