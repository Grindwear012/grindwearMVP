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
import { doc, updateDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2, MapPin, Trash2 } from 'lucide-react';

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
    // Only return the collection ref if we have a valid UID to prevent root list errors.
    if (!db || !user?.uid) return null;
    return collection(db, 'customers', user.uid, 'addresses');
  }, [db, user?.uid]);

  const { data: addresses, isLoading: isAddressesLoading } = useCollection(addressesRef);

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

  // Notification for missing address
  useEffect(() => {
    if (!isUserLoading && user && !isAddressesLoading && addresses && addresses.length === 0) {
      toast({
        title: 'Welcome back!',
        description: 'Please add a shipping address to your profile for faster checkout.',
      });
    }
  }, [user, isUserLoading, isAddressesLoading, addresses, toast]);

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

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading account details...</p>
      </div>
    );
  }

  const mockOrders = [
    { id: 'ORD001', date: '2023-10-26', total: 'R120.00', status: 'Shipped' },
    { id: 'ORD002', date: '2023-10-20', total: 'R45.00', status: 'Delivered' },
  ];

  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <h1 className="mb-2 text-3xl font-bold">My Account</h1>
      <p className="text-muted-foreground mb-8">
        Manage your orders, profile, and addresses.
      </p>
      <Tabs defaultValue="orders">
        <TabsList className="mb-6">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View the details of your past orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
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
                        <TableCell>{order.total}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-4 md:hidden">
                {mockOrders.map((order) => (
                  <Card key={order.id} className="w-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{order.id}</CardTitle>
                          <CardDescription>{order.date}</CardDescription>
                        </div>
                        <p className="text-sm font-medium">{order.status}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold">{order.total}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={customerData ? `${customerData.firstName} ${customerData.lastName}` : user.displayName || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email || ''} readOnly disabled className="bg-muted" />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Addresses</CardTitle>
                <CardDescription>
                  Manage your shipping and billing addresses.
                </CardDescription>
              </div>
              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Add New</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
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
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
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
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Anytown" {...field} />
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
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="CA" {...field} />
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
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
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
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="USA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Save Address</Button>
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
                     <div key={address.id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div className="flex gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-semibold capitalize">{address.addressType} Address</p>
                            <p className="text-muted-foreground">{address.street1}</p>
                            <p className="text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
                            <p className="text-muted-foreground">{address.country}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                   ))}
                   {!isAddressesLoading && addresses?.length === 0 && (
                     <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No addresses saved yet.</p>
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