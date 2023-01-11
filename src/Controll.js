export const Controll = (props) => {
  return (
    <div>
      {/* Grid */}
      <label>
        Grid visible:
        <input
          type="checkbox"
          checked={props.gridEnabled}
          onChange={props.gridEnabledHandler}
        ></input>
      </label>
      <br />
      {/* Cell Size */}
      <label>
        Cell size (px):
        <input
          type="number"
          step="1"
          min="1"
          value={props.cellSize}
          onChange={props.cellSizeHandler}
        ></input>
      </label>
      <br />
      {/* Number of cells (one side) */}
      <label>
        Number of cells on each side:
        <input
          type="number"
          step="1"
          min="1"
          value={props.cellN}
          onChange={props.cellNHandler}
        ></input>
      </label>
      <br />
      <hr />
      {/* Image */}
      <input
        type="checkbox"
        checked={props.imageVisible}
        onChange={props.imageVisibleHandler}
      ></input>
      Image:
      <input
        type="file"
        accept="image/*"
        onChange={props.imageLoadHandler}
      ></input>
      <label>
        Opacity:
        <input
          type="range"
          min="0"
          step="0.01"
          max="1"
          value={props.imageOpacity}
          onChange={props.imageOpacityHandler}
        ></input>
      </label>
      <hr />
      {/* Save and Load */}
      Save to file: <button onClick={props.saveHandler}>Save</button>
      <br />
      Load saved file:
      <input type="file" accept=".json" onChange={props.loadHandler}></input>
      <br />
      (Images is ignored for saving)
    </div>
  );
};
