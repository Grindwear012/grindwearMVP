'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collectionGroup, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { Loader2, Package, ExternalLink } from 'lucide-react';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminOrdersTab() {
  const db = useFirestore();
  const { user } = useUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Check admin authorization locally before firing the collectionGroup query
  useEffect(() => {
    async function checkAuth() {
      if (!db || !user) {
        setIsAuthorized(false);
        return;
      }
      try {
        const adminRef = doc(db, 'roles_admin', user.uid);
        const snap = await getDoc(adminRef);
        setIsAuthorized(snap.exists());
      } catch (err) {
        console.error("Auth check failed", err);
        setIsAuthorized(false);
      }
    }
    checkAuth();
  }, [db, user]);

  const ordersQuery = useMemoFirebase(() => {
    // ONLY initiate the query if the user is verified as an admin.
    // This prevents "Missing or insufficient permissions" errors on component mount.
    if (!db || !user || isAuthorized !== true) return null;
    return query(collectionGroup(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db, user, isAuthorized]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection<Order>(ordersQuery);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'shipped':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'delivered':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  if (isAuthorized === null || isOrdersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {isAuthorized === null ? 'Verifying Admin Access...' : 'Loading Orders...'}
        </p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Unauthorized</CardTitle>
          <CardDescription>You do not have permission to view this data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage all customer orders in real-time.</CardDescription>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs uppercase">
                        #{order.id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        {order.orderDate ? format(new Date(order.orderDate), 'MMM dd, yyyy') : 'Recently'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customerName}</span>
                          <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>R{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.fulfillmentStatus) as any} className="capitalize">
                          {order.fulfillmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'} className="capitalize">
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/orders/${order.customerId}/${order.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Details
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
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base uppercase font-mono">
                          #{order.id.slice(-6)}
                        </CardTitle>
                        <CardDescription>{order.customerName}</CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(order.fulfillmentStatus) as any} className="capitalize">
                        {order.fulfillmentStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">R{order.totalAmount.toFixed(2)}</p>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>{order.paymentStatus}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/admin/orders/${order.customerId}/${order.id}`}>Manage Order</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground">Orders will appear here once customers start checking out.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}