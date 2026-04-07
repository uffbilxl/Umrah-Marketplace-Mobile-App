import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import { toast } from 'sonner';

const CATEGORIES = ['Fresh Halal Meat', 'Frozen Foods', 'Sauces', 'Masalas & Spices', 'Drinks', 'Fresh Produce', 'Bakery'];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    document.title = 'Shop Halal Groceries | Umrah Supermarket';
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');
      if (selectedCategory) query = query.eq('category', selectedCategory);
      if (search) query = query.ilike('name', `%${search}%`);
      if (inStockOnly) query = query.eq('in_stock', true);
      const { data } = await query.order('name');
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory, search, inStockOnly]);

  const handleCategoryClick = (cat: string) => {
    const newCat = selectedCategory === cat ? '' : cat;
    setSelectedCategory(newCat);
    if (newCat) {
      setSearchParams({ category: newCat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <Preloader />
      <Navbar />
      <main className="pt-24 pb-20 min-h-screen bg-muted">
        <div className="container-umrah">
          <div className="text-center mb-12">
            <span className="section-label">Our Products</span>
            <h1 className="section-title">Shop Our Range</h1>
            <div className="gold-line mx-auto" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-[250px] shrink-0">
              <div className="bg-card rounded-lg p-6 sticky top-24">
                <h3 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`block w-full text-left text-sm py-2 px-3 rounded transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-primary w-4 h-4" />
                    <span className="text-sm">In Stock Only</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-5 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {loading ? (
                <div className="text-center py-20 text-muted-foreground">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No products found.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(product => {
                    const memberPrice = user && product.member_discount > 0
                      ? product.price * (1 - product.member_discount / 100)
                      : null;
                    const pts = Math.floor(product.price * 10);

                    return (
                      <div key={product.id} className="bg-card rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all group">
                        <Link to={`/product/${product.id}`} className="block">
                          <div className="h-48 relative overflow-hidden">
                            <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {product.brand && (
                              <div className="absolute top-3 left-3 bg-umrah-black/80 text-umrah-white text-[0.65rem] px-2.5 py-1 rounded font-medium">{product.brand}</div>
                            )}
                            {!product.in_stock && (
                              <div className="absolute inset-0 bg-umrah-black/60 flex items-center justify-center">
                                <span className="text-umrah-white font-bold tracking-wider uppercase text-sm">Out of Stock</span>
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="p-5">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-header text-sm tracking-[0.05em] uppercase mb-1">{product.name}</h3>
                            <p className="text-xs text-muted-foreground mb-3">{product.weight}</p>
                          </Link>
                          <div className="flex items-baseline gap-2 mb-2">
                            {memberPrice ? (
                              <>
                                <span className="font-header text-lg text-primary">£{memberPrice.toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground line-through">£{product.price.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="font-header text-lg text-foreground">£{product.price.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-[0.7rem] font-semibold px-2 py-0.5 rounded mb-3">
                            <i className="fas fa-star text-[0.5rem]" /> +{pts} pts
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
                              toast.success(`${product.name} added to basket`, {
                                description: `£${(memberPrice || product.price).toFixed(2)} · +${pts} pts`,
                              });
                            }}
                            disabled={!product.in_stock}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all disabled:opacity-50"
                          >
                            Add to Basket
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShopPage;
