'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
} from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/hooks/use-cart';
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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {/* Left: Logo */}
        <div className="flex">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8" />
            <span className="hidden text-lg font-semibold tracking-wide md:block">TCP</span>
          </Link>
        </div>

        {/* Center: Title (Mobile) */}
        <div className="flex flex-1 items-center justify-center md:hidden">
            <span className="text-lg font-semibold">ThriftClothingPlug</span>
        </div>

        {/* Right: Icons */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
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
