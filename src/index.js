import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import { Canvas } from "./Canvas.js";
import { Controll } from "./Controll.js";
import { Palette } from "./Palette.js";

const createInitialData = (cellN) => {
  let data = [];
  for (let i = 0; i < cellN * cellN; i++) {
    data.push({ colorKey: null });
  }
  return data;
};

const createInitialPalettes = () => {
  let palettes = [
    {
      key: 0,
      colors: [
        { key: 0, hex: "#ff0000" },
        { key: 1, hex: "#00ff00" },
        { key: 2, hex: "#0000ff" },
      ],
    },
  ];
  return palettes;
};

const createInitialState = () => {
  const cellN = 64;
  return {
    cellN: cellN,
    cellSize: 10,
    canvasHeight: 512,
    canvasWidth: 512,
    gridEnabled: true,
    mouseI: 0,
    mouseJ: 0,
    palettes: createInitialPalettes(),
    paletteKey: 0,
    paletteKeyCounter: 1,
    colorKey: 0,
    colorKeyCounter: 3,
    data: createInitialData(cellN),
    drawingMode: "brush", // brush, eraser
    image: null,
    imageOpacity: 0.5,
    imageVisible: true,
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

  const cellNHandler = (event) => {
    const newCellN = event.target.value;
    if (newCellN !== state.cellN) {
      const newData = createInitialData(newCellN);
      setState({ ...state, cellN: newCellN, data: newData });
    }
  };

  const gridEnabledHandler = () => {
    setState({ ...state, gridEnabled: !state.gridEnabled });
  };

  const imageVisibleHandler = () => {
    setState({ ...state, imageVisible: !state.imageVisible });
  };

  const imageOpacityHandler = (event) => {
    setState({ ...state, imageOpacity: event.target.value });
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
          (state.data[i * state.cellN + j].colorKey === null &&
            state.colorKey != null) ||
          state.drawingMode === "eraser";

        let newColorKey = state.colorKey;
        if (state.drawingMode === "eraser") {
          newColorKey = null;
        }

        if (mouseMoved && colorChanged) {
          const newData = state.data;
          newData[i * state.cellN + j].colorKey = newColorKey;
          setState({ ...state, mouseI: i, mouseJ: j, data: newData });
        } else if (mouseMoved && !colorChanged) {
          setState({ ...state, mouseI: i, mouseJ: j });
        } else if (!mouseMoved && colorChanged) {
          const newData = state.data;
          newData[i * state.cellN + j].colorKey = newColorKey;
          setState({ ...state, data: newData });
        }
      } else {
        if (mouseMoved) {
          setState({ ...state, mouseI: i, mouseJ: j });
        }
      }
    };
  };

  const colorHandlerCreator = (paletteKey, colorKey) => {
    return (event) => {
      const newColor = event.target.value;
      const palettes = state.palettes;

      // Find the color being modified
      const paletteIdx = palettes.findIndex((x) => x.key === paletteKey);
      const colorIdx = palettes[paletteIdx].colors.findIndex(
        (x) => x.key === colorKey
      );
      const color = palettes[paletteIdx].colors[colorIdx];

      if (color.hex !== newColor) {
        color.hex = newColor;
        setState({ ...state, palettes: palettes });
      }
    };
  };

  const colorSelectHandlerCreator = (paletteKey, colorKey) => {
    return (event) => {
      setState({ ...state, paletteKey: paletteKey, colorKey: colorKey });
    };
  };

  const colorAddHandler = () => {
    const newPalettes = state.palettes;
    for (const palette of newPalettes) {
      palette.colors.push({ key: state.colorKeyCounter, hex: "#000000" });
    }
    setState({
      ...state,
      palettes: newPalettes,
      colorKeyCounter: state.colorKeyCounter + 1,
    });
  };

  const saveHandler = () => {
    const a = document.createElement("a");
    const stateToSave = state;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(stateToSave)
    )}`;
    a.href = jsonString;
    a.download = "out.json";
    a.click();
  };

  const loadHandler = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const loadedState = JSON.parse(e.target.result);
      loadedState.image = null;
      setState(loadedState);
    };
  };

  const colorRemoveHandlerCreator = (colorKey) => {
    return () => {
      if (!window.confirm("Are you sure you want to remove this color?")) {
        return;
      }

      // Remove color from all palettes
      const newPalettes = state.palettes;
      for (const palette of newPalettes) {
        const colorIdx = palette.colors.findIndex((x) => x.key === colorKey);
        palette.colors.splice(colorIdx, 1);
      }
      // Remove cells filled with removed color
      const newData = state.data;
      for (let cell of newData) {
        if (cell.colorKey === colorKey) {
          cell.colorKey = null;
        }
      }
      setState({
        ...state,
        colorKey: null,
        palettes: newPalettes,
        data: newData,
      });
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
        cellN={state.cellN}
        cellNHandler={cellNHandler}
        imageVisible={state.imageVisible}
        imageVisibleHandler={imageVisibleHandler}
        imageOpacity={state.imageOpacity}
        imageOpacityHandler={imageOpacityHandler}
        saveHandler={saveHandler}
        loadHandler={loadHandler}
      />
      {/* Plettes */}
      <Palette
        palettes={state.palettes}
        colorHandlerCreator={colorHandlerCreator}
        colorSelectHandlerCreator={colorSelectHandlerCreator}
        colorAddHandler={colorAddHandler}
        colorRemoveHandlerCreator={colorRemoveHandlerCreator}
        colorKey={state.colorKey}
        drawingMode={state.drawingMode}
        drawingModeHandlerCreator={drawingModeHandlerCreator}
      />
      {/* Main canvas */}
      <Canvas
        cellN={state.cellN}
        cellSize={state.cellSize}
        gridEnabled={state.gridEnabled}
        mouseI={state.mouseI}
        mouseJ={state.mouseJ}
        mouseHandlerCreator={mouseHandlerCreator}
        palettes={state.palettes}
        paletteKey={state.paletteKey}
        data={state.data}
        image={state.image}
        imageVisible={state.imageVisible}
        imageOpacity={state.imageOpacity}
      />
      {/* debug outputs */}
      <details>
        <summary>Debug outputs</summary>
        mouseI: {state.mouseI}, mouseJ: {state.mouseJ}, colorKey:{" "}
        {state.colorKey}
      </details>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
