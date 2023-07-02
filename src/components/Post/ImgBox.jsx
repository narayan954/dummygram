import { ImageSlider } from "../../reusableComponents";
import React from "react";
import { ReadMore } from "../index";

const ImgBox = ({
  postHasImages,
  postImages,
  likesHandler,
  caption,
  postId,
}) => {
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
                <ReadMore picCap postId={postId}>
                  {caption}
                </ReadMore>
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
            <ReadMore postId={postId}>{caption}</ReadMore>
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
