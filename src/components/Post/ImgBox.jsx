import Caption from "./Caption.jsx";
import { ImageSlider } from "../../reusableComponents";
import React from "react";
import { ReadMore } from "../index";

const ImgBox = ({
  postHasImages,
  postImages,
  likesHandler,
  caption,
  postId,
  background,
}) => {
  const defaultBg = `linear-gradient(130deg, #dee2ed, #dee2ed, #9aa9d1, #b6c8e3, #b6afd0, #d3c0d8)`;
  return (
    <div>
      {postHasImages ? (
        <ImageSlider
          slides={postImages}
          isCommentBox={false}
          doubleClickHandler={likesHandler}
        />
      ) : (
        <div
          className="post__background"
          style={{ background: background ? background : defaultBg }}
          onDoubleClick={likesHandler}
        >
          {caption.length >= 300 ? (
            <>
              <p className="post_caption">
                <ReadMore picCap postId={postId}>
                  {caption}
                </ReadMore>
              </p>
            </>
          ) : (
            <p className="post_caption">
              <Caption caption={caption} />
            </p>
          )}
        </div>
      )}

      <div className={caption.length ? "p-0" : "post__text"}>
        {caption && postHasImages ? (
          <p
            className={`${
              caption.length >= 100 ? "postCaption" : "postCaptiontext"
            }`}
          >
            <ReadMore postId={postId}>{caption}</ReadMore>
          </p>
        ) : (
          <p
            style={{
              color: "var(--color)",
              paddingInline: "8px",
              height: "27px",
            }}
          ></p>
        )}
      </div>
    </div>
  );
};

export default ImgBox;
