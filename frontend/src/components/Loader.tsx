const Loader = () => {
  return  <div className="overlay">
  <div className="overlay__inner">
      <div className="overlay__content"><span className="spinner"></span></div>
  </div>
</div>

};

export default Loader;

type SkeletonProps = {
  width?: string;
  length?: number;
};
export const Skeleon = ({ width = "unset", length = 3 }: SkeletonProps) => {
  const Skeleton = Array.from({ length }, (_, idx) => (
    <div className="skeleton-shape" key={idx + 1}></div>
  ));
  return (
    <div className="skeleton-loader" style={{ width }}>
      {Skeleton}
    </div>
  );
};
