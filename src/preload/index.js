import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { createOrder, editUser } from '../main/model'

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

  getNota: () => ipcRenderer.invoke('getNota'),
  getDetailNota: (notaId) => ipcRenderer.invoke('getDetailNota', notaId),
  getAllOrder: () => ipcRenderer.invoke('getAllOrder'),
  getDetailOrder: (orderId) => ipcRenderer.invoke('getDetailOrder', orderId),
  
  //kasir




  // Pengiriman
  getOrder: () => ipcRenderer.invoke('getOrder'),
  getBarang: () => ipcRenderer.invoke('getBarang'),
  createOrder: (namaPembeli, total, keranjang) => ipcRenderer.invoke('createOrder', { namaPembeli, total, keranjang }),
  getPendingOrders: () => ipcRenderer.invoke('get-pending-orders'),
  updateOrderStatus: (id, status) => ipcRenderer.invoke('update-order-status', id, status),
  getOrderById: (idOrder) => ipcRenderer.invoke('get-order-by-id', idOrder),
  updateJumlahBarangOrderDetail: (idOrder, namaBarang, jumlahBaru) => 
    ipcRenderer.invoke('updateJumlahBarangOrderDetail', idOrder, namaBarang, jumlahBaru),
  updateOrderNamaPembeli: (idOrder, namaPembeli, totalHarga) =>
    ipcRenderer.invoke('update-nama-pembeli', idOrder, namaPembeli, totalHarga),

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
