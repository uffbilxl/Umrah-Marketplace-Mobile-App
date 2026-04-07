import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

const AboutPage = () => {
  useEffect(() => { document.title = 'About Us | Umrah Supermarket'; }, []);

  return (
    <>
      <Preloader /><Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center brightness-[0.3]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80')" }} />
          <div className="absolute inset-0 bg-umrah-black/50" />
          <div className="relative z-10 text-center">
            <h1 className="font-header text-[clamp(2.5rem,5vw,4rem)] text-umrah-white uppercase tracking-[0.08em]">Our Story</h1>
            <div className="gold-line mx-auto mt-4" />
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-background">
          <div className="container-umrah">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="section-label">Who We Are</span>
                <h2 className="section-title text-2xl">More Than a Supermarket</h2>
                <div className="gold-line" />
                <p className="text-muted-foreground leading-7 mb-6">
                  Founded in Leicester, Umrah Supermarket has grown from a single store into a beloved national chain serving multicultural communities across the UK. We are a one-stop destination for premium Halal meats, fresh seasonal produce, and authentic ingredients from African, Caribbean, and Asian markets.
                </p>
                <div className="space-y-4">
                  <div><h4 className="font-header text-sm tracking-[0.1em] uppercase text-primary mb-1">Vision</h4><p className="text-sm text-muted-foreground">To become the premier national destination for global flavours — bringing authentic international groceries to every major community in the United Kingdom.</p></div>
                  <div><h4 className="font-header text-sm tracking-[0.1em] uppercase text-primary mb-1">Mission</h4><p className="text-sm text-muted-foreground">To provide a diverse selection of high-quality Halal meats and fresh world produce at competitive prices through a seamless and welcoming shopping experience.</p></div>
                  <div><h4 className="font-header text-sm tracking-[0.1em] uppercase text-primary mb-1">Purpose</h4><p className="text-sm text-muted-foreground">To ensure multicultural families have reliable access to the essential tastes and traditions of their heritage, all under one roof.</p></div>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80" alt="Fresh produce at Umrah Supermarket" className="w-full h-[400px] object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-muted">
          <div className="container-umrah">
            <div className="text-center mb-12">
              <span className="section-label">What Drives Us</span>
              <h2 className="section-title">Core Values</h2>
              <div className="gold-line mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'fa-award', title: 'Quality', desc: 'We never compromise on the standard of what we stock.' },
                { icon: 'fa-leaf', title: 'Freshness', desc: 'From farm to shelf, freshness is our promise.' },
                { icon: 'fa-tag', title: 'Best Prices', desc: 'Great food should never cost the earth.' },
              ].map(v => (
                <div key={v.title} className="bg-card rounded-lg p-8 text-center hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${v.icon} text-primary text-xl`} />
                  </div>
                  <h3 className="font-header text-lg tracking-[0.08em] uppercase mb-2">{v.title}</h3>
                  <div className="w-10 h-[2px] bg-secondary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Halal cert */}
        <section className="py-16 bg-background">
          <div className="container-umrah text-center max-w-[600px]">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-certificate text-primary text-3xl" />
            </div>
            <h2 className="font-header text-2xl tracking-[0.08em] uppercase mb-3">100% Halal Certified</h2>
            <p className="text-sm text-muted-foreground">Every product in our meat range is certified Halal to the highest UK standards. We partner only with certified suppliers.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-umrah-black">
          <div className="container-umrah">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { n: '7+', l: 'UK Locations' },
                { n: '5,000+', l: 'Products' },
                { n: '100%', l: 'Halal Certified' },
                { n: 'Est. 2010', l: 'Founded' },
              ].map(s => (
                <div key={s.l}>
                  <div className="font-header text-3xl text-secondary mb-1">{s.n}</div>
                  <div className="text-xs text-umrah-white/50 tracking-[0.15em] uppercase">{s.l}</div>
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

export default AboutPage;
