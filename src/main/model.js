import mysql from 'mysql2/promise';

// Buat koneksi pool ke database MySQL
const pool = mysql.createPool({
  host: '147.185.221.24',
  port: '20174',
  user: 'userplayit',
  password: 'passwordku',      
  database: 'proyek-acs',
  multipleStatements: true 
});

export default async function loginUser(username, password) {
  // cek user via function di DB
  const [rows] = await pool.query('SELECT fn_cek_user(?, ?) AS valid', [username, password]);
  if (rows[0].valid === 1) {
    // panggil procedure login
    const [resultSets] = await pool.query('CALL sp_login_user(?, ?)', [username, password]);
    // resultSets[0] adalah hasil SELECT dalam procedure
    return resultSets[0][0]; // { username, status }
  }
  return null; // login gagal
}

// ADMIN
export async function getUser(){
    // ambil data order via function di DB
     const [[result, meta], field] = await pool.query('call get_user()');
    return result;
}

export async function insertUser(event, username, password, status) {
  try {
    const [rows, metadata] = await pool.query("CALL insert_user(?, ?, ?)", [
      username, 
      password, 
      status
    ]);
    return {
      success: true,
      message: "User added successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteUser(event, id) {
  try {
    const [rows, metadata] = await pool.query("CALL delete_user(?)", [id]);
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function editUser(event, username, password, status, id) {
  try {
    const [rows, metadata] = await pool.query("CALL edit_user(?, ?, ?, ?)", [
      username,
      password,
      status,
      id
    ]);
    return {
      success: true,
      message: "User edit successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function insertBarang(event, nama, harga, stok) {
  try {
    const [rows, metadata] = await pool.query("CALL insert_barang(?, ?, ?)", [
      nama, 
      harga, 
      stok
    ]);
    return {
      success: true,
      message: "Item added successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function editBarang(event, harga, stok, id) {
  try {
    const [rows, metadata] = await pool.query("CALL edit_barang(?, ?, ?)", [
      harga,
      stok,
      id
    ]);
    return {
      success: true,
      message: "Barang edit successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteBarang(event, id) {
  try {
    const [rows, metadata] = await pool.query("CALL delete_barang(?)", [id]);
    return {
      success: true,
      message: "Barang deleted successfully",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getAllOrder(){
    const [[result, meta], field] = await pool.query('call get_all_order()');
    return result;
}
export async function getOmzetByHari(){
    const [[result, meta], field] = await pool.query('call get_omzet_by_hari()');
    return result;
}
export async function getOrderByIdAdmin(event, idOrder){
    const [[result, meta], field] = await pool.query('call get_order_by_id(?)', [idOrder]);
    return result[0];
}

export async function getDetailOrder(event, idOrder){
    const [[result, meta], field] = await pool.query('call get_detail_order(?)', [idOrder]);
    return result;
}

export async function getAllPengiriman(){
    const [[result, meta], field] = await pool.query('call get_all_pengiriman()');
    return result;
}

export async function getAllOrderDetail(){
    const [[result, meta], field] = await pool.query('call get_all_order_detail()');
    return result;
}

export async function getPengirimanById(event, idPengiriman){
    const [[result, meta], field] = await pool.query('call get_pengiriman_by_id(?)', [idPengiriman]);
    return result[0];
}

export async function getAllNota(){
    const [[result, meta], field] = await pool.query('call get_all_nota()');
    return result;
}

export async function getNotaById(event, idNota){
    const [[result, meta], field] = await pool.query('call get_nota_by_id(?)', [idNota]);
    return result[0];
}

export async function getDetailNota(event, idNota){
    const [[result, meta], field] = await pool.query('call get_detail_nota(?)', [idNota]);
    return result;
}


// Kasir
export async function createNota({ hargaTotal, keranjang }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const jsonItems = JSON.stringify(keranjang);

    // Panggil prosedur create_nota
    await conn.query(
      `CALL create_nota(?, ?, @nota_id);`,
      [hargaTotal, jsonItems]
    );

    // Ambil nilai output parameter
    const [[result]] = await conn.query(`SELECT @nota_id AS notaId;`);
    const notaId = result.notaId;

    if (!notaId) throw new Error('Gagal mendapatkan nota ID dari prosedur');

    await conn.commit();
    return { notaId };

  } catch (error) {
    await conn.rollback();
    console.error('Gagal create nota:', error);
    throw error;
  } finally {
    conn.release();
  }
}


// Pengiriman
export async function getOrder(){
    // ambil data order via function di DB
    const [[result, meta], field] = await pool.query('call get_orders()');
    return result;
}

export async function getBarang(){
    // ambil data order via function di DB
    const [[result, meta], field] = await pool.query('call getBarang()');
    return result;
}

export async function createOrder({ namaPembeli, hargaTotal, keranjang }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const jsonItems = JSON.stringify(keranjang);

    // Jalankan stored procedure tanpa SELECT @orderId
    await conn.query(
      `CALL create_order(?, ?, ?, @orderId);`,
      [namaPembeli, hargaTotal, jsonItems]
    );

    // Ambil nilai output parameter @orderId
    const [rows] = await conn.query(`SELECT @orderId AS orderId;`);

    const orderId = rows[0].orderId;
    if (!orderId) throw new Error('Order ID tidak didapatkan dari prosedur');

    await conn.commit();

    return { orderId };
  } catch (error) {
    await conn.rollback();
    console.error('Gagal create order:', error);
    throw error;
  } finally {
    conn.release();
  }
}

export async function getPendingOrders() {
  const [[result, meta], field] = await pool.query('CALL GetPendingOrders()');
  return result; // hasil CALL prosedur ada di rows[0]
}

// Update status satu order
export async function updateOrderStatus(id, status, pengirim) {
  await pool.query('CALL UpdateOrderStatus(?, ?, ?)', [id, status, pengirim]);
  return { success: true };
}


export async function getOrderById(idOrder) {
  const [results] = await pool.query('CALL get_order_with_detail(?)', [idOrder]);

// results itu array of result sets
const orderMain = results[0][0]; // first result set, first row
const orderDetails = results[1]; // second result set, array

return {
  nama_pembeli: orderMain.nama_pembeli,
  harga_total: orderMain.harga_total,
  status: orderMain.status,
  detail: orderDetails,
};
}

export async function updateJumlahBarangOrderDetail(idOrder, namaBarang, jumlahBaru) {
  const [rows] = await pool.query('CALL update_jumlah_barang_order_detail(?, ?, ?)', [
    idOrder,
    namaBarang,
    jumlahBaru,
  ]);
  return rows;
}

export async function updateOrderNamaPembeli(idOrder, namaPembeli, totalHarga) {
  const [result] = await pool.query('UPDATE `order` SET nama_pembeli = ?, harga_total = ? WHERE id = ?', [
    namaPembeli,
    totalHarga,
    idOrder,
    
  ]);
  return result;
}
