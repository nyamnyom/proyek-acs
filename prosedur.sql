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


DELIMITER //

CREATE PROCEDURE sp_login_user(
  IN username_in VARCHAR(50),
  IN password_in VARCHAR(100)
)
BEGIN
  SELECT username, STATUS
  FROM USER
  WHERE username = username_in AND PASSWORD = password_in;
END //

DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE get_orders()
BEGIN
  SELECT id, nama_pembeli, harga_total, STATUS
  FROM `order`
  WHERE STATUS = 'belum';
END //
DELIMITER ;


-- ambil barang
DELIMITER $$

CREATE OR REPLACE PROCEDURE getBarang()
BEGIN
  SELECT 
    id_barang AS id,
    nama_barang AS nama,
    harga,
    stok
  FROM barang;
END $$



-- generate order_id
DELIMITER $$

CREATE OR REPLACE FUNCTION generate_order_id() RETURNS VARCHAR(12)
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
DELIMITER $$

CREATE OR REPLACE PROCEDURE create_order(
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


DELIMITER $$

CREATE PROCEDURE GetPendingOrders()
BEGIN
  SELECT id, nama_pembeli, harga_total, STATUS, created_at
  FROM `order`
  WHERE STATUS = 'belum';
END $$

DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE UpdateOrderStatus(IN orderId VARCHAR(20), IN newStatus VARCHAR(20))
BEGIN
  UPDATE `order`
  SET STATUS = newStatus
  WHERE id = orderId;
END //
DELIMITER ;


CALL UpdateOrderStatus ('250515007', 'terkirim');



