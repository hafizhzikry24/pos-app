import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'error' | 'success' | 'info';
  onHide: () => void;
}

export default function Toast({ visible, message, type = 'error', onHide }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'close-circle';
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return '#dc2626';
      case 'success':
        return '#059669';
      case 'info':
        return '#2563eb';
      default:
        return '#2563eb';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return '#fef2f2';
      case 'success':
        return '#f0fdf4';
      case 'info':
        return '#eff6ff';
      default:
        return '#eff6ff';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: getBgColor(),
          borderColor: getIconColor(),
        }
      ]}
    >
      <Ionicons name={getIcon()} size={20} color={getIconColor()} />
      <Text style={[styles.message, { color: getIconColor() }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  message: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
