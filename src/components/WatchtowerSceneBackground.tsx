/**
 * Shared Europe-map scene used on the landing page and countries picker so
 * transitions only swap foreground UI, not the backdrop.
 */
type WatchtowerSceneBackgroundProps = {
  /** Pin behind scrolling content (landing → gallery handoff). */
  fixed?: boolean;
  className?: string;
};

export function WatchtowerSceneBackground({
  fixed = false,
  className = '',
}: WatchtowerSceneBackgroundProps) {
  return (
    <div
      className={[
        fixed ? 'fixed inset-0' : 'absolute inset-0',
        'overflow-hidden bg-[#050508]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-[0.55] saturate-[0.85] contrast-[1.05] sm:opacity-60"
        style={{ backgroundImage: 'url(/hero/europe.png), url(/hero/europe.svg)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(120,160,220,0.18),transparent_50%),radial-gradient(ellipse_90%_60%_at_100%_50%,rgba(80,100,140,0.12),transparent_45%),linear-gradient(180deg,rgba(8,10,16,0.35)_0%,rgba(5,6,10,0.55)_45%,rgba(3,4,8,0.75)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
    </div>
  );
}
