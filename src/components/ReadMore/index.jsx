import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ReadMore = ({ children, picCap = false, postId, readMore = true }) => {
  const { id } = useParams();
  
  const [isReadMore, setIsReadMore] = useState(readMore);
  const navigate = useNavigate()
  let text = children;
  const toggleReadMore = () => setIsReadMore((prev) => !prev);

  return (
    <>
      {isReadMore ? (picCap ? text.slice(0, 300) : text.slice(0, 100)) : text}
      {text.length >= 300 && (
        <span
          onClick={() => {
            toggleReadMore()
            if(!id){
              navigate(`/dummygram/posts/${postId}`)
            }
          }}
          style={{
            color: "var(--color)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {isReadMore ? " ...read more" : " ...show less"}
        </span>
      )}
    </>
  );
};

export default ReadMore;
