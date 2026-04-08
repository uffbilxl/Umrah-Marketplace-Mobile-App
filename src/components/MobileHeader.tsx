import { useCart } from '@/contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const MobileHeader = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="ios-fixed-surface safe-top fixed inset-x-0 top-0 z-40 border-b border-border/30 bg-background/95 backdrop-blur-xl">
      <div className="mobile-header-frame flex items-center justify-between px-5 py-2">
        <Link to="/" className="hover-scale">
          <img
            src="/images/umrah_logo.png"
            alt="Umrah Supermarket"
            className="h-11 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => navigate('/cart')}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-secondary transition-transform duration-200 hover:scale-110"
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
