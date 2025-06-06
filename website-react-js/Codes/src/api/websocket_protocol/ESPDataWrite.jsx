let socket = null;
let reconnectInterval = null;
let lastPayload = null;
let hasReconnected = false;

export const initWebSocket = (ip = '192.168.0.148') => {
  const connect = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("ℹ️ WebSocket đã kết nối, không cần tạo lại");
      return;
    }

    socket = new WebSocket(`ws://${ip}:81`);

    socket.onopen = () => {
      console.log("✅ WebSocket đã kết nối");

      if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
      }

      // Nếu đã từng reconnect, reload lại trang để đảm bảo web sạch
      if (hasReconnected) {
        console.log("🔄 WebSocket reconnect => Reload lại trang");
        window.location.reload();
      } else {
        hasReconnected = true;
      }

      // (Tùy chọn) Gửi lại payload sau reconnect
      if (lastPayload) {
        setTimeout(() => {
          console.log("📤 Gửi lại trạng thái gần nhất sau reconnect");
          socket.send(lastPayload);
        }, 500);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket lỗi:", err);
      socket.close();
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket đã đóng. Đang thử kết nối lại...");
      if (!reconnectInterval) {
        reconnectInterval = setInterval(() => {
          console.log("🔁 Thử kết nối lại WebSocket...");
          connect();
        }, 3000);
      }
    };
  };

  connect();
};

export const updateControlState = (temp2, temp3, isManual, fanLevel) => {
  lastPayload = JSON.stringify({ temp2, temp3, isManual, fanLevel });

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(lastPayload);
    console.log("📤 Gửi WebSocket:", lastPayload);
  } else {
    console.warn("⚠️ WebSocket chưa sẵn sàng. Hãy chắc chắn đã gọi initWebSocket()");
  }
};
