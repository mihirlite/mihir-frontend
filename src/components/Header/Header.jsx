import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './Header.css'
import { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'



import heroVideo from '../../assets/logo/hero-rider.mp4'
import heroVideoMobile from '../../assets/logo/heromobile.mp4'
import heroPoster from '../../assets/hero_delivery.png'

const Header = () => {
    const { generalSettings, heroImages } = useContext(StoreContext);
    const imagesReady = heroImages && heroImages.length > 0;

    const { 
        heroHeadline = "👉 Fresh Bengali & Odia Thali", 
        heroSubHeadline = "👉 Ghar jaisa khana, daily fresh – Veg, Fish & Chicken", 
        heroPriceHighlight = "Under ₹100" 
    } = generalSettings || {};

    return (
        <section className='hero-section'>
            {/* ── Background Video & Overlay Removed ── */}

            {/* ── Top Branding Section ── */}
            <div className='hero-text-container animate-fadeInUp'>
                <h1 className='hero-title'>
                    {heroHeadline} <span className='highlight-price'>{heroPriceHighlight}</span>
                </h1>
                <p className='hero-subtitle'>
                    {heroSubHeadline}
                </p>
            </div>

            {/* ── Content Grid: Video Card (Left) & Swiper Card (Right) ── */}
            <div className='hero-content-grid'>
                {/* Left: Video Card */}
                <div className='hero-left-content'>
                    <div className='hero-video-card'>
                        <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            preload="metadata"
                            poster={heroPoster}
                            className='hero-card-video'
                        >
                            <source src={window.innerWidth < 768 ? heroVideoMobile : heroVideo} type="video/mp4" />
                        </video>
                    </div>
                </div>

                {/* Right: Swiper Card */}
                {imagesReady && (
                    <div className='hero-right-content'>
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
                                {heroImages.map((slide) => (
                                    <SwiperSlide key={slide._id}>
                                        <img src={slide.image} alt={slide.altText || "Delicious food presentation"} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom Section: CTA Buttons ── */}
            <div className='hero-footer'>
                <div className='hero-cta-row'>
                    <a href='#all-foods' className='btn-primary'>Order Now</a>
                    <a href='#all-foods' className='btn-outline'>Explore More</a>
                </div>
            </div>
        </section>
    )
}

export default Header
