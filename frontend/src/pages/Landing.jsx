import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const Landing = () => {
  const navigate = useNavigate()

  const cursorRef = useRef({ x: 0, y: 0 })
  const glowRef = useRef(null)

  // Smooth cursor interpolation
  useEffect(() => {
    const move = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      if (glowRef.current) {
        const { x, y } = cursorRef.current
        glowRef.current.style.transform = `translate(${x - 250}px, ${
          y - 250
        }px)`
      }
      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", move)
    animate()

    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* DOT GRID BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* CURSOR GLOW */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[160px] transition-transform duration-100"
      />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="group relative max-w-2xl rounded-3xl p-[2px]">

          {/* ELECTRIC BORDER */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 opacity-70 blur-sm animate-[spin_6s_linear_infinite]" />

          {/* INNER CARD */}
          <div className="relative rounded-3xl bg-black/70 backdrop-blur-xl border border-white/10 p-12 shadow-2xl">

            <h1 className="text-5xl font-extrabold tracking-tight">
              {" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Connect
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
              Book Facilities on the go, Stay Connected with Your Community.
            </p>

            {/* CTA */}
            <div className="mt-10">
<button
  onClick={() => navigate("/auth")}
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translate(0, 0)"
  }}
  className="relative transition-transform duration-200 rounded-xl bg-blue-600 px-10 py-4 font-semibold hover:bg-blue-700"
>
  Login to Continue
</button>

            </div>

            <p className="mt-8 text-sm text-slate-500">
              Built for modern apartment living
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
