/** Decorative drifting gradient shapes. CSS-only (transform animation); static under reduced motion. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)',
        }}
      />
      <div
        className="animate-drift-a absolute -top-32 -right-24 size-[34rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(200 255 46 / 0.28), transparent 65%)' }}
      />
      <div
        className="animate-drift-b absolute -bottom-40 -left-32 size-[30rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(120 90 255 / 0.22), transparent 65%)' }}
      />
    </div>
  );
}
