import AnimatedBackground from "./AnimatedBackground";
import MovingRectangles from "./MovingRectangles";

export default function LandingVisuals() {
  return (
    <>
      {/* Base animated gradient / particles */}
      <AnimatedBackground />

      {/* Floating outline rectangles */}
      <MovingRectangles />
    </>
  );
}
