DROP FUNCTION IF EXISTS fn_cek_user;
DELIMITER //
CREATE FUNCTION fn_cek_user(username_in VARCHAR(50), password_in VARCHAR(100))
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE valid INT DEFAULT 0;

  IF EXISTS (
    SELECT * FROM USER
    WHERE username = username_in AND PASSWORD = password_in
  ) THEN
    SET valid = 1;
  END IF;

  RETURN valid;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_login_user;
DELIMITER //
CREATE PROCEDURE sp_login_user(
  IN username_in VARCHAR(50),
  IN password_in VARCHAR(100)
)
BEGIN
  SELECT username, `status`
  FROM USER
  WHERE username = username_in AND PASSWORD = password_in;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS get_orders;
DELIMITER //
CREATE PROCEDURE get_orders()
BEGIN
  SELECT id, nama_pembeli, harga_total, `status`
  FROM `order`
  WHERE STATUS = 'belum';
END //
DELIMITER ;


-- ambil barang
DROP PROCEDURE IF EXISTS getBarang;
DELIMITER $$
CREATE PROCEDURE getBarang()
BEGIN
  SELECT 
    id_barang AS id,
    nama_barang AS nama,
    harga,
    stok
  FROM barang;
END $$
DELIMITER ;



-- generate order_id
DROP FUNCTION IF EXISTS generate_order_id;
DELIMITER $$
CREATE FUNCTION generate_order_id() RETURNS VARCHAR(12)
DETERMINISTIC
BEGIN
  DECLARE yymmdd VARCHAR(8);
  DECLARE counter INT DEFAULT 0;
  DECLARE order_id VARCHAR(12);

  SET yymmdd = DATE_FORMAT(NOW(), '%y%m%d');

  SELECT COUNT(*) + 1 INTO counter
  FROM `order`
  WHERE DATE(created_at) = CURDATE();

  SET order_id = CONCAT(yymmdd, LPAD(counter, 3, '0'));

  RETURN order_id;
END$$
DELIMITER ;


-- create
DROP PROCEDURE IF EXISTS create_order;
DELIMITER $$
CREATE PROCEDURE create_order(
  IN p_nama_pembeli VARCHAR(100),
  IN p_total DECIMAL(10,2),
  IN p_json_items JSON,
  OUT p_order_id VARCHAR(12)
)
BEGIN
  DECLARE orderId VARCHAR(12);
  DECLARE i INT DEFAULT 0;
  DECLARE items_length INT;
  DECLARE item_id INT;
  DECLARE item_nama VARCHAR(100);
  DECLARE item_harga DECIMAL(10,2);
  DECLARE item_qty INT;
  DECLARE item_total DECIMAL(10,2);

  SET orderId = generate_order_id();

  -- Insert data utama order
  INSERT INTO `order` (id, harga_total, nama_pembeli) 
  VALUES (orderId, p_total, p_nama_pembeli);

  SET items_length = JSON_LENGTH(p_json_items);

  WHILE i < items_length DO
    SET item_id = JSON_EXTRACT(p_json_items, CONCAT('$[', i, '].id'));
    SET item_qty = JSON_EXTRACT(p_json_items, CONCAT('$[', i, '].qty'));

    -- Ambil nama dan harga barang dari tabel barang
    SELECT nama_barang, harga INTO item_nama, item_harga 
    FROM barang WHERE id_barang = item_id;

    SET item_total = item_harga * item_qty;

    -- Masukkan detail order
    INSERT INTO order_detail (id_order, nama_barang, harga_barang, jumlah_barang, total_harga)
    VALUES (orderId, item_nama, item_harga, item_qty, item_total);

    -- Kurangi stok barang
    UPDATE barang SET stok = stok - item_qty WHERE id_barang = item_id;

    SET i = i + 1;
  END WHILE;

  SET p_order_id = orderId;
END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS GetPendingOrders;
DELIMITER $$
CREATE PROCEDURE GetPendingOrders()
BEGIN
  SELECT id, nama_pembeli, harga_total, `status`, created_at
  FROM `order`
  WHERE STATUS = 'belum';
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS UpdateOrderStatus;
DELIMITER //
CREATE PROCEDURE UpdateOrderStatus(
  IN orderId VARCHAR(20),
  IN newStatus VARCHAR(20),
  IN namaPengirim VARCHAR(100)
)
BEGIN
  UPDATE `order`
  SET STATUS = newStatus
  WHERE id = orderId;

  IF newStatus = 'terkirim' THEN
    INSERT INTO pengiriman (id_order, nama_pengirim)
    VALUES (orderId, namaPengirim);
  END IF;
END//

DELIMITER ;


DROP PROCEDURE IF EXISTS get_user;
DELIMITER $$
CREATE PROCEDURE get_user()
BEGIN
  SELECT 
    id,
    username,
    `password`,
    `status`
  FROM `user`;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `insert_user`$$
CREATE PROCEDURE `insert_user` (
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(100),
    IN p_status VARCHAR(10)
)
BEGIN
    INSERT INTO `user` (username, `password`, `status`)
    VALUES (p_username, p_password, p_status);
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `edit_user` $$
CREATE PROCEDURE `edit_user` (
	IN p_id INT,
	IN p_username VARCHAR(50),
	IN p_password VARCHAR(100),
	IN p_status VARCHAR(10)
)   
BEGIN
  UPDATE `user` 
  SET 	
	username = p_username,  
	`password` = p_password,
	`status` = p_status
  WHERE id = p_id;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `delete_user` $$
CREATE PROCEDURE `delete_user` (
	IN p_id INT
)   
BEGIN
  DELETE FROM `user`
  WHERE id = p_id;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `insert_barang`$$
CREATE PROCEDURE `insert_barang` (
    IN p_nama_barang VARCHAR(50),
    IN p_harga DECIMAL (10,2),
    IN p_stok INT
)
BEGIN
    INSERT INTO `barang` (nama_barang, `harga`, `stok`)
    VALUES (p_nama_barang, p_harga, p_stok);
END $$
DELIMITER ;

-- History
DROP PROCEDURE IF EXISTS get_all_nota;
DELIMITER //
CREATE PROCEDURE get_all_nota()
BEGIN
  SELECT * FROM nota
  ORDER BY created_at DESC;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS get_nota_by_id;
DELIMITER //
CREATE PROCEDURE get_nota_by_id(
  IN htrans_nota INT
)
BEGIN
  SELECT * FROM nota
  WHERE id_htrans = htrans_nota;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS get_detail_nota;
DELIMITER //
CREATE PROCEDURE get_detail_nota(
   IN htrans_nota VARCHAR(12)
)
BEGIN
  SELECT * FROM detail_nota
  WHERE id_htrans = htrans_nota;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS get_all_order_detail;
DELIMITER //
CREATE PROCEDURE get_all_order_detail()
BEGIN
  SELECT b.nama_barang, CAST(COALESCE(SUM(penjualan.jumlah_barang), 0) AS UNSIGNED) AS sold
  FROM barang b
  LEFT JOIN (
    SELECT nama_barang, jumlah_barang FROM detail_nota
    UNION ALL
    SELECT nama_barang, jumlah_barang FROM order_detail
  ) AS penjualan
  ON penjualan.nama_barang = b.nama_barang
  GROUP BY b.nama_barang
  ORDER BY sold DESC;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS get_all_order;
DELIMITER //
CREATE PROCEDURE get_all_order()
BEGIN
  SELECT * FROM `order`
  ORDER BY created_at DESC;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS get_order_by_id;
DELIMITER //
CREATE PROCEDURE get_order_by_id(
  IN htrans_order INT
)
BEGIN
  SELECT * FROM `order`
  WHERE id = htrans_order;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS get_detail_order;
DELIMITER //
CREATE PROCEDURE get_detail_order(
  IN htrans_order INT
)
BEGIN
  SELECT * FROM order_detail
  WHERE id_order = htrans_order;
END//
DELIMITER ;


DROP PROCEDURE IF EXISTS get_all_pengiriman;
DELIMITER //
CREATE PROCEDURE get_all_pengiriman()
BEGIN
  SELECT p.id_pengiriman, p.id_order, p.nama_pengirim, o.* FROM pengiriman p
  JOIN `order` o ON o.id = p.id_order
  ORDER BY o.updated_at DESC;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS get_pengiriman_by_id;
DELIMITER //
CREATE PROCEDURE get_pengiriman_by_id(
  IN htrans_pengiriman INT
)
BEGIN
  SELECT p.*, o.* FROM pengiriman p
  JOIN `order` o ON o.id = p.id_order
  WHERE o.id = htrans_pengiriman;
END//
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `edit_barang` $$
CREATE PROCEDURE `edit_barang` (
	IN p_harga DECIMAL(10,2),
	IN p_stok INT,
  IN p_id INT
)   
BEGIN
  UPDATE `barang` 
  SET 	
	harga = p_harga,  
	stok = p_stok
  WHERE id_barang = p_id;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `delete_barang` $$
CREATE PROCEDURE `delete_barang` (
	IN p_id INT
)   
BEGIN
  DELETE FROM `barang`
  WHERE id_barang = p_id;
END $$
DELIMITER ;


-- ngene lo
DROP PROCEDURE IF EXISTS update_jumlah_barang_order_detail;
DELIMITER $$
CREATE PROCEDURE update_jumlah_barang_order_detail(
  IN p_id_order VARCHAR(12),
  IN p_nama_barang VARCHAR(100),
  IN p_jumlah_baru INT
)
BEGIN
  DECLARE v_jumlah_lama INT;

  SELECT jumlah_barang INTO v_jumlah_lama
  FROM order_detail
  WHERE id_order = p_id_order AND nama_barang = p_nama_barang;

  -- Update order_detail
  UPDATE order_detail
  SET jumlah_barang = p_jumlah_baru,
      total_harga = harga_barang * p_jumlah_baru
  WHERE id_order = p_id_order AND nama_barang = p_nama_barang;

  -- Update stok di barang
  UPDATE barang
  SET stok = stok + v_jumlah_lama - p_jumlah_baru
  WHERE nama_barang = p_nama_barang;
END $$

DELIMITER ;


DROP PROCEDURE IF EXISTS get_order_with_detail;
DELIMITER $$
CREATE PROCEDURE get_order_with_detail(
  IN p_id_order VARCHAR(12)
)
BEGIN
  -- Result set pertama: data order utama
  SELECT id, nama_pembeli, harga_total, STATUS
  FROM `order`
  WHERE id = p_id_order;

  -- Result set kedua: data detail order
  SELECT nama_barang, harga_barang, jumlah_barang, total_harga
  FROM order_detail
  WHERE id_order = p_id_order;
END $$

DELIMITER ;


-- KASIR PROSEDUR
-- generate nota_id
DROP FUNCTION IF EXISTS generate_nota_id;
DELIMITER $$
CREATE FUNCTION generate_nota_id() RETURNS VARCHAR(12)
DETERMINISTIC
BEGIN
  DECLARE mmdd00 VARCHAR(8);
  DECLARE counter INT DEFAULT 0;
  DECLARE nota_id VARCHAR(12);

  SET mmdd00 = DATE_FORMAT(NOW(), '%m%d00');

  SELECT COUNT(*) + 1 INTO counter
  FROM `nota`
  WHERE DATE(created_at) = CURDATE();

  SET nota_id = CONCAT(mmdd00, LPAD(counter, 3, '0'));

  RETURN nota_id;
END$$
DELIMITER ;

-- create nota 
DROP PROCEDURE IF EXISTS create_nota;
DELIMITER $$

CREATE PROCEDURE create_nota (
  IN p_total DECIMAL(10,2),
  IN p_json_items JSON,
  OUT p_nota_id VARCHAR(12)
)
BEGIN
  DECLARE notaId VARCHAR(12);
  DECLARE i INT DEFAULT 0;
  DECLARE item_id INT;
  DECLARE items_length INT;
  DECLARE item_nama VARCHAR(100);
  DECLARE item_harga DECIMAL(10,2);
  DECLARE item_jumlah INT;
  DECLARE item_total DECIMAL(10,2);

  -- Generate ID nota
  SET notaId = generate_nota_id();

  -- Insert ke tabel nota (header)
  INSERT INTO nota (id_htrans, harga_total)
  VALUES (notaId, p_total);

  -- Hitung panjang array JSON
  SET items_length = JSON_LENGTH(p_json_items);

  -- Loop setiap item dalam JSON
  WHILE i < items_length DO
	SET item_id = JSON_EXTRACT(p_json_items, CONCAT('$[', i, '].id'));
	SET item_nama = JSON_UNQUOTE(JSON_EXTRACT(p_json_items, CONCAT('$[', i, '].nama_barang')));
	SET item_harga = CAST(JSON_EXTRACT(p_json_items, CONCAT('$[', i, '].harga_barang')) AS DECIMAL(10,2));
	SET item_jumlah = CAST(JSON_EXTRACT(p_json_items, CONCAT('$[', i, '].jumlah_barang')) AS UNSIGNED);
	SET item_total = CAST(JSON_EXTRACT(p_json_items, CONCAT('$[', i, '].total_harga')) AS DECIMAL(10,2));

    -- Insert ke detail nota
    INSERT INTO detail_nota (
      id_htrans, nama_barang, harga_barang, jumlah_barang, total_harga
    ) VALUES (
      notaId, item_nama, item_harga, item_jumlah, item_total
    );
    
    -- Kurangi stok barang
    UPDATE barang SET stok = stok - item_jumlah WHERE id_barang = item_id;

    SET i = i + 1;
  END WHILE;

  -- Set output
  SET p_nota_id = notaId;
END$$
DELIMITER ;




