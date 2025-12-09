export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl mb-4 tracking-normal">Tux N Ties</h3>
            <p className="text-sm font-normal text-white/90 leading-relaxed">
              Your premier destination for premium tuxedo rentals and purchases.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm tracking-normal">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/inventory" className="text-sm font-medium hover:text-primary transition-colors">
                  Browse Inventory
                </a>
              </li>
              <li>
                <a href="/bookings" className="text-sm font-medium hover:text-primary transition-colors">
                  Book Fitting
                </a>
              </li>
              <li>
                <a href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm tracking-normal">Contact</h4>
            <p className="text-sm font-normal text-white/90 leading-relaxed">
              info@tuxnties.com
              <br />
              (559) 889-2717
            </p>
          </div>
        </div>
        <div className="border-t-2 border-white/20 mt-12 pt-8 text-center">
          <p className="text-sm font-medium">&copy; 2025 Tux N Ties. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

