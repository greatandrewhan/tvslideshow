import React, { useState, useEffect, useCallback } from "react";
import { client } from "../../client";
import CarouselSlide from "./CarouselSlide";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Navigation,
  Pagination,
  Keyboard,
  Autoplay,
} from "swiper";
import "swiper/scss";
import "swiper/scss/effect-fade";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import Loader from "../Loader/Loader";

SwiperCore.use([Navigation]);

const Carousel = () => {
  const [isCarouselLoading, setIsCarouselLoading] = useState(false);
  const [carouselSlides, setCarouselSlides] = useState([]);

  const cleanUpCarouselSlides = useCallback((rawData) => {
    const cleanSlides = rawData.map((slide) => {
      const { sys, fields } = slide;
      const { id } = sys;
      const slideTitle = fields.title;
      const slideDescription = fields.description;
      const slideBg = fields.image.fields.file.url;
      const updatedSlide = { id, slideTitle, slideDescription, slideBg };
      return updatedSlide;
    });

    setCarouselSlides(cleanSlides);
  }, []);

  const getCarouselSlides = useCallback(async () => {
    setIsCarouselLoading(true);
    try {
      const response = await client.getEntries({
        content_type: "tvslideshow",
      });
      const responseData = response.items;
      if (responseData) {
        cleanUpCarouselSlides(responseData);
      } else {
        setCarouselSlides([]);
      }
      setIsCarouselLoading(false);
    } catch (error) {
      console.log(error);
      setIsCarouselLoading(false);
    }
  }, [cleanUpCarouselSlides]);

  useEffect(() => {
    getCarouselSlides();
  }, [getCarouselSlides]);

  if (isCarouselLoading) {
    return <Loader />;
  }

  if (!Array.isArray(carouselSlides) || !carouselSlides.length) {
    return null;
  }

  return (
    <div className="carousel">
      <Swiper
        effect={"fade"}
        pagination={{
          clickable: true,
        }}
        keyboard={{
          enabled: true,
        }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        navigation={true}
        loop={true}
        modules={[EffectFade, Autoplay, Keyboard, Pagination, Navigation]}
      >
        {carouselSlides.map((item) => {
          const { id, slideTitle, slideDescription, slideBg } = item;
          return (
            <SwiperSlide key={id}>
              <CarouselSlide
                slideTitle={slideTitle}
                slideDescription={slideDescription}
                slideBg={slideBg}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Carousel;
