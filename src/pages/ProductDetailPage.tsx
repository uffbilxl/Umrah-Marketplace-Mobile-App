import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { toast } from 'sonner';
import { ArrowLeft, Star, ShoppingCart, Loader2 } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <>
        <MobileHeader />
        <main className="pt-20 pb-24 min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </main>
        <BottomTabBar />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <MobileHeader />
        <main className="pt-20 pb-24 min-h-screen bg-background flex flex-col items-center justify-center px-5">
          <h1 className="font-header text-xl tracking-[0.08em] uppercase mb-2">Product Not Found</h1>
          <Link to="/search" className="text-sm text-secondary font-semibold">Back to Search</Link>
        </main>
        <BottomTabBar />
      </>
    );
  }

  const memberPrice = user && product.member_discount > 0 ? product.price * (1 - product.member_discount / 100) : null;
  const pts = Math.floor(product.price * 10);

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background">
        <div className="px-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Product image */}
          <div className="rounded-2xl overflow-hidden h-[280px] mb-5 relative">
            <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
            {product.brand && (
              <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground text-xs px-3 py-1 rounded-full font-medium">
                {product.brand}
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <span className="text-foreground font-bold tracking-wider uppercase text-sm">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Details */}
          <h1 className="font-header text-2xl tracking-[0.05em] uppercase mb-1">{product.name}</h1>
          <p className="text-sm text-muted-foreground mb-3">{product.category} {product.weight && `· ${product.weight}`}</p>

          <div className="flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-secondary text-secondary" />)}
            <span className="text-xs text-muted-foreground ml-1">4.8 (127 reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
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

          {/* Points */}
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-xl mb-6">
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold">Earn {pts} U Points with this purchase</span>
          </div>

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-lg hover:bg-muted transition-colors">−</button>
              <span className="px-4 py-3 text-sm font-semibold min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-lg hover:bg-muted transition-colors">+</button>
            </div>
            <button
              onClick={() => {
                addItem({ product_id: product.id, name: product.name, price: memberPrice || product.price, image_url: product.image_url, member_discount: product.member_discount }, qty);
                toast.success(`${product.name} added to basket`);
              }}
              disabled={!product.in_stock}
              className="flex-1 bg-secondary text-secondary-foreground py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              {product.in_stock ? 'Add to Basket' : 'Out of Stock'}
            </button>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <>
              <h2 className="font-header text-sm tracking-[0.1em] uppercase mb-4">You May Also Like</h2>
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                {related.map(p => (
                  <Link to={`/product/${p.id}`} key={p.id} className="bg-card rounded-xl overflow-hidden flex-shrink-0 w-[140px]">
                    <div className="h-[100px] overflow-hidden">
                      <img src={p.image_url || '/placeholder.svg'} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-xs font-semibold text-foreground truncate mb-1">{p.name}</h3>
                      <span className="font-header text-sm text-foreground">£{p.price.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default ProductDetailPage;
