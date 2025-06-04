import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useESPStatus from '../api/ESPDataRead'; // 👈 Import custom hook
import { sendThresholds } from '../api/ESPDataWrite';


const AdjTempBlock = () => {

  const handleIncreaseTemp2 = async () => {
  if (!espData) return;

  const newTemp2 = espData.Temp2 + 2;

  await sendThresholds({
    temp2: newTemp2,
    temp3: espData.Temp3,
    isManual: espData.isManual,
    fanLevel: espData.fanLevel,
  });
};

const handleIncreaseTemp3 = async () => {
  if (!espData) return;

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
    backgroundColor: '#fefefe',
    margin: 10,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#f2f2f2',
    paddingVertical: 20, // ⬆️ Cao thêm
    paddingHorizontal: 16, // ⬅️ Thêm padding để icon & button không sát biên
    borderRadius: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20, // ⬆️ Tăng khoảng cách icon - text
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
    fontSize: 18,
    fontWeight: '700',
    color: '#e53935', // ⬅️ Màu đỏ hồng cho giá trị
  },
  button: {
    backgroundColor: '#34A853',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdjTempBlock;
