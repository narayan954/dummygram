import "./index.css";

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
    <div className="loader-container">
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
