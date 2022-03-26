import React from "react";
import { StateContext } from "./State"

export interface ClothStateType {
  dw: number,
  dh: number,
  nw: number,
  nh: number,
  data: number[],
};

const dh = 7;
const dw = 7;
const nh = 80;
const nw = 80;
let data: number[] = [];
for (var i = 0; i < nh; i++) {
  for (var j = 0; j < nw; j++) {
    data.push(-1);
  }
}

export const initClothState: ClothStateType = {
  dw: dw,
  dh: dh,
  nw: nw,
  nh: nh,
  data: data,
};

export function ClothCanvas(props: any) {
  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

  const canvasRef = React.useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext("2d");
  };

  const renderCanvas = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    const height = state.cloth.nh * state.cloth.dh;
    const width = state.cloth.nw * state.cloth.dw;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < state.cloth.nh; i++) {
      for (let j = 0; j < state.cloth.nw; j++) {
        const h = i * state.cloth.dh;
        const w = j * state.cloth.dw;
        const palette_id = state.cloth.data[i * state.cloth.nw + j];
        if (palette_id >= 0) {
          //TODO: Optimize here
          const color = state.palette.columns[state.palette.selectedColumns].colors.find(color => color.key === palette_id);
          if (color !== undefined) {
            ctx.fillStyle = color.value;
            ctx.fillRect(w, h, state.cloth.dw, state.cloth.dh)
          }
        }
      }
    }

    if (state.grid.visible) {
      // Grids
      for (let i = 0; i < state.cloth.nh; i++) {
        ctx.fillStyle = i % 10 === 0 ? "#ddd" : "#eee";
        ctx.fillRect(0, i * state.cloth.dh, width, 1);
      }
      for (let j = 0; j < state.cloth.nw; j++) {
        ctx.fillStyle = j % 10 === 0 ? "#ddd" : "#eee";
        ctx.fillRect(j * state.cloth.dw, 0, 1, height);
      }
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    // Calculate relative mouse coordinates (x, y) on canvas.
    const canvas: any = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const x = event.clientX - rect.left;
    const i = Math.floor(y / state.cloth.dh);
    const j = Math.floor(x / state.cloth.dw);

    let next_state = -1;
    if (state.palette.brushType === 1) {
      next_state = state.palette.columns[state.palette.selectedColumns].selected;
    }

    // Ignore when selected color is no longer existed.
    const colors = state.palette.columns[state.palette.selectedColumns].colors;
    //TODO: Optimize here
    const array_idx = colors.findIndex(color => color.key === state.palette.columns[state.palette.selectedColumns].selected);
    if (array_idx === -1) {
      return;
    }

    // Change grid state (fill one cell)
    let cloth = state.cloth;
    cloth.data[i * state.cloth.nw + j] = next_state
    setState({ ...state, cloth })
  };

  React.useEffect(() => {
    renderCanvas();
  });

  const height = state.cloth.dh * state.cloth.nh;
  const width = state.cloth.dw * state.cloth.nw;

  return (
    <canvas ref={canvasRef} height={height} width={width} onClick={handleOnClick} style={props.style} />
  );
};