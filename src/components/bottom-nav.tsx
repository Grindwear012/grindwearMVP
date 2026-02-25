'use client';
import Link from 'next/link';
import { Home, Search, Heart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/products', icon: Search },
    { name: 'Wishlist', href: '#', icon: Heart },
    { name: 'Profile', href: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group',
              pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
