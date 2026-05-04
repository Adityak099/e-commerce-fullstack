import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-2xl">
                F
              </div>
              <span className="font-bold text-3xl">FreshMart</span>
            </div>
            
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xs">
              Fresh groceries delivered to your doorstep in minutes. 
              Quality you can trust, speed you can rely on.
            </p>

            <p className="mt-6 text-sm text-white/60">
              Made with ❤️ in India
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">Shop</h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=fruits" className="hover:text-white transition-colors">Fruits & Vegetables</Link>
              </li>
              <li>
                <Link href="/products?category=dairy" className="hover:text-white transition-colors">Dairy, Bread & Eggs</Link>
              </li>
              <li>
                <Link href="/products?category=snacks" className="hover:text-white transition-colors">Snacks & Munchies</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">Company</h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">Support</h4>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© 2026 FreshMart. All rights reserved.</p>
          <p>Patna, Bihar • Fast Delivery</p>
        </div>
      </div>
    </footer>
  );
}