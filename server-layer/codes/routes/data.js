// routes/data.js
const express = require('express');
const router = express.Router();
const mqttClient = require('../mqttClient');
const { getLastData } = require('../mqttClient');

// GET /api/status - Lấy dữ liệu mới nhất từ ESP32 (qua MQTT)
router.get('/status', (req, res) => {
  const data = getLastData();
  res.json(data);
});

// POST /api/control - Gửi lệnh điều khiển xuống ESP32
router.post('/control', (req, res) => {
  const controlData = req.body;

  if (!controlData || typeof controlData !== 'object') {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }

  // Publish tới topic điều khiển
  mqttClient.publish('iot/device1/control', JSON.stringify(controlData), (err) => {
    if (err) {
      console.error('❌ Lỗi khi publish MQTT:', err);
      return res.status(500).json({ message: 'Gửi lệnh thất bại' });
    }

    console.log('✅ Đã gửi điều khiển:', controlData);
    res.json({ message: 'Đã gửi điều khiển', data: controlData });
  });
});

module.exports = router;
