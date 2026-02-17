import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  item: {
    id: number;
    name: string;
    price: number;
    sku_code?: string;
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, change: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(cartItem => {
        if (cartItem.item.id === itemId) {
          const newQuantity = cartItem.quantity + change;
          return newQuantity > 0 ? { ...cartItem, quantity: newQuantity } : null;
        }
        return cartItem;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
