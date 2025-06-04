export const updateControlState = async (temp2, temp3, isManual, fanLevel) => {
  try {
    const response = await fetch('http://192.168.0.148/set-thresholds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ temp2, temp3, isManual, fanLevel })
    });

    if (!response.ok) throw new Error("Lỗi khi gửi dữ liệu");
    return await response.json();
  } catch (err) {
    console.error("Gửi thất bại:", err);
    return null;
  }
};
