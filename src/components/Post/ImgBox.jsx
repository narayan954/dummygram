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
              <div className="post_caption">
                <ReadMore picCap>{caption}</ReadMore>
              </div>
            </>
          ) : (
            <p className="post_caption">{caption}</p>
          )}
        </div>
      )}
      <div className="post__text">
        {caption && postHasImages && caption.length >= 300 ? (
          <>
            <ReadMore>{caption}</ReadMore>
          </>
        ) : (
          caption && postHasImages && <p className="">{caption}</p>
        )}
      </div>
    </div>
  );
};

export default ImgBox;
