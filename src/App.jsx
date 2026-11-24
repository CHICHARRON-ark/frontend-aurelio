import { Navigate, Route, Routes } from "react-router-dom";
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
  Camino,
  Cancelar,
  Carrito,
  CitaDetalle,
  Citas,
  Esperando,
  Foco,
  Listo,
  Pago,
  Pastilla,
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/app" element={<Inicio />} />
      <Route path="/app/registro" element={<Registro />} />
      <Route path="/app/entrar" element={<Entrar />} />
      <Route path="/app/filtros" element={<Filtros />} />
      <Route path="/app/lista/:oficio" element={<Listado />} />
      <Route path="/app/tecnico/:id" element={<Detalle />} />
      <Route path="/app/electricistas" element={<Listado />} />
      <Route path="/app/carlos" element={<Detalle />} />
      <Route path="/app/domicilio" element={<Domicilio />} />
      <Route path="/app/local" element={<Local />} />
      <Route path="/app/precio" element={<Precio />} />
      <Route path="/app/no-agendo" element={<NoAgendo />} />
      <Route path="/app/paga-primero" element={<PagaPrimero />} />
      <Route path="/app/citas" element={<Citas />} />
      <Route path="/app/citas/cancelar/:id" element={<Cancelar />} />
      <Route path="/app/citas/:id" element={<CitaDetalle />} />
      <Route path="/app/tienda/:id" element={<Foco />} />
      <Route path="/app/citas/pastilla" element={<Pastilla />} />
      <Route path="/app/citas/cancelar" element={<Cancelar />} />
      <Route path="/app/citas/camino" element={<Camino />} />
      <Route path="/app/citas/esperando" element={<Esperando />} />
      <Route path="/app/citas/listo" element={<Listo />} />
      <Route path="/app/pago" element={<Pago />} />
      <Route path="/app/calificar" element={<Calificar />} />
      <Route path="/app/tienda" element={<Tienda />} />
      <Route path="/app/tienda/foco" element={<Foco />} />
      <Route path="/app/carrito" element={<Carrito />} />
      <Route path="/app/perfil" element={<Perfil />} />
      <Route path="/app/oficio" element={<Oficio />} />
      <Route path="/app/servicios-tecnico" element={<ServiciosTecnico />} />
      <Route path="/app/rechazada" element={<Rechazada />} />
      <Route path="/app/avisos" element={<Avisos />} />

      <Route path="/tecnico" element={<Pedidos />} />
      <Route path="/tecnico/pedido" element={<PedidoNuevo />} />
      <Route path="/tecnico/pedido/:id" element={<PedidoNuevo />} />
      <Route path="/tecnico/estado" element={<Estado />} />
      <Route path="/tecnico/estado/:id" element={<Estado />} />
      <Route path="/tecnico/publicar" element={<Publicar />} />
      <Route path="/tecnico/refaccion" element={<Refaccion />} />
      <Route path="/tecnico/agenda" element={<Agenda />} />
      <Route path="/tecnico/ganancias" element={<Ganancias />} />
      <Route path="/tecnico/perfil" element={<PerfilTecnico />} />

      <Route path="/admin/entrar" element={<Acceso />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/validacion" element={<Validacion />} />
      <Route path="/admin/catalogo" element={<Catalogo />} />
      <Route path="/admin/citas" element={<CitasAdmin />} />
      <Route path="/admin/usuarios" element={<Usuarios />} />
      <Route path="/admin/pagos" element={<Pagos />} />
      <Route path="/admin/resenas" element={<Resenas />} />
      <Route path="/admin/bitacora" element={<Bitacora />} />
      <Route path="/admin/datos" element={<Datos />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
