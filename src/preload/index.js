import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { createNota, createOrder, editUser } from '../main/model'

// Custom APIs for renderer
const api = {
  loginUser: (username, password) => ipcRenderer.invoke('login-user', username, password),

  // Admin
  getUser: () => ipcRenderer.invoke('getUser'),
  insertUser: (username, password, status) =>
  ipcRenderer.invoke("insertUser", username, password, status),
  deleteUser: (id) => ipcRenderer.invoke("deleteUser", id),
  editUser: (username, password, status, id) =>
  ipcRenderer.invoke("editUser", username, password, status, id),

  insertBarang: (nama, harga, stok) =>
  ipcRenderer.invoke("insertBarang", nama, harga, stok),
  editBarang: (harga, stok, id) => 
  ipcRenderer.invoke("editBarang", harga, stok, id),
  deleteBarang: (id) => 
  ipcRenderer.invoke("deleteBarang", id),

  getAllNota: () => ipcRenderer.invoke('getAllNota'),
  getDetailNota: (idNota) => ipcRenderer.invoke('getDetailNota', idNota),
  getNotaById: (idNota) => ipcRenderer.invoke('getNotaById', idNota),
  getAllOrder: () => ipcRenderer.invoke('getAllOrder'),
  getAllOrderDetail: () => ipcRenderer.invoke('getAllOrderDetail'),
  getDetailOrder: (orderId) => ipcRenderer.invoke('getDetailOrder', orderId),
  getOrderByIdAdmin: (orderId) => ipcRenderer.invoke('getOrderByIdAdmin', orderId),
  getAllPengiriman: () => ipcRenderer.invoke('getAllPengiriman'),
  getPengirimanById: (idPengiriman) => ipcRenderer.invoke('getPengirimanById', idPengiriman),
  
  //kasir
  createNota: (total, keranjang) => ipcRenderer.invoke('createNota', { total, keranjang }),



  // Pengiriman
  getOrder: () => ipcRenderer.invoke('getOrder'),
  getBarang: () => ipcRenderer.invoke('getBarang'),
  createOrder: (namaPembeli, total, keranjang) => ipcRenderer.invoke('createOrder', { namaPembeli, total, keranjang }),
  getPendingOrders: () => ipcRenderer.invoke('get-pending-orders'),
  updateOrderStatus: (id, status, pengirim) => ipcRenderer.invoke('update-order-status', id, status, pengirim),
  getOrderById: (idOrder) => ipcRenderer.invoke('get-order-by-id', idOrder),
  updateJumlahBarangOrderDetail: (idOrder, namaBarang, jumlahBaru) => 
    ipcRenderer.invoke('updateJumlahBarangOrderDetail', idOrder, namaBarang, jumlahBaru),
  updateOrderNamaPembeli: (idOrder, namaPembeli, totalHarga) =>
    ipcRenderer.invoke('update-nama-pembeli', idOrder, namaPembeli, totalHarga),


  printReport: function () {
    return ipcRenderer.invoke("printReport");
  },
}

// Expose API
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
