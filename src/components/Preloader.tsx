import { useEffect, useState } from 'react';

const Preloader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-umrah-black transition-all duration-600 ${hidden ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}
    >
      <div className="text-center">
        <div className="font-header text-[2.5rem] text-secondary tracking-[0.15em] uppercase mb-2">
          Umrah
        </div>
        <div className="font-body text-sm text-umrah-white tracking-[0.3em] lowercase opacity-70">
          supermarket
        </div>
        <div className="w-[200px] h-[2px] bg-umrah-white/10 mt-8 mx-auto rounded overflow-hidden">
          <div className="h-full bg-secondary animate-[preloaderBar_1.8s_ease_forwards] w-0" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
