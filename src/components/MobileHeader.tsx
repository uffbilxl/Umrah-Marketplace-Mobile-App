import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const MobileHeader = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-5 pt-[env(safe-area-inset-top,12px)] pb-3 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <img
          src="/images/umrah_logo.png"
          alt="Umrah Supermarket"
          className="h-12 w-auto object-contain"
        />
        <button
          onClick={() => navigate('/cart')}
          className="relative w-11 h-11 bg-secondary rounded-full flex items-center justify-center"
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
