
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
    padding: 10,
  },
  block: {
    width: '45%',
    backgroundColor: '#f2f2f2',
    padding: 16,
    margin: 8,
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 16,
    fontWeight: '400',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default TempLightBlock;

