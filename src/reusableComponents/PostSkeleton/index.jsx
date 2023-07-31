import "./index.css";

import { Skeleton } from "@mui/material";

const PostSkeleton = () => {
  return (
    <div className="skeleton">
      <div className="post-skeleton-header">
        <Skeleton variant="circular" width={40} height={40} />
        <span>
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem" }}
            className="skeleton-user-name"
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.7rem" }}
            className="skeleton-user-name"
          />
        </span>
      </div>
      <Skeleton variant="rectangular" height={240} />
      <Skeleton
        variant="text"
        sx={{ fontSize: "1rem" }}
        className="skeleton-user-caption"
      />
      <div className="post-skeleton-nav">
        <Skeleton variant="rectangular" width={50} height={35} />
        <Skeleton variant="rectangular" width={50} height={35} />
        <Skeleton variant="rectangular" width={50} height={35} />
        <Skeleton variant="rectangular" width={50} height={35} />
      </div>
      <Skeleton variant="rectangular" height={30} />
    </div>
  );
};

export default PostSkeleton;
