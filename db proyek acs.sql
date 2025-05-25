CREATE DATABASE IF NOT EXISTS `proyek-acs`;
USE `proyek-acs`;

-- TABEL USER
CREATE TABLE IF NOT EXISTS USER (
  username VARCHAR(50) PRIMARY KEY,
  PASSWORD VARCHAR(100) NOT NULL,
  STATUS ENUM('Admin', 'Kasir', 'Pengiriman') NOT NULL
);
INSERT INTO USER (username, PASSWORD, STATUS) VALUES
('admin', '123', 'Admin'),
('kasir', '123', 'Kasir'),
('pengirim', '123', 'Pengiriman');
-- TABEL BARANG
CREATE TABLE IF NOT EXISTS barang (
  id_barang INT AUTO_INCREMENT PRIMARY KEY,
  nama_barang VARCHAR(100) NOT NULL,
  harga DECIMAL(10,2) NOT NULL,
  stok INT NOT NULL
);
INSERT INTO barang (nama_barang, harga, stok) VALUES
('Aqua Galon', 20000.00, 50),
('Cleo Galon', 18000.00, 40),
('LPG 3 kg', 150000.00, 30),
('LPG 12 kg', 150000.00, 30),
('Club galon ', 15000.00, 30),
('Air isi Ulang', 15000.00, 30),
('Club gelas', 150000.00, 30);



-- TABEL NOTA
CREATE TABLE IF NOT EXISTS nota (
  id_htrans INT AUTO_INCREMENT PRIMARY KEY,
  harga_total DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABEL DETAIL NOTA
CREATE TABLE IF NOT EXISTS detail_nota (
  id_dtrans INT,
  id_htrans INT,
  nama_barang VARCHAR(100),
  harga_barang DECIMAL(10,2),
  jumlah_barang INT,
  total_harga DECIMAL(10,2),
  FOREIGN KEY (id_htrans) REFERENCES nota(id_htrans)
);

-- TABEL ORDER

CREATE TABLE IF NOT EXISTS `order` (
  id VARCHAR(12) PRIMARY KEY,
  harga_total DECIMAL(10,2) NOT NULL,
  nama_pembeli VARCHAR(100) NOT NULL,
  STATUS ENUM('terkirim', 'belum') NOT NULL DEFAULT 'belum',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABEL ORDER_DETAIL
CREATE TABLE IF NOT EXISTS order_detail (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_order VARCHAR(12),
  nama_barang VARCHAR(100),
  harga_barang DECIMAL(10,2),
  jumlah_barang INT,
  total_harga DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_order) REFERENCES `order`(id)
);

-- TABEL PENGIRIMAN
CREATE TABLE IF NOT EXISTS pengiriman (
  id_pengiriman INT AUTO_INCREMENT PRIMARY KEY,
  id_order VARCHAR(12),
  nama_pengirim VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_order) REFERENCES `order`(id)
);


INSERT INTO `order` (id, harga_total, nama_pembeli) VALUES
('250515001',100000, 'erick');

INSERT INTO order_detail(id_order, nama_barang, jumlah_barang, total_harga) VALUES
('250515001', 'aqua galon', 2, 30000),
('250515001', 'cleo galon', 5, 70000);