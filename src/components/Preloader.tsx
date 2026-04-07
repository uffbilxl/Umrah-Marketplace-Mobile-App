import { useEffect, useState } from 'react';

const Preloader = () => {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'hidden'>('visible');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), 2200);
    const hideTimer = setTimeout(() => setPhase('hidden'), 2800);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-background transition-opacity duration-500 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center flex flex-col items-center">
        <img
          src="/images/umrah_logo.png"
          alt="Umrah Supermarket"
          className="h-20 w-auto object-contain mb-6 animate-[fadeInScale_0.8s_ease_forwards]"
        />
        <div className="font-header text-[2rem] text-secondary tracking-[0.15em] uppercase mb-1 animate-[fadeInUp_0.6s_0.3s_ease_both]">
          Umrah
        </div>
        <div className="text-xs text-muted-foreground tracking-[0.3em] lowercase mb-8 animate-[fadeInUp_0.6s_0.5s_ease_both]">
          supermarket
        </div>
        <div className="w-[180px] h-[2px] bg-muted rounded overflow-hidden animate-[fadeInUp_0.6s_0.7s_ease_both]">
          <div className="h-full bg-secondary rounded animate-[preloaderBar_1.8s_ease_forwards]" style={{ width: 0 }} />
        </div>
        <p className="text-[0.6rem] text-muted-foreground tracking-[0.2em] uppercase mt-4 animate-[fadeInUp_0.6s_0.9s_ease_both]">
          Quality · Freshness · Best Prices
        </p>
      </div>
    </div>
  );
};

export default Preloader;
