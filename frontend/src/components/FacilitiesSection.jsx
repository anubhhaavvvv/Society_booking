import {
  Dumbbell,
  Waves,
  Activity,
  CircleDot,
  Sparkles,
} from 'lucide-react'
import FacilityCarousel from './FacilityCarousel'

const facilities = [
  {
    name: 'Gym',
    description: 'Fully equipped gym with modern machines',
    icon: Dumbbell,
  },
  {
    name: 'Swimming Pool',
    description: 'Clean and well-maintained swimming pool',
    icon: Waves,
  },
  {
    name: 'Badminton Court',
    description: 'Indoor badminton courts with lighting',
    icon: Activity,
  },
  {
    name: 'Lawn Tennis',
    description: 'Professional outdoor tennis courts',
    icon: CircleDot,
  },
  {
    name: 'Table Tennis',
    description: 'Indoor table tennis area',
    icon: CircleDot,
  },
  {
    name: 'Pickleball',
    description: 'Modern pickleball courts',
    icon: Sparkles,
  },
]

const FacilitiesSection = () => {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Our Facilities</h2>
      <p style={styles.subheading}>
        Premium amenities designed for comfort, fitness, and recreation
      </p>

      <div style={styles.grid}>
        {facilities.map((facility, index) => {
          const Icon = facility.icon
          return (
            <div key={index} style={styles.card}>
              {/* IMAGE CAROUSEL */}
              <FacilityCarousel facility={facility.name} />

              {/* ICON */}
              <div style={styles.iconWrapper}>
                <Icon size={26} color="#6366f1" />
              </div>

              {/* TEXT */}
              <h3 style={styles.cardTitle}>{facility.name}</h3>
              <p style={styles.cardDesc}>{facility.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const styles = {
  section: {
    padding: '80px 24px',
    backgroundColor: '#f9fafb',
    textAlign: 'center',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  subheading: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '48px',
  },
  grid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '28px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '18px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  iconWrapper: {
    width: '54px',
    height: '54px',
    borderRadius: '14px',
    backgroundColor: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
}

export default FacilitiesSection
