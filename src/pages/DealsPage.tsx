import { useEffect, useState } from 'react';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dealsList = [
  { id: 1, title: 'Lamb Leg Whole', badge: 'Double Deal', desc: 'Premium whole lamb leg, 100% Halal.', price: '£8.99/kg', original: '£11.99/kg', img: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=600&q=80' },
  { id: 2, title: 'Shan Biryani Masala 10-pack', badge: 'Mega Pack', desc: 'Authentic biryani spice, family size.', price: '£9.99', original: '£14.99', img: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&q=80' },
  { id: 3, title: 'Basmati Rice 10kg', badge: 'Save 20%', desc: 'Premium extra long grain Basmati.', price: '£12.00', original: '£15.00', img: 'https://images.unsplash.com/photo-1587049352847-4d4b126a5424?w=600&q=80' },
  { id: 4, title: 'By Sara Samosa Bundle', badge: 'Mega Pack', desc: 'Mixed samosa family bundle.', price: '£34.99', original: '£45.00', img: 'https://images.unsplash.com/photo-1585985740516-e0b80c3c1da8?w=600&q=80' },
  { id: 5, title: 'Regal Sauce Triple Pack', badge: 'Save 30%', desc: 'Garlic mayo, chilli, peri peri trio.', price: '£3.99', original: '£5.67', img: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&q=80' },
  { id: 6, title: 'Chicken Breast 5kg', badge: 'Double Deal', desc: 'Premium Halal chicken breast bulk.', price: '£24.99', original: '£32.99', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80' },
  { id: 7, title: 'Fresh Produce Box', badge: 'U Points Bonus', desc: 'Seasonal veg box + 500 bonus pts.', price: '£15.00', original: '', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80' },
  { id: 8, title: 'Frozen Family Pack', badge: 'Mega Pack', desc: 'Family frozen favourites bundle.', price: '£39.99', original: '£54.99', img: 'https://images.unsplash.com/photo-1585985740516-e0b80c3c1da8?w=600&q=80' },
];

const filters = ['All', 'Double Deal', 'Mega Pack', 'Save %', 'U Points Bonus'];

const DealsPage = () => {
  const [filter, setFilter] = useState('All');
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Deals & Offers | Umrah Supermarket';
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + (7 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const filtered = filter === 'All' ? dealsList
    : filter === 'Save %' ? dealsList.filter(d => d.badge.startsWith('Save'))
    : dealsList.filter(d => d.badge === filter);

  const featured = dealsList[0];

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background">
        <div className="px-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-5">Deals & Offers</h1>

          {/* Featured deal */}
          <div className="rounded-2xl overflow-hidden mb-5 relative h-[200px]">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute top-3 left-3 bg-secondary px-3 py-1 rounded text-xs font-bold text-secondary-foreground tracking-wider uppercase">
              Featured Deal
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="font-header text-xl uppercase text-foreground mb-1">{featured.title}</h2>
              <div className="flex items-baseline gap-2">
                <span className="font-header text-2xl text-secondary">{featured.price}</span>
                {featured.original && <span className="text-sm text-muted-foreground line-through">{featured.original}</span>}
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex gap-3 justify-center mb-6">
            {[{ v: countdown.d, l: 'Days' }, { v: countdown.h, l: 'Hrs' }, { v: countdown.m, l: 'Min' }, { v: countdown.s, l: 'Sec' }].map(t => (
              <div key={t.l} className="text-center">
                <div className="font-header text-xl text-foreground bg-card w-14 h-14 rounded-xl flex items-center justify-center mb-1 border border-border">
                  {String(t.v).padStart(2, '0')}
                </div>
                <div className="text-[0.55rem] text-muted-foreground uppercase tracking-wider">{t.l}</div>
              </div>
            ))}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${filter === f ? 'bg-secondary text-secondary-foreground' : 'bg-card text-muted-foreground border border-border'}`}>
                {f}
              </button>
            ))}
          </div>

          {/* Deal cards */}
          <div className="space-y-3">
            {filtered.map(deal => (
              <div key={deal.id} className="bg-card rounded-xl overflow-hidden flex gap-4 p-3">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src={deal.img} alt={deal.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-secondary px-1.5 py-0.5 rounded text-[0.5rem] font-bold text-secondary-foreground tracking-wider uppercase">
                    {deal.badge}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate mb-0.5">{deal.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{deal.desc}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-header text-lg text-secondary">{deal.price}</span>
                    {deal.original && <span className="text-xs text-muted-foreground line-through">{deal.original}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default DealsPage;
