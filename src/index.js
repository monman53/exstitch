import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    if (props.gridEnabled) {
      for (let i = 0; i < props.cellN; i++) {
        if (i % 5 == 0) {
          ctx.strokeStyle = "#aaa";
        } else {
          ctx.strokeStyle = "#eee";
        }
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, i * props.cellSize + 0.5);
        ctx.lineTo(props.cellN * props.cellSize, i * props.cellSize + 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(i * props.cellSize + 0.5, 0);
        ctx.lineTo(i * props.cellSize + 0.5, props.cellN * props.cellSize);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const size = props.cellN * props.cellSize;
    canvas.height = size;
    canvas.width = size;
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
        cellN={state.cellN}
        cellSize={state.cellSize}
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
