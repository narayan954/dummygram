import "./index.css";

import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

const ImageSlider = ({ slides, doubleClickHandler }) => {
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
            className="image"
            src={imageUrl}
            placeholderSrc={thumbnail}
            effect="blur"
            alt={" upload"}
            delayTime={1000}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          {slides.length > 1 ? (
            <div className={"slider-action"}>
              <FaChevronCircleLeft
                className="circle"
                onClick={prevStep}
                title={"View Previous Image"}
                // style={isCommentBox ? {width: "60%"} : {width: "60%"}}
              />
              <FaChevronCircleRight
                className="chevron"
                onClick={nextStep}
                title={"View Next Image"}
                // style={isCommentBox ? {width: "60%"} : {width: "60%"}}
              />
            </div>
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
