import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">ASYLEN VENTURES</h4>
            <p className="text-white/80">
              Your trusted partner in real estate excellence.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href="/properties" className="hover:text-white">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">For Agents</h5>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href="/signup" className="hover:text-white">
                  Join Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
          <p>&copy; 2024 ASYLEN VENTURES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
