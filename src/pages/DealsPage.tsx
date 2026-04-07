import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

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
      <Preloader /><Navbar />
      <main className="min-h-screen">
        {/* Featured deal hero */}
        <section className="bg-umrah-black pt-28 pb-16">
          <div className="container-umrah">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-lg overflow-hidden h-[300px] lg:h-[400px]">
                <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="inline-block bg-secondary px-4 py-1.5 rounded text-xs font-bold text-umrah-black tracking-[0.1em] uppercase mb-4">Featured Deal</span>
                <h1 className="font-header text-3xl lg:text-4xl text-umrah-white uppercase tracking-[0.08em] mb-4">{featured.title}</h1>
                <p className="text-umrah-white/50 mb-6">{featured.desc}</p>
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="font-header text-4xl text-secondary">{featured.price}</span>
                  {featured.original && <span className="text-lg text-umrah-white/30 line-through">{featured.original}</span>}
                </div>
                {/* Countdown */}
                <div className="flex gap-4 mb-8">
                  {[{ v: countdown.d, l: 'Days' }, { v: countdown.h, l: 'Hours' }, { v: countdown.m, l: 'Mins' }, { v: countdown.s, l: 'Secs' }].map(t => (
                    <div key={t.l} className="text-center">
                      <div className="font-header text-2xl text-umrah-white bg-umrah-dark-gray w-14 h-14 rounded-lg flex items-center justify-center mb-1">{String(t.v).padStart(2, '0')}</div>
                      <div className="text-[0.6rem] text-umrah-white/40 uppercase tracking-wider">{t.l}</div>
                    </div>
                  ))}
                </div>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-secondary text-umrah-black px-8 py-3.5 rounded-[2px] text-sm font-bold tracking-[0.15em] uppercase hover:bg-umrah-white transition-all">
                  Shop This Deal <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filter tabs */}
        <section className="py-16 bg-muted">
          <div className="container-umrah">
            <div className="flex flex-wrap gap-3 mb-10">
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-[2px] text-xs font-semibold tracking-[0.1em] uppercase transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-primary/10'}`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(deal => (
                <div key={deal.id} className="bg-card rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all group">
                  <div className="h-60 relative overflow-hidden">
                    <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-umrah-black/50" />
                    <div className="absolute top-4 left-4 bg-secondary px-3 py-1.5 rounded text-[0.7rem] font-bold text-umrah-black tracking-[0.1em] uppercase z-10">{deal.badge}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-header text-base tracking-[0.05em] uppercase mb-2">{deal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{deal.desc}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-header text-xl text-primary">{deal.price}</span>
                      {deal.original && <span className="text-sm text-muted-foreground line-through">{deal.original}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DealsPage;
