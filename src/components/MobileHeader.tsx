import { useCart } from '@/contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const MobileHeader = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-5 pt-[env(safe-area-inset-top,8px)] pb-2 bg-background/95 backdrop-blur-xl border-b border-border/30">
      <div className="flex items-center justify-between">
        <Link to="/" className="hover-scale">
          <img
            src="/images/umrah_logo.png"
            alt="Umrah Supermarket"
            className="h-12 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => navigate('/cart')}
          className="relative w-11 h-11 bg-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
        >
          <ShoppingCart className="w-5 h-5 text-secondary-foreground" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[0.6rem] font-bold text-destructive-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
