import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { calcVoucherValue, nextVoucherPointsNeeded } from '@/lib/points';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Tag, Clock, ShoppingCart, X } from 'lucide-react';
import patternLeft from '@/assets/pattern-left.png';

const STORES = ['Leicester', 'Liverpool', 'Huddersfield', 'Northampton'];

const RewardsPage = () => {
  const { user, profile, signUp, signIn, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [qrModal, setQrModal] = useState<{ code: string; value: number } | null>(null);

  // Auth state
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', store: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'U Points Rewards | Umrah Supermarket';
  }, []);

  const fetchData = async () => {
    if (!user) return;
    const [purchaseRes, voucherRes] = await Promise.all([
      supabase.from('purchases').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('vouchers').select('*').eq('user_id', user.id).eq('used', false).order('created_at', { ascending: false }),
    ]);
    setPurchases(purchaseRes.data || []);
    setVouchers(voucherRes.data || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signUp(form.email, form.password, form.name, form.phone, form.store);
    if (error) setError(error.message);
    setSubmitting(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    if (error) setError(error.message);
    setSubmitting(false);
  };

  const handleRedeem = async (pts: number, value: number) => {
    if (!user || !profile) return;
    const code = 'UMRAH-' + Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
    const { error } = await supabase.from('vouchers').insert({
      user_id: user.id,
      code,
      value,
      points_spent: pts,
    });
    if (error) { toast.error('Failed to generate voucher'); return; }
    await supabase.from('profiles').update({ points: profile.points - pts }).eq('id', user.id);
    await refreshProfile();
    await fetchData();
    toast.success(`Voucher ${code} created!`);
    setQrModal({ code, value });
  };

  // Not logged in - show auth
  if (!user || !profile) {
    return (
      <>
        <main className="pt-6 pb-24 min-h-screen bg-background">
          <div className="px-5">
            <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-2 text-center">
              U Points Loyalty
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Shop. Earn. Save.
            </p>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-3 text-xs font-bold tracking-[0.1em] uppercase rounded-xl transition-all ${tab === 'register' ? 'bg-secondary text-secondary-foreground' : 'bg-card text-foreground'}`}
              >
                Join
              </button>
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-3 text-xs font-bold tracking-[0.1em] uppercase rounded-xl transition-all ${tab === 'login' ? 'bg-secondary text-secondary-foreground' : 'bg-card text-foreground'}`}
              >
                Sign In
              </button>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4">{error}</div>}

            {tab === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-3">
                <input required placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <input placeholder="Phone Number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <select value={form.store} onChange={e => setForm(p => ({ ...p, store: e.target.value }))} className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50">
                  <option value="">Preferred Store</option>
                  {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" disabled={submitting} className="w-full bg-secondary text-secondary-foreground py-3.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Join Now'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3">
                <input required type="email" placeholder="Email" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <input required type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                <button type="submit" disabled={submitting} className="w-full bg-secondary text-secondary-foreground py-3.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase disabled:opacity-50">
                  {submitting ? 'Signing In...' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginForm({ email: 'demo@umrahsupermarket.co.uk', password: 'UmrahDemo2026!' });
                  }}
                  className="w-full text-xs text-secondary font-semibold py-2"
                >
                  Use Demo Account
                </button>
              </form>
            )}
          </div>
        </main>
        <BottomTabBar />
      </>
    );
  }

  // Logged in dashboard
  const voucherValue = calcVoucherValue(profile.points);
  const ptsToNext = nextVoucherPointsNeeded(profile.points);
  const progressPct = profile.points >= 200 ? 100 : (profile.points / 200) * 100;

  const displayName = `${profile.name.split(' ')[0]} ${profile.name.split(' ').slice(-1)[0]?.[0] || ''}.`;

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background relative overflow-hidden">
        {/* Pattern decoration */}
        <img src={patternLeft} alt="" className="absolute top-28 -left-4 w-10 h-auto opacity-[0.05] pointer-events-none" aria-hidden="true" />

        <div className="px-5">
          {/* Greeting */}
          <div className="mb-5">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="font-header text-3xl tracking-[0.05em] uppercase text-foreground">
              {displayName}
            </h1>
          </div>

          {/* Points card */}
          <div className="gold-shimmer rounded-2xl p-6 mb-6 relative overflow-hidden shadow-[var(--shadow-gold)]">
            <div className="relative z-10">
              <div className="text-sm text-secondary-foreground/70 tracking-[0.15em] uppercase font-bold mb-1">
                Total Balance
              </div>
              <div className="font-header text-[2.8rem] text-secondary-foreground leading-none mb-4">
                {profile.points.toLocaleString()} PTS
              </div>
              <div className="w-full h-2 bg-secondary-foreground/20 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-secondary-foreground rounded-full transition-all"
                  style={{ width: `${Math.min(progressPct, 100)}%` }}
                />
              </div>
              <div className="text-sm text-secondary-foreground/60 font-semibold">
                {ptsToNext > 0 ? `${ptsToNext} points to next reward` : 'Voucher available!'}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: QrCode, label: 'SCAN\nCARD', action: () => {
                if (vouchers.length > 0) {
                  setQrModal({ code: vouchers[0].code, value: Number(vouchers[0].value) });
                } else {
                  toast.info('No vouchers to scan. Redeem your points first!');
                }
              }},
              { icon: Tag, label: 'OFFERS', action: () => navigate('/search') },
              { icon: Clock, label: 'HISTORY', action: () => navigate('/profile?tab=orders') },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="bg-card rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-all"
              >
                <Icon className="w-7 h-7 text-secondary" />
                <span className="text-xs font-bold tracking-wider text-foreground whitespace-pre-line text-center">
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Recent activity */}
          <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">
            Recent activity
          </h3>
          <div className="space-y-3 mb-8">
            {purchases.length === 0 && vouchers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No activity yet.</p>
            ) : (
              <>
                {purchases.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-4 py-3 border-b border-border/50">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">In-store purchase</p>
                      <p className="text-xs text-muted-foreground">
                        {p.store_location || 'Online'} | {new Date(p.date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-secondary">+{p.points_earned}</span>
                  </div>
                ))}
                {vouchers.slice(0, 3).map(v => (
                  <div key={v.id} className="flex items-center gap-4 py-3 border-b border-border/50">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Tag className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Reward Redeemed</p>
                      <p className="text-xs text-muted-foreground">
                        £{Number(v.value).toFixed(0)} Off Voucher | {new Date(v.created_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-destructive">-{v.points_spent}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Redeem section */}
          {profile.points >= 200 && (
            <>
              <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">
                Redeem Points
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { pts: 200, value: 2 },
                  { pts: 300, value: 3 },
                  { pts: 500, value: 5 },
                  { pts: 1000, value: 10 },
                ].filter(t => t.pts <= profile.points).map(tier => (
                  <button
                    key={tier.pts}
                    onClick={() => handleRedeem(tier.pts, tier.value)}
                    className="bg-card border border-border rounded-xl p-4 text-center hover:border-secondary transition-all"
                  >
                    <div className="font-header text-xl text-secondary">£{tier.value}</div>
                    <div className="text-xs text-muted-foreground">{tier.pts} pts</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-[200] bg-background/90 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm text-center relative">
            <button
              onClick={() => setQrModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-header text-lg tracking-[0.1em] uppercase mb-2">
              Your Voucher
            </h3>
            <p className="text-2xl font-bold text-secondary mb-1">£{qrModal.value.toFixed(2)} OFF</p>
            <p className="text-xs text-muted-foreground mb-6">Show this QR code at the till to redeem</p>
            <div className="bg-foreground rounded-xl p-4 inline-block mb-4">
              <QRCodeSVG
                value={qrModal.code}
                size={200}
                level="H"
                bgColor="hsl(0 0% 95%)"
                fgColor="hsl(0 0% 8%)"
              />
            </div>
            <p className="font-mono text-sm font-bold tracking-widest text-foreground mb-2">
              {qrModal.code}
            </p>
            <button
              onClick={() => { navigator.clipboard.writeText(qrModal.code); toast.success('Copied!'); }}
              className="text-xs text-secondary font-semibold"
            >
              <i className="fas fa-copy mr-1" />Copy Code
            </button>
          </div>
        </div>
      )}

      <BottomTabBar />
    </>
  );
};

export default RewardsPage;
