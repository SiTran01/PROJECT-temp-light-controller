// broker.js
const aedes = require('aedes')();
const net = require('net');

const PORT = 1883;

const server = net.createServer(aedes.handle);
server.listen(PORT, () => {
  console.log(`✅ MQTT Broker (Aedes) đang chạy ở cổng ${PORT}`);
});

// Thêm các đoạn log dưới đây:
aedes.on('client', (client) => {
  console.log(`📥 Client kết nối: ${client.id}`);
});

aedes.on('clientDisconnect', (client) => {
  console.log(`❌ Client ngắt kết nối: ${client.id}`);
});

aedes.on('publish', (packet, client) => {
  if (client) {
    console.log(`📤 ${client.id} gửi đến topic '${packet.topic}': ${packet.payload.toString()}`);
  }
});
