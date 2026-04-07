import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import BottomTabBar from '@/components/BottomTabBar';
import { toast } from 'sonner';
import { SlidersHorizontal, Mic, Heart } from 'lucide-react';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Bakery', 'Meat', 'Spices', 'Drinks'];
const DB_CATEGORIES: Record<string, string> = {
  'Fruits': 'Fresh Produce',
  'Vegetables': 'Fresh Produce',
  'Bakery': 'Bakery',
  'Meat': 'Fresh Halal Meat',
  'Spices': 'Masalas & Spices',
  'Drinks': 'Drinks',
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    document.title = 'Search Products | Umrah Supermarket';
    const cat = searchParams.get('category');
    if (cat) {
      const match = Object.entries(DB_CATEGORIES).find(([_, v]) => v === cat);
      if (match) setSelectedCategory(match[0]);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');
      const dbCat = DB_CATEGORIES[selectedCategory];
      if (dbCat) query = query.eq('category', dbCat);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data } = await query.order('name');
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory, search]);

  return (
    <>
      <main className="pt-6 pb-24 min-h-screen bg-background">
        <div className="px-5">
          <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-5">
            Search products
          </h1>

          {/* Search bar */}
          <div className="relative mb-4">
            <Mic className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>

          {/* Filters button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground mb-4">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-card text-muted-foreground border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4">
            {loading ? 'Searching...' : `${products.length} products found`}
          </p>

          {/* Product cards */}
          <div className="space-y-3">
            {products.map(product => {
              const memberPrice = user && product.member_discount > 0
                ? product.price * (1 - product.member_discount / 100)
                : null;

              return (
                <div key={product.id} className="bg-card rounded-xl p-3 flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm text-foreground truncate pr-2">
                        {product.name}
                      </h3>
                      <Heart className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <i key={s} className="fas fa-star text-secondary text-[0.5rem]" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">4.8 (127 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="font-header text-lg text-foreground">
                          £{(memberPrice || product.price).toFixed(2)}
                        </span>
                        {product.weight && (
                          <span className="text-xs text-muted-foreground">/{product.weight}</span>
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
                        disabled={!product.in_stock}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <i className="fas fa-shopping-cart text-[0.6rem]" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default SearchPage;
