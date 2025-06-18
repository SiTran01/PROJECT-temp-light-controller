
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useESPStatus from '../api/ESPDataRead'; // 👈 Import custom hook

const TempLightBlock = () => {
  const { espData, loading, error } = useESPStatus();

  const temperature = espData?.temperature ?? 0;
  const light = espData?.light ?? 0;

  return (
    <View style={styles.container}>
      {/* Temp */}
      <View style={styles.block}>
        <View style={styles.row}>
          <Icon name="thermometer" size={30} color="#e74c3c" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Temp</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#999" />
            ) : (
              <Text style={styles.value}>
                {temperature}
                <Text style={styles.unit}> °C</Text>
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Light */}
      <View style={styles.block}>
        <View style={styles.row}>
          <Icon name="white-balance-sunny" size={30} color="#f1c40f" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Light</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#999" />
            ) : (
              <Text style={styles.value}>
                {light}
                <Text style={styles.unit}> %</Text>
              </Text>
            )}
          </View>
        </View>
      </View>

      {error && (
        <Text style={styles.errorText}>ESP32 connection failed</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  block: {
    width: '45%',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,

    // Viền & bóng đổ tinh tế
    borderWidth: 1,
    borderColor: '#cdd9ed', // xanh-xám hiện đại
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,

    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  unit: {
    fontSize: 16,
    fontWeight: '400',
    color: '#7f8c8d',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500',
  },
});


export default TempLightBlock;

