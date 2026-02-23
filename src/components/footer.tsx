import Link from 'next/link';
import { Sparkles, Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start">
             <Link href="/" className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-6 w-6" />
              <span className="font-bold">
                thrift_clothing_plug_
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">Sustainable style, one piece at a time.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
            <div>
              <h3 className="font-semibold mb-2">Shop</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">New Arrivals</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Tops</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Bottoms</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Sale</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold mb-2">About</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Our Story</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Sustainability</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
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
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} thrift_clothing_plug_. All Rights Reserved.</p>
           <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
