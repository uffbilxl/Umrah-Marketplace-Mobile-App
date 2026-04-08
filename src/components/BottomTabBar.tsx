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
      <div className="bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-around py-2 px-4">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-secondary'
                    : 'text-muted-foreground active:scale-95'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[0.6rem] font-semibold tracking-wider">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      {/* Decorative pattern strip at bottom */}
      <div className="h-[4px] w-full overflow-hidden">
        <svg width="100%" height="4" preserveAspectRatio="none" viewBox="0 0 400 4">
          <rect width="400" height="4" fill="hsl(43, 89%, 58%)" />
          {Array.from({ length: 25 }).map((_, i) => (
            <polygon
              key={i}
              points={`${i * 16},0 ${i * 16 + 8},4 ${i * 16 + 16},0`}
              fill="hsl(150, 52%, 21%)"
            />
          ))}
        </svg>
      </div>
    </nav>
  );
};

export default BottomTabBar;
