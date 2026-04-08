import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import BottomTabBar from '@/components/BottomTabBar';
import { toast } from 'sonner';
import MobileHeader from '@/components/MobileHeader';
import { Search, SlidersHorizontal, Star, ShoppingCart } from 'lucide-react';

const CATEGORIES = ['All', 'Fresh Halal Meat', 'Frozen Foods', 'Sauces', 'Masalas & Spices', 'Drinks', 'Fresh Produce', 'Bakery'];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    document.title = 'Search Products | Umrah Supermarket';
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');
      if (selectedCategory !== 'All') query = query.eq('category', selectedCategory);
      if (search) query = query.ilike('name', `%${search}%`);
      if (inStockOnly) query = query.eq('in_stock', true);
      const { data } = await query.order('name');
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory, search, inStockOnly]);

  return (
    <>
      <MobileHeader />
      <main className="mobile-page mobile-scroll-surface bg-background">
        <div className="px-5">
          <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-5">
            Search products
          </h1>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>

          {/* In-stock toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm mb-4 transition-all ${inStockOnly ? 'bg-secondary text-secondary-foreground' : 'bg-card border border-border text-muted-foreground'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {inStockOnly ? 'Showing In-Stock Only' : 'Filter: In Stock Only'}
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
              const pts = Math.floor(product.price);

              return (
                <div key={product.id} className="bg-card rounded-xl p-3 flex gap-4 items-center hover:bg-accent/50 transition-all duration-200">
                  <Link to={`/product/${product.id}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm text-foreground truncate pr-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.brand && (
                      <p className="text-[0.6rem] text-muted-foreground">{product.brand}</p>
                    )}
                    <div className="flex items-center gap-0.5 mt-1 mb-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-secondary text-secondary" />)}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[0.6rem] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-semibold">+{pts} pts</span>
                      {!product.in_stock && (
                        <span className="text-[0.6rem] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-semibold">Out of stock</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="font-header text-lg text-foreground">
                          £{(memberPrice || product.price).toFixed(2)}
                        </span>
                        {memberPrice && (
                          <span className="text-[0.6rem] text-muted-foreground line-through">£{product.price.toFixed(2)}</span>
                        )}
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
                        <ShoppingCart className="w-3 h-3" />
                        Add
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
