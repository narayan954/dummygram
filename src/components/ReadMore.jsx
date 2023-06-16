import React, { useEffect, useState } from "react";

import Caption from "./Caption.jsx";

/**
 *
 * @param caption
 * @returns {JSX.Element}
 * @constructor
 */
export default function ReadMore({ caption }) {
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
    const splitDesc = caption.split(" ");
    const sz = splitDesc.length;
    setSize(sz);
    if (sz > 14) {
      setDesc(splitDesc.splice(0, 14).join(" "));
    } else {
      setDesc(caption);
    }
  }, [caption]);

  return (
    <>
      {size > 14 ? (
        <>
          {expand === false ? (
            <>
              <Caption caption={desc} />
              ...
              <span className="read__more__less" onClick={handleReadMore}>
                Read More
              </span>
            </>
          ) : (
            <>
              <Caption caption={caption} />
              <span className="read__more__less" onClick={handleReadLess}>
                Read Less
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <Caption caption={caption} />
        </>
      )}
    </>
  );
}
