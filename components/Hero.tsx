"use client";

import React from "react";
import Image from "next/image";

// Swiper Components සහ Styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Images Import
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
        <div className="h-[80vh] w-full bg-black overflow-hidden relative">
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
                className="mySwiper h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full w-full">
                            <Image
                                src={slide.image}
                                alt={`Meili Banner ${slide.id}`}
                                fill
                                // Priority eka slide 1 ta aniwaaryenma danna
                                priority={slide.id === 1}
                                // LCP fix ekata meka godak wadagath
                                fetchPriority={slide.id === 1 ? "high" : "auto"}
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles */}
            <style jsx global>{`
                .swiper-pagination-bullet-active {
                    background: white !important;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: white !important;
                    transform: scale(0.5);
                }
                /* Hide navigation on mobile if needed */
                @media (max-width: 640px) {
                    .swiper-button-next, .swiper-button-prev {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Hero;