import "./index.css";

import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

const ImageSlider = ({ slides, doubleClickHandler }) => {
  const [current, setCurrent] = useState(0);

  const prevStep = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextStep = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    setTimeout(nextStep, 1000);
  }, [slides]);

  return (
    slides.length > 0 && (
      <div className="slider" onDoubleClick={doubleClickHandler}>
        {slides.map(({ imageUrl, thumbnail }, index) => (
          <div
            style={{
              display: index === current ? "contents" : "none",
              width: "100%",
            }}
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            <LazyLoadImage
              className="image post__image"
              src={imageUrl}
              placeholderSrc={thumbnail}
              effect="blur"
              alt={" upload"}
              delayTime={1000}
            />
            {slides.length > 1 && (
              <div className={"slider-action"}>
                <FaChevronCircleLeft
                  className="circle"
                  onClick={prevStep}
                  title={"View Previous Image"}
                />
                <FaChevronCircleRight
                  className="chevron"
                  onClick={nextStep}
                  title={"View Next Image"}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default ImageSlider;
