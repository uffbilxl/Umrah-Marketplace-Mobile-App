const SidePatternStrip = ({ side }: { side: 'left' | 'right' }) => {
  const isLeft = side === 'left';

  return (
    <div
      className={`fixed ${isLeft ? 'left-0' : 'right-0'} top-0 bottom-0 z-[35] pointer-events-none`}
      style={{ width: '8px' }}
      aria-hidden="true"
    >
      <svg
        width="8"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 8 600"
        className={isLeft ? '' : 'scale-x-[-1]'}
      >
        <defs>
          <pattern id={`side-pattern-${side}`} x="0" y="0" width="8" height="40" patternUnits="userSpaceOnUse">
            {/* Gold background segment */}
            <rect width="8" height="20" fill="hsl(43, 89%, 58%)" opacity="0.15" />
            {/* Green background segment */}
            <rect y="20" width="8" height="20" fill="hsl(150, 52%, 21%)" opacity="0.15" />
            {/* Diamond */}
            <polygon points="4,2 7,10 4,18 1,10" fill="hsl(43, 89%, 58%)" opacity="0.12" />
            {/* Small triangle */}
            <polygon points="0,20 8,20 4,28" fill="hsl(150, 52%, 21%)" opacity="0.12" />
            {/* Dots */}
            <circle cx="4" cy="35" r="1.5" fill="hsl(43, 89%, 58%)" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="8" height="600" fill={`url(#side-pattern-${side})`} />
      </svg>
    </div>
  );
};

export default SidePatternStrip;
