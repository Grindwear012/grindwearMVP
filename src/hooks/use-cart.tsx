"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from './use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  // Local state for guest users
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);

  // Firestore reference for logged-in user's cart
  // We use a fixed 'default' cart ID for simplicity in the MVP
  const cartItemsRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'customers', user.uid, 'carts', 'default', 'items');
  }, [db, user?.uid]);

  const { data: firestoreCartItems, isLoading: isFirestoreLoading } = useCollection<CartItem>(cartItemsRef);

  // Initialize local cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setLocalCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse local cart", e);
      }
    }
  }, []);

  // Update localStorage when local cart changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(localCartItems));
    }
  }, [localCartItems, user]);

  // Determine active cart items
  const cartItems = useMemo(() => {
    if (user) {
      return firestoreCartItems || [];
    }
    return localCartItems;
  }, [user, firestoreCartItems, localCartItems]);

  const addToCart = useCallback(
    (product: Product, size: string, color: string) => {
      const itemId = `${product.id}-${size}-${color}`;
      const existingItem = cartItems.find((item) => item.id === itemId);

      if (user && db && cartItemsRef) {
        // Update Firestore
        const docRef = doc(db, cartItemsRef.path, itemId);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        
        setDocumentNonBlocking(docRef, {
          id: itemId,
          product,
          size,
          color,
          quantity: newQuantity,
          addedAt: new Date().toISOString(),
        }, { merge: true });
      } else {
        // Update Local State
        setLocalCartItems((prevItems) => {
          if (existingItem) {
            return prevItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            const newItem: CartItem = {
              id: itemId,
              product,
              size,
              color,
              quantity: 1,
            };
            return [...prevItems, newItem];
          }
        });
      }

      toast({
        title: 'Added to cart!',
        description: `${product.name} has been added to your cart.`,
      });
    },
    [user, db, cartItemsRef, cartItems, toast]
  );

  const removeFromCart = useCallback((itemId: string) => {
    if (user && db && cartItemsRef) {
      const docRef = doc(db, cartItemsRef.path, itemId);
      deleteDocumentNonBlocking(docRef);
    } else {
      setLocalCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    }
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  }, [user, db, cartItemsRef, toast]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    const newQuantity = Math.max(0, quantity);
    
    if (user && db && cartItemsRef) {
      const docRef = doc(db, cartItemsRef.path, itemId);
      if (newQuantity === 0) {
        deleteDocumentNonBlocking(docRef);
      } else {
        updateDocumentNonBlocking(docRef, { quantity: newQuantity });
      }
    } else {
      setLocalCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ).filter(item => item.quantity > 0)
      );
    }
  }, [user, db, cartItemsRef]);

  const clearCart = useCallback(() => {
    if (user && db && cartItemsRef && firestoreCartItems) {
      const batch = writeBatch(db);
      firestoreCartItems.forEach((item) => {
        const docRef = doc(db, cartItemsRef.path, item.id);
        batch.delete(docRef);
      });
      batch.commit();
    } else {
      setLocalCartItems([]);
    }
  }, [user, db, cartItemsRef, firestoreCartItems]);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const totalPrice = useMemo(() => cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ), [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice,
        isLoading: isUserLoading || (!!user && isFirestoreLoading),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
