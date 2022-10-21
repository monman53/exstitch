import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx, cellN, cellSize, gridEnabled, mouseI, mouseJ) => {
    // Grid drawing
    if (gridEnabled) {
      for (let i = 0; i < cellN; i++) {
        // Color
        if (i % 10 === 0) {
          // Major grid
          ctx.strokeStyle = "#999";
        } else if (i % 5 === 0) {
          ctx.strokeStyle = "#ddd";
        } else {
          // Minor grid
          ctx.strokeStyle = "#eee";
        }

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize + 0.5);
        ctx.lineTo(cellN * cellSize, i * cellSize + 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(i * cellSize + 0.5, 0);
        ctx.lineTo(i * cellSize + 0.5, cellN * cellSize);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Highlighted cell
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.rect(mouseJ * cellSize, mouseI * cellSize, cellSize, cellSize);
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const size = props.cellN * props.cellSize;
    canvas.height = size;
    canvas.width = size;
    const context = canvas.getContext("2d");
    draw(
      context,
      props.cellN,
      props.cellSize,
      props.gridEnabled,
      props.mouseI,
      props.mouseJ
    );
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={props.mouseHandlerCreator(canvasRef)}
    />
  );
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

const Palette = (props) => {
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

const Root = (props) => {
  // States
  const [state, setState] = useState({
    cellN: 128,
    cellSize: 5,
    canvasHeight: 512,
    canvasWidth: 512,
    gridEnabled: true,
    mouseI: 0,
    mouseJ: 0,
    palettes: [
      [{ value: "#ff0000" }, { value: "#00ff00" }, { value: "#0000ff" }],
    ],
    paletteIdx: 0,
    colorIdx: 0,
  });

  // Handlers
  const cellSizeHandler = (event) => {
    setState({ ...state, cellSize: event.target.value });
  };

  const gridEnabledHandler = () => {
    setState({ ...state, gridEnabled: !state.gridEnabled });
  };

  const mouseHandlerCreator = (canvasRef) => {
    return (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const i = Math.floor(y / state.cellSize);
      const j = Math.floor(x / state.cellSize);

      if (i !== state.mouseI || j !== state.mouseJ) {
        setState({ ...state, mouseI: i, mouseJ: j });
      }
    };
  };

  const colorHandlerCreator = (paletteIdx, colorIdx) => {
    return (event) => {
      const newColor = event.target.value;
      const palettes = state.palettes;
      if (palettes[paletteIdx][colorIdx].value !== newColor) {
        palettes[paletteIdx][colorIdx].value = newColor;
        setState({ ...state, palettes: palettes });
      }
    };
  };

  return (
    <div>
      <h1>exstitch</h1>
      {/* Controllers */}
      <Controlls
        gridEnabled={state.gridEnabled}
        gridEnabledHandler={gridEnabledHandler}
        cellSize={state.cellSize}
        cellSizeHandler={cellSizeHandler}
      />
      {/* Plettes */}
      <Palette
        palettes={state.palettes}
        colorHandlerCreator={colorHandlerCreator}
      />
      {/* debug outputs */}
      {state.mouseI}, {state.mouseJ}
      <br />
      {/* Main canvas */}
      <Canvas
        cellN={state.cellN}
        cellSize={state.cellSize}
        gridEnabled={state.gridEnabled}
        mouseI={state.mouseI}
        mouseJ={state.mouseJ}
        mouseHandlerCreator={mouseHandlerCreator}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
