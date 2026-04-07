import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { ArrowLeft, MapPin, Clock, Phone, ExternalLink } from 'lucide-react';

const stores = [
  { name: 'Leicester — HQ', address: '123 Retail Park, Leicester, LE1 1AA', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '0116 000 0000', open: true, maps: 'https://maps.google.com/?q=Leicester+LE1+1AA' },
  { name: 'Liverpool', address: '45 City Road, Liverpool, L1 4AB', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '0151 000 0000', open: true, maps: 'https://maps.google.com/?q=Liverpool+L1+4AB' },
  { name: 'Huddersfield', address: '78 Market Street, Huddersfield, HD1 2CD', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '01484 000 000', open: true, maps: 'https://maps.google.com/?q=Huddersfield+HD1+2CD' },
  { name: 'Northampton', address: '12 Retail Avenue, Northampton, NN1 3EF', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '01604 000 000', open: true, maps: 'https://maps.google.com/?q=Northampton+NN1+3EF' },
  { name: 'Birmingham', address: '', hours: '', tel: '', open: false, maps: '' },
  { name: 'Manchester', address: '', hours: '', tel: '', open: false, maps: '' },
  { name: 'Leeds', address: '', hours: '', tel: '', open: false, maps: '' },
];

const StoresPage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Our Stores | Umrah Supermarket'; }, []);

  const filtered = stores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <MobileHeader />
      <main className="pt-20 pb-24 min-h-screen bg-background">
        <div className="px-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="font-header text-2xl tracking-[0.08em] uppercase mb-2">Our Stores</h1>
          <p className="text-sm text-muted-foreground mb-5">Find your nearest Umrah Supermarket</p>

          <input
            type="text"
            placeholder="Search by city or postcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 mb-5"
          />

          <div className="space-y-3">
            {filtered.map(store => (
              <div key={store.name} className={`bg-card rounded-xl p-4 ${!store.open ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-header text-sm tracking-[0.08em] uppercase text-foreground">{store.name}</h3>
                  <span className={`text-[0.6rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${store.open ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {store.open ? 'Open' : 'Coming Soon'}
                  </span>
                </div>
                {store.open ? (
                  <>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                        {store.address}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                        {store.hours}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                        {store.tel}
                      </div>
                    </div>
                    <a
                      href={store.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase"
                    >
                      Get Directions <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">Coming soon to {store.name}!</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
};

export default StoresPage;
