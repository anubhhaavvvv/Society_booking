export default function MovingRectangles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rectangle 1 */}
      <div className="absolute w-72 h-40 border border-cyan-400/30 rounded-xl
        animate-rect-1" />

      {/* Rectangle 2 */}
      <div className="absolute w-96 h-52 border border-purple-400/20 rounded-2xl
        animate-rect-2" />

      {/* Rectangle 3 */}
      <div className="absolute w-60 h-36 border border-emerald-400/20 rounded-xl
        animate-rect-3" />
    </div>
  );
}
