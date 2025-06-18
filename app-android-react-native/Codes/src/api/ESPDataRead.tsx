import { useEffect, useState } from 'react';

interface ESPData {
  // Bạn có thể định nghĩa cấu trúc dữ liệu của ESP trả về tại đây nếu biết rõ
  // Ví dụ:
  // temperature: number;
  // humidity: number;
  // light: number;
  [key: string]: any; // Tạm thời chấp nhận bất cứ dữ liệu gì
}

export default function useESPStatus() {
  const [espData, setEspData] = useState<ESPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchESPStatus = async () => {
    try {
      const response = await fetch('https://smarthomeworld.cyou/api/status');
      const data: ESPData = await response.json();
      setEspData(data);
      setError(null); // reset lỗi nếu request thành công
    } catch (err) {
      console.error('Lỗi kết nối ESP32:', err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchESPStatus(); // gọi lần đầu
    const interval = setInterval(fetchESPStatus, 1000); // gọi mỗi 1 giây
    return () => clearInterval(interval); // clear khi component bị unmount
  }, []);

  return { espData, loading, error };
}
