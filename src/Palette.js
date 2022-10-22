export const Palette = (props) => {
  return (
    <div>
      {/* Loop for palettes */}
      {props.palettes.map((palette, pIdx) => (
        <div key={pIdx}>
          <hr />
          {/* Loop for colors */}
          {palette.map((color, cIdx) => (
            <div
              key={cIdx}
              onClick={props.colorSelectHandlerCreator(pIdx, cIdx)}
            >
              <label>
                <input
                  type="color"
                  value={color.value}
                  onChange={props.colorHandlerCreator(pIdx, cIdx)}
                />
                <input
                  type="text"
                  value={color.value}
                  onChange={props.colorHandlerCreator(pIdx, cIdx)}
                ></input>
              </label>
              <button onClick={props.colorRemoveHandlerCreator(cIdx)}>
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
