import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useESPStatus from '../api/ESPDataRead'; // 👈 Import custom hook
import { sendThresholds } from '../api/ESPDataWrite';


const AdjTempBlock = () => {

  const handleIncreaseTemp2 = async () => {
  if (!espData) {return;}

  const newTemp2 = espData.Temp2 + 2;

  await sendThresholds({
    temp2: newTemp2,
    temp3: espData.Temp3,
    isManual: espData.isManual,
    fanLevel: espData.fanLevel,
  });
};

const handleIncreaseTemp3 = async () => {
  if (!espData) {return;}

  const newTemp3 = espData.Temp3 + 2;

  await sendThresholds({
    temp2: espData.Temp2,
    temp3: newTemp3,
    isManual: espData.isManual,
    fanLevel: espData.fanLevel,
  });
};

  const { espData } = useESPStatus();

  const temp2 = espData?.Temp2 ?? '--';
  const temp3 = espData?.Temp3 ?? '--';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adjustable Temperature</Text>

      {/* Temp 2 */}
      <View style={styles.block}>
        <View style={styles.leftSection}>
          <Icon name="thermometer" size={30} color="#e67e22" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Temp 2</Text>
            <Text style={styles.value}>{temp2}°C</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleIncreaseTemp2}>
          <Text style={styles.buttonText}>+2</Text>
        </TouchableOpacity>
      </View>

      {/* Temp 3 */}
      <View style={styles.block}>
        <View style={styles.leftSection}>
          <Icon name="thermometer" size={30} color="#e67e22" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Temp 3</Text>
            <Text style={styles.value}>{temp3}°C</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleIncreaseTemp3}>
          <Text style={styles.buttonText}>+2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f5e9', // Nền xanh nhạt nhẹ nhàng
    margin: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#34A853', // Viền xanh lá
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Bóng đổ Android
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
    color: '#2e7d32', // Đậm hơn chút
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9', // viền nhẹ cho từng block
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20,
  },
  textContainer: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    color: '#555',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d32f2f', // đỏ đậm hơn
  },
  button: {
    backgroundColor: '#388e3c',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});


export default AdjTempBlock;
