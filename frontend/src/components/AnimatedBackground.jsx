export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.10),transparent_60%)]" />
    </div>
  );
}
