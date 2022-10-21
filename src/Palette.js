export const Palette = (props) => {
  return (
    <div>
      {/* Loop for palettes */}
      {props.palettes.map((palette, pIdx) => (
        <div key={pIdx}>
          <hr />
          {/* Loop for colors */}
          {palette.map((color, cIdx) => (
            <div key={cIdx}>
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
              <br />
            </div>
          ))}
          <hr />
        </div>
      ))}
    </div>
  );
};
