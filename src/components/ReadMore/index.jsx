import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Caption from "../Post/Caption.jsx";

const ReadMore = ({ children, picCap = false, postId, readMore = true }) => {
  const { id } = useParams();

  const [isReadMore, setIsReadMore] = useState(readMore);
  const navigate = useNavigate();
  let text = children;
  const toggleReadMore = () => setIsReadMore((prev) => !prev);

  return (
    <>
      <Caption
        caption={
          isReadMore ? (picCap ? text.slice(0, 100) : text.slice(0, 40)) : text
        }
      />
      {text.length >= 40 && (
        <span
          onClick={() => {
            toggleReadMore();
            if (!id) {
              navigate(`/dummygram/posts/${postId}`);
            }
          }}
          style={{
            color: "var(--profile-color)",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          {isReadMore ? " ...read more" : " ...show less"}
        </span>
      )}
    </>
  );
};

export default ReadMore;
