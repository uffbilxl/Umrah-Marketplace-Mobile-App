import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { toast } from 'sonner';
import { calcPoints } from '@/lib/points';
import { ArrowLeft, Trash2 } from 'lucide-react';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Your Basket | Umrah Supermarket'; }, []);

  const memberDiscount = user ? items.reduce((s, i) => s + (i.member_discount > 0 ? i.price * i.quantity * (i.member_discount / 100) : 0), 0) : 0;
  const total = subtotal - memberDiscount;
  const pointsToEarn = calcPoints(total);

  if (items.length === 0) {
    return (
      <>
        <MobileHeader />
        <main className="mobile-page bg-background flex flex-col items-center justify-center px-5">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-shopping-basket text-secondary text-2xl" />
          </div>
          <h1 className="font-header text-xl tracking-[0.08em] uppercase mb-2">Basket Empty</h1>
          <p className="text-sm text-muted-foreground mb-6">Add some products to get started.</p>
          <Link to="/search" className="bg-secondary text-secondary-foreground px-8 py-3 rounded-xl text-sm font-bold tracking-wider uppercase">
            Start Shopping
          </Link>
        </main>
        <BottomTabBar />
      </>
    );
  }

  return (
    <>
      <MobileHeader />
      <main className="mobile-page mobile-scroll-surface bg-background">
        <div className="px-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-6">Your Basket</h1>

          <div className="space-y-3 mb-6">
            {items.map(item => (
              <div key={item.product_id} className="bg-card rounded-xl p-3 flex gap-3 items-center">
                <img src={item.image_url || '/placeholder.svg'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">£{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground text-xs">−</button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground text-xs">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground">£{(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.product_id)} className="block mt-2 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card rounded-xl p-5 mb-4">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              {memberDiscount > 0 && (
                <div className="flex justify-between text-primary"><span>Member Discount</span><span>-£{memberDiscount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-secondary font-semibold"><span>U Points to earn</span><span>+{pointsToEarn} pts</span></div>
            </div>
            <div className="flex justify-between font-header text-lg border-t border-border pt-3 mb-5">
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => user ? navigate('/checkout') : navigate('/rewards')}
              className="w-full bg-secondary text-secondary-foreground py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase"
            >
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default CartPage;
