import "./Loader.css";

/**
 *
 * @param {{
 *     width: number,
 *     height:number
 * }} props
 */
export default function Loader(props) {
  const { width, height } = Object.assign(
    {
      width: 30,
      height: 30,
    },
    props
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="loader"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
}
