'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Heart,
} from 'lucide-react';
import { Button } from './ui/button';
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
    { name: 'Men', href: '/products?category=Men' },
    { name: 'Women', href: '/products?category=Women' },
    { name: 'Accessories', href: '/products?category=Accessories' },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-4/5 p-4">
               <Link href="/" className="flex items-center gap-2 mb-8">
                <Logo className="h-7" />
                <span className="font-bold">ThriftClothingPlug</span>
              </Link>
              <nav className="flex flex-col gap-4">
                 {[{name: 'Home', href: '/'}, ...navItems].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-foreground text-foreground/80"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Left: Logo (Desktop) */}
        <div className="hidden md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-7" />
            <span className="font-bold tracking-wider">THRIFTCLOTHINGPLUG</span>
          </Link>
        </div>

        {/* Center: Navigation (Desktop) / Logo (Mobile) */}
        <div className="flex flex-1 items-center justify-center">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium tracking-wider">
                {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="transition-colors hover:text-foreground text-foreground/70"
                >
                    {item.name.toUpperCase()}
                </Link>
                ))}
            </nav>
            <div className="md:hidden">
                 <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-7" />
                    <span className="font-bold">ThriftClothingPlug</span>
                </Link>
            </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isUserLoading ? (
                 <DropdownMenuItem>Loading...</DropdownMenuItem>
              ) : user ? (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/account">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild><Link href="/login">Sign In</Link></DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartCount > 0 && <div className="absolute -right-1 -top-1 w-4 h-4 text-xs rounded-full bg-primary text-primary-foreground flex items-center justify-center">{cartCount}</div>}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
