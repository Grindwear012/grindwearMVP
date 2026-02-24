'use client';

import {
  Card,
  CardContent,
  CardDescription,
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

export default function AdminOrdersTab() {
    const mockOrders = [
        { id: 'ORD001', date: '2023-10-26', customer: 'John Doe', total: 'R120.00', status: 'Shipped' },
        { id: 'ORD002', date: '2023-10-25', customer: 'Jane Smith', total: 'R45.00', status: 'Processing' },
        { id: 'ORD003', date: '2023-10-25', customer: 'Peter Jones', total: 'R75.50', status: 'Delivered' },
        { id: 'ORD004', date: '2023-10-24', customer: 'Mary Johnson', total: 'R210.00', status: 'Shipped' },
        { id: 'ORD005', date: '2023-10-23', customer: 'Chris Lee', total: 'R60.00', status: 'Cancelled' },
    ];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Shipped':
                return 'default';
            case 'Processing':
                return 'secondary';
            case 'Delivered':
                return 'outline';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'default';
        }
    }


  return (
    <Card>
        <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and manage all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {mockOrders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm">Manage</Button>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </CardContent>
    </Card>
  );
}
