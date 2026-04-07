import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import { toast } from 'sonner';

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Your Basket | Umrah Supermarket'; }, []);

  const memberDiscount = user ? items.reduce((s, i) => s + (i.member_discount > 0 ? i.price * i.quantity * (i.member_discount / 100) : 0), 0) : 0;
  const total = subtotal - memberDiscount;
  const pointsToEarn = Math.floor(total * 10);

  const handleCheckout = async () => {
    if (!user || !profile) {
      navigate('/upoints');
      return;
    }

    const points_earned = pointsToEarn;
    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      total_spent: total,
      points_earned,
      store_location: profile.preferred_store_location || 'Online',
    });

    if (error) {
      toast.error('Checkout failed. Please try again.');
      return;
    }

    // Update points
    const newPoints = profile.points + points_earned;
    const newTier = newPoints >= 5000 ? 'Gold' : newPoints >= 1000 ? 'Silver' : 'Bronze';
    await supabase.from('profiles').update({ points: newPoints, tier: newTier }).eq('id', user.id);
    await refreshProfile();
    clearCart();
    toast.success(`Order placed! You earned ${points_earned} pts.`);
    navigate('/upoints');
  };

  if (items.length === 0) {
    return (
      <>
        <Preloader /><Navbar />
        <main className="pt-28 pb-20 min-h-screen bg-muted">
          <div className="container-umrah text-center py-20">
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shopping-basket text-secondary text-3xl" />
            </div>
            <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-3">Your Basket is Empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to get started.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all">
              Start Shopping <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Preloader /><Navbar />
      <main className="pt-28 pb-20 min-h-screen bg-muted">
        <div className="container-umrah">
          <h1 className="section-title mb-8">Your Basket</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.product_id} className="bg-card rounded-lg p-4 flex gap-4 items-center">
                  <img src={item.image_url || '/placeholder.svg'} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-header text-sm tracking-[0.05em] uppercase">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center border border-border rounded">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-3 py-1 hover:bg-muted">−</button>
                    <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-3 py-1 hover:bg-muted">+</button>
                  </div>
                  <span className="font-header text-base w-20 text-right">£{(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.product_id)} className="text-destructive hover:text-destructive/80 transition-colors">
                    <i className="fas fa-trash text-sm" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg p-6 h-fit sticky top-24">
              <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                {memberDiscount > 0 && (
                  <div className="flex justify-between text-primary"><span>Member Discount</span><span>-£{memberDiscount.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between text-secondary font-semibold">
                  <span>U Points to earn</span><span>+{pointsToEarn} pts</span>
                </div>
              </div>
              <div className="flex justify-between font-header text-lg mb-6">
                <span>Total</span><span>£{total.toFixed(2)}</span>
              </div>
              <button onClick={() => user ? navigate('/checkout') : navigate('/upoints')} className="w-full bg-secondary text-secondary-foreground py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all">
                {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CartPage;
