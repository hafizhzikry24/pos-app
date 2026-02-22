import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { itemService } from '@/services/itemService';
import { freeItemService, FreeItem, CheckEligibilityRequest } from '@/services/freeItemService';
import { receiptService, ReceiptData } from '@/services/receiptService';
import { DisplayService } from '@/services/displayService';
import { useAuth } from '@/context/AuthContext';

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
  const { total, memberId, memberPhone, cartData } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const totalAmount = Number(total) || 0;

  // Parse cart data
  const cart = cartData ? JSON.parse(cartData as string) : [];

  const [cashReceived, setCashReceived] = useState(0);
  const [eligibleFreeItems, setEligibleFreeItems] = useState<FreeItem[]>([]);
  const [selectedFreeItems, setSelectedFreeItems] = useState<number[]>([]);
  const [selectedSelectableItems, setSelectedSelectableItems] = useState<{freeItemId: number, itemId: number}[]>([]);
  const [isLoadingFreeItems, setIsLoadingFreeItems] = useState(false);
  const [hasMember] = useState(!!memberId);

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

  // Update dual display with cart and free items
  const updateDualDisplay = async () => {
    if (!process.env.EXPO_PUBLIC_DUAL_SCREEN) return;
    
    try {
      // Combine cart items with selected free items
      const displayItems = [
        ...cart.map((item: any) => ({
          item: item.item,
          quantity: item.quantity
        })),
        ...selectedSelectableItems.map((selection: {freeItemId: number, itemId: number}) => {
          const freeItem = eligibleFreeItems.find(item => item.id === selection.freeItemId);
          const selectableItem = freeItem?.selectable_items?.find(item => item.id === selection.itemId);
          
          return {
            item: {
              ...selectableItem,
              price: 0, // Free items have 0 price
              is_free_item: true
            },
            quantity: 1
          };
        })
      ];
      
      await DisplayService.updateCart(displayItems);
    } catch (error) {
      console.log('Failed to update dual display:', error);
    }
  };

  // Update dual display when free items selection changes
  useEffect(() => {
    updateDualDisplay();
  }, [selectedSelectableItems, selectedFreeItems]);

  // Check free item eligibility when component mounts or when member/cart changes
  useEffect(() => {
    if (hasMember && cart.length > 0) {
      checkFreeItemEligibility();
    } else {
      setEligibleFreeItems([]);
      setSelectedFreeItems([]);
      setSelectedSelectableItems([]);
    }
  }, [hasMember, cart.length]); // Only depend on hasMember and cart.length, not totalAmount

  const checkFreeItemEligibility = async () => {
    if (!hasMember || cart.length === 0) return;

    setIsLoadingFreeItems(true);
    try {
      const eligibilityRequest: CheckEligibilityRequest = {
        purchase_amount: totalAmount,
        cart_items: cart.map((item: any) => ({
          item_id: item.item.id,
          quantity: item.quantity
        }))
      };

      const response = await freeItemService.checkEligibility(eligibilityRequest);
      setEligibleFreeItems(response.eligible_free_items);
    } catch (error) {
      console.error('Failed to check free item eligibility:', error);
      setEligibleFreeItems([]);
    } finally {
      setIsLoadingFreeItems(false);
    }
  };

  const toggleFreeItem = (freeItemId: number) => {
    const freeItem = eligibleFreeItems.find(item => item.id === freeItemId);
    
    if (!freeItem || !freeItem.selectable_items || freeItem.selectable_items.length === 0) {
      console.log('No selectable items found for free item:', freeItemId);
      return;
    }
    
    // Check if any items from this free item are currently selected
    const hasSelectedItems = selectedSelectableItems.some(item => item.freeItemId === freeItemId);
    
    if (hasSelectedItems) {
      // Remove all items from this free item
      setSelectedSelectableItems(prev => prev.filter(item => item.freeItemId !== freeItemId));
      setSelectedFreeItems(prev => prev.filter(id => id !== freeItemId));
    } else {
      // Add ALL selectable items
      console.log('Adding ALL items to free item:', freeItemId);
      const allItems = freeItem.selectable_items.map(item => ({ freeItemId, itemId: item.id }));
      console.log('Items to add:', allItems);
      setSelectedSelectableItems(prev => [...prev, ...allItems]);
      setSelectedFreeItems(prev => [...prev, freeItemId]);
    }
  };

  const toggleSelectableItem = (freeItemId: number, itemId: number) => {
    setSelectedSelectableItems(prev => {
      const exists = prev.some(item => item.freeItemId === freeItemId && item.itemId === itemId);
      let newSelection;
      if (exists) {
        newSelection = prev.filter(item => !(item.freeItemId === freeItemId && item.itemId === itemId));
      } else {
        newSelection = [...prev, { freeItemId, itemId }];
      }
            
      // Also update selectedFreeItems - if there are any selectable items selected, add the free item
      const hasSelectedItems = newSelection.some(item => item.freeItemId === freeItemId);
      setSelectedFreeItems(prevFreeItems => {
        if (hasSelectedItems && !prevFreeItems.includes(freeItemId)) {
          const updated = [...prevFreeItems, freeItemId];
          return updated;
        } else if (!hasSelectedItems && prevFreeItems.includes(freeItemId)) {
          const updated = prevFreeItems.filter(id => id !== freeItemId);
          return updated;
        }
        return prevFreeItems;
      });
      
      return newSelection;
    });
  };


  const confirmPayment = async () => {
    if (change < 0) {
      Alert.alert("Insufficient Payment", "Please enter a valid amount.");
      return;
    }

    try {
      if (!user) {
        Alert.alert("Error", "User session not found.");
        return;
      }

      // Handle potential stale user object if it's still wrapped in 'data'
      const cashierId = user.id || user.data?.id;
      const locationId = user.location_id || user.data?.location_id;

      if (!cashierId || !locationId) {
        console.log("Stale or incomplete user object:", user);
        Alert.alert("Error", "Incomplete user profile. Please try to logout and login again.");
        return;
      }

      const receiptNumber = `RCP-${Date.now()}`;

      // // Debug: Log the current state
      // console.log('=== Debug Info ===');
      // console.log('Cart:', cart);
      // console.log('Selected Free Items:', selectedFreeItems);
      // console.log('Selected Selectable Items:', selectedSelectableItems);
      // console.log('Eligible Free Items:', eligibleFreeItems);
      // console.log('Has Member:', hasMember);
      // console.log('Member ID:', memberId);

      const receiptData: ReceiptData = {
        number: receiptNumber,
        location_id: locationId,
        cashier_id: cashierId,
        customer_id: memberId ? Number(memberId) : null,
        total_amount: totalAmount,
        discount_amount: 0,
        tax_amount: 0,
        payable_amount: cashReceived, // What customer actually pays
        change_amount: change >= 0 ? change : 0, // Change to give back
        payment_method: 'cash', // Default to cash for now
        note: 'POS transaction',
        items: [
          ...cart.map((item: any) => ({
            item_id: item.item.id,
            name: item.item.name,
            quantity: item.quantity,
            price: item.item.price,
            discount: 0,
            total: item.item.price * item.quantity,
            is_free_item: false
          })),
          // Add selected free items
          ...selectedSelectableItems.map((selection: {freeItemId: number, itemId: number}) => {
            const freeItem = eligibleFreeItems.find(item => item.id === selection.freeItemId);
            const selectableItem = freeItem?.selectable_items?.find(item => item.id === selection.itemId);
            
            const freeItemData = {
              item_id: selectableItem?.id || 0,
              name: selectableItem?.name || freeItem?.name || 'Free Item',
              quantity: 1,
              price: 0,
              discount: 0,
              total: 0,
              is_free_item: true
            };
            
            console.log('Creating free item:', freeItemData);
            return freeItemData;
          })
        ]
      };

      // console.log('Final receipt data:', receiptData);
      // console.log('===================');

      await receiptService.create(receiptData);

      // Clear the dual screen display after successful payment
      try {
        await DisplayService.updateCart([]);
      } catch (error) {
        console.log('Failed to clear secondary display:', error);
      }

      Alert.alert("Success", "Transaction completed!", [
        {
          text: "OK",
          onPress: () => {
            router.replace({ pathname: "/", params: { refresh: Date.now().toString() } });
          }
        }
      ]);
    } catch (error: any) {
      console.error('Payment Error:', error);

      let errorMessage = "Failed to process transaction.";
      if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.message || errorMessage;

        // If there are validation errors, append them
        if (data.errors) {
          const firstErrorField = Object.keys(data.errors)[0];
          const firstErrorMessage = data.errors[firstErrorField][0];
          errorMessage = `${errorMessage}\n\n${firstErrorMessage}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
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

        {/* Free Items Section */}
        <View style={[styles.freeItemsSection, !hasMember && styles.freeItemsSectionDisabled]}>
          <Text style={styles.freeItemsTitle}>
            <Ionicons name="gift-outline" size={16} color={hasMember ? '#2563eb' : '#9ca3af'} />
            {' '}Free Items {hasMember ? '' : '(Member Required)'}
          </Text>

          {!hasMember ? (
            <View style={styles.freeItemsDisabled}>
              <Text style={styles.freeItemsDisabledText}>
                Scan a member to unlock free items
              </Text>
            </View>
          ) : isLoadingFreeItems ? (
            <View style={styles.freeItemsLoading}>
              <Text style={styles.freeItemsLoadingText}>Checking eligibility...</Text>
            </View>
          ) : eligibleFreeItems.length === 0 ? (
            <View style={styles.freeItemsEmpty}>
              <Text style={styles.freeItemsEmptyText}>No free items available for this purchase</Text>
            </View>
          ) : (
            <View style={styles.freeItemsList}>
              {eligibleFreeItems.map((freeItem) => (
                <TouchableOpacity
                  key={freeItem.id}
                  style={[
                    styles.freeItemCard,
                    selectedFreeItems.includes(freeItem.id) && styles.freeItemCardSelected
                  ]}
                  onPress={() => toggleFreeItem(freeItem.id)}
                >
                  <View style={styles.freeItemHeader}>
                    <Text style={styles.freeItemName}>{freeItem.name}</Text>
                    <View style={styles.freeItemCheckbox}>
                      {selectedFreeItems.includes(freeItem.id) && (
                        <Ionicons name="checkmark-circle" size={20} color="#2563eb" />
                      )}
                    </View>
                  </View>
                  <Text style={styles.freeItemDescription}>
                    {freeItem.description || 'Special free item offer'}
                  </Text>
                  <View style={styles.selectableItemsContainer}>
                    <Text style={styles.selectableItemsTitle}>Choose items:</Text>
                    {freeItem.selectable_items?.map((item: any) => {
                      const isSelected = selectedSelectableItems.some(
                        selection => selection.freeItemId === freeItem.id && selection.itemId === item.id
                      );
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.selectableItemRow}
                          onPress={() => toggleSelectableItem(freeItem.id, item.id)}
                        >
                          <View style={styles.selectableItemCheckbox}>
                            {isSelected && (
                              <Ionicons name="checkmark-circle" size={16} color="#2563eb" />
                            )}
                          </View>
                          <Text style={styles.selectableItemName}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <Text style={styles.freeItemRequirement}>
                    Required: RP {freeItem.required_purchase_amount.toLocaleString('id-ID')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  // Free Items Section Styles
  freeItemsSection: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  freeItemsSectionDisabled: {
    opacity: 0.5,
    backgroundColor: '#f9fafb',
  },
  freeItemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeItemsDisabled: {
    padding: 20,
    alignItems: 'center',
  },
  freeItemsDisabledText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  freeItemsLoading: {
    padding: 20,
    alignItems: 'center',
  },
  freeItemsLoadingText: {
    fontSize: 14,
    color: '#2563eb',
    textAlign: 'center',
  },
  freeItemsEmpty: {
    padding: 20,
    alignItems: 'center',
  },
  freeItemsEmptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  freeItemsList: {
    gap: 12,
  },
  freeItemCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  freeItemCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  freeItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  freeItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  freeItemCheckbox: {
    padding: 4,
  },
  freeItemDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  freeItemRequirement: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  selectableItemsContainer: {
    marginVertical: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
  },
  selectableItemsTitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  selectableItemName: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 2,
  },
  selectableItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    marginBottom: 4,
  },
  selectableItemCheckbox: {
    marginRight: 8,
    padding: 2,
  },
  numpad: {},
});
