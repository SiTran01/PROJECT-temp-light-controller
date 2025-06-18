import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import TempLightBlock from '../components/TempLightBlock';
import FanControlBlock from '../components/FanControlBlock';
import AdjTempBlock from '../components/AdjTempBlock';

const HomePage = () => {
  const [fanOn, setFanOn] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Fan Control Dashboard</Text>

      <TempLightBlock/>
      <AdjTempBlock />
      <FanControlBlock
        isOn={fanOn}
        onToggle={setFanOn}
      />

      {/* Thêm các block khác nếu cần */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 25, // ⬅️ tăng từ 24 lên 40
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
});

export default HomePage;
