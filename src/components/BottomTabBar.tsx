import { NavLink } from 'react-router-dom';
import { Home, Search, Gift, User } from 'lucide-react';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const BottomTabBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-4 mb-3 bg-muted/90 backdrop-blur-xl rounded-full border border-border/50 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around py-2 px-2">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-5 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-muted text-secondary'
                    : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[0.6rem] font-semibold tracking-wider">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomTabBar;
