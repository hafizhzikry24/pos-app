import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { View, Text } from 'react-native'; // Standard RN components
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Item, itemService } from '@/services/itemService';
import { customerService, Customer } from '@/services/customerService';
import { DisplayService } from '@/services/displayService';
import { useAuth } from '@/context/AuthContext';
import Numpad from '@/components/Numpad';
import Toast from '@/components/Toast';
import MemberNumpadModal from '@/components/MemberNumpadModal';
import { useRouter } from 'expo-router';

export default function PosScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<{ item: Item; quantity: number }[]>([]);
  const [skuInput, setSkuInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' as 'error' | 'success' });
  const { token, logout } = useAuth();
  const router = useRouter();

  // Member scanning states
  const [memberPhone, setMemberPhone] = useState('');
  const [scannedMember, setScannedMember] = useState<Customer | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);

  useEffect(() => {
    if (token) {
      fetchItems();
      initializeSecondaryDisplay();
    }
  }, [token]);

  const initializeSecondaryDisplay = async () => {
    try {
      const hasMultiple = await DisplayService.hasMultipleDisplays();
      if (hasMultiple) {
        await DisplayService.showOnSecondaryDisplay();
      }
    } catch (error) {
      console.log('Secondary display not available:', error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemService.getAll();
      const activeItems = data.filter(i => i.is_active);
      setItems(activeItems);
      setFilteredItems(activeItems);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const addToCart = async (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      const newCart = existing 
        ? prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { item, quantity: 1 }];
      
      // Update secondary display
      updateSecondaryDisplay(newCart);
      return newCart;
    });
  };

  const removeFromCart = async (itemId: number) => {
    setCart(prev => {
      const newCart = prev.filter(i => i.item.id !== itemId);
      // Update secondary display
      updateSecondaryDisplay(newCart);
      return newCart;
    });
  };

  const updateQuantity = async (itemId: number, delta: number) => {
    setCart(prev => {
      const newCart = prev.map(i => {
        if (i.item.id === itemId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : i;
        }
        return i;
      });
      // Update secondary display
      updateSecondaryDisplay(newCart);
      return newCart;
    });
  };

  const updateSecondaryDisplay = async (cartData: { item: Item; quantity: number }[]) => {
    try {
      await DisplayService.updateCart(cartData);
    } catch (error) {
      console.log('Failed to update secondary display:', error);
    }
  };

  const handleSkuSubmit = () => {
    if (!skuInput) return;
    const item = items.find(i => i.sku_code === skuInput);
    if (item) {
      addToCart(item);
      setSkuInput('');
    } else {
      setToast({
        visible: true,
        message: `Item with SKU "${skuInput}" not found`,
        type: 'error'
      });
    }
  };

  const handleNumpadPress = (value: string | number) => {
    if (value === 'C') {
      setSkuInput('');
    } else if (value === '←') {
      setSkuInput(prev => prev.slice(0, -1));
    } else {
      setSkuInput(prev => prev + value.toString());
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);
  };

  const handlePay = () => {
    const total = calculateTotal();
    if (total === 0) return;

    // Pass cart and member info to payment modal
    const params: any = { total };
    if (scannedMember) {
      params.memberId = scannedMember.id;
      params.memberPhone = scannedMember.phone_number;
    }
    params.cartData = JSON.stringify(cart);

    router.push({ pathname: "/modal", params });
  };

  const handleMemberScan = async (phone: string) => {
    if (!phone.trim()) {
      setToast({
        visible: true,
        message: 'Please enter a phone number',
        type: 'error'
      });
      return;
    }

    setMemberLoading(true);
    try {
      const customer = await customerService.searchByPhone(phone.trim());
      if (customer) {
        setScannedMember(customer);
        setToast({
          visible: true,
          message: `Member found: ${customer.name}`,
          type: 'success'
        });
        setIsMemberModalVisible(false);
        setMemberPhone('');
      } else {
        setToast({
          visible: true,
          message: 'Member not found',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        visible: true,
        message: 'Failed to search member',
        type: 'error'
      });
    } finally {
      setMemberLoading(false);
    }
  };

  const clearMember = () => {
    setScannedMember(null);
    setMemberPhone('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      router.replace('/login');
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.itemCard} onPress={() => addToCart(item)}>
      <View style={styles.itemIconPlaceholder}>
        <Ionicons name="cube-outline" size={24} color="#666" />
      </View>
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
      <MemberNumpadModal
        visible={isMemberModalVisible}
        onClose={() => setIsMemberModalVisible(false)}
        onScan={handleMemberScan}
        loading={memberLoading}
      />
      {/* Left Side: Item Grid */}
      <View style={styles.leftPane}>
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search items..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
        />

        {/* Member Scanning Section - Bottom Left */}
        <View style={styles.memberSectionBottom}>
          <Text style={styles.memberSectionTitle}>Member Scan</Text>
          {scannedMember ? (
            <View style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <Ionicons name="person-circle" size={20} color="#2563eb" />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{scannedMember.name}</Text>
                  <Text style={styles.memberPhone}>{scannedMember.phone_number}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={clearMember} style={styles.clearMemberButton}>
                <Ionicons name="close-circle" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={() => setIsMemberModalVisible(true)}
            >
              <Ionicons name="person-add-outline" size={20} color="#2563eb" />
              <Text style={styles.addMemberButtonText}>Add Member</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Right Side: Cart */}
      <View style={styles.rightPane}>
        <Text style={styles.cartTitle}>Current Order</Text>
        <ScrollView style={styles.cartList}>
          {cart.map((cartItem) => (
            <View key={cartItem.item.id} style={styles.cartItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cartItemName}>{cartItem.item.name}</Text>
                <Text style={styles.cartItemPrice}>
                  Rp {cartItem.item.price.toLocaleString('id-ID')} x {cartItem.quantity}
                </Text>
              </View>
              <View style={styles.qtyControls}>
                <TouchableOpacity onPress={() => updateQuantity(cartItem.item.id, -1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#dc2626" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(cartItem.item.id, 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromCart(cartItem.item.id)} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {/* SKU Input */}
          <View style={styles.skuInputContainer}>
            <TextInput
              value={skuInput}
              onChangeText={setSkuInput}
              placeholder="Enter SKU Code"
              style={styles.skuInput}
              onSubmitEditing={handleSkuSubmit}
            />
            <TouchableOpacity style={styles.skuButton} onPress={handleSkuSubmit}>
              <Text style={styles.skuButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <Numpad onKeyPress={handleNumpadPress} />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>Rp {calculateTotal().toLocaleString('id-ID')}</Text>
          </View>

          <TouchableOpacity
            style={[styles.payButton, calculateTotal() === 0 && styles.payButtonDisabled]}
            onPress={handlePay}
            disabled={calculateTotal() === 0}
          >
            <Text style={styles.payButtonText}>Pay Rp {calculateTotal().toLocaleString('id-ID')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
  },
  leftPane: {
    flex: 2,
    padding: 16,
    flexDirection: 'column',
  },
  rightPane: {
    flex: 1,
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logoutButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  gridContent: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: '32%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemIconPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1f2937',
  },
  itemPrice: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#6b7280',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  skuInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  skuInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  skuButton: {
    backgroundColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  skuButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  payButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Member scanning styles
  memberSectionBottom: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  memberSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  memberCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberDetails: {
    marginLeft: 8,
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  memberPhone: {
    fontSize: 12,
    color: '#64748b',
  },
  clearMemberButton: {
    padding: 4,
  },
  memberScanContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  memberPhoneInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  scanButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  addMemberButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
});
