import React, { useState } from "react";

import { ImageSlider } from "../../reusableComponents";
import { ReadMore } from "../index";

const ImgBox = ({ postHasImages, postImages, likesHandler, caption }) => {
  const [readMore, setReadMore] = useState(false);

  // const handleReadPost = () => {
  //     setReadMore(!readMore);
  // };

  return (
    <div>
      {postHasImages ? (
        <ImageSlider
          slides={postImages}
          isCommentBox={false}
          doubleClickHandler={likesHandler}
        />
      ) : (
        <div className="post__background" onDoubleClick={likesHandler}>
          {caption.length >= 300 ? (
            <>
              <p className="post_caption">
                <ReadMore picCap>{caption}</ReadMore>
              </p>
            </>
          ) : (
            <p className="post_caption">{caption}</p>
          )}
        </div>
      )}
      <div className="post__text">
        {caption && postHasImages && caption.length >= 300 ? (
          <p style={{ color: "var(--color)" }}>
            <ReadMore>{caption}</ReadMore>
          </p>
        ) : (
          caption &&
          postHasImages && <p style={{ color: "var(--color)" }}>{caption}</p>
        )}
      </div>
    </div>
  );
};

export default ImgBox;
