import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from "fs";
import loginUser ,{  createOrder, 
  getBarang, getOrder, 
  getPendingOrders, 
  updateOrderStatus,
   getUser, insertUser, 
   deleteUser, deleteBarang, 
   editBarang, editUser, 
   insertBarang,  
   getDetailNota, 
   getAllOrder, 
   getAllOrderDetail, 
   getDetailOrder,
   getOrderById, 
   updateJumlahBarangOrderDetail, 
   updateOrderNamaPembeli, 
   createNota,
   getAllNota,
   getAllPengiriman,
   getOmzetByHari,
   getNotaById,
   getOrderByIdAdmin,
   getPengirimanById} from './model.js';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// PENGISIAN HANDLER
ipcMain.handle('login-user', async (event, username, password) => {
  try {
    const result = await loginUser(username, password);
    return result;  // objek user { username, status } atau null
  } catch (error) {
    console.error(error);
    return null; // atau kirim pesan error sesuai kebutuhan
  }
});

// ADMIN
ipcMain.handle('getUser', getUser);
ipcMain.handle("insertUser", insertUser);
ipcMain.handle("deleteUser", deleteUser);
ipcMain.handle("editUser", editUser);

ipcMain.handle("insertBarang", insertBarang);
ipcMain.handle("editBarang", editBarang);
ipcMain.handle("deleteBarang", deleteBarang);

ipcMain.handle('getAllNota', getAllNota);
ipcMain.handle('getNotaById', getNotaById);
ipcMain.handle('getDetailNota', getDetailNota);
ipcMain.handle('getAllOrder', getAllOrder);
ipcMain.handle('getOmzetByHari', getOmzetByHari);
ipcMain.handle('getAllOrderDetail', getAllOrderDetail);
ipcMain.handle('getOrderByIdAdmin', getOrderByIdAdmin);
ipcMain.handle('getDetailOrder', getDetailOrder);
ipcMain.handle('getAllPengiriman', getAllPengiriman);
ipcMain.handle('getPengirimanById', getPengirimanById);


// KASIR
ipcMain.handle('createNota', async (event, { total, keranjang }) => {
  try {
    const { notaId } = await createNota({ hargaTotal: total, keranjang });
    return { success: true, notaId };
  } catch (err) {
    return { success: false, message: err.message };
  }
});



// PENGIRIMAN 
ipcMain.handle('getOrder', getOrder)
ipcMain.handle('getBarang', getBarang)
ipcMain.handle('createOrder', async (event, { namaPembeli, total, keranjang }) => {
  try {
    const orderId = await createOrder(namaPembeli, total, keranjang);
    return { success: true, orderId };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
ipcMain.handle('get-pending-orders', async () => {
  return await getPendingOrders();
});

// ✅ Handler untuk update status order
ipcMain.handle('update-order-status', async (event, id, status,pengirim) => {
  try {
    await updateOrderStatus(id, status, pengirim);
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('get-order-by-id', async (event, idOrder) => {
  return await getOrderById(idOrder);
});

ipcMain.handle('updateJumlahBarangOrderDetail', async (event, idOrder, namaBarang, jumlahBaru) => {
  return await updateJumlahBarangOrderDetail(idOrder, namaBarang, jumlahBaru); // Fungsi backend Node.js
});

ipcMain.handle('update-nama-pembeli', async (event, idOrder, namaPembeli,totalHarga) => {
  return await updateOrderNamaPembeli(idOrder, namaPembeli, totalHarga);
});

ipcMain.handle("printReport", function (event) {
      const savePath = dialog.showSaveDialogSync({
        title: "Save report",
        defaultPath: "report.pdf",
      });
      if (savePath) {
        const win = BrowserWindow.fromWebContents(event.sender);
        win.webContents
          .printToPDF({ printBackground: true, pageSize: "A4" })
          .then((data) => {
            fs.writeFile(savePath, data, (error) => {
              if (error) throw error;
              console.log(`Report successfully saved in ${savePath}`);
            });
          })
          .catch((err) => {
            throw err;
          });
      }
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
