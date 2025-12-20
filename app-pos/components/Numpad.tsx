import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

interface NumpadProps {
  onKeyPress: (value: string | number) => void;
}

export default function Numpad({ onKeyPress }: NumpadProps) {
  const keys = [1, 2, 3, 'C', 4, 5, 6,'←', 7, 8, 9, '', '00', 0, '000', '',];

  return (
    <View style={styles.container}>
      {keys.map((key, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.keyButton,
            key === 'C' ? styles.clearButton : null,
            key === '←' ? styles.backspaceButton : null
          ]}
          onPress={() => onKeyPress(key)}
        >
          <Text style={[
            styles.keyText,
            key === 'C' ? styles.clearText : null,
            key === '←' ? styles.backspaceText : null
          ]}>{key.toString()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 8,
  },
  keyButton: {
    width: '23%',
    height: 50,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  clearText: {
    color: '#dc2626',
  },
  backspaceButton: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  backspaceText: {
    color: '#0284c7',
  },
});
