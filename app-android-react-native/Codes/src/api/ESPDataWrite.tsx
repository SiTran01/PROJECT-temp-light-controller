const ESP32_IP = 'http://192.168.0.148';

/**
 * Gửi toàn bộ cấu hình xuống ESP32
 */
export const sendThresholds = async ({
  temp2,
  temp3,
  isManual,
  fanLevel
}: {
  temp2: number;
  temp3: number;
  isManual: boolean;
  fanLevel: number;
}) => {
  try {
    const response = await fetch(`${ESP32_IP}/set-thresholds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        temp2,
        temp3,
        isManual,
        fanLevel
      })
    });

    return await response.json(); // { status: "success" } hoặc { error: "..." }
  } catch (error) {
    console.error('❌ Failed to send thresholds:', error);
    return { error };
  }
};
