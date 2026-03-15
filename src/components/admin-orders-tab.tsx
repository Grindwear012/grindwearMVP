'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { Loader2, Package, ExternalLink } from 'lucide-react';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * @fileOverview AdminOrdersTab component for the Admin Dashboard.
 * 
 * Fetches real order data from the server-side Admin API to avoid 
 * client-side permission issues with Collection Group queries.
 */

export default function AdminOrdersTab({ isAuthorized }: { isAuthorized: boolean }) {
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthorized) {
      setIsLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        setIsLoading(true);
        setError(null);

        // Get the fresh ID token for the Bearer header
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Authentication required.');

        const res = await fetch('/api/admin/orders', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with ${res.status}`);
        }

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error('Failed to fetch admin orders:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [isAuthorized, auth]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'shipped': return 'default';
      case 'processing': return 'secondary';
      case 'delivered': return 'outline';
      case 'cancelled': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-xl border-2 border-dashed">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Retrieving Global Orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive uppercase italic">Sync Error</CardTitle>
          <CardDescription className="font-bold text-destructive/80">
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="rounded-none uppercase font-bold text-[10px]">
                Retry Connection
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-muted/20">
      <CardHeader>
        <CardTitle className="uppercase italic text-lg tracking-tight">Order Management</CardTitle>
        <CardDescription>
          Live feed of all customer transactions and fulfillment statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="uppercase font-bold text-[10px] tracking-[0.2em] border-foreground/10">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-foreground/5">
                      <TableCell className="font-mono text-xs uppercase">#{order.id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell className="text-xs font-medium">
                        {order.orderDate ? format(new Date(order.orderDate), 'dd MMM yyyy') : 'Recently'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs uppercase italic">{order.customerName}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{order.customerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-black">R{order.totalAmount?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.fulfillmentStatus) as any} className="capitalize rounded-none text-[10px] font-black italic">
                          {order.fulfillmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'} className="capitalize rounded-none text-[10px] font-black">
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm" className="rounded-none font-bold text-[10px] uppercase">
                          <Link href={`/admin/orders/${order.customerId}/${order.id}`}>
                            <ExternalLink className="h-3 w-3 mr-2" />
                            Manage
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {orders.map((order) => (
                <Card key={order.id} className="rounded-none border-foreground/10 bg-background">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xs font-mono uppercase">#{order.id.slice(-6).toUpperCase()}</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-black italic mt-1">{order.customerName}</CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(order.fulfillmentStatus) as any} className="capitalize text-[9px] rounded-none italic">
                        {order.fulfillmentStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center">
                        <p className="font-black text-sm">R{order.totalAmount?.toFixed(2)}</p>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'} className="text-[9px] rounded-none">{order.paymentStatus}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t border-foreground/5">
                    <Button asChild variant="outline" size="sm" className="w-full rounded-none uppercase font-bold text-[10px] tracking-widest">
                      <Link href={`/admin/orders/${order.customerId}/${order.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-background/50">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-sm font-bold uppercase tracking-widest">No orders found</h3>
            <p className="text-xs text-muted-foreground font-medium mt-1">Orders will appear here once customers complete the checkout process.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
