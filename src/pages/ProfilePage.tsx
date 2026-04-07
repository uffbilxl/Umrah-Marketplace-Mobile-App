import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { calcVoucherValue, nextVoucherPointsNeeded, redeemCalc } from '@/lib/points';

const STORES = ['Leicester', 'Liverpool', 'Huddersfield', 'Northampton'];

const ProfilePage = () => {
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'details';
  const [tab, setTab] = useState<string>(initialTab);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStore, setEditStore] = useState('');
  const [saving, setSaving] = useState(false);

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => { document.title = 'My Profile | Umrah Supermarket'; }, []);

  useEffect(() => {
    if (!authLoading && !user) navigate('/upoints');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditPhone(profile.phone_number || '');
      setEditStore(profile.preferred_store_location || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .then(({ data }) => {
          setOrders(data || []);
          setOrdersLoading(false);
          if (data && data.length > 0) setExpandedOrder(data[0].id);
        });
    }
  }, [user]);

  const handleSaveDetails = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      name: editName.trim(),
      phone_number: editPhone || null,
      preferred_store_location: editStore || null,
    }).eq('id', user.id);
    setSaving(false);
    if (error) { toast.error('Failed to update profile'); return; }
    await refreshProfile();
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = async () => {
    if (newPass.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords do not match'); return; }
    setChangingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setChangingPass(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Password updated successfully');
    setNewPass(''); setConfirmPass('');
  };

  const handleRedeem = async () => {
    if (!profile || !user) return;
    const { voucherValue, pointsRemaining, pointsRedeemed } = redeemCalc(profile.points);
    if (voucherValue <= 0) return;
    const code = 'UMRAH-' + Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
    const { error } = await supabase.from('vouchers').insert({
      user_id: user.id,
      code,
      value: voucherValue,
      points_spent: pointsRedeemed,
    });
    if (error) { toast.error('Failed to generate voucher'); return; }
    await supabase.from('profiles').update({ points: pointsRemaining }).eq('id', user.id);
    await refreshProfile();
    toast.success(`Voucher generated: ${code} — use this at checkout for £${voucherValue.toFixed(2)} off!`);
  };

  if (authLoading || !profile) {
    return (
      <>
        <Preloader /><Navbar />
        <main className="pt-28 pb-20 min-h-screen bg-muted flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </main>
        <Footer />
      </>
    );
  }

  const voucherValue = calcVoucherValue(profile.points);
  const ptsToNext = nextVoucherPointsNeeded(profile.points);
  const progressPct = profile.points >= 200 ? 100 : (profile.points / 200) * 100;

  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = new Date(profile.created_at || '').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const inputCls = "w-full px-4 py-3 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all";
  const tabCls = (t: string) => `px-6 py-3 text-sm font-semibold tracking-[0.1em] uppercase transition-all border-b-[3px] ${tab === t ? 'border-secondary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`;

  const runningTotals = [...orders].reverse().reduce<{ id: number; running: number }[]>((acc, o) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].running : 0;
    acc.push({ id: o.id, running: prev + o.points_earned });
    return acc;
  }, []);
  const runningMap = new Map(runningTotals.map(r => [r.id, r.running]));

  return (
    <>
      <Preloader /><Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-primary pt-28 pb-10">
          <div className="container-umrah flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-header text-xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-header text-2xl md:text-3xl tracking-[0.05em] uppercase text-primary-foreground">{profile.name}</h1>
              <div className="flex items-center gap-3 mt-1 justify-center md:justify-start">
                <span className="text-xs text-primary-foreground/60">Member since {memberSince}</span>
              </div>
            </div>
            <div className="md:ml-auto text-center md:text-right">
              <div className="font-header text-3xl text-secondary">{profile.points.toLocaleString()}</div>
              <div className="text-xs text-primary-foreground/60 tracking-[0.1em] uppercase">U Points</div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="bg-card border-b border-border sticky top-[64px] z-[100]">
          <div className="container-umrah flex gap-0">
            <button onClick={() => setTab('details')} className={tabCls('details')}>My Details</button>
            <button onClick={() => setTab('orders')} className={tabCls('orders')}>My Orders</button>
            <button onClick={() => setTab('points')} className={tabCls('points')}>U Points</button>
          </div>
        </div>

        <div className="bg-muted pb-20">
          <div className="container-umrah max-w-[900px] pt-8">

            {/* TAB: My Details */}
            {tab === 'details' && (
              <div className="space-y-8">
                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-6">Profile Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-1 block">Full Name</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-1 block">Email Address</label>
                      <input value={profile.email} readOnly className={`${inputCls} bg-muted/60 cursor-not-allowed`} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-1 block">Phone Number</label>
                      <input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="07700 000 000" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-1 block">Preferred Store</label>
                      <select value={editStore} onChange={e => setEditStore(e.target.value)} className={inputCls}>
                        <option value="">Select a store</option>
                        {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-1 block">Member Since</label>
                      <input value={memberSince} readOnly className={`${inputCls} bg-muted/60 cursor-not-allowed`} />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={handleSaveDetails} disabled={saving} className="bg-primary text-primary-foreground px-8 py-3 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
                    </button>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-6">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[600px]">
                    <div className="md:col-span-2">
                      <label className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-1 block">New Password</label>
                      <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 8 characters" className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-1 block">Confirm New Password</label>
                      <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter new password" className={inputCls} />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={handleChangePassword} disabled={changingPass} className="bg-primary text-primary-foreground px-8 py-3 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                      {changingPass ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
                    </button>
                  </div>
                </div>

                <button onClick={() => signOut().then(() => navigate('/'))} className="bg-destructive text-destructive-foreground px-8 py-3 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-destructive/90 transition-all">
                  Sign Out
                </button>
              </div>
            )}

            {/* TAB: My Orders */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {ordersLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
                ) : orders.length === 0 ? (
                  <div className="bg-card rounded-lg p-12 text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="font-header text-lg tracking-[0.08em] uppercase mb-2">No Orders Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">Start shopping to see your order history here.</p>
                    <a href="/shop" className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all">
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-card rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-header text-sm tracking-[0.05em]">Order #{order.id}</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          {order.store_location && <span className="text-xs text-muted-foreground">• {order.store_location}</span>}
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">Confirmed</span>
                        </div>
                        <span className="font-header text-base">£{Number(order.total_spent).toFixed(2)}</span>
                      </button>
                      {expandedOrder === order.id && (
                        <div className="border-t border-border p-4">
                          <div className="flex items-center justify-between mt-2 pt-2 text-sm">
                            <span className="text-secondary font-semibold">Points earned: +{order.points_earned} pts</span>
                            <span className="font-header">Total: £{Number(order.total_spent).toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: U Points */}
            {tab === 'points' && (
              <div className="space-y-8">
                {/* Balance card */}
                <div className="bg-gradient-to-br from-secondary to-umrah-gold-dark rounded-2xl p-8 relative overflow-hidden shadow-[var(--shadow-gold)]">
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
                  </div>
                </div>

                {/* Redeem */}
                <div>
                  <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Redeem Your Points</h3>
                  {voucherValue > 0 ? (
                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                      <div className="font-header text-3xl text-secondary mb-1">£{voucherValue.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Voucher</div>
                      <div className="text-sm font-semibold mb-4">Based on your {profile.points} pts</div>
                      <button
                        onClick={handleRedeem}
                        className="bg-secondary text-secondary-foreground px-8 py-3 rounded-[2px] text-sm font-bold tracking-[0.1em] uppercase hover:bg-umrah-gold-dark transition-all"
                      >
                        Redeem Voucher
                      </button>
                      {ptsToNext > 0 && (
                        <div className="text-xs text-muted-foreground mt-3">
                          Earn {ptsToNext} more points to increase your voucher by £0.50
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                      <div className="text-sm text-muted-foreground mb-2">You need at least 200 points to redeem a voucher.</div>
                      <div className="text-sm text-secondary font-semibold">{ptsToNext} more points to go!</div>
                    </div>
                  )}
                </div>

                {/* Points history */}
                <div className="bg-card rounded-lg p-6">
                  <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Points History</h3>
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No transactions yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-muted-foreground tracking-[0.1em] uppercase border-b border-border">
                            <th className="pb-3">Date</th><th className="pb-3">Store</th><th className="pb-3">Spent</th><th className="pb-3">Earned</th><th className="pb-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} className="border-b border-border/50">
                              <td className="py-3">{new Date(o.date).toLocaleDateString('en-GB')}</td>
                              <td className="py-3">{o.store_location || '—'}</td>
                              <td className="py-3">£{Number(o.total_spent).toFixed(2)}</td>
                              <td className="py-3 text-secondary font-semibold">+{o.points_earned}</td>
                              <td className="py-3 font-semibold">{runningMap.get(o.id)?.toLocaleString() || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
