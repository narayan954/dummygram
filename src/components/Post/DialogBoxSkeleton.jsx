import Skeleton from "@mui/material/Skeleton";

const DialogBoxSkeleton = () => {
  return (
    <div>
      <SkeletonStructure />
      <SkeletonStructure />
      <SkeletonStructure />
      <SkeletonStructure />
    </div>
  );
};

export default DialogBoxSkeleton;

function SkeletonStructure() {
  return (
    <div className="dialog_box_skeleton">
      <Skeleton variant="circular" width={50} height={50} />
      <div className="dialog_box_text_skeleton">
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} />
      </div>
    </div>
  );
}
