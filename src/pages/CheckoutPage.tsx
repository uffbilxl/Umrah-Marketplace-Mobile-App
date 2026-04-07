import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import { calcPoints } from '@/lib/points';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'card', icon: 'fa-credit-card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex' },
  { id: 'apple', icon: 'fab fa-apple-pay', label: 'Apple Pay', desc: 'Pay with Face ID or Touch ID' },
  { id: 'google', icon: 'fab fa-google-pay', label: 'Google Pay', desc: 'Fast checkout with Google' },
  { id: 'paypal', icon: 'fab fa-paypal', label: 'PayPal', desc: 'Pay with your PayPal account' },
  { id: 'klarna', icon: 'fa-clock', label: 'Klarna — Pay Later', desc: 'Buy now, pay in 3 instalments' },
];

interface AppliedVoucher {
  id: number;
  code: string;
  value: number;
}

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  // Voucher state
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

    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', code)
      .eq('used', false)
      .maybeSingle();

    setCheckingVoucher(false);

    if (error || !data) {
      setVoucherError('Invalid or already used voucher code.');
      return;
    }

    if (user && data.user_id !== user.id) {
      setVoucherError('This voucher belongs to a different account.');
      return;
    }

    setAppliedVoucher({ id: data.id, code: data.code, value: Number(data.value) });
    toast.success(`Voucher applied: £${Number(data.value).toFixed(2)} off!`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
  };

  const handlePay = async () => {
    setProcessing(true);

    // Mark voucher as used if applied
    if (appliedVoucher) {
      await supabase.from('vouchers').update({ used: true }).eq('id', appliedVoucher.id);
    }

    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
      clearCart();
    }, 2500);
  };

  if (complete) {
    return (
      <>
        <Preloader /><Navbar />
        <main className="pt-28 pb-20 min-h-screen bg-muted">
          <div className="container-umrah max-w-[560px] text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-primary text-4xl" />
            </div>
            <h1 className="font-header text-3xl tracking-[0.08em] uppercase mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">Thank you for shopping with Umrah Supermarket.</p>
            <p className="text-secondary font-semibold mb-8">You earned +{pointsToEarn} U Points with this order.</p>
            <div className="bg-card rounded-lg p-6 mb-8 text-left">
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Order Number</span><span className="font-semibold">UM-{Date.now().toString().slice(-6)}</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Payment Method</span><span className="font-semibold capitalize">{paymentMethods.find(m => m.id === selected)?.label}</span></div>
              {appliedVoucher && (
                <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Voucher Used</span><span className="font-semibold">{appliedVoucher.code}</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Paid</span><span className="font-header text-lg">£{total.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/shop" className="bg-secondary text-secondary-foreground px-8 py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all">
                Continue Shopping
              </Link>
              <Link to="/profile?tab=orders" className="border-2 border-primary text-primary px-8 py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                View Orders
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0 && !complete) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Preloader /><Navbar />
      <main className="pt-28 pb-20 min-h-screen bg-muted">
        <div className="container-umrah max-w-[900px]">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <i className="fas fa-arrow-left" /> Back to Basket
          </Link>
          <h1 className="section-title mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-4">
              <h2 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Select Payment Method</h2>
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelected(method.id)}
                  className={`w-full flex items-center gap-4 p-5 rounded-lg border-2 transition-all text-left ${
                    selected === method.id
                      ? 'border-secondary bg-secondary/5 shadow-[0_0_0_1px_hsl(var(--umrah-gold)/0.3)]'
                      : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    selected === method.id ? 'bg-secondary text-umrah-black' : 'bg-muted text-muted-foreground'
                  }`}>
                    <i className={`${method.icon.startsWith('fab') ? method.icon : `fas ${method.icon}`} text-xl`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{method.label}</div>
                    <div className="text-xs text-muted-foreground">{method.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected === method.id ? 'border-secondary' : 'border-muted-foreground/30'
                  }`}>
                    {selected === method.id && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
                  </div>
                </button>
              ))}

              {selected === 'card' && (
                <div className="bg-card rounded-lg p-6 border border-border space-y-4 mt-2">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Card Number</label>
                    <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Expiry</label>
                      <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">CVC</label>
                      <input type="text" placeholder="123" className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 sticky top-24">
                <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Order Summary</h3>
                <div className="space-y-3 max-h-[200px] overflow-y-auto mb-4">
                  {items.map(item => (
                    <div key={item.product_id} className="flex items-center gap-3">
                      <img src={item.image_url || '/placeholder.svg'} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">×{item.quantity}</div>
                      </div>
                      <span className="text-xs font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Voucher input */}
                <div className="border-t border-border pt-4 mb-4">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Voucher Code</label>
                  {appliedVoucher ? (
                    <div className="flex items-center justify-between bg-secondary/10 border border-secondary/30 rounded p-3">
                      <div>
                        <span className="text-sm font-semibold text-secondary">{appliedVoucher.code}</span>
                        <span className="text-xs text-muted-foreground ml-2">-£{appliedVoucher.value.toFixed(2)}</span>
                      </div>
                      <button onClick={handleRemoveVoucher} className="text-xs text-destructive hover:text-destructive/80 font-semibold">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. UMRAH-ABCD1234"
                        value={voucherInput}
                        onChange={e => { setVoucherInput(e.target.value); setVoucherError(''); }}
                        className="flex-1 px-3 py-2 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        disabled={checkingVoucher || !voucherInput.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded text-xs font-bold tracking-wider uppercase hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {checkingVoucher ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  {voucherError && <p className="text-xs text-destructive mt-1">{voucherError}</p>}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                  {memberDiscount > 0 && (
                    <div className="flex justify-between text-primary"><span>Member Discount</span><span>-£{memberDiscount.toFixed(2)}</span></div>
                  )}
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-secondary"><span>Voucher</span><span>-£{voucherDiscount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-secondary font-semibold"><span>U Points to earn</span><span>+{pointsToEarn} pts</span></div>
                  <div className="border-t border-border pt-3 flex justify-between font-header text-lg">
                    <span>Total</span><span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full mt-6 bg-secondary text-secondary-foreground py-3.5 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <><i className="fas fa-spinner fa-spin" /> Processing...</>
                  ) : (
                    <>Pay £{total.toFixed(2)}</>
                  )}
                </button>
                <p className="text-[0.65rem] text-muted-foreground text-center mt-3">
                  <i className="fas fa-lock mr-1" /> Secure payment · Demo mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
