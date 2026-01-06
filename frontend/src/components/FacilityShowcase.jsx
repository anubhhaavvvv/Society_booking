import { useNavigate } from 'react-router-dom'

const facilities = [
  {
    name: 'Gym',
    desc: 'Fully equipped gym with structured time-slot access.',
  },
  {
    name: 'Swimming Pool',
    desc: 'Clean, well-maintained pool with controlled capacity.',
  },
  {
    name: 'Badminton Court',
    desc: 'Indoor courts with booking-based access.',
  },
  {
    name: 'Lawn Tennis',
    desc: 'Outdoor tennis courts with fair scheduling.',
  },
  {
    name: 'Table Tennis',
    desc: 'Indoor TT tables for casual and competitive play.',
  },
  {
    name: 'Pickleball',
    desc: 'Modern pickleball courts with hourly slots.',
  },
]

const FacilityShowcase = () => {
  // ✅ STEP 2 GOES HERE (inside component, before return)
  const navigate = useNavigate()

  return (
    <section className="max-w-7xl mx-auto px-6 pb-28">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
        Explore Facilities
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((facility, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(
                `/facility/${facility.name.toLowerCase().replace(' ', '-')}`
              )
            }
            className="
              group cursor-pointer rounded-2xl p-6
              bg-gradient-to-br from-white/10 to-white/5
              border border-white/10
              backdrop-blur-xl
              transition
              hover:-translate-y-2
              hover:shadow-2xl
              hover:border-indigo-400/40
            "
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
              <span className="text-indigo-400 text-lg font-semibold">
                {facility.name[0]}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {facility.name}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {facility.desc}
            </p>

            <div className="mt-6 text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition">
              Book now →
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FacilityShowcase
