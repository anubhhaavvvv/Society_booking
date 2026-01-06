import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const FacilityCard = ({ name, slug, accent, images }) => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)

  const startCarousel = () => {
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 1400)
  }

  const stopCarousel = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIndex(0)
  }

  return (
    <div
      onMouseEnter={startCarousel}
      onMouseLeave={stopCarousel}
      onClick={() => navigate(`/facilities/${slug}`)}
      className="group relative cursor-pointer"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-3xl blur-2xl opacity-40 group-hover:opacity-80 transition"
        style={{
          background: `linear-gradient(135deg, ${accent}, transparent 70%)`,
        }}
      />

      {/* POLAROID CARD */}
      <div
        className="
          relative
          w-[340px] sm:w-[380px] md:w-[420px]
          h-[520px]
          bg-white
          rounded-3xl
          overflow-hidden
          shadow-2xl
          transition-transform duration-500
          group-hover:-translate-y-3
        "
      >
        {/* IMAGE AREA */}
        <div className="relative h-[78%] w-full overflow-hidden">
          <img
            src={images[index]}
            alt={name}
            className="
              absolute inset-0
              w-full h-full
              object-cover
              transition-opacity duration-700
            "
          />
        </div>

        {/* BOTTOM POLAROID STRIP */}
        <div className="relative h-[22%] px-6 py-5 bg-white text-black">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {name}
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Tap to view availability
          </p>

          <div
            className="mt-3 h-[3px] w-16 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
    </div>
  )
}

export default FacilityCard
