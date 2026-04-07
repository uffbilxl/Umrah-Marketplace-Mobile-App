import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categoryImages: Record<string, string> = {
  'Halal Meats': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80',
  'Fresh Produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
  'World Foods': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
  'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
};

const categories = [
  { name: 'Halal Meats', desc: 'Premium fresh and frozen cuts, all certified Halal to the highest standards.', icon: 'fa-drumstick-bite', filter: 'Fresh Halal Meat' },
  { name: 'Fresh Produce', desc: 'Seasonal fruits and vegetables sourced daily for peak freshness.', icon: 'fa-apple-alt', filter: 'Fresh Produce' },
  { name: 'World Foods', desc: 'African, Caribbean, and Asian specialty ingredients and spices.', icon: 'fa-pepper-hot', filter: 'Masalas & Spices' },
  { name: 'Bakery', desc: 'Fresh breads, pastries, and dairy essentials baked daily.', icon: 'fa-bread-slice', filter: 'Bakery' },
];

const deals = [
  { title: 'Lamb Leg Whole', desc: 'Premium quality whole lamb leg, 100% Halal certified and fresh.', current: '£8.99/kg', original: '£11.99/kg', badge: 'Double Deal', img: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=600&q=80' },
  { title: 'Premium Spice Blend', desc: 'Authentic 500g mixed spice blend perfect for marinades and curries.', current: '£4.50', original: '£6.00', badge: 'Mega Pack', img: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&q=80' },
  { title: 'Basmati Rice 10kg', desc: 'Extra long grain premium Basmati rice, perfect for large family meals.', current: '£12.00', original: '£15.00', badge: 'Save 20%', img: 'https://images.unsplash.com/photo-1587049352847-4d4b126a5424?w=600&q=80' },
];

const marqueeItems = [
  'Premium Halal Meats', 'Fresh Seasonal Produce', 'African Groceries',
  'Caribbean Specialties', 'Asian Ingredients', 'Double Deal Promotions', 'Mega Pack Offers',
];

const HomePage = () => {
  useEffect(() => {
    document.title = 'Umrah Supermarket — Quality · Freshness · Best Prices';
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen min-h-[750px] flex flex-col bg-umrah-black overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.3]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-umrah-black/[0.88] via-umrah-black/50 to-umrah-black/75" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(var(--umrah-gold)) 1px, transparent 1px), radial-gradient(circle at 75% 75%, hsl(var(--umrah-gold)) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Scrolling tagline strip below navbar */}
        <div className="relative z-10 mt-[80px] bg-secondary/10 border-y border-secondary/20 py-2 overflow-hidden">
          <div className="flex animate-[marqueeScroll_30s_linear_infinite] whitespace-nowrap">
            {[
              'Your One-Stop Multicultural Supermarket',
              '100% Halal Certified Products',
              'Premium Quality at Best Prices',
              'Fresh Daily From Farm to Shelf',
              '7+ Stores Across the UK',
              'Earn U Points on Every Shop',
              'Your One-Stop Multicultural Supermarket',
              '100% Halal Certified Products',
              'Premium Quality at Best Prices',
              'Fresh Daily From Farm to Shelf',
              '7+ Stores Across the UK',
              'Earn U Points on Every Shop',
            ].map((text, i) => (
              <span key={i} className="inline-flex items-center gap-3 mr-10 text-[0.65rem] font-semibold text-secondary tracking-[0.2em] uppercase shrink-0">
                <i className="fas fa-star text-[0.4rem]" />{text}
              </span>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-[650px] xl:mx-auto xl:text-center xl:flex xl:flex-col xl:items-center px-6">
          <h1 className="text-[clamp(2.8rem,6vw,5rem)] text-umrah-white uppercase tracking-[0.08em] mb-2.5 leading-[1.05] font-header">
            Quality.<br />Freshness.<br /><span className="text-secondary">Best Prices.</span>
          </h1>
          <p className="text-lg text-umrah-white/70 mb-10 leading-7 max-w-[550px]">
            Premium Halal meats, fresh seasonal produce, and authentic ingredients sourced from African, Caribbean, and Asian markets — all under one roof.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/shop" className="inline-flex items-center gap-2.5 bg-secondary text-umrah-black px-9 py-4 font-body text-[0.8rem] font-bold tracking-[0.15em] uppercase border-2 border-secondary rounded-[2px] hover:bg-transparent hover:text-secondary transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold)]">
              Explore Our Range <i className="fas fa-arrow-right" />
            </Link>
            <Link to="/upoints" className="inline-flex items-center gap-2.5 bg-transparent text-umrah-white px-9 py-4 font-body text-[0.8rem] font-bold tracking-[0.15em] uppercase border-2 border-umrah-white/30 rounded-[2px] hover:border-umrah-white hover:bg-umrah-white hover:text-umrah-black transition-all hover:-translate-y-0.5">
              <i className="fas fa-mobile-alt" /> Download Our App
            </Link>
          </div>
          {/* Stats inline below buttons */}
          <div className="hidden md:flex gap-14 mt-10">
            {[{ n: '7+', l: 'Stores UK Wide' }, { n: '5K+', l: 'Products' }, { n: '100%', l: 'Halal Certified' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="font-header text-[2rem] text-secondary leading-none mb-1">{s.n}</div>
                <div className="text-[0.65rem] text-umrah-white/50 tracking-[0.2em] uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Hero tiles left - desktop only */}
        <div className="hidden xl:flex absolute left-12 top-[28%] z-10 flex-col gap-4">
          {[
            { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', alt: 'Fresh bakery' },
            { src: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', alt: 'Drinks selection' },
            { src: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=400&q=80', alt: 'Sauces' },
          ].map((tile, i) => (
            <div key={i} className={`w-[155px] h-[105px] rounded-lg overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] border-2 border-umrah-white/[0.08] hover:scale-105 hover:border-secondary transition-all ${i === 1 ? 'ml-8' : ''}`}>
              <img src={tile.src} alt={tile.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Hero tiles right - desktop only */}
        <div className="hidden xl:flex absolute right-12 top-[28%] z-10 flex-col gap-4">
          {[
            { src: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', alt: 'Fresh halal meat' },
            { src: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80', alt: 'Fresh produce' },
            { src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', alt: 'Spices' },
          ].map((tile, i) => (
            <div key={i} className={`w-[155px] h-[105px] rounded-lg overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] border-2 border-umrah-white/[0.08] hover:scale-105 hover:border-secondary transition-all ${i === 1 ? 'ml-8' : ''}`}>
              <img src={tile.src} alt={tile.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

      </section>

      {/* Marquee */}
      <section className="bg-secondary py-3.5 overflow-hidden">
        <div className="flex animate-[marqueeScroll_25s_linear_infinite] whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 mr-12 text-[0.8rem] font-bold text-umrah-black tracking-[0.15em] uppercase shrink-0">
              <span className="w-1.5 h-1.5 bg-umrah-black rounded-full" />{item}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="container-umrah">
          <div className="text-center mb-16">
            <span className="section-label">Our Range</span>
            <h2 className="section-title">Shop by Category</h2>
            <div className="gold-line mx-auto" />
            <p className="section-subtitle mx-auto">Everything under one roof — quality products at the best prices.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link to={`/shop?category=${encodeURIComponent(cat.filter)}`} key={cat.name} className="group relative bg-card rounded-lg overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-[var(--shadow-lg)] transition-all">
                <div className="h-60 relative overflow-hidden">
                  <img src={categoryImages[cat.name]} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-umrah-black/60" />
                  <div className="absolute top-4 right-4 w-[42px] h-[42px] bg-secondary/90 rounded-full flex items-center justify-center z-10">
                    <i className={`fas ${cat.icon} text-umrah-black text-sm`} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-[0.95rem] tracking-[0.1em] uppercase mb-1.5 font-header">{cat.name}</h3>
                  <p className="text-[0.82rem] text-muted-foreground leading-relaxed">{cat.desc}</p>
                </div>
                <div className="absolute bottom-6 right-6 w-9 h-9 bg-secondary rounded-full flex items-center justify-center opacity-0 -translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <i className="fas fa-arrow-right text-umrah-black text-xs" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="py-24 md:py-32 bg-umrah-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] border border-secondary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="container-umrah relative z-10">
          <div className="text-center mb-16">
            <span className="section-label">This Week</span>
            <h2 className="section-title text-umrah-white">Hot Deals & Offers</h2>
            <div className="gold-line mx-auto" />
            <p className="section-subtitle text-umrah-white/50 mx-auto">Exceptional value through our signature promotions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map(deal => (
              <Link to="/deals" key={deal.title} className="group bg-umrah-dark-gray border border-umrah-white/[0.06] rounded-lg overflow-hidden hover:border-secondary/30 hover:-translate-y-1 transition-all">
                <div className="h-[220px] relative overflow-hidden">
                  <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-600" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-umrah-black/50" />
                  <div className="absolute top-4 left-4 bg-secondary px-3.5 py-1.5 rounded text-[0.7rem] font-bold text-umrah-black tracking-[0.1em] uppercase z-10">{deal.badge}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-base text-umrah-white tracking-[0.08em] uppercase mb-2 font-header">{deal.title}</h3>
                  <p className="text-sm text-umrah-white/50 leading-relaxed mb-4">{deal.desc}</p>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-header text-2xl text-secondary">{deal.current}</span>
                    <span className="text-sm text-umrah-white/30 line-through">{deal.original}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty / U Points */}
      <section className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="container-umrah">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="section-label">Umrah Rewards</span>
              <h2 className="section-title">Shop. Earn.<br />Save Instantly.</h2>
              <div className="gold-line" />
              <p className="section-subtitle mb-10">Download the sleek, custom Umrah Supermarket app. Keep track of your purchases, earn points on every grocery run, and unlock exclusive mobile-only discounts.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: 'fa-coins', title: 'Earn Points', desc: 'Get 10 points for every £1 spent in-store.' },
                  { icon: 'fa-ticket-alt', title: 'Digital Vouchers', desc: 'Turn points into discounts at checkout.' },
                  { icon: 'fa-barcode', title: 'Quick Scan', desc: 'A seamless, sleek digital barcode to scan.' },
                  { icon: 'fa-bell', title: 'Deal Alerts', desc: 'Be the first to know about Mega Pack offers.' },
                ].map(f => (
                  <div key={f.title} className="p-6 bg-muted rounded-lg hover:bg-umrah-black group transition-all hover:-translate-y-1">
                    <div className="w-11 h-11 bg-secondary/10 rounded-[10px] flex items-center justify-center mb-4">
                      <i className={`fas ${f.icon} text-secondary`} />
                    </div>
                    <h4 className="font-header text-[0.82rem] tracking-[0.1em] uppercase mb-1.5 group-hover:text-umrah-white transition-colors">{f.title}</h4>
                    <p className="text-[0.8rem] text-muted-foreground leading-relaxed group-hover:text-umrah-white/60 transition-colors">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                {[{ icon: 'fab fa-apple', small: 'Download on the', large: 'App Store' }, { icon: 'fab fa-google-play', small: 'GET IT ON', large: 'Google Play' }].map(b => (
                  <a key={b.large} href="#" className="inline-flex items-center gap-3 bg-umrah-black text-umrah-white px-7 py-3.5 rounded-lg border border-transparent hover:bg-transparent hover:border-umrah-black hover:text-umrah-black transition-all">
                    <i className={`${b.icon} text-2xl`} />
                    <div className="flex flex-col">
                      <span className="text-[0.6rem] tracking-[0.1em] uppercase opacity-70">{b.small}</span>
                      <span className="text-[0.95rem] font-semibold leading-tight">{b.large}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center items-center relative order-first lg:order-last">
              <div className="hidden md:flex absolute top-16 -right-10 bg-card rounded-xl p-3.5 px-4.5 shadow-[var(--shadow-lg)] items-center gap-2.5 animate-[phoneFloat_3s_ease-in-out_infinite_0.5s] z-10">
                <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center"><i className="fas fa-gift text-secondary" /></div>
                <div><div className="text-[0.6rem] text-muted-foreground tracking-[0.05em] uppercase">Reward</div><div className="font-header text-sm tracking-[0.05em]">£5 Voucher</div></div>
              </div>
              <div className="hidden md:flex absolute bottom-28 -left-12 bg-card rounded-xl p-3.5 px-4.5 shadow-[var(--shadow-lg)] items-center gap-2.5 animate-[phoneFloat_3s_ease-in-out_infinite_1s] z-10">
                <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center"><i className="fas fa-star text-secondary" /></div>
                <div><div className="text-[0.6rem] text-muted-foreground tracking-[0.05em] uppercase">Status</div><div className="font-header text-sm tracking-[0.05em]">Gold Member</div></div>
              </div>

              <div className="w-[280px] h-[580px] bg-umrah-black rounded-[40px] border-[3px] border-umrah-white/20 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[30px] bg-umrah-black rounded-b-[20px] z-20" />
                <div className="w-full h-full pt-[50px] px-5 pb-5 bg-umrah-dark-gray overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-header text-sm text-secondary tracking-[0.1em]">UMRAH</span>
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"><i className="fas fa-user text-umrah-black text-[0.7rem]" /></div>
                  </div>
                  <div className="mb-6"><div className="text-[0.65rem] text-umrah-white/50 tracking-[0.1em] uppercase">Welcome back,</div><div className="font-header text-lg text-umrah-white tracking-[0.05em]">Aisha K.</div></div>
                  <div className="bg-gradient-to-br from-secondary to-umrah-gold-dark rounded-2xl p-5 mb-5 relative overflow-hidden shadow-[0_10px_20px_rgba(243,170,52,0.2)]">
                    <div className="absolute -top-5 -right-5 w-[100px] h-[100px] border-2 border-umrah-black/10 rounded-full" />
                    <div className="text-[0.6rem] text-umrah-black/60 tracking-[0.15em] uppercase font-semibold mb-1">Total Balance</div>
                    <div className="font-header text-[1.8rem] text-umrah-black leading-none mb-3">2,450 pts</div>
                    <div className="w-full h-1 bg-umrah-black/15 rounded overflow-hidden mb-1.5"><div className="w-[65%] h-full bg-umrah-black rounded" /></div>
                    <div className="text-[0.6rem] text-umrah-black/50 font-semibold">50 pts to next reward</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {[{ i: 'fa-qrcode', l: 'Scan Card' }, { i: 'fa-tag', l: 'Offers' }, { i: 'fa-history', l: 'History' }].map(a => (
                      <div key={a.l} className="bg-umrah-white/5 rounded-xl py-3.5 px-2 text-center hover:bg-secondary/10 transition-all cursor-pointer">
                        <i className={`fas ${a.i} text-secondary text-base mb-1.5 block`} /><span className="text-[0.55rem] text-umrah-white/60 tracking-[0.05em] uppercase block">{a.l}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[0.65rem] text-umrah-white/40 tracking-[0.15em] uppercase mb-2.5">Recent Activity</div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center gap-2.5 py-2.5 border-b border-umrah-white/[0.04]">
                      <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0"><i className="fas fa-shopping-basket text-secondary text-[0.7rem]" /></div>
                      <div className="flex-1"><div className="text-[0.7rem] text-umrah-white font-medium">In-Store Purchase</div><div className="text-[0.58rem] text-umrah-white/40">Leicester Branch • Today</div></div>
                      <div className="font-header text-xs text-secondary">+120</div>
                    </div>
                    <div className="flex items-center gap-2.5 py-2.5">
                      <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0"><i className="fas fa-gift text-secondary text-[0.7rem]" /></div>
                      <div className="flex-1"><div className="text-[0.7rem] text-umrah-white font-medium">Reward Redeemed</div><div className="text-[0.58rem] text-umrah-white/40">£5 Off Voucher • 2d ago</div></div>
                      <div className="font-header text-xs text-umrah-white">-500</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
