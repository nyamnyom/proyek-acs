import mysql from 'mysql2/promise';


// Buat koneksi pool ke database MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',        // Ganti dengan password MySQL kamu
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


// Kasir



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
export async function updateOrderStatus(id, status) {
  await pool.query('CALL UpdateOrderStatus(?, ?)', [id, status]);
  return { success: true };
}
