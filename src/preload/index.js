import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { createOrder } from '../main/model'

// Custom APIs for renderer
const api = {
  loginUser: (username, password) => ipcRenderer.invoke('login-user', username, password),

  // Admin



  //kasir




  // Pengiriman
  getOrder: () => ipcRenderer.invoke('getOrder'),
  getBarang: () => ipcRenderer.invoke('getBarang'),
  createOrder: (namaPembeli, total, keranjang) => ipcRenderer.invoke('createOrder', { namaPembeli, total, keranjang }),
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
