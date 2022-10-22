import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import { Canvas } from "./Canvas.js";
import { Controll } from "./Controll.js";
import { Palette } from "./Palette.js";

const createInitialData = (cellN) => {
  let data = [];
  for (let i = 0; i < cellN * cellN; i++) {
    data.push({ colorIdx: null });
  }
  return data;
};

const createInitialState = () => {
  const cellN = 128;
  return {
    cellN: cellN,
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
    data: createInitialData(cellN),
    drawingMode: "brush", // brush, eraser
    image: null,
  };
};

// Root component
const Root = (props) => {
  // States
  const [state, setState] = useState(createInitialState());

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
      const mouseMoved = i !== state.mouseI || j !== state.mouseJ;

      if (event.buttons === 1) {
        // Left button down
        const colorChanged =
          state.data[i * state.cellN + j].colorIdx !== state.colorIdx ||
          state.drawingMode === "eraser";
        let newColorIdx = state.colorIdx;
        if (state.drawingMode === "eraser") {
          newColorIdx = null;
        }

        if (mouseMoved && colorChanged) {
          const newData = state.data;
          newData[i * state.cellN + j].colorIdx = newColorIdx;
          setState({ ...state, mouseI: i, mouseJ: j, data: newData });
        } else if (mouseMoved && !colorChanged) {
          setState({ ...state, mouseI: i, mouseJ: j });
        } else if (!mouseMoved && colorChanged) {
          const newData = state.data;
          newData[i * state.cellN + j].colorIdx = newColorIdx;
          setState({ ...state, data: newData });
        }
      } else {
        if (mouseMoved) {
          setState({ ...state, mouseI: i, mouseJ: j });
        }
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

  const colorSelectHandlerCreator = (paletteIdx, colorIdx) => {
    return (event) => {
      setState({ ...state, paletteIdx: paletteIdx, colorIdx: colorIdx });
    };
  };

  const colorAddHandler = () => {
    const newPalettes = state.palettes;
    for (const palette of newPalettes) {
      palette.push({ value: "#000000" });
    }
    setState({ ...state, palettes: newPalettes });
  };

  const colorRemoveHandlerCreator = (colorIdx) => {
    return () => {
      if (!window.confirm("Are you sure you want to remove this color?")) {
        return;
      }

      // Remove color from all palettes
      const newPalettes = state.palettes;
      for (const palette of newPalettes) {
        palette.splice(colorIdx, 1);
      }
      // Remove cells filled with removed color
      const newData = state.data;
      for (let cell of newData) {
        if (cell.colorIdx === colorIdx) {
          cell.colorIdx = null;
        }
      }
      setState({ ...state, colorIdx: 0, palettes: newPalettes, data: newData });
    };
  };

  const drawingModeHandlerCreator = (newDrawingMode) => {
    return () => {
      setState({ ...state, drawingMode: newDrawingMode });
    };
  };

  const imageLoadHandler = (event) => {
    console.log("image loaded 0");
    let imageFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = (e) => {
      console.log("image loaded 1");
      let image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        console.log("image loaded 2");
        setState({ ...state, image: image });
      };
    };
  };

  return (
    <div>
      <h1>exstitch</h1>
      {/* Controll */}
      <Controll
        gridEnabled={state.gridEnabled}
        gridEnabledHandler={gridEnabledHandler}
        cellSize={state.cellSize}
        cellSizeHandler={cellSizeHandler}
        image={state.image}
        imageLoadHandler={imageLoadHandler}
      />
      {/* Plettes */}
      <Palette
        palettes={state.palettes}
        colorHandlerCreator={colorHandlerCreator}
        colorSelectHandlerCreator={colorSelectHandlerCreator}
        colorAddHandler={colorAddHandler}
        colorRemoveHandlerCreator={colorRemoveHandlerCreator}
        colorIdx={state.colorIdx}
        drawingMode={state.drawingMode}
        drawingModeHandlerCreator={drawingModeHandlerCreator}
      />
      {/* debug outputs */}
      mouseI: {state.mouseI}, mouseJ: {state.mouseJ}, colorIdx: {state.colorIdx}
      <br />
      {/* Main canvas */}
      <Canvas
        cellN={state.cellN}
        cellSize={state.cellSize}
        gridEnabled={state.gridEnabled}
        mouseI={state.mouseI}
        mouseJ={state.mouseJ}
        mouseHandlerCreator={mouseHandlerCreator}
        palette={state.palettes[state.paletteIdx]}
        data={state.data}
        image={state.image}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
