import React from "react";
import { StateContext } from "./State"

export interface ClothStateType {
  dw: number,
  dh: number,
  nw: number,
  nh: number,
  data: number[],
  cellStyle: string, // "cross", "rect"
  mouseDown: boolean,
  mouse: {
    i: number,
    j: number,
  }
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
  cellStyle: "cross",
  mouseDown: false,
  mouse: {
    i: 0,
    j: 0,
  }
};

// TODO: Same as Palette::BrushType ?
export function CellStyle() {
  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

  const handleCellStyleChange = (style: string) => {
    return () => {
      let cloth = state.cloth;
      cloth.cellStyle = style;
      setState({ ...state, cloth: cloth })
    }
  };

  return (
    <div className="btn-group" role="group">
      <input type="radio" className="btn-check" id="cell-style-radio1" onClick={handleCellStyleChange("cross")} checked={state.cloth.cellStyle === "cross"} />
      <label className="btn btn-outline-secondary" htmlFor="cell-style-radio1">Cross</label>
      <input type="radio" className="btn-check" id="cell-style-radio2" onClick={handleCellStyleChange("rect")} checked={state.cloth.cellStyle === "rect"} />
      <label className="btn btn-outline-secondary" htmlFor="cell-style-radio2">Rect</label>
    </div>
  );
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
    const column_idx = state.palette.columns.findIndex(column => column.key === state.palette.selectedColumns);
    for (let i = 0; i < state.cloth.nh; i++) {
      for (let j = 0; j < state.cloth.nw; j++) {
        const h = i * state.cloth.dh;
        const w = j * state.cloth.dw;
        const palette_id = state.cloth.data[i * state.cloth.nw + j];
        if (palette_id >= 0) {
          //TODO: Optimize here
          const color = state.palette.columns[column_idx].colors.find(color => color.key === palette_id);
          if (color !== undefined) {
            if (state.cloth.cellStyle === "cross") {
              ctx.strokeStyle = color.value;
              ctx.lineWidth = 2.4;
              const d = 0.7;
              ctx.beginPath();
              ctx.moveTo(w + d, h + d);
              ctx.lineTo(w + state.cloth.dw - d, h + state.cloth.dh - d);
              ctx.moveTo(w + state.cloth.dw - d, h + d);
              ctx.lineTo(w + 1, h + state.cloth.dh - d);
              ctx.stroke();
            } else if (state.cloth.cellStyle === "rect") {
              ctx.fillStyle = color.value;
              ctx.fillRect(w, h, state.cloth.dw, state.cloth.dh)
            }
          }
        }
      }
    }

    // Grids
    if (state.grid.visible) {
      ctx.fillStyle = "#000000";
      const alpha_normal = 0.1;
      const alpha_bold = 0.3;
      for (let i = 0; i < state.cloth.nh; i++) {
        ctx.globalAlpha = i % 10 === 0 ? alpha_bold : alpha_normal;
        ctx.fillRect(0, i * state.cloth.dh, width, 1);
      }
      for (let j = 0; j < state.cloth.nw; j++) {
        ctx.globalAlpha = j % 10 === 0 ? alpha_bold : alpha_normal;
        ctx.fillRect(j * state.cloth.dw, 0, 1, height);
      }
      ctx.globalAlpha = 1;
    }

    // Cell highlight
    {
      ctx.strokeStyle = "#0d6efd";
      ctx.lineWidth = 1;
      const x = state.cloth.mouse.j * state.cloth.dw;
      const y = state.cloth.mouse.i * state.cloth.dh;
      ctx.strokeRect(x, y, state.cloth.dw, state.cloth.dh);
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    // Calculate relative mouse coordinates (x, y) on canvas.
    const i = state.cloth.mouse.i;
    const j = state.cloth.mouse.j;

    const column_idx = state.palette.columns.findIndex(column => column.key === state.palette.selectedColumns);

    let next_state = -1;
    if (state.palette.brushType === 1) {
      next_state = state.palette.columns[column_idx].selected;
    }

    // Ignore when selected color is no longer existed.
    const colors = state.palette.columns[column_idx].colors;
    //TODO: Optimize here
    const array_idx = colors.findIndex(color => color.key === state.palette.columns[column_idx].selected);
    if (array_idx === -1) {
      return;
    }

    // Change grid state (fill one cell)
    let cloth = state.cloth;
    const color = cloth.data[i * state.cloth.nw + j];
    if (color === -1) {
      cloth.data[i * state.cloth.nw + j] = next_state
      setState({ ...state, cloth })
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    let cloth = state.cloth;
    cloth.mouseDown = true;
    setState({ ...state, cloth })

  }

  const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    let cloth = state.cloth;
    cloth.mouseDown = false;
    setState({ ...state, cloth })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const canvas: any = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const x = event.clientX - rect.left;
    const i = Math.floor(y / state.cloth.dh);
    const j = Math.floor(x / state.cloth.dw);

    let cloth = state.cloth;
    cloth.mouse.i = i;
    cloth.mouse.j = j;
    setState({ ...state, cloth })

    if (cloth.mouseDown) {
      handleOnClick(event);
    }
  }

  React.useEffect(() => {
    renderCanvas();
  });

  const height = state.cloth.dh * state.cloth.nh;
  const width = state.cloth.dw * state.cloth.nw;

  return (
    <canvas ref={canvasRef} height={height} width={width} style={props.style}
      onClick={handleOnClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove} />
  );
};