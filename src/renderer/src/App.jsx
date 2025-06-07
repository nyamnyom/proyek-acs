import { BrowserRouter, Routes, Route, Navigate, useParams, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import AdminMain from './components/Admin/main';
import KasirMain from './components/Kasir/main';

import CreateOrderKasir from './components/Kasir/CreateOrderKasir';
import RiwayatTransaksi from './components/Kasir/RiwayatTransaksi';

import OrderList from './components/Pengiriman/OrderList';
import CreateOrder from './components/Pengiriman/CreateOrder';
import KirimOrder from './components/Pengiriman/KirimOrder';
import EditOrder from './components/Pengiriman/EditOrder'; 
import NotaReport, { loaderNotaReport } from './components/Admin/Report/nota';
import OrderReport, { loaderOrderReport } from './components/Admin/Report/order';
import PengirimanReport, { loaderPengirimanReport } from './components/Admin/Report/pengiriman';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/admin",
      element: <AdminMain />,
    },
    {
      path: "/kasir",
      element: <KasirMain />,
    },
    {
      path: "/admin/nota-report/:idNota",
      element: <NotaReport />,
      loader: loaderNotaReport,
    },
    {
      path: "/admin/order-report/:idOrder",
      element: <OrderReport />,
      loader: loaderOrderReport,
    },
    {
      path: "/admin/pengiriman-report/:idPengiriman",
      element: <PengirimanReport />,
      loader: loaderPengirimanReport,
    },
    {
      path: "/pengiriman",
      element: <Navigate to="/pengiriman/order" replace />,
    },
    {
      path: "/pengiriman/order",
      element: <OrderList />,
    },
    {
      path: "/pengiriman/create",
      element: <CreateOrder />,
    },
    {
      path: "/pengiriman/kirim",
      element: <KirimOrder />,
    },
    {
      path: "/pengiriman/edit/:idOrder",
      element: <EditOrderWrapper />,
    },
    {
      path: "/kasir/create-order-kasir",
      element: <CreateOrderKasir />,
    },
  ]);

  return <RouterProvider router={router} />;
}
function EditOrderWrapper() {
  const { idOrder } = useParams();
  return <EditOrder idOrder={idOrder} />;
}
export default App;
