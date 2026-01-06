import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const images = {
  Gym: [
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
    'https://images.unsplash.com/photo-1558611848-73f7eb4001a1',
  ],
  'Swimming Pool': [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  ],
  'Badminton Court': [
    'https://images.unsplash.com/photo-1599058917212-d750089bc07a',
  ],
  'Lawn Tennis': [
    'https://images.unsplash.com/photo-1521412644187-c49fa049e84d',
  ],
  'Table Tennis': [
    'https://images.unsplash.com/photo-1628890920690-9e29d0019b9c',
  ],
  Pickleball: [
    'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e',
  ],
}

const FacilityCarousel = ({ facility }) => {
  const slides = images[facility] || []

  return (
    <Swiper spaceBetween={12} slidesPerView={1}>
      {slides.map((src, index) => (
        <SwiperSlide key={index}>
          <img
            src={src}
            alt={facility}
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              borderRadius: '14px',
              marginBottom: '16px',
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default FacilityCarousel
