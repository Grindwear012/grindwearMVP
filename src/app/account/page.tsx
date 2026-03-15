'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, collection, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, MapPin, Trash2, Package, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';

const addressSchema = z.object({
  street1: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  addressType: z.string().min(1, 'Address type is required'),
});

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  // Memoize the customer doc reference
  const customerRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'customers', user.uid);
  }, [db, user?.uid]);

  const { data: customerData, isLoading: isCustomerLoading } = useDoc(customerRef);

  // Memoize the addresses collection reference
  const addressesRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'customers', user.uid, 'addresses');
  }, [db, user?.uid]);

  const { data: addresses, isLoading: isAddressesLoading } = useCollection(addressesRef);

  // Memoize real orders query
  const ordersRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'customers', user.uid, 'orders'), orderBy('createdAt', 'desc'));
  }, [db, user?.uid]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection<Order>(ordersRef);

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      addressType: 'shipping',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !db) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    setIsSaving(true);
    try {
      await updateProfile(user, { displayName: name });

      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      if (customerRef) {
        await updateDoc(customerRef, {
          firstName,
          lastName,
          updatedAt: new Date().toISOString(),
        });
      }

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onAddressSubmit = (values: z.infer<typeof addressSchema>) => {
    if (!addressesRef || !user) return;

    const addressData = {
      ...values,
      customerId: user.uid,
      isDefaultShipping: addresses?.length === 0,
      isDefaultBilling: addresses?.length === 0,
    };

    addDocumentNonBlocking(addressesRef, addressData);
    
    toast({
      title: 'Address Added',
      description: 'Your new address has been saved.',
    });
    
    addressForm.reset();
    setIsAddressDialogOpen(false);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (!db || !user) return;
    const addressRef = doc(db, 'customers', user.uid, 'addresses', addressId);
    deleteDocumentNonBlocking(addressRef);
    toast({
      title: 'Address Deleted',
      description: 'The address has been removed.',
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'shipped': return 'default';
      case 'processing': return 'secondary';
      case 'delivered': return 'outline';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-32 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <h1 className="mb-2 text-3xl font-bold tracking-tighter uppercase italic">My Account</h1>
      <p className="text-muted-foreground mb-8">
        Manage your orders, profile, and addresses.
      </p>
      <Tabs defaultValue="orders">
        <TabsList className="mb-6 rounded-none bg-muted/50 p-1">
          <TabsTrigger value="orders" className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none font-bold uppercase tracking-widest px-8">Order History</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none font-bold uppercase tracking-widest px-8">Profile</TabsTrigger>
          <TabsTrigger value="addresses" className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none font-bold uppercase tracking-widest px-8">Addresses</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card className="border-none shadow-sm bg-muted/20">
            <CardHeader>
              <CardTitle className="uppercase italic text-lg tracking-tight">Orders</CardTitle>
              <CardDescription>
                View the details of your past orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : orders && orders.length > 0 ? (
                <>
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="uppercase font-bold text-[10px] tracking-[0.2em] border-foreground/10">
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="border-foreground/5">
                            <TableCell className="font-mono text-xs uppercase">#{order.id.slice(-8)}</TableCell>
                            <TableCell className="text-sm font-medium">
                              {order.orderDate ? format(new Date(order.orderDate), 'dd MMM yyyy') : 'Recently'}
                            </TableCell>
                            <TableCell className="font-bold">R{order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(order.fulfillmentStatus) as any} className="capitalize rounded-none text-[10px] font-black italic">
                                {order.fulfillmentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="rounded-none font-bold text-[10px] uppercase">Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="space-y-4 md:hidden">
                    {orders.map((order) => (
                      <Card key={order.id} className="w-full rounded-none border-foreground/10">
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-sm font-mono uppercase">#{order.id.slice(-8)}</CardTitle>
                              <CardDescription className="text-[10px] uppercase font-bold tracking-widest">
                                {order.orderDate ? format(new Date(order.orderDate), 'dd MMM yyyy') : 'Recently'}
                              </CardDescription>
                            </div>
                            <Badge variant={getStatusVariant(order.fulfillmentStatus) as any} className="capitalize text-[10px] rounded-none italic">
                              {order.fulfillmentStatus}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="font-black text-lg">R{order.totalAmount.toFixed(2)}</p>
                        </CardContent>
                        <CardFooter className="p-4 border-t border-foreground/5">
                          <Button variant="outline" size="sm" className="w-full rounded-none uppercase font-bold text-[10px] tracking-widest">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card className="border-none shadow-sm bg-muted/20">
            <CardHeader>
              <CardTitle className="uppercase italic text-lg tracking-tight">Personal Info</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={customerData ? `${customerData.firstName} ${customerData.lastName}` : user.displayName || ''} 
                    required 
                    className="rounded-none border-2 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email || ''} readOnly disabled className="bg-muted rounded-none border-2 h-12" />
                </div>
                <Button type="submit" disabled={isSaving} className="w-full rounded-none h-12 uppercase font-black italic tracking-widest">
                  {isSaving ? 'Updating...' : 'Save Changes'}
                </Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="addresses">
          <Card className="border-none shadow-sm bg-muted/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="uppercase italic text-lg tracking-tight">Addresses</CardTitle>
                <CardDescription>
                  Manage your shipping and billing addresses.
                </CardDescription>
              </div>
              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-none font-bold uppercase text-[10px] tracking-widest">Add New</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-none border-4">
                  <DialogHeader>
                    <DialogTitle className="uppercase italic text-2xl font-black">Add New Address</DialogTitle>
                    <DialogDescription className="font-bold">
                      Enter your shipping details below.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                      <FormField
                        control={addressForm.control}
                        name="street1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" className="rounded-none border-2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground">City</FormLabel>
                            <FormControl>
                              <Input placeholder="Anytown" className="rounded-none border-2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground">State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="CA" className="rounded-none border-2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addressForm.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" className="rounded-none border-2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={addressForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground">Country</FormLabel>
                            <FormControl>
                              <Input placeholder="USA" className="rounded-none border-2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full rounded-none h-12 uppercase font-black italic tracking-widest">Save Address</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
               {isAddressesLoading ? (
                 <div className="flex justify-center p-8">
                   <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                 </div>
               ) : (
                 <div className="grid gap-4">
                   {addresses?.map((address) => (
                     <div key={address.id} className="border-2 rounded-none p-4 flex justify-between items-start bg-background">
                        <div className="flex gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-black uppercase italic text-xs tracking-tight">{address.addressType} Address</p>
                            <p className="text-muted-foreground text-sm font-medium">{address.street1}</p>
                            <p className="text-muted-foreground text-sm font-medium">{address.city}, {address.state} {address.postalCode}</p>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{address.country}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                   ))}
                   {!isAddressesLoading && addresses?.length === 0 && (
                     <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                        <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">No addresses saved yet.</p>
                     </div>
                   )}
                 </div>
               )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}