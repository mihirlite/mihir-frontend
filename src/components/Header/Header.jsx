import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './Header.css'

const slides = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/8818667/pexels-photo-8818667.jpeg",
        alt: "Veg Thali"
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/4997810/pexels-photo-4997810.jpeg",
        alt: "Non-Veg Thali"
    }
]

const Header = () => {
    return (
        <section className='hero-section'>

            {/* ── Left: Text Content ── */}
            <div className='hero-left'>
                <h1 className='hero-heading'>
                    Bringing the Taste of Home<br />
                    to Every Plate.

                </h1>
                <p className='hero-para'>
                    Freshly prepared every day using traditional recipes and local ingredients.
                </p>
                <div className='hero-cta-row'>
                    <a href='#all-foods' className='btn-primary'>Order Now</a>
                    <a href='#all-foods' className='btn-outline'>Explore Menu</a>
                </div>
            </div>

            {/* ── Right: Image Card with Badges ── */}
            <div className='hero-right'>
                <div className='hero-image-card'>
                    {/* Top-left badge */}
                    <div className='badge badge-top'>
                        <span className='badge-icon'>🌿</span>
                        <div>
                            <p className='badge-title'>Super Fresh</p>
                            <p className='badge-sub'>100% Organic</p>
                        </div>
                    </div>

                    {/* Carousel */}
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        loop={true}
                        className="hero-swiper"
                    >
                        {slides.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <img src={slide.image} alt={slide.alt} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Bottom-right badge */}
                    <div className='badge badge-bottom'>
                        <span className='badge-icon'>🚚</span>
                        <div>
                            <p className='badge-title'>Fast Delivery</p>
                            <p className='badge-sub'>30 min Guarantee</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Header
