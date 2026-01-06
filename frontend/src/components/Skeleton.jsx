export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-white/5
        rounded-xl
        ${className}
      `}
    >
      <div
        className="
          absolute
          inset-0
          -translate-x-full
          animate-[shimmer_1.6s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
      />
    </div>
  );
}
