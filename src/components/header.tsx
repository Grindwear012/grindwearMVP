"use client";

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCart } from '@/hooks/use-cart';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { Logo } from './logo';

export default function Header() {
  const { cartCount } = useCart();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Men', href: '/products?category=Men' },
    { name: 'Women', href: '/products?category=Women' },
    { name: 'Accessories', href: '/products?category=Accessories' },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center">
            <Logo className="h-12 opacity-60" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
               <Link href="/" className="mr-6 flex items-center mb-6">
                <Logo className="h-12 opacity-60" />
              </Link>
              <nav className="flex flex-col space-y-4">
                 {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 sm:w-auto sm:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full bg-background pl-9 sm:w-64"
                />
              </div>
            </form>
          </div>
          <nav className="flex items-center space-x-2">
             {isUserLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
