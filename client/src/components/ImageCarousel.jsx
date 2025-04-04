import React from "react";
import { Carousel } from "react-bootstrap";
import slide1 from "../assets/img/slide1.png";
import slide2 from "../assets/img/slide2.png";
import slide3 from "../assets/img/slide3.png";

const ImageCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          src={slide2}
          alt="First slide"
          className="w-full h-auto max-w-[900px] mx-auto mt-20" 
        />
      </Carousel.Item>

      <Carousel.Item>
        <img  src={slide1}
          alt="Second slide"
          className="w-full h-auto max-w-[900px] mx-auto mt-20" 
        />
      </Carousel.Item>

      <Carousel.Item>
        <img   
          src={slide3}
          alt="third slide"
          className="w-full h-auto max-w-[900px] mx-auto mt-20" 
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default ImageCarousel;
