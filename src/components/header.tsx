'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  User,
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
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Logo and Brand Name */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          <span className="text-lg font-semibold tracking-wide">
            ThriftClothingPlug
          </span>
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center justify-end space-x-2">
          <Link href="/products">
            <Button variant="ghost" size="icon" suppressHydrationWarning={true}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" suppressHydrationWarning={true}>
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
            <Button variant="ghost" size="icon" className="relative" suppressHydrationWarning={true}>
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
