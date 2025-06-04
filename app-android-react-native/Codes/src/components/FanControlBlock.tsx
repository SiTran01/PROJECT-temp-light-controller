import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useESPStatus from '../api/ESPDataRead';
import { sendThresholds } from '../api/ESPDataWrite';

const FanControlBlock: React.FC = () => {

  const toggleMode = async () => {
  if (!espData) return;

  const newManual = !espData.isManual;

  await sendThresholds({
    temp2: espData.Temp2,
    temp3: espData.Temp3,
    fanLevel: espData.fanLevel,
    isManual: newManual,
  });
};

const changeFanLevel = async (delta: number) => {
  if (!espData) return;

  const newLevel = Math.max(0, Math.min(3, espData.fanLevel + delta)); // giữ trong khoảng 0–3

  await sendThresholds({
    temp2: espData.Temp2,
    temp3: espData.Temp3,
    fanLevel: newLevel,
    isManual: espData.isManual,
  });
};


  const { espData, loading } = useESPStatus();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const fanSpeed = espData?.fanLevel ?? 0;
  const isManual = espData?.isManual ?? false;

  const startRotation = useCallback(() => {
    const duration = fanSpeed === 1 ? 1000 : fanSpeed === 2 ? 500 : 100;
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [fanSpeed, rotateAnim]);

  useEffect(() => {
  if (fanSpeed === 0) {
    rotateAnim.stopAnimation();
    rotateAnim.setValue(0);
  } else {
    startRotation();
  }
}, [fanSpeed, startRotation]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (loading || !espData) {
    return <Text style={styles.loading}>Đang tải dữ liệu quạt...</Text>;
  }

  return (
    <View style={styles.block}>
      <View style={styles.iconContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Icon name="fan" size={100} color="#4285F4" />
        </Animated.View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.title}>Mode</Text>
        <TouchableOpacity style={styles.button} onPress={toggleMode}>
          <Text style={styles.buttonText}>{isManual ? 'Manual' : 'Automatic'}</Text>
        </TouchableOpacity>
      </View>

      {isManual && (
        <View style={styles.bottomRow}>
        <Text style={styles.subLabel}>Fan-Level</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: '#EA4335', marginRight: 5 }]}
            onPress={() => changeFanLevel(-1)}
          >
            <Text style={styles.subButtonText}>-</Text>
          </TouchableOpacity>
          <View style={[styles.subButton, { backgroundColor: '#34A853' }]}>
            <Text style={styles.subButtonText}>
              {fanSpeed === 0 ? 'OFF' : fanSpeed}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: '#4285F4', marginLeft: 5 }]}
            onPress={() => changeFanLevel(1)}
          >
            <Text style={styles.subButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    width: '95%',
    backgroundColor: '#e8f0fe',
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 2,
    alignSelf: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 19,
  },
  subLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginLeft: 20,
  },
  subButton: {
    backgroundColor: '#34A853',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 20,
  },
  subButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});

export default FanControlBlock;
