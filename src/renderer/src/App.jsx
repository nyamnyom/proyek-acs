import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './components/Login';
import AdminMain from './components/Admin/main';
import KasirMain from './components/Kasir/main';

import CreateOrderKasir from './components/Kasir/CreateOrderKasir';
import RiwayatTransaksi from './components/Kasir/RiwayatTransaksi';

import OrderList from './components/Pengiriman/OrderList';
import CreateOrder from './components/Pengiriman/CreateOrder';
import KirimOrder from './components/Pengiriman/KirimOrder';
import EditOrder from './components/Pengiriman/EditOrder'; 


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/kasir" element={<KasirMain />} />

        {/* Redirect jika hanya buka /pengiriman */}
        <Route path="/pengiriman" element={<Navigate to="/pengiriman/order" replace />} />

        {/* Pengiriman routes */}
        <Route path="/pengiriman/order" element={<OrderList />} />
        <Route path="/pengiriman/create" element={<CreateOrder />} />
        <Route path="/pengiriman/kirim" element={<KirimOrder />} />
        <Route path="/pengiriman/edit/:idOrder" element={<EditOrderWrapper />} />

        {/* Kasir routes */}
        <Route path="/kasir/create-order-kasir" element={<CreateOrderKasir />} />
        <Route path="/kasir/riwayat-transaksi" element={<RiwayatTransaksi />} />

      </Routes>
    </BrowserRouter>
  );
}
function EditOrderWrapper() {
  const { idOrder } = useParams();
  return <EditOrder idOrder={idOrder} />;
}
export default App;
