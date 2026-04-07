import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBasket, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import AuthModal from '@/components/AuthModal';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome
    ? 'bg-umrah-black/[0.97] backdrop-blur-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-3'
    : 'py-5';

  const navLinkClass = "text-[0.8rem] font-medium text-umrah-white tracking-[0.15em] uppercase relative py-1 hover:text-secondary transition-all duration-400 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-secondary after:transition-all after:duration-400 hover:after:w-full";

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.info("You've been signed out");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-400 ${navBg}`}>
        <div className="container-umrah flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start">
            <img src="/images/umrah_logo.png" alt="Umrah Supermarket" className="h-10 md:h-12" />
          </Link>
          <div className="hidden md:flex items-center gap-9">
            <Link to="/shop" className={navLinkClass}>Shop</Link>
            <Link to="/deals" className={navLinkClass}>Deals</Link>
            <Link to="/upoints" className={navLinkClass}>
              U Points
              {user && profile && (
                <span className="ml-2 bg-secondary text-umrah-black text-[0.65rem] font-bold px-2 py-0.5 rounded-full">
                  {profile.points.toLocaleString()} pts
                </span>
              )}
            </Link>
            <Link to="/stores" className={navLinkClass}>Stores</Link>
            <Link to="/about" className={navLinkClass}>About</Link>
            <Link to="/cart" className="relative text-umrah-white hover:text-secondary transition-all">
              <ShoppingBasket className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-umrah-black text-[0.6rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user && profile ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-secondary text-umrah-black px-4 py-2 rounded-[2px] text-[0.8rem] font-semibold tracking-[0.1em] uppercase hover:bg-umrah-white transition-all"
                >
                  <span className="w-6 h-6 bg-umrah-black/10 rounded-full flex items-center justify-center text-[0.6rem] font-bold">
                    {initials}
                  </span>
                  {profile.name.split(' ')[0]}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-[var(--shadow-lg)] border border-border overflow-hidden z-50">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="/profile?tab=orders" className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                      📦 My Orders
                    </Link>
                    <Link to="/upoints" className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                      ⭐ U Points
                    </Link>
                    <div className="border-t border-border" />
                    <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors w-full">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="bg-secondary text-umrah-black px-6 py-2.5 rounded-[2px] text-[0.8rem] font-semibold tracking-[0.15em] uppercase hover:bg-umrah-white transition-all"
              >
                Sign In
              </button>
            )}
          </div>
          <button
            className="md:hidden flex flex-col gap-[5px] z-[1001] bg-transparent border-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`w-7 h-[2px] bg-umrah-white transition-all block ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-7 h-[2px] bg-umrah-white transition-all block ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-7 h-[2px] bg-umrah-white transition-all block ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 bg-umrah-black z-[999] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Link to="/shop" className="font-header text-3xl text-umrah-white tracking-[0.1em] uppercase hover:text-secondary">Shop</Link>
        <Link to="/deals" className="font-header text-3xl text-umrah-white tracking-[0.1em] uppercase hover:text-secondary">Deals</Link>
        <Link to="/upoints" className="font-header text-3xl text-umrah-white tracking-[0.1em] uppercase hover:text-secondary">U Points</Link>
        <Link to="/stores" className="font-header text-3xl text-umrah-white tracking-[0.1em] uppercase hover:text-secondary">Stores</Link>
        <Link to="/about" className="font-header text-3xl text-umrah-white tracking-[0.1em] uppercase hover:text-secondary">About</Link>
        <Link to="/cart" className="font-header text-3xl text-umrah-white tracking-[0.1em] uppercase hover:text-secondary">
          Basket {totalItems > 0 && `(${totalItems})`}
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="font-header text-3xl text-umrah-white tracking-[0.1em] uppercase hover:text-secondary">Profile</Link>
            <button onClick={handleSignOut} className="bg-secondary text-umrah-black px-8 py-3 rounded-[2px] font-semibold tracking-[0.15em] uppercase mt-4">
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
            className="bg-secondary text-umrah-black px-8 py-3 rounded-[2px] font-semibold tracking-[0.15em] uppercase mt-4"
          >
            Sign In
          </button>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;
