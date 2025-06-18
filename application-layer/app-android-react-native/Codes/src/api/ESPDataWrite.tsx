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
    const response = await fetch(`https://smarthomeworld.cyou/api/control`, {
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

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status} - ${errText}`);
    }

    return await response.json(); // ví dụ: { status: "success" }
  } catch (error) {
    console.error('❌ Failed to send thresholds:', error);

    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: String(error) };
  }
};
