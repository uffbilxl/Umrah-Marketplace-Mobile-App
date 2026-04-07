import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from('products').select('*').eq('id', Number(id)).maybeSingle();
      setProduct(data);
      if (data) {
        document.title = `${data.name} | Umrah Supermarket`;
        const { data: rel } = await supabase.from('products').select('*').eq('category', data.category).neq('id', data.id).limit(4);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <><Preloader /><Navbar /><div className="pt-32 pb-20 text-center min-h-screen">Loading...</div><Footer /></>;
  if (!product) return <><Preloader /><Navbar /><div className="pt-32 pb-20 text-center min-h-screen">Product not found.</div><Footer /></>;

  const memberPrice = user && product.member_discount > 0 ? product.price * (1 - product.member_discount / 100) : null;
  const pts = Math.floor(product.price * 10);

  return (
    <>
      <Preloader />
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen bg-background">
        <div className="container-umrah">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-muted-foreground">
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Image */}
            <div className="lg:col-span-3">
              <div className="rounded-lg overflow-hidden aspect-[4/3]">
                <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              {product.brand && <span className="text-sm text-muted-foreground tracking-[0.1em] uppercase">{product.brand}</span>}
              <h1 className="font-header text-3xl tracking-[0.05em] uppercase mt-2 mb-2">{product.name}</h1>
              <p className="text-sm text-muted-foreground mb-1">{product.category} · {product.weight}</p>
              
              <div className="mt-6 mb-4">
                {memberPrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="font-header text-3xl text-primary">£{memberPrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">£{product.price.toFixed(2)}</span>
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded">Member Price</span>
                  </div>
                ) : (
                  <span className="font-header text-3xl text-foreground">£{product.price.toFixed(2)}</span>
                )}
              </div>

              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded mb-8">
                <i className="fas fa-star text-sm" />
                <span className="text-sm font-semibold">Earn {pts} pts with this purchase</span>
              </div>

              {/* Qty + Add */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg hover:bg-muted transition-colors">−</button>
                  <span className="px-4 py-2 text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-lg hover:bg-muted transition-colors">+</button>
                </div>
                <button
                  onClick={() => addItem({ product_id: product.id, name: product.name, price: memberPrice || product.price, image_url: product.image_url, member_discount: product.member_discount }, qty)}
                  disabled={!product.in_stock}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {product.in_stock ? 'Add to Basket' : 'Out of Stock'}
                </button>
              </div>

              {!product.in_stock && <p className="text-destructive text-sm font-medium">Currently out of stock</p>}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="section-title text-2xl mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(p => (
                  <Link to={`/product/${p.id}`} key={p.id} className="bg-card rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all group">
                    <div className="h-40 overflow-hidden">
                      <img src={p.image_url || '/placeholder.svg'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-header text-xs tracking-[0.05em] uppercase mb-1">{p.name}</h3>
                      <span className="font-header text-base text-foreground">£{p.price.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
