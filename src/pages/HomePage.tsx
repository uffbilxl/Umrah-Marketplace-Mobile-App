import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { toast } from 'sonner';
import patternLeft from '@/assets/pattern-left.png';
import patternRight from '@/assets/pattern-right.png';
import { MapPin, Clock, ChevronRight, Star, ShoppingCart } from 'lucide-react';

const categoryImages: Record<string, string> = {
  'Fresh Halal Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80',
  'Frozen Foods': 'https://images.unsplash.com/photo-1585985740516-e0b80c3c1da8?w=600&q=80',
  'Sauces': 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&q=80',
  'Masalas & Spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
  'Drinks': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80',
  'Fresh Produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
  'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
};

const categories = [
  'Fresh Halal Meat', 'Frozen Foods', 'Sauces', 'Masalas & Spices', 'Drinks', 'Fresh Produce', 'Bakery',
];

const dealsList = [
  { id: 1, title: 'Lamb Leg Whole', badge: 'Double Deal', price: '£8.99/kg', original: '£11.99/kg', img: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=600&q=80' },
  { id: 2, title: 'Shan Biryani Masala 10-pack', badge: 'Mega Pack', price: '£9.99', original: '£14.99', img: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&q=80' },
  { id: 3, title: 'Basmati Rice 10kg', badge: 'Save 20%', price: '£12.00', original: '£15.00', img: 'https://images.unsplash.com/photo-1587049352847-4d4b126a5424?w=600&q=80' },
  { id: 4, title: 'Chicken Breast 5kg', badge: 'Double Deal', price: '£24.99', original: '£32.99', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80' },
];

const stores = [
  { name: 'Leicester — HQ', hours: '8am – 10pm', open: true },
  { name: 'Liverpool', hours: '8am – 10pm', open: true },
  { name: 'Huddersfield', hours: '8am – 10pm', open: true },
  { name: 'Northampton', hours: '8am – 10pm', open: true },
  { name: 'Birmingham', hours: '', open: false },
  { name: 'Manchester', hours: '', open: false },
  { name: 'Leeds', hours: '', open: false },
];

const HomePage = () => {
  const { user, profile } = useAuth();
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'Umrah Supermarket';
    const fetchFeatured = async () => {
      const { data } = await supabase.from('products').select('*').eq('in_stock', true).limit(6);
      setFeaturedProducts(data || []);
    };
    fetchFeatured();
  }, []);

  const displayName = profile
    ? `${profile.name.split(' ')[0]} ${profile.name.split(' ').slice(-1)[0]?.[0] || ''}.`
    : 'Guest';

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background relative overflow-hidden">
        {/* Decorative patterns */}
        <img src={patternLeft} alt="" className="absolute top-20 -left-6 w-14 h-auto opacity-[0.06] pointer-events-none" aria-hidden="true" />
        <img src={patternRight} alt="" className="absolute bottom-32 -right-6 w-14 h-auto opacity-[0.06] pointer-events-none" aria-hidden="true" />

        <div className="px-5">
          {/* Greeting */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Hello,</p>
            <h1 className="font-header text-3xl tracking-[0.05em] uppercase text-foreground">
              {displayName}
            </h1>
          </div>

          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-8 h-[200px]">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
              alt="Fresh groceries"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-header text-sm tracking-[0.1em] uppercase text-foreground">
                Your one-stop
              </p>
              <p className="font-header text-xl tracking-[0.05em] uppercase text-secondary leading-tight">
                Multi-Cultural
              </p>
              <p className="font-header text-lg tracking-[0.08em] uppercase text-foreground">
                Supermarket
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {[
              { n: '7+', l: 'UK Stores' },
              { n: '5,000+', l: 'Products' },
              { n: '100%', l: 'Halal' },
            ].map(s => (
              <div key={s.l} className="bg-card rounded-xl py-3 text-center">
                <div className="font-header text-lg text-secondary">{s.n}</div>
                <div className="text-[0.6rem] text-muted-foreground tracking-wider uppercase">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Explore categories */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-header text-sm tracking-[0.1em] uppercase">Categories</h2>
            <Link to="/search" className="text-xs text-secondary font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 mb-8 scrollbar-hide">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/search?category=${encodeURIComponent(cat)}`}
                className="relative rounded-xl overflow-hidden h-[100px] w-[100px] flex-shrink-0 group"
              >
                <img
                  src={categoryImages[cat]}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 font-header text-[0.55rem] tracking-[0.08em] uppercase text-foreground leading-tight">
                  {cat}
                </span>
              </Link>
            ))}
          </div>

          {/* This Week's Deals */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-header text-sm tracking-[0.1em] uppercase">This Week's Deals</h2>
            <Link to="/deals" className="text-xs text-secondary font-semibold flex items-center gap-1">
              See All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 mb-8 scrollbar-hide">
            {dealsList.map(deal => (
              <div key={deal.id} className="bg-card rounded-xl overflow-hidden flex-shrink-0 w-[180px]">
                <div className="h-[120px] relative overflow-hidden">
                  <img src={deal.img} alt={deal.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-secondary px-2 py-0.5 rounded text-[0.55rem] font-bold text-secondary-foreground tracking-wider uppercase">
                    {deal.badge}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-foreground truncate mb-1">{deal.title}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-header text-sm text-secondary">{deal.price}</span>
                    {deal.original && <span className="text-[0.6rem] text-muted-foreground line-through">{deal.original}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-header text-sm tracking-[0.1em] uppercase">Popular Products</h2>
                <Link to="/search" className="text-xs text-secondary font-semibold flex items-center gap-1">
                  Browse All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {featuredProducts.slice(0, 4).map(product => {
                  const memberPrice = user && product.member_discount > 0
                    ? product.price * (1 - product.member_discount / 100)
                    : null;

                  return (
                    <div key={product.id} className="bg-card rounded-xl overflow-hidden">
                      <Link to={`/product/${product.id}`}>
                        <div className="h-[120px] overflow-hidden relative">
                          <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
                          {product.member_discount > 0 && (
                            <div className="absolute top-2 left-2 bg-primary px-2 py-0.5 rounded text-[0.55rem] font-bold text-primary-foreground">
                              -{product.member_discount}%
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-3">
                        <h3 className="text-xs font-semibold text-foreground truncate mb-1">{product.name}</h3>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-secondary text-secondary" />)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-header text-sm text-foreground">
                              £{(memberPrice || product.price).toFixed(2)}
                            </span>
                            {memberPrice && (
                              <span className="text-[0.55rem] text-muted-foreground line-through ml-1">
                                £{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              addItem({
                                product_id: product.id,
                                name: product.name,
                                price: memberPrice || product.price,
                                image_url: product.image_url,
                                member_discount: product.member_discount,
                              });
                              toast.success(`${product.name} added`);
                            }}
                            className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-secondary-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Halal Certified Banner */}
          <div className="bg-card rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏅</span>
            </div>
            <div>
              <h3 className="font-header text-xs tracking-[0.1em] uppercase text-foreground mb-0.5">
                100% Halal Certified
              </h3>
              <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
                Every meat product meets the highest UK Halal certification standards.
              </p>
            </div>
          </div>

          {/* Our Stores */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-header text-sm tracking-[0.1em] uppercase">Our Stores</h2>
            <Link to="/stores" className="text-xs text-secondary font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2 mb-8">
            {stores.slice(0, 4).map(store => (
              <div key={store.name} className="bg-card rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{store.name}</p>
                    {store.open && (
                      <p className="text-[0.65rem] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {store.hours}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`text-[0.6rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${store.open ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {store.open ? 'Open' : 'Soon'}
                </div>
              </div>
            ))}
          </div>

          {/* U Points promo */}
          <Link to="/rewards" className="block gold-shimmer rounded-2xl p-5 mb-6 relative overflow-hidden shadow-[var(--shadow-gold)]">
            <div className="relative z-10">
              <h3 className="font-header text-sm tracking-[0.1em] uppercase text-secondary-foreground mb-1">
                U Points Rewards
              </h3>
              <p className="text-xs text-secondary-foreground/70 mb-2">
                Earn 1 point per £1 spent. Redeem for vouchers starting at 200 points!
              </p>
              <span className="text-xs font-bold text-secondary-foreground tracking-wider uppercase flex items-center gap-1">
                {profile ? `${profile.points.toLocaleString()} pts balance` : 'Join Now'} <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* About snippet */}
          <div className="bg-card rounded-2xl p-5 mb-4">
            <h3 className="font-header text-xs tracking-[0.1em] uppercase text-foreground mb-2">About Umrah Supermarket</h3>
            <p className="text-[0.7rem] text-muted-foreground leading-relaxed mb-3">
              Founded in Leicester, Umrah Supermarket is a one-stop destination for premium Halal meats, fresh seasonal produce, and authentic ingredients from African, Caribbean, and Asian markets.
            </p>
            <Link to="/about" className="text-xs text-secondary font-semibold flex items-center gap-1">
              Learn More <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default HomePage;
