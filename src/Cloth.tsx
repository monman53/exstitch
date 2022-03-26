import React from "react";
import { StateContext } from "./State"

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
    const height = state.nh * state.dh;
    const width = state.nw * state.dw;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < state.nh; i++) {
      for (let j = 0; j < state.nw; j++) {
        const h = i * state.dh;
        const w = j * state.dw;
        const palette_id = state.data[i * state.nw + j];
        if (palette_id >= 0) {
          //TODO: Optimize here
          const color = state.palette.colors.find(e => e.key === palette_id);
          if (color !== undefined) {
            ctx.fillStyle = color.value;
            ctx.fillRect(w, h, state.dw, state.dh)
          }
        }
      }
    }

    if (state.grid.visible) {
      // Grids
      for (let i = 0; i < state.nh; i++) {
        ctx.fillStyle = i % 10 === 0 ? "#ddd" : "#eee";
        ctx.fillRect(0, i * state.dh, width, 1);
      }
      for (let j = 0; j < state.nw; j++) {
        ctx.fillStyle = j % 10 === 0 ? "#ddd" : "#eee";
        ctx.fillRect(j * state.dw, 0, 1, height);
      }
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    // Calculate relative mouse coordinates (x, y) on canvas.
    const canvas: any = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const x = event.clientX - rect.left;
    const i = Math.floor(y / state.dh);
    const j = Math.floor(x / state.dw);

    let next_state = -1;
    if (state.brushType === 1) {
      next_state = state.palette.selected;
    }

    // Ignore when selected color is no longer existed.
    const colors = state.palette.colors;
    //TODO: Optimize here
    const array_idx = colors.findIndex(color => color.key === state.palette.selected);
    if (array_idx === -1) {
      return;
    }

    // Change grid state (fill one cell)
    let data = state.data;
    data[i * state.nw + j] = next_state
    setState({ ...state, data: data })
  };

  React.useEffect(() => {
    renderCanvas();
  });

  const height = state.dh * state.nh;
  const width = state.dw * state.nw;

  return (
    <canvas ref={canvasRef} height={height} width={width} onClick={handleOnClick} style={props.style} />
  );
};