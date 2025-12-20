import { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { itemService } from '@/services/itemService';

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const formatNumber = (amount: number) => {
  if (amount >= 1000) {
    return `+${amount / 1000}k`;
  }
  return `+${amount}`;
};

export default function ModalScreen() {
  const { total } = useLocalSearchParams();
  const router = useRouter();
  const totalAmount = Number(total) || 0;

  const [cashReceived, setCashReceived] = useState(0);

  const denominations = [10000, 20000, 50000, 100000];

  const handlePayment = (amount: number) => {
    setCashReceived(amount);
  };

  const handleNumpadPress = (value: string | number) => {
    if (value === 'C') {
      setCashReceived(0);
    } else if (value === '←') {
      setCashReceived(prev => Math.floor(prev / 10));
    } else if (typeof value === 'number') {
      setCashReceived(prev => (prev * 10) + value);
    }
  };

  const change = cashReceived - totalAmount;

  // Placeholder for cart - in a real app this would come from context/store
  const cart: any[] = [];
  const clearCart = () => { };

  const confirmPayment = async () => {
    if (change < 0) {
      Alert.alert("Insufficient Payment", "Please enter a valid amount.");
      return;
    }

    try {
      await itemService.processTransaction(
        // {
        //   items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        //   total_amount: totalAmount,
        //   cash_received: cashReceived,
        //   change_amount: change
        // }
      );
      clearCart();
      Alert.alert("Success", "Transaction completed!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      // Fallback for demo if API fails or is not implemented
      Alert.alert("Success", "Transaction completed (Demo)!", [{ text: "OK", onPress: () => router.back() }]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Total: {formatCurrency(totalAmount)}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cash Received:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cashReceived.toString()}
            editable={false}
          />
        </View>

        <View style={styles.QuickMoneyContainer}>
          {denominations.map((amount) => (
            <TouchableOpacity key={amount} style={styles.moneyButton} onPress={() => handlePayment(amount)}>
              <Text style={styles.moneyButtonText}>{formatNumber(amount)}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.moneyButton, styles.exactButton]} onPress={() => handlePayment(totalAmount)}>
            <Text style={[styles.moneyButtonText, styles.exactButtonText]}>{formatCurrency(totalAmount)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.numpadContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '←'].map((key, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.numpadButton,
                key === 'C' ? styles.clearButton : null,
                key === '←' ? styles.backspaceButton : null
              ]}
              onPress={() => handleNumpadPress(key)}
            >
              <Text style={[
                styles.numpadText,
                key === 'C' ? styles.clearText : null,
                key === '←' ? styles.backspaceText : null
              ]}>{key.toString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.changeContainer}>
          <Text style={[styles.changeText, change < 0 ? styles.errorText : null]}>
            Change: {formatCurrency(change)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmButton, change < 0 && styles.disabledButton]}
          onPress={confirmPayment}
          disabled={change < 0}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlign: 'right',
  },
  QuickMoneyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  moneyButton: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exactButton: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  moneyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  exactButtonText: {
    color: '#2563eb',
  },
  numpadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  numpadButton: {
    width: '30%',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numpadText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearButton: {
    backgroundColor: '#fef2f2',
  },
  clearText: {
    color: '#dc2626',
  },
  backspaceButton: {
    backgroundColor: '#f0f9ff',
  },
  backspaceText: {
    color: '#0284c7',
  },
  changeContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  changeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  errorText: {
    color: '#dc2626',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#f3f4f6',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#9ca3af',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  numpad: {},
});
