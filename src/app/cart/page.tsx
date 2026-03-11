"use client";

import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag, Minus, Plus, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount, clearCart } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [shippingRate, setShippingRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const provinces = [
    { name: 'Eastern Cape', code: 'EC' },
    { name: 'Free State', code: 'FS' },
    { name: 'Gauteng', code: 'GP' },
    { name: 'KwaZulu-Natal', code: 'KZN' },
    { name: 'Limpopo', code: 'LP' },
    { name: 'Mpumalanga', code: 'MP' },
    { name: 'Northern Cape', code: 'NC' },
    { name: 'North West', code: 'NW' },
    { name: 'Western Cape', code: 'WC' },
  ];

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "222 Struben Street",
    suburb: "Pretoria Central",
    city: "Pretoria",
    province: "GP",
    postalCode: "0001",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
    setShippingRate(null);
  };

  const handleProvinceChange = (value: string) => {
    setDeliveryAddress(prev => ({ ...prev, province: value }));
    setShippingRate(null);
  };

  const getShippingRates = async () => {
    setIsFetchingRates(true);
    setError(null);
    
    // Simulate API call for shipping rates
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Flat rate for MVP
    const rate = 50.00;
    setShippingRate(rate);
    
    toast({
      title: "Shipping Calculated",
      description: `Delivery to ${deliveryAddress.city} will be R${rate.toFixed(2)}.`,
    });
    
    setIsFetchingRates(false);
  };

  const preparePayment = async () => {
    if (shippingRate === null) {
      toast({ variant: "destructive", title: "Calculate Shipping", description: "Please calculate shipping before paying." });
      return;
    }
    if (!user) {
      toast({ variant: "destructive", title: "Login Required", description: "Please sign in to complete your purchase." });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const finalTotal = totalPrice + (shippingRate || 0);
      const nameParts = (user.displayName || 'Customer').split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || 'User';

      // 1. Create the Order in Firestore
      const orderData = {
        customerId: user.uid,
        customerName: `${firstName} ${lastName}`,
        customerEmail: user.email,
        customerInfo: { firstName, lastName, email: user.email },
        orderDate: new Date().toISOString(),
        products: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          color: item.color,
        })),
        subtotal: totalPrice,
        shippingCost: shippingRate,
        totalAmount: finalTotal,
        shippingAddress: deliveryAddress,
        fulfillmentStatus: 'pending',
        paymentStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, 'customers', user.uid, 'orders'), orderData);
      const orderId = orderRef.id;

      // 2. Generate Signature via API
      const signaturePayload = {
        amount: finalTotal,
        item_name: `${cartCount} items from Thrift Plug`,
        item_description: `Order #${orderId.slice(-6).toUpperCase()}`,
        name_first: firstName,
        name_last: lastName,
        email_address: user.email || '',
        m_payment_id: orderId,
        return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
        notify_url: `${window.location.origin}/api/payment-notify`,
        custom_str1: user.uid,
        custom_str2: JSON.stringify(deliveryAddress),
      };

      const signatureResponse = await fetch('/api/generate-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signaturePayload),
      });

      if (!signatureResponse.ok) throw new Error('Failed to generate secure signature.');

      const sigData = await signatureResponse.json();
      setPaymentData(sigData);

    } catch (err: any) {
      console.error("Payment setup error:", err);
      setError(err.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (paymentData) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payfast.co.za/eng/process';
      form.target = '_top'; 

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      clearCart(); 
      form.submit();
    }
  }, [paymentData, clearCart]);

  const finalTotal = totalPrice + (shippingRate ?? 0);

  if (cartCount === 0) {
    return (
      <div className="container mx-auto py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 md:py-12 px-4">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter uppercase italic">Your Cart</h1>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-muted/20">
            <CardContent className="p-0">
              <ul className="divide-y divide-muted-foreground/10">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 p-4">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product.images[0]?.url || ''}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.id}`} className="font-bold uppercase text-sm hover:underline block truncate">
                        {item.product.name}
                      </Link>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {item.size} · {item.color}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center border rounded-md bg-background">
                          <button 
                            className="p-1 px-2 hover:bg-muted"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            className="p-1 px-2 hover:bg-muted"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-bold text-sm">R{(item.product.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-muted">
            <CardHeader><CardTitle className="text-lg font-bold uppercase tracking-tight">Delivery Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Street</Label>
                  <Input name="street" value={deliveryAddress.street} onChange={handleAddressChange} className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Suburb</Label>
                  <Input name="suburb" value={deliveryAddress.suburb} onChange={handleAddressChange} className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">City</Label>
                  <Input name="city" value={deliveryAddress.city} onChange={handleAddressChange} className="rounded-none border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Province</Label>
                  <Select value={deliveryAddress.province} onValueChange={handleProvinceChange}>
                    <SelectTrigger className="rounded-none border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {provinces.map(p => <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Postal Code</Label>
                  <Input name="postalCode" value={deliveryAddress.postalCode} onChange={handleAddressChange} className="rounded-none border-2" />
                </div>
              </div>
              <Button 
                onClick={getShippingRates} 
                disabled={isFetchingRates || !user} 
                variant="outline"
                className="w-full rounded-none font-bold uppercase tracking-widest"
              >
                {isFetchingRates ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</> : 'Calculate Shipping'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-none shadow-xl bg-muted/30">
            <CardHeader><CardTitle className="text-xl font-black uppercase italic tracking-tighter">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span>R{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <span>Shipping</span>
                <span>{shippingRate !== null ? `R${shippingRate.toFixed(2)}` : '--'}</span>
              </div>
              <Separator className="bg-foreground/10" />
              <div className="flex justify-between text-2xl font-black uppercase italic tracking-tighter">
                <span>Total</span>
                <span>R{finalTotal.toFixed(2)}</span>
              </div>

              {error && <p className="text-xs text-destructive font-bold uppercase">{error}</p>}

              <Button 
                size="lg" 
                className="w-full h-14 rounded-none font-black uppercase tracking-widest italic text-lg"
                disabled={shippingRate === null || isProcessing || !user}
                onClick={preparePayment}
              >
                {isProcessing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Syncing Securely...</> : 'Pay with PayFast →'}
              </Button>
              
              {!user && (
                <p className="text-center text-[10px] font-bold uppercase text-muted-foreground mt-2">
                  Please <Link href="/login" className="underline">sign in</Link> to complete your order.
                </p>
              )}
              
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secured by PayFast
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
