import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import patternLeft from '@/assets/pattern-left.png';
import patternRight from '@/assets/pattern-right.png';

const categoryImages: Record<string, string> = {
  'Halal Meats': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80',
  'Fresh Produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
  'World Foods': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
  'Bakery & Dairy': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
};

const categories = [
  { name: 'Halal Meats', filter: 'Fresh Halal Meat' },
  { name: 'Fresh Produce', filter: 'Fresh Produce' },
  { name: 'World Foods', filter: 'Masalas & Spices' },
  { name: 'Bakery & Dairy', filter: 'Bakery' },
];

const HomePage = () => {
  const { profile } = useAuth();

  useEffect(() => {
    document.title = 'Umrah Supermarket';
  }, []);

  const displayName = profile
    ? `${profile.name.split(' ')[0]} ${profile.name.split(' ').slice(-1)[0]?.[0] || ''}.`
    : 'Guest';

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background relative overflow-hidden">
        {/* Decorative patterns */}
        <img
          src={patternLeft}
          alt=""
          className="absolute top-20 -left-6 w-14 h-auto opacity-[0.06] pointer-events-none"
          aria-hidden="true"
        />
        <img
          src={patternRight}
          alt=""
          className="absolute bottom-32 -right-6 w-14 h-auto opacity-[0.06] pointer-events-none"
          aria-hidden="true"
        />

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

          {/* Explore our range */}
          <h2 className="font-header text-lg tracking-[0.1em] uppercase text-center mb-5">
            Explore our range
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/search?category=${encodeURIComponent(cat.filter)}`}
                className="relative rounded-xl overflow-hidden h-[140px] group"
              >
                <img
                  src={categoryImages[cat.name]}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 font-header text-xs tracking-[0.1em] uppercase text-foreground">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default HomePage;
