  import React, { useEffect, useRef, useCallback } from 'react';
  import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import useESPStatus from '../api/ESPDataRead';
  import { sendThresholds } from '../api/ESPDataWrite';

  const FanControlBlock: React.FC = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const isSpinning = useRef(false);
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    const { espData, loading } = useESPStatus();
    const isDataReady = !!espData && !loading;

    const fanSpeed = espData?.fanLevel ?? 0;
    const isManual = espData?.isManual ?? false;

    const toggleMode = async () => {
      if (!isDataReady) {return;}

      const newManual = !espData.isManual;

      await sendThresholds({
        temp2: espData.Temp2,
        temp3: espData.Temp3,
        fanLevel: espData.fanLevel,
        isManual: newManual,
      });
    };

    const changeFanLevel = async (delta: number) => {
      if (!isDataReady) {return;}

      const newLevel = Math.max(0, Math.min(3, espData.fanLevel + delta));

      await sendThresholds({
        temp2: espData.Temp2,
        temp3: espData.Temp3,
        fanLevel: newLevel,
        isManual: espData.isManual,
      });
    };

    const startRotation = useCallback(() => {
      if (isSpinning.current || fanSpeed === 0) {
        return;
      }

      const duration = fanSpeed === 1 ? 1000 : fanSpeed === 2 ? 500 : 100;
      rotateAnim.setValue(0);
      isSpinning.current = true;

      animationRef.current = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animationRef.current.start();
    }, [fanSpeed, rotateAnim]);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    isSpinning.current = false;

    if (isManual && fanSpeed > 0) {
      startRotation();
    } else {
      // Quạt dừng => mượt mà đưa icon về góc ban đầu
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300, // 300ms đưa về vị trí gốc
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fanSpeed, isManual, startRotation]);


    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.block}>
        <View style={styles.iconContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name="fan" size={100} color="#4285F4" />
          </Animated.View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.title}>Mode</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleMode}
            disabled={!isDataReady}
          >
            <Text style={styles.buttonText}>
              {isDataReady ? (isManual ? 'Manual' : 'Automatic') : 'Loading...'}
            </Text>
          </TouchableOpacity>
        </View>

        {isManual && (
          <View style={styles.bottomRow}>
            <Text style={styles.subLabel}>Fan-Level</Text>
            <View style={styles.fanControlRow}>
              <TouchableOpacity
                style={[styles.subButton, { backgroundColor: '#EA4335', marginRight: 5 }]}
                onPress={() => changeFanLevel(-1)}
                disabled={!isDataReady}
              >
                <Text style={styles.subButtonText}>-</Text>
              </TouchableOpacity>

              <View style={[styles.subButton, styles.centerFanLevel]}>
                <Text style={styles.subButtonText}>
                  {isDataReady ? (fanSpeed === 0 ? 'OFF' : fanSpeed) : '...'}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.subButton, { backgroundColor: '#4285F4', marginLeft: 5 }]}
                onPress={() => changeFanLevel(1)}
                disabled={!isDataReady}
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
  backgroundColor: '#e8f0fe', // Màu nền xanh dương nhạt
  padding: 16,
  marginVertical: 10,
  borderRadius: 16,

  // Viền nổi bật
  borderWidth: 2,
  borderColor: '#3367D6', // Xanh dương đậm hơn để tương phản

  // Bóng đổ để tạo chiều sâu
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 6,

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
    fanControlRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
    },
    centerFanLevel: {
      backgroundColor: '#34A853',
      minWidth: 50,
      alignItems: 'center',
    },
    subButtonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
    },
  });

  export default FanControlBlock;
