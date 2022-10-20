import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    if (props.gridEnabled) {
      ctx.fillStyle = "#000000";
    } else {
      ctx.fillStyle = "#FF0000";
    }
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = props.size;
    canvas.width = props.size;
    const context = canvas.getContext("2d");
    draw(context);
  }, [props]);

  return <canvas ref={canvasRef} />;
};

const Controlls = (props) => {
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
    </div>
  );
};

const Root = (props) => {
  // States
  const [state, setState] = useState({
    cellN: 128,
    cellSize: 5,
    canvasHeight: 512,
    canvasWidth: 512,
    gridEnabled: true,
  });

  // Handlers
  const cellSizeHandler = (event) => {
    setState({ ...state, cellSize: event.target.value });
  };
  const gridEnabledHandler = () => {
    setState({ ...state, gridEnabled: !state.gridEnabled });
  };

  return (
    <div>
      <h1>exstitch</h1>
      <Canvas
        size={state.cellN * state.cellSize}
        gridEnabled={state.gridEnabled}
      />
      <Controlls
        gridEnabled={state.gridEnabled}
        gridEnabledHandler={gridEnabledHandler}
        cellSize={state.cellSize}
        cellSizeHandler={cellSizeHandler}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
