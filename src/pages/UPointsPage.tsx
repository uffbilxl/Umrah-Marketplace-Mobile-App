import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import { calcVoucherValue, nextVoucherPointsNeeded, redeemCalc } from '@/lib/points';
import { toast } from 'sonner';

const STORES = ['Leicester', 'Liverpool', 'Huddersfield', 'Northampton'];

const UPointsPage = () => {
  const { user, profile, signUp, signIn, signOut, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', store: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    document.title = 'U Points Loyalty | Umrah Supermarket';
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('purchases').select('*').eq('user_id', user.id).order('date', { ascending: false }).then(({ data }) => {
        setPurchases(data || []);
        setPurchaseCount(data?.length || 0);
        setTotalSpent(data?.reduce((s: number, p: any) => s + Number(p.total_spent), 0) || 0);
      });
    }
  }, [user]);

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

  // Logged in dashboard
  if (user && profile) {
    const voucherValue = calcVoucherValue(profile.points);
    const ptsToNext = nextVoucherPointsNeeded(profile.points);
    const progressPct = profile.points >= 200
      ? 100
      : (profile.points / 200) * 100;

    return (
      <>
        <Preloader /><Navbar />
        <main className="pt-28 pb-20 min-h-screen bg-muted">
          <div className="container-umrah max-w-[900px]">
            <h1 className="font-header text-3xl tracking-[0.05em] uppercase mb-2">Welcome back, {profile.name}</h1>
            <div className="gold-line" />

            {/* Points card */}
            <div className="bg-gradient-to-br from-secondary to-umrah-gold-dark rounded-2xl p-8 mb-8 relative overflow-hidden shadow-[var(--shadow-gold)]">
              <div className="absolute -top-8 -right-8 w-[160px] h-[160px] border-2 border-umrah-black/10 rounded-full" />
              <div className="text-sm text-umrah-black/60 tracking-[0.15em] uppercase font-semibold mb-1">Total Balance</div>
              <div className="font-header text-5xl text-umrah-black leading-none mb-4">{profile.points.toLocaleString()} pts</div>
              <div className="w-full h-2 bg-umrah-black/15 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-umrah-black rounded-full transition-all" style={{ width: `${Math.min(progressPct, 100)}%` }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-umrah-black/50 font-semibold">
                  {voucherValue > 0
                    ? `Voucher available: £${voucherValue.toFixed(2)}`
                    : `${ptsToNext} pts until first voucher`}
                </span>
                {ptsToNext > 0 && voucherValue > 0 && (
                  <span className="text-xs text-umrah-black/40">
                    +{ptsToNext} pts to next level
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="font-header text-2xl text-foreground mb-1">£{totalSpent.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground tracking-[0.1em] uppercase">Total Spent</div>
              </div>
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="font-header text-2xl text-foreground mb-1">{purchaseCount}</div>
                <div className="text-xs text-muted-foreground tracking-[0.1em] uppercase">Purchases Made</div>
              </div>
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="font-header text-2xl text-foreground mb-1">{new Date(profile.created_at || '').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</div>
                <div className="text-xs text-muted-foreground tracking-[0.1em] uppercase">Member Since</div>
              </div>
            </div>

            {/* Recent purchases */}
            <div className="bg-card rounded-lg p-6 mb-8">
              <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Recent Purchases</h3>
              {purchases.length === 0 ? (
                <p className="text-sm text-muted-foreground">No purchases yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-muted-foreground tracking-[0.1em] uppercase border-b border-border">
                      <th className="pb-3">Date</th><th className="pb-3">Store</th><th className="pb-3">Total</th><th className="pb-3">Points</th>
                    </tr></thead>
                    <tbody>
                      {purchases.slice(0, 10).map(p => (
                        <tr key={p.id} className="border-b border-border/50">
                          <td className="py-3">{new Date(p.date).toLocaleDateString('en-GB')}</td>
                          <td className="py-3">{p.store_location || '—'}</td>
                          <td className="py-3">£{Number(p.total_spent).toFixed(2)}</td>
                          <td className="py-3 text-secondary font-semibold">+{p.points_earned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Voucher Redemption */}
            <div className="bg-card rounded-lg p-6 mb-8">
              <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Your Voucher</h3>
              {voucherValue > 0 ? (
                <div className="text-center">
                  <div className="font-header text-3xl text-secondary mb-2">£{voucherValue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mb-4">Available to redeem now</div>
                  <button
                    onClick={async () => {
                      const { voucherValue: val, pointsRemaining } = redeemCalc(profile.points);
                      if (val <= 0) return;
                      const code = 'UMRAH-' + Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
                      await supabase.from('profiles').update({ points: pointsRemaining }).eq('id', user.id);
                      await refreshProfile();
                      toast.success(`Voucher generated: ${code} — use this at checkout for £${val.toFixed(2)} off!`);
                    }}
                    className="bg-secondary text-secondary-foreground px-8 py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all"
                  >
                    Redeem £{voucherValue.toFixed(2)} Voucher
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">You need at least 200 points to redeem a voucher.</div>
                  <div className="text-sm text-secondary font-semibold mt-2">{ptsToNext} more points to go!</div>
                </div>
              )}
            </div>

            <button onClick={() => signOut().then(() => navigate('/'))} className="bg-destructive text-destructive-foreground px-8 py-3 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-destructive/90 transition-all">
              Logout
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not logged in
  return (
    <>
      <Preloader /><Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-umrah-black pt-32 pb-20">
          <div className="container-umrah text-center max-w-[700px]">
            <span className="section-label">U Points Loyalty</span>
            <h1 className="section-title text-umrah-white">Shop. Earn. Save.</h1>
            <div className="gold-line mx-auto" />
            <p className="section-subtitle text-umrah-white/50 mx-auto">Join U Points and earn rewards every time you shop. Collect points and redeem them for vouchers to save on your next purchase.</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-background">
          <div className="container-umrah">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { step: '01', title: 'Earn', desc: '1 point for every £1 spent in store or online', icon: 'fa-coins' },
                { step: '02', title: 'Collect', desc: 'Reach 200 points to unlock your first voucher', icon: 'fa-piggy-bank' },
                { step: '03', title: 'Save', desc: 'Redeem points for vouchers — the more you collect, the more you save', icon: 'fa-tag' },
              ].map(s => (
                <div key={s.step} className="text-center p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${s.icon} text-secondary text-xl`} />
                  </div>
                  <div className="text-xs text-secondary tracking-[0.2em] uppercase font-semibold mb-2">Step {s.step}</div>
                  <h3 className="font-header text-xl tracking-[0.08em] uppercase mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Voucher value table */}
            <div className="max-w-[600px] mx-auto mb-16">
              <h2 className="font-header text-lg tracking-[0.08em] uppercase text-center mb-6">Voucher Values</h2>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground tracking-[0.1em] uppercase border-b border-border bg-muted">
                      <th className="p-4">Points</th>
                      <th className="p-4">Voucher Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[200, 250, 300, 350, 400, 500].map(pts => (
                      <tr key={pts} className="border-b border-border/50">
                        <td className="p-4 font-semibold">{pts} pts</td>
                        <td className="p-4 text-secondary font-semibold">£{calcVoucherValue(pts).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 text-xs text-muted-foreground bg-muted">
                  Every additional 50 points adds £0.50 to your voucher value.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auth forms */}
        <section className="py-20 bg-muted">
          <div className="container-umrah max-w-[500px]">
            <div className="flex gap-4 mb-8">
              <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-3 text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-all ${tab === 'register' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}>
                Join U Points
              </button>
              <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-3 text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-all ${tab === 'login' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}>
                Sign In
              </button>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">{error}</div>}

            {tab === 'register' ? (
              <form onSubmit={handleRegister} className="bg-card rounded-lg p-6 space-y-4">
                <input required placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input placeholder="Phone Number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <select value={form.store} onChange={e => setForm(p => ({ ...p, store: e.target.value }))} className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Preferred Store</option>
                  {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" disabled={submitting} className="w-full bg-secondary text-secondary-foreground py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all disabled:opacity-50">
                  {submitting ? 'Creating Account...' : 'Join Now'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="bg-card rounded-lg p-6 space-y-4">
                <input required type="email" placeholder="Email" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <input required type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="submit" disabled={submitting} className="w-full bg-secondary text-secondary-foreground py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all disabled:opacity-50">
                  {submitting ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default UPointsPage;
