import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { ArrowLeft, Award, Leaf, Tag, Shield } from 'lucide-react';
import patternLeft from '@/assets/pattern-left.png';
import patternRight from '@/assets/pattern-right.png';

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => { document.title = 'About Us | Umrah Supermarket'; }, []);

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background relative overflow-hidden">
        <img src={patternLeft} alt="" className="absolute top-40 -left-6 w-14 h-auto opacity-[0.06] pointer-events-none" aria-hidden="true" />
        <img src={patternRight} alt="" className="absolute bottom-60 -right-6 w-14 h-auto opacity-[0.06] pointer-events-none" aria-hidden="true" />

        <div className="px-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden h-[200px] mb-6">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" alt="About Umrah Supermarket" className="w-full h-full object-cover brightness-[0.4]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="font-header text-3xl text-foreground uppercase tracking-[0.08em]">Our Story</h1>
            </div>
          </div>

          {/* About text */}
          <div className="mb-8">
            <h2 className="font-header text-sm tracking-[0.1em] uppercase text-secondary mb-2">Who We Are</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Founded in Leicester, Umrah Supermarket has grown from a single store into a beloved national chain serving multicultural communities across the UK. We are a one-stop destination for premium Halal meats, fresh seasonal produce, and authentic ingredients from African, Caribbean, and Asian markets.
            </p>
          </div>

          {/* Vision / Mission / Purpose */}
          <div className="space-y-4 mb-8">
            {[
              { title: 'Vision', text: 'To become the premier national destination for global flavours — bringing authentic international groceries to every major community in the United Kingdom.' },
              { title: 'Mission', text: 'To provide a diverse selection of high-quality Halal meats and fresh world produce at competitive prices through a seamless and welcoming shopping experience.' },
              { title: 'Purpose', text: 'To ensure multicultural families have reliable access to the essential tastes and traditions of their heritage, all under one roof.' },
            ].map(item => (
              <div key={item.title} className="bg-card rounded-xl p-4">
                <h3 className="font-header text-xs tracking-[0.1em] uppercase text-primary mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Core Values */}
          <h2 className="font-header text-sm tracking-[0.1em] uppercase mb-4">Core Values</h2>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Award, title: 'Quality', desc: 'Never compromise on standards.' },
              { icon: Leaf, title: 'Freshness', desc: 'Farm to shelf promise.' },
              { icon: Tag, title: 'Best Prices', desc: 'Great food, fair prices.' },
            ].map(v => (
              <div key={v.title} className="bg-card rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-header text-[0.6rem] tracking-[0.1em] uppercase mb-1">{v.title}</h3>
                <p className="text-[0.55rem] text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Halal Certified */}
          <div className="bg-card rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-header text-xs tracking-[0.1em] uppercase text-foreground mb-0.5">
                100% Halal Certified
              </h3>
              <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
                Every product in our meat range is certified Halal to the highest UK standards. We partner only with certified suppliers.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { n: '7+', l: 'UK Locations' },
              { n: '5,000+', l: 'Products' },
              { n: '100%', l: 'Halal Certified' },
              { n: 'Est. 2010', l: 'Founded' },
            ].map(s => (
              <div key={s.l} className="bg-card rounded-xl py-4 text-center">
                <div className="font-header text-xl text-secondary mb-0.5">{s.n}</div>
                <div className="text-[0.6rem] text-muted-foreground tracking-wider uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default AboutPage;
