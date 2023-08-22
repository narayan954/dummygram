import "./index.css";

import { Skeleton } from "@mui/material";

const PostSkeleton = () => {
  return (
    <div className="skeleton">
      <div className="post-skeleton-header">
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          className="shimmer_bg"
        />
        <span>
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem" }}
            className="skeleton-user-name shimmer_bg"
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.7rem" }}
            className="skeleton-user-name shimmer_bg"
          />
        </span>
      </div>
      <Skeleton variant="rectangular" height={240} className="shimmer_bg" />
      <Skeleton
        variant="text"
        sx={{ fontSize: "1rem" }}
        className="skeleton-user-caption shimmer_bg"
      />
      <div className="post-skeleton-nav">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            variant="rectangular"
            width={50}
            height={35}
            className="shimmer_bg"
          />
        ))}
      </div>
      <Skeleton variant="rectangular" height={30} className="shimmer_bg" />
    </div>
  );
};

export default PostSkeleton;
