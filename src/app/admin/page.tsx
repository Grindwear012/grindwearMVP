'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminOrdersTab from '@/components/admin-orders-tab';
import AdminProductsTab from '@/components/admin-products-tab';
import { useUser, useFirestore } from '@/firebase';
import { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();
    const { toast } = useToast();
    const [isSettingUp, setIsSettingUp] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const MASTER_ADMIN_EMAIL = "mohalashelldon@gmail.com";

    useEffect(() => {
        async function checkAndSetupAdmin() {
            if (!user || !db || user.email !== MASTER_ADMIN_EMAIL) {
                if (user && user.email !== MASTER_ADMIN_EMAIL) {
                    // Check if they are already in the roles_admin collection
                    const roleRef = doc(db, 'roles_admin', user.uid);
                    const roleSnap = await getDoc(roleRef);
                    setIsAuthorized(roleSnap.exists());
                }
                return;
            }

            // If it's the master email, ensure the record exists
            setIsSettingUp(true);
            try {
                const roleRef = doc(db, 'roles_admin', user.uid);
                const roleSnap = await getDoc(roleRef);
                
                if (!roleSnap.exists()) {
                    await setDoc(roleRef, {
                        userId: user.uid,
                        email: user.email,
                        assignedBy: 'system-init',
                        createdAt: new Date().toISOString()
                    });
                    toast({
                        title: "Admin Status Verified",
                        description: "Your account has been registered as a Master Administrator.",
                    });
                }
                setIsAuthorized(true);
            } catch (error) {
                console.error("Admin setup failed:", error);
            } finally {
                setIsSettingUp(false);
            }
        }

        if (!isUserLoading) {
            checkAndSetupAdmin();
        }
    }, [user, isUserLoading, db, toast]);

    if (isUserLoading || isSettingUp) {
        return (
            <div className="container mx-auto py-32 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Verifying Credentials...</p>
            </div>
        );
    }

    if (!isAuthorized && user?.email !== MASTER_ADMIN_EMAIL) {
        return (
            <div className="container mx-auto py-32 text-center">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Access Denied</h1>
                <p className="text-muted-foreground mb-8">You do not have administrative privileges to view this dashboard.</p>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="border-2 border-primary px-8 py-3 font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 md:py-12 px-4">
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tighter uppercase italic">Admin Dashboard</h1>
                <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-8">
                Manage your store's orders and products. Authenticated as <span className="text-foreground font-bold">{user?.email}</span>
            </p>
            <Tabs defaultValue="orders">
                <TabsList className="mb-6 rounded-none bg-muted/50 p-1">
                    <TabsTrigger value="orders" className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none font-bold uppercase tracking-widest px-8">Orders</TabsTrigger>
                    <TabsTrigger value="products" className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none font-bold uppercase tracking-widest px-8">Products</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <AdminOrdersTab />
                </TabsContent>
                <TabsContent value="products">
                    <AdminProductsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
