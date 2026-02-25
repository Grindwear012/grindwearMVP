import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { Logo } from './logo';

export default function Footer() {
  return (
    <footer className="hidden border-t bg-background md:block">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <Logo className="h-16 mb-2" />
            <p className="text-muted-foreground text-sm">Sustainable style, one piece at a time.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
            <div>
              <h3 className="font-semibold mb-2">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="/products?category=Men" className="text-sm text-muted-foreground hover:text-primary">Men</Link></li>
                <li><Link href="/products?category=Women" className="text-sm text-muted-foreground hover:text-primary">Women</Link></li>
                <li><Link href="/products?category=Accessories" className="text-sm text-muted-foreground hover:text-primary">Accessories</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Sale</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold mb-2">About</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Our Story</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold mb-2">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/account" className="text-sm text-muted-foreground hover:text-primary">My Account</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  <Link href="/admin" className="hover:text-primary transition-colors">
                    &copy; {new Date().getFullYear()} Thrift Clothing Plug. All Rights Reserved.
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">Powered by GRINDWEAR STUDIOS</p>
            </div>
           <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
