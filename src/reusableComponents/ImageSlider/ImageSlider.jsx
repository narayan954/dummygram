import "./ImageSlider.css";

import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

const ImageSlider = ({ slides, isCommentBox }) => {
  const [current, setCurrent] = useState(0);

  //destructure  slides.length to get const { length } = slides;

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

  return slides.length ? (
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
            alt={" upload"}
            delayTime={1000}
            style={{
              width: "100%",
              height: "14rem",
              objectFit: "contain",
            }}
          />
          {slides.length > 1 ? (
            <>
              <FaChevronCircleLeft
                className="circle"
                onClick={prevStep}
                style={isCommentBox ? { width: "50%" } : { width: "100%" }}
              />
              <FaChevronCircleRight
                className="chevron"
                onClick={nextStep}
                style={isCommentBox ? { width: "50%" } : { width: "100%" }}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  ) : null;
};

export default ImageSlider;

// className={index === current ? "slide active" : "slide"}
