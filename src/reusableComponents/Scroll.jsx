import React from "react";

const Scroll = (props) => {
  return (
    <div
      style={{
        overflow: "scroll",
        border: "2px black",
        height: "250px",
        overflowX: "hidden"
      }}
    >
      {props.children}
    </div>
  );
};

export default Scroll;
