import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // Cho phép truy cập từ các thiết bị khác trong mạng LAN
    port: 5173    // Nếu muốn, có thể khai báo port cố định
  }
})
