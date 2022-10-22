export const Controll = (props) => {
  return (
    <div>
      {/* Grid */}
      <label>
        Grid:
        <input
          type="checkbox"
          checked={props.gridEnabled}
          onChange={props.gridEnabledHandler}
        ></input>
      </label>
      <br />
      {/* Cell Size */}
      <label>
        Cell Size (px):
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
        Number of cells on a side:
        <input
          type="number"
          step="1"
          min="1"
          value={props.cellN}
          onChange={props.cellNHandler}
        ></input>
      </label>
      <br />
      {/* Image */}
      <label>
        Image:
        <input
          type="file"
          accept="image/*"
          onChange={props.imageLoadHandler}
        ></input>
      </label>
    </div>
  );
};
