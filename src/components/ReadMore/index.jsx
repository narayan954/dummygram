import React, {useState} from "react";

const ReadMore = ({children, picCap = false}) => {
    let text = children;

    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => setIsReadMore((prev) => !prev);

    return (
        <>
            {isReadMore ? (picCap ? text.slice(0, 300) : text.slice(0, 100)) : text}
            {text.length >= 300 && (
                <strong
                    onClick={toggleReadMore}
                    style={{color: "black", fontWeight: "bold"}}
                >
                    {isReadMore ? " ...read more" : " show less"}
                </strong>
            )}
        </>
    );
};

export default ReadMore;