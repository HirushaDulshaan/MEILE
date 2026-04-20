"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import banner1 from "@/public/banner/banner1.webp";
import banner2 from "@/public/banner/banner2.webp";
import banner3 from "@/public/banner/banner3.webp";

const Hero = () => {
    const slides = [
        { id: 1, image: banner1 },
        { id: 2, image: banner2 },
        { id: 3, image: banner3 },
    ];

    return (
        <section className="relative w-full bg-white">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper w-full h-auto" // Height එක auto කළා
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="w-full relative leading-[0]">
                            <Image
                                src={slide.image}
                                alt={`Meili Banner ${slide.id}`}
                                width={1920} // මුල් පින්තූරයේ width එක දාන්න
                                height={1080} // මුල් පින්තූරයේ height එක දාන්න
                                priority={slide.id === 1}
                                className="w-full h-auto object-contain" // object-contain මගින් සම්පූර්ණ පින්තූරය පෙන්වයි
                                sizes="100vw"
                                quality={100}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles */}
            <style jsx global>{`
                :root {
                    --swiper-theme-color: #ffffff;
                    --swiper-navigation-size: 20px;
                }
                .swiper-pagination {
                    bottom: 10px !important;
                }
                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.6);
                    width: 8px;
                    height: 8px;
                }
                .swiper-pagination-bullet-active {
                    background: white !important;
                    width: 20px;
                    border-radius: 5px;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: white !important;
                    opacity: 0.5;
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 18px !important;
                }
                @media (max-width: 768px) {
                    .swiper-button-next, .swiper-button-prev {
                        display: none;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;