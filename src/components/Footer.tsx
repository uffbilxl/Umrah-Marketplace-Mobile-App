import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-umrah-black pt-20">
      <div className="container-umrah">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-16 border-b border-umrah-white/[0.06]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex flex-col items-start mb-5">
              <img src="/images/umrah_logo.png" alt="Umrah Supermarket" className="h-10" />
            </Link>
            <p className="text-sm text-umrah-white/50 leading-7 mb-6 max-w-[300px]">
              Providing multicultural communities across the UK with premium Halal meats, fresh produce, and international groceries at the best prices.
            </p>
            <div className="flex gap-3">
              {['instagram', 'facebook-f', 'twitter'].map(icon => (
                <a key={icon} href="#" className="w-10 h-10 border border-umrah-white/10 rounded flex items-center justify-center text-umrah-white hover:bg-secondary hover:border-secondary hover:text-umrah-black transition-all">
                  <i className={`fab fa-${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-header text-[0.8rem] text-secondary tracking-[0.15em] uppercase mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">About Us</Link></li>
              <li><Link to="/shop" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">Shop Categories</Link></li>
              <li><Link to="/deals" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">Weekly Deals</Link></li>
              <li><Link to="/upoints" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">Loyalty App</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-header text-[0.8rem] text-secondary tracking-[0.15em] uppercase mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link to="/stores" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">Store Locator</Link></li>
              <li><a href="#" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">Return Policy</a></li>
              <li><a href="#" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">Halal Certification</a></li>
              <li><a href="#" className="text-sm text-umrah-white/50 hover:text-secondary hover:pl-1 transition-all">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-header text-[0.8rem] text-secondary tracking-[0.15em] uppercase mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-secondary text-sm mt-1" />
                <span className="text-sm text-umrah-white/50 leading-6">HQ: 123 Retail Park,<br/>Leicester, LE1 1AA</span>
              </div>
              <div className="flex items-start gap-3">
                <i className="fas fa-envelope text-secondary text-sm mt-1" />
                <span className="text-sm text-umrah-white/50">info@umrahsupermarket.co.uk</span>
              </div>
              <div className="flex items-start gap-3">
                <i className="fas fa-phone text-secondary text-sm mt-1" />
                <span className="text-sm text-umrah-white/50">0116 000 0000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-umrah-white/30">&copy; 2026 Umrah Supermarket. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-umrah-white/30 hover:text-secondary">Privacy Policy</a>
            <a href="#" className="text-xs text-umrah-white/30 hover:text-secondary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
