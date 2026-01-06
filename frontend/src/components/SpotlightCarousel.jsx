import { useEffect, useRef, useState, useMemo } from "react"
import FacilityCard from "./FacilityCard"

const LOOP_MULTIPLIER = 3
const SCROLL_AMOUNT = 780// wider scroll step

const SpotlightCarousel = ({ facilities }) => {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const loopedFacilities = useMemo(() => {
    return Array(LOOP_MULTIPLIER).fill(facilities).flat()
  }, [facilities])

  /* Center on mount */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.scrollLeft =
      container.scrollWidth / 2 - container.offsetWidth / 2
  }, [])

  /* Spotlight tracking */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const children = Array.from(container.children)
      const center =
        container.scrollLeft + container.offsetWidth / 2

      let closest = 0
      let minDist = Infinity

      children.forEach((child, i) => {
        const childCenter =
          child.offsetLeft + child.offsetWidth / 2
        const dist = Math.abs(center - childCenter)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      })

      setActiveIndex(closest)

      const maxScroll = container.scrollWidth
      const threshold = container.offsetWidth

      if (container.scrollLeft < threshold) {
        container.scrollLeft = maxScroll / 2
      }
      if (container.scrollLeft > maxScroll - threshold) {
        container.scrollLeft = maxScroll / 2
      }
    }

    container.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => container.removeEventListener("scroll", handleScroll)
  }, [loopedFacilities])

  /* Keyboard arrows */
  useEffect(() => {
    const handleKey = (e) => {
      if (!containerRef.current) return
      if (e.key === "ArrowRight")
        containerRef.current.scrollLeft += SCROLL_AMOUNT
      if (e.key === "ArrowLeft")
        containerRef.current.scrollLeft -= SCROLL_AMOUNT
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <div className="relative mt-28 overflow-hidden">

      {/* Spotlight */}
      <div className="pointer-events-none absolute inset-x-0 -top-48 h-[550px] flex justify-center">
        <div className="w-[780px] h-full bg-gradient-to-b from-white/25 via-white/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Left Arrow */}
      <button
        onClick={() =>
          (containerRef.current.scrollLeft -= SCROLL_AMOUNT)
        }
        className="
          absolute left-6 top-1/2 -translate-y-1/2 z-20
          bg-black/70 hover:bg-black
          border border-white/10
          rounded-full p-4
        "
      >
        ◀
      </button>

      {/* Right Arrow */}
      <button
        onClick={() =>
          (containerRef.current.scrollLeft += SCROLL_AMOUNT)
        }
        className="
          absolute right-6 top-1/2 -translate-y-1/2 z-20
          bg-black/70 hover:bg-black
          border border-white/10
          rounded-full p-4
        "
      >
        ▶
      </button>

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="
          relative z-10
          flex gap-28
          overflow-x-scroll
          snap-x snap-mandatory
          px-[38vw]
          min-w-full
          no-scrollbar
        "
      >
        {loopedFacilities.map((facility, index) => {
          const isActive = index === activeIndex

          return (
<div
  key={`${facility.slug}-${index}`}
  className={`
    snap-center
    transition-all duration-300
    w-[720px] md:w-[780px] lg:w-[820px]
    ${isActive
      ? "scale-100 opacity-100"
      : "scale-90 opacity-30"
    }
  `}
>

              <FacilityCard {...facility} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SpotlightCarousel
