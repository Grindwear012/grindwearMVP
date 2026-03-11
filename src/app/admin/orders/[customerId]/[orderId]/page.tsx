'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Truck, User, Home, Package, Check, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params.customerId as string;
    const orderId = params.orderId as string;
    const db = useFirestore();
    const { toast } = useToast();
    
    const [isShipDialogOpen, setIsShipDialogOpen] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const orderRef = useMemoFirebase(() => {
      if (!db || !customerId || !orderId) return null;
      return doc(db, 'customers', customerId, 'orders', orderId);
    }, [db, customerId, orderId]);

    const { data: order, isLoading } = useDoc<Order>(orderRef);
    
    const handleStatusUpdate = async (status: Order['fulfillmentStatus'], trackingNum?: string) => {
        if (!orderRef) return;
        setIsUpdating(true);
        try {
            const updates: any = { 
              fulfillmentStatus: status,
              updatedAt: new Date().toISOString()
            };
            if (trackingNum) {
                updates.trackingNumber = trackingNum;
            }

            await updateDoc(orderRef, updates);

            toast({
              title: "Order Updated",
              description: `Order fulfillment status changed to ${status}.`
            })
        } catch (err: any) {
            toast({
              variant: "destructive",
              title: "Update Failed",
              description: err.message
            })
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleConfirmShip = () => {
        if (order) {
          handleStatusUpdate('shipped', trackingNumber);
        }
        setTrackingNumber('');
        setIsShipDialogOpen(false);
    }

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'pending': return 'destructive';
            case 'processing': return 'secondary';
            case 'shipped': return 'default';
            case 'delivered': return 'outline';
            default: return 'default';
        }
    }

    if (isLoading) return (
      <div className="container mx-auto py-32 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p>Loading order details...</p>
      </div>
    );

    if (!order) return (
      <div className="container mx-auto py-32 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Button variant="link" onClick={() => router.back()}>Go Back</Button>
      </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-5xl">
             <div className="mb-8">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                </Button>
            </div>
            
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter uppercase italic">Order #{order.id.slice(-8).toUpperCase()}</h1>
                    <p className="mt-2 text-muted-foreground font-medium">
                        Placed on {order.orderDate ? format(new Date(order.orderDate), 'dd MMM yyyy, HH:mm') : 'Recently'}
                    </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusBadgeVariant(order.paymentStatus) as any} className="capitalize text-sm h-8 px-4">
                      {order.paymentStatus} Payment
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(order.fulfillmentStatus) as any} className="capitalize text-sm h-8 px-4">
                      {order.fulfillmentStatus}
                  </Badge>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm bg-muted/20">
                        <CardHeader><CardTitle className="flex items-center gap-2 uppercase text-lg italic"><Package className="h-5 w-5" /> Order Summary</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.products.map((product, idx) => (
                                    <div key={`${order.id}-${idx}`} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold uppercase text-sm">{product.name} (x{product.quantity})</p>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{product.size} · {product.color} · R{product.price.toFixed(2)} each</p>
                                        </div>
                                        <p className="font-black">R{(product.price * product.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6 bg-foreground/10" />
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                  <span>Subtotal</span>
                                  <span>R{order.subtotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                  <span>Shipping</span>
                                  <span>R{order.shippingCost?.toFixed(2) || '0.00'}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-black text-2xl uppercase italic tracking-tighter">
                                  <span>Total</span>
                                  <span>R{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {order.trackingNumber && (
                      <Card className="border-2 border-primary/20">
                        <CardHeader><CardTitle className="flex items-center gap-2 uppercase text-lg italic"><Truck className="h-5 w-5" /> Shipment Tracking</CardTitle></CardHeader>
                        <CardContent>
                          <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tracking Number</p>
                              <p className="text-lg font-mono font-bold">{order.trackingNumber}</p>
                            </div>
                            <Truck className="h-8 w-8 text-primary opacity-20" />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </div>

                <div className="space-y-8">
                     <Card className="border-2 border-primary">
                        <CardHeader><CardTitle className="uppercase text-lg italic">Actions</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {order.fulfillmentStatus === 'pending' && order.paymentStatus === 'paid' && (
                                <Button 
                                  className="w-full rounded-none font-bold uppercase tracking-widest" 
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate('processing')}
                                >
                                  Process Order
                                </Button>
                            )}
                            {order.fulfillmentStatus === 'processing' && (
                                <Button 
                                  className="w-full rounded-none font-bold uppercase tracking-widest"
                                  disabled={isUpdating}
                                  onClick={() => setIsShipDialogOpen(true)}
                                >
                                  Ship Order
                                </Button>
                            )}
                             {order.fulfillmentStatus === 'shipped' && (
                                <Button 
                                  variant="secondary" 
                                  className="w-full rounded-none font-bold uppercase tracking-widest"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate('delivered')}
                                >
                                  <Check className="mr-2 h-4 w-4" /> Delivered
                                </Button>
                            )}
                            {order.fulfillmentStatus === 'delivered' && (
                              <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                                <Check className="h-4 w-4 text-green-500" /> Order Fulfilled
                              </p>
                            )}
                            {isUpdating && <div className="flex justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2 uppercase text-base italic"><User className="h-4 w-4" /> Customer</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                            <p className="font-bold">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                            <p className="text-muted-foreground text-sm">{order.customerInfo.email}</p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2 uppercase text-base italic"><Home className="h-4 w-4" /> Shipping Address</CardTitle></CardHeader>
                        <CardContent className="space-y-1 text-muted-foreground text-sm font-medium">
                            <p>{order.shippingAddress.street}</p>
                            {order.shippingAddress.suburb && <p>{order.shippingAddress.suburb}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            {order.shippingAddress.province && <p>{order.shippingAddress.province}</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isShipDialogOpen} onOpenChange={setIsShipDialogOpen}>
                <DialogContent className="rounded-none border-4">
                    <DialogHeader>
                        <DialogTitle className="uppercase italic text-2xl font-black">Ship Order</DialogTitle>
                        <DialogDescription className="font-bold">Enter the tracking number for this shipment.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tracking" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Tracking Number</Label>
                            <Input 
                              id="tracking" 
                              placeholder="e.g. TCP-SHP-12345"
                              value={trackingNumber} 
                              onChange={(e) => setTrackingNumber(e.target.value)} 
                              className="rounded-none border-2 font-mono"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleConfirmShip} 
                        className="w-full rounded-none h-12 font-black uppercase italic tracking-widest"
                        disabled={!trackingNumber.trim() || isUpdating}
                      >
                        Confirm & Ship →
                      </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
