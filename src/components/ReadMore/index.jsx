import "./index.css";
import "../Caption";

import { useEffect, useState } from "react";

import React from "react";

function ReadMore({ caption }) {
  const [desc, setDesc] = useState("");
  const [size, setSize] = useState("");
  const [expand, setExpand] = useState(false);

  const handleReadMore = (e) => {
    e.preventDefault();
    setExpand(true);
    setDesc(caption);
  };

  const handleReadLess = (e) => {
    e.preventDefault();
    setExpand(false);
    setDesc(caption.split(" ").splice(0, 14).join(" "));
  };

  useEffect(() => {
    const split_desc = caption.split(" ");
    const sz = split_desc.length;
    setSize(sz);
    if (sz > 14) {
      setDesc(split_desc.splice(0, 14).join(" "));
    } else {
      setDesc(caption);
    }
  }, [caption]);

  return (
    <span>
      {size > 14 ? (
        <>
          {expand === false ? (
            <>
              {desc}...
              <span className="read__more__less" onClick={handleReadMore}>
                {" "}
                Read More
              </span>
            </>
          ) : (
            <>
              {caption}
              <span className="read__more__less" onClick={handleReadLess}>
                {" "}
                Read Less
              </span>
            </>
          )}
        </>
      ) : (
        <>{caption}</>
      )}
    </span>
  );
}

export default ReadMore;
