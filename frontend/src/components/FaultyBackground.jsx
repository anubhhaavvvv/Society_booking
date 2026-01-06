import FaultyTerminal from "./FaultyTerminal";

export default function FaultyBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <FaultyTerminal
        digitSize={0.9}
        timeScale={1.2}
        tint="#2c4054"
        brightness={0.9}
        curvature={0.15}
        scanlineIntensity={0.25}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
      />
    </div>
  );
}
