import {useEffect, useState} from "react";

const useCreatedAt = (postTimestamp) => {
    const [time, setTime] = useState("");
    console.log(postTimestamp)
    useEffect(() => {
        const calculateTime = () => {
            if (!postTimestamp) return ""; // Handle null or undefined case

            const postDate = postTimestamp.toDate();
            const currentDate = new Date();
            const timeDiff = currentDate.getTime() - postDate.getTime();
            const seconds = Math.floor(timeDiff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                if (days === 1) {
                    return "Yesterday";
                } else {
                    const options = {year: "numeric", month: "long", day: "numeric"};
                    return postDate.toLocaleDateString(undefined, options);
                }
            } else if (hours > 0) {
                return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
            } else if (minutes > 0) {
                return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
            } else {
                return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
            }
        };

        setTime(calculateTime());
    }, [postTimestamp]);

    return time;
};

export default useCreatedAt;