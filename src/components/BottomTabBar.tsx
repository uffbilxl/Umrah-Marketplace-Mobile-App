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
    <nav className="ios-fixed-surface fixed inset-x-0 bottom-0 z-50 border-t border-border/30 bg-background/95 backdrop-blur-xl">
      <div className="mobile-dock-frame safe-bottom flex items-center justify-around px-4 pt-2 pb-1">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl px-5 py-2 transition-all duration-200 ${
                isActive
                  ? 'text-secondary'
                  : 'text-muted-foreground active:scale-95'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[0.6rem] font-semibold tracking-wider">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="h-[4px] w-full overflow-hidden">
        <svg width="100%" height="4" preserveAspectRatio="none" viewBox="0 0 400 4">
          <rect width="400" height="4" fill="hsl(var(--secondary))" />
          {Array.from({ length: 25 }).map((_, i) => (
            <polygon
              key={i}
              points={`${i * 16},0 ${i * 16 + 8},4 ${i * 16 + 16},0`}
              fill="hsl(var(--primary))"
            />
          ))}
        </svg>
      </div>
    </nav>
  );
};

export default BottomTabBar;
