import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import AuthModal from '@/components/AuthModal';
import { toast } from 'sonner';
import { Loader2, Settings, ChevronRight, LogOut, User, Lock, MapPin, Phone } from 'lucide-react';
import patternRight from '@/assets/pattern-right.png';

const STORES = ['Leicester', 'Liverpool', 'Huddersfield', 'Northampton'];

const ProfilePage = () => {
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'settings';

  const [activeSection, setActiveSection] = useState<string | null>(initialTab === 'orders' ? 'orders' : null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStore, setEditStore] = useState('');
  const [saving, setSaving] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => { document.title = 'Profile | Umrah Supermarket'; }, []);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditPhone(profile.phone_number || '');
      setEditStore(profile.preferred_store_location || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setOrdersLoading(true);
      const { data } = await supabase.from('purchases').select('*').eq('user_id', user.id).order('date', { ascending: false });
      setOrders(data || []);
      setOrdersLoading(false);
    };
    fetchOrders();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      name: editName.trim(),
      phone_number: editPhone || null,
      preferred_store_location: editStore || null,
    }).eq('id', user.id);
    setSaving(false);
    if (error) { toast.error('Failed to update'); return; }
    await refreshProfile();
    toast.success('Profile updated');
  };

  const handleChangePassword = async () => {
    if (newPass.length < 8) { toast.error('Min 8 characters'); return; }
    if (newPass !== confirmPass) { toast.error('Passwords don\'t match'); return; }
    setChangingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setChangingPass(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Password updated');
    setNewPass(''); setConfirmPass('');
  };

  if (authLoading) {
    return (
      <>
        <MobileHeader />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </main>
        <BottomTabBar />
      </>
    );
  }

  if (!user || !profile) {
    return (
      <>
        <MobileHeader />
        <main className="pt-20 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-5">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-header text-xl tracking-[0.08em] uppercase mb-2">My Account</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Sign in to view your profile, order history and U Points balance.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-secondary text-secondary-foreground px-8 py-3 rounded-xl text-sm font-bold tracking-wider uppercase"
          >
            Sign In or Register
          </button>
          <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </main>
        <BottomTabBar />
      </>
    );
  }

  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = new Date(profile.created_at || '').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const inputCls = "w-full px-4 py-3.5 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  const menuItems = [
    { key: 'edit', icon: User, label: 'Edit Profile' },
    { key: 'orders', icon: Settings, label: 'Order History' },
    { key: 'password', icon: Lock, label: 'Change Password' },
  ];

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background relative overflow-hidden">
        <img src={patternRight} alt="" className="absolute bottom-40 -right-4 w-10 h-auto opacity-[0.05] pointer-events-none" aria-hidden="true" />

        <div className="px-5">
          {/* Profile header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-header text-xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="font-header text-xl tracking-[0.05em] uppercase text-foreground">
                {profile.name}
              </h1>
              <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
              <p className="text-xs text-secondary font-semibold">{profile.points.toLocaleString()} U Points</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="bg-card rounded-xl overflow-hidden mb-6">
            {menuItems.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(activeSection === key ? null : key)}
                className="w-full flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-all"
              >
                <Icon className="w-5 h-5 text-secondary" />
                <span className="flex-1 text-left text-sm font-semibold text-foreground">{label}</span>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === key ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </div>

          {/* Edit Profile */}
          {activeSection === 'edit' && (
            <div className="bg-card rounded-xl p-5 mb-6 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase mb-1 block">Full Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase mb-1 block">Phone</label>
                <input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="07700 000 000" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase mb-1 block">Preferred Store</label>
                <select value={editStore} onChange={e => setEditStore(e.target.value)} className={inputCls}>
                  <option value="">Select</option>
                  {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-bold tracking-wider uppercase disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Order History */}
          {activeSection === 'orders' && (
            <div className="bg-card rounded-xl p-5 mb-6">
              {ordersLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-secondary" /></div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 10).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.date).toLocaleDateString('en-GB')} • {order.store_location || 'Online'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">£{Number(order.total_spent).toFixed(2)}</p>
                        <p className="text-xs text-secondary font-semibold">+{order.points_earned} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Change Password */}
          {activeSection === 'password' && (
            <div className="bg-card rounded-xl p-5 mb-6 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase mb-1 block">New Password</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 8 characters" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground tracking-wider uppercase mb-1 block">Confirm Password</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter password" className={inputCls} />
              </div>
              <button onClick={handleChangePassword} disabled={changingPass} className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl text-sm font-bold tracking-wider uppercase disabled:opacity-50">
                {changingPass ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={() => signOut().then(() => navigate('/'))}
            className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive py-4 rounded-xl text-sm font-bold tracking-wider uppercase"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default ProfilePage;
