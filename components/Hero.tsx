"use client"; // Swiper වැඩ කරන්නේ Client Side නිසා මේක අනිවාර්යයි

import React from "react";
import Image from "next/image";

// Swiper Components සහ Styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Images Import (Public folder එකේ ඇති බවට සහතික වන්න)
import banner1 from "@/public/banner/banner1.webp";
import banner2 from "@/public/banner/banner2.webp";
import banner3 from "@/public/banner/banner3.webp";

const Hero = () => {
    const slides = [
        {
            id: 1,
            title: "Exclusive Collection",
            subtitle: "STREETWEAR ESSENTIALS 2026",
            image: banner1,
        },
        {
            id: 2,
            title: "Summer Vibes",
            subtitle: "NEW ARRIVALS JUST FOR YOU",
            image: banner2,
        },
        {
            id: 3,
            title: "Premium Quality",
            subtitle: "DESIGNED FOR COMFORT & STYLE",
            image: banner3,
        },
    ];

    return (
        <div className="h-[80vh] w-full bg-black overflow-hidden">
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
                            {/* Next.js Image Component - මේකෙන් images load වෙන එක වේගවත් වෙනවා */}
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={slide.id === 1} // පළවෙනි image එක ඉක්මනට load කරනවා
                                className="object-cover brightness-75"
                            />



                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Swiper එකේ බෝල (Bullets) වල පාට වෙනස් කරන්න CSS ටිකක් */}
            <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: white !important;
        }
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          transform: scale(0.5);
        }
      `}</style>
        </div>
    );
};

export default Hero;