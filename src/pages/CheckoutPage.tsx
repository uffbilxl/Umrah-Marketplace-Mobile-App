import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { calcPoints } from '@/lib/points';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const paymentMethods = [
  { id: 'card', icon: 'fa-credit-card', label: 'Card' },
  { id: 'apple', icon: 'fab fa-apple-pay', label: 'Apple Pay' },
  { id: 'google', icon: 'fab fa-google-pay', label: 'Google Pay' },
  { id: 'paypal', icon: 'fab fa-paypal', label: 'PayPal' },
];

interface AppliedVoucher { id: number; code: string; value: number; }

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [checkingVoucher, setCheckingVoucher] = useState(false);

  useEffect(() => { document.title = 'Checkout | Umrah Supermarket'; }, []);

  const memberDiscount = user ? items.reduce((s, i) => s + (i.member_discount > 0 ? i.price * i.quantity * (i.member_discount / 100) : 0), 0) : 0;
  const afterMemberDiscount = subtotal - memberDiscount;
  const voucherDiscount = appliedVoucher ? Math.min(appliedVoucher.value, afterMemberDiscount) : 0;
  const total = Math.max(afterMemberDiscount - voucherDiscount, 0);
  const pointsToEarn = calcPoints(total);

  const handleApplyVoucher = async () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    setVoucherError('');
    setCheckingVoucher(true);
    const { data, error } = await supabase.from('vouchers').select('*').eq('code', code).eq('used', false).maybeSingle();
    setCheckingVoucher(false);
    if (error || !data) { setVoucherError('Invalid or used code.'); return; }
    if (user && data.user_id !== user.id) { setVoucherError('Wrong account.'); return; }
    setAppliedVoucher({ id: data.id, code: data.code, value: Number(data.value) });
    toast.success(`Voucher applied: £${Number(data.value).toFixed(2)} off!`);
  };

  const handlePay = async () => {
    setProcessing(true);
    if (appliedVoucher) await supabase.from('vouchers').update({ used: true }).eq('id', appliedVoucher.id);
    setTimeout(() => { setProcessing(false); setComplete(true); clearCart(); }, 2500);
  };

  if (complete) {
    return (
      <>
        <main className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
          <CheckCircle className="w-16 h-16 text-primary mb-4" />
          <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-2">Order Confirmed!</h1>
          <p className="text-sm text-muted-foreground mb-1">Thank you for shopping with us.</p>
          <p className="text-sm text-secondary font-semibold mb-8">+{pointsToEarn} U Points earned</p>
          <div className="flex gap-3">
            <Link to="/search" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-xl text-sm font-bold tracking-wider uppercase">
              Continue Shopping
            </Link>
            <Link to="/profile?tab=orders" className="border border-border text-foreground px-6 py-3 rounded-xl text-sm font-bold tracking-wider uppercase">
              View Orders
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (items.length === 0 && !complete) { navigate('/cart'); return null; }

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background">
        <div className="px-5">
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-6">Checkout</h1>

          {/* Payment methods */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {paymentMethods.map(m => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`py-3 rounded-xl text-center transition-all ${selected === m.id ? 'bg-secondary text-secondary-foreground' : 'bg-card text-muted-foreground border border-border'}`}
              >
                <i className={`${m.icon.startsWith('fab') ? m.icon : `fas ${m.icon}`} text-lg mb-1 block`} />
                <span className="text-[0.6rem] font-semibold">{m.label}</span>
              </button>
            ))}
          </div>

          {selected === 'card' && (
            <div className="bg-card rounded-xl p-4 space-y-3 mb-6">
              <input placeholder="Card Number" className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM / YY" className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <input placeholder="CVC" className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
              </div>
            </div>
          )}

          {/* Voucher */}
          <div className="mb-6">
            {appliedVoucher ? (
              <div className="flex items-center justify-between bg-secondary/10 border border-secondary/30 rounded-xl p-3">
                <span className="text-sm font-semibold text-secondary">{appliedVoucher.code} (-£{appliedVoucher.value.toFixed(2)})</span>
                <button onClick={() => { setAppliedVoucher(null); setVoucherInput(''); }} className="text-xs text-destructive font-semibold">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input placeholder="Voucher code" value={voucherInput} onChange={e => { setVoucherInput(e.target.value); setVoucherError(''); }}
                  className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <button onClick={handleApplyVoucher} disabled={checkingVoucher} className="px-5 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold tracking-wider uppercase disabled:opacity-50">
                  Apply
                </button>
              </div>
            )}
            {voucherError && <p className="text-xs text-destructive mt-1">{voucherError}</p>}
          </div>

          {/* Summary */}
          <div className="bg-card rounded-xl p-5 mb-4">
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              {memberDiscount > 0 && <div className="flex justify-between text-primary"><span>Member Discount</span><span>-£{memberDiscount.toFixed(2)}</span></div>}
              {voucherDiscount > 0 && <div className="flex justify-between text-secondary"><span>Voucher</span><span>-£{voucherDiscount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-secondary font-semibold"><span>Points to earn</span><span>+{pointsToEarn}</span></div>
            </div>
            <div className="flex justify-between font-header text-xl border-t border-border pt-3 mb-5">
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
            <button onClick={handlePay} disabled={processing} className="w-full bg-secondary text-secondary-foreground py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase disabled:opacity-70 flex items-center justify-center gap-2">
              {processing ? <><i className="fas fa-spinner fa-spin" /> Processing...</> : `Pay £${total.toFixed(2)}`}
            </button>
            <p className="text-[0.6rem] text-muted-foreground text-center mt-2"><i className="fas fa-lock mr-1" />Secure · Demo mode</p>
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default CheckoutPage;
