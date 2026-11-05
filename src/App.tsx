import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Conocenos } from './pages/Conocenos';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Pedido } from './pages/Pedido';
import { Producto } from './pages/Producto';
import { Reservas } from './pages/Reservas';
import { Tienda } from './pages/Tienda';
import { Tratamiento } from './pages/Tratamiento';
import { Tratamientos } from './pages/Tratamientos';

// El panel se descarga aparte: la web pública no carga su código.
const Admin = lazy(() => import('./admin/Admin'));

export function App() {
  return (
    <Routes>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={null}>
            <Admin />
          </Suspense>
        }
      />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tratamientos" element={<Tratamientos />} />
        <Route path="tratamientos/:slug" element={<Tratamiento />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="tienda" element={<Tienda />} />
        <Route path="tienda/:slug" element={<Producto />} />
        <Route path="pedido" element={<Pedido />} />
        <Route path="conocenos" element={<Conocenos />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
