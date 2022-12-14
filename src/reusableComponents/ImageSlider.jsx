import React, { useEffect, useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./ImageSlider.css";

const ImageSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  //destructure  slides.lenght to get const { lenght } = slides;

  const prevStep = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextStep = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    setTimeout(nextStep, 1000);
  }, [slides]);

  // useEffect(() => {
  //   setTimeout(() => setCurrent(current + 1), 1000);
  // }, [slides]);

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <div className="slider">
      {slides.map(({ imageUrl, imageWidth, imageHeight, thumbnail }, index) => (
        <div
          style={{ display: index === current ? "contents" : "none" }}
          className={index === current ? "slide active" : "slide"}
          key={index}
        >
          <LazyLoadImage
            className="image"
            src={imageUrl}
            placeholderSrc={thumbnail}
            effect="blur"
            alt={` upload`}
            delayTime={1000}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <FaChevronCircleLeft className="circle" onClick={prevStep} />
          <FaChevronCircleRight className="chevron" onClick={nextStep} />
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;

// className={index === current ? "slide active" : "slide"}
