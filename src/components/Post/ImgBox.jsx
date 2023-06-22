import React, { useState } from 'react'
import { ImageSlider } from '../../reusableComponents'
import { Caption, ReadMore } from "../index"

const ImgBox = ({ postHasImages, postImages, likesHandler, caption}) => {
    const [readMore, setReadMore] = useState(false);

    const handleReadPost = () => {
        setReadMore(!readMore);
      };

    return (
        <div>
            {postHasImages ? (
                <ImageSlider
                    slides={postImages}
                    isCommentBox={false}
                    doubleClickHandler={likesHandler}
                />
            ) : (
                <div className="post__background">
                    {caption.length >= 700 && readMore === false ? (
                        <>
                            <p className="post_caption">
                                <Caption caption={caption.substr(0, 700)} />
                                <button
                                    className="post__btn"
                                    onClick={() => handleReadPost()}
                                >
                                    ... Read More
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="post_caption">
                                <Caption caption={caption} />
                            </p>
                            {caption.length >= 700 && (
                                <button
                                    className="post__less_btn"
                                    onClick={() => handleReadPost()}
                                >
                                    ... Read Less
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
            <div className="post__text">
                {caption && postHasImages && (
                    <>
                        <ReadMore caption={caption} />
                    </>
                )}
            </div>
        </div>
    )
}

export default ImgBox
