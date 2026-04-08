const DecorativeStrip = ({ position }: { position: 'top' | 'bottom' }) => {
  const isTop = position === 'top';

  return (
    <div
      className={`fixed ${isTop ? 'top-0' : 'bottom-0'} left-0 right-0 z-30 pointer-events-none overflow-hidden hidden`}
      style={{ height: '6px' }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="6"
        preserveAspectRatio="none"
        viewBox="0 0 400 6"
        className={isTop ? '' : 'rotate-180'}
      >
        {/* Gold base */}
        <rect width="400" height="6" fill="hsl(43, 89%, 58%)" />
        {/* Green triangles pattern */}
        {Array.from({ length: 20 }).map((_, i) => (
          <polygon
            key={i}
            points={`${i * 20},6 ${i * 20 + 10},0 ${i * 20 + 20},6`}
            fill="hsl(150, 52%, 21%)"
          />
        ))}
      </svg>
    </div>
  );
};

export default DecorativeStrip;
