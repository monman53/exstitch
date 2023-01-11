export const Palette = (props) => {
  return (
    <div>
      <hr />
      <label onClick={props.drawingModeHandlerCreator("brush")}>
        <input type="radio" readOnly checked={props.drawingMode === "brush"} />
        Brush
      </label>
      <label onClick={props.drawingModeHandlerCreator("eraser")}>
        <input type="radio" readOnly checked={props.drawingMode === "eraser"} />
        Eraser
      </label>
      {/* Loop for palettes */}
      {props.palettes.map((palette) => (
        <div key={palette.key}>
          <hr />
          {/* Loop for colors */}
          {palette.colors.map((color) => (
            <div
              key={color.key}
              onMouseDown={props.colorSelectHandlerCreator(
                palette.key,
                color.key
              )}
            >
              <label>
                <input
                  type="radio"
                  checked={props.colorKey === color.key}
                  readOnly
                ></input>
                <input
                  type="color"
                  value={color.hex}
                  onChange={props.colorHandlerCreator(palette.key, color.key)}
                />
                <input
                  type="text"
                  value={color.hex}
                  onChange={props.colorHandlerCreator(palette.key, color.key)}
                ></input>
              </label>
              <button onClick={props.colorRemoveHandlerCreator(color.key)}>
                Remove
              </button>
              <br />
            </div>
          ))}
          <button onClick={props.colorAddHandler}>Add Color</button>
          <hr />
        </div>
      ))}
    </div>
  );
};
