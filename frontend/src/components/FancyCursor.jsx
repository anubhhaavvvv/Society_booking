import { useEffect, useRef } from "react"

const FancyCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  const mouse = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const animate = () => {
      // Smooth follow (lerp)
      dot.current.x += (mouse.current.x - dot.current.x) * 0.25
      dot.current.y += (mouse.current.y - dot.current.y) * 0.25

      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }

      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", move)
    animate()

    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <>
      {/* Core dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400"
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/40"
      />
    </>
  )
}

export default FancyCursor
