import React, { useRef, useEffect, useState } from "react";

interface State {
  style: string;
  debug: number;
  dw: number;
  dh: number;
  nw: number;
  nh: number;
  grid: number[],
};

function Editor() {
  const canvasRef = useRef(null);
  const BGCanvasRef = useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext("2d");
  };

  const getBGContext = (): CanvasRenderingContext2D => {
    const canvas: any = BGCanvasRef.current;
    return canvas.getContext("2d");
  };

  // const image = new Image();

  const dh = 7;
  const dw = 7;
  const nh = 120;
  const nw = 120;
  let grid: number[] = [];
  for (var i = 0; i < nh; i++) {
    for (var j = 0; j < nw; j++) {
      // grid.push((i + j) % 2);
      grid.push(0);
    }
  }

  const initialState: State = {
    style: "green",
    debug: 0,
    dw: dw,
    dh: dh,
    nw: nw,
    nh: nh,
    grid: grid,
  }

  const [state, setState] = useState(initialState);

  const renderBGCanvas = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 100, 100)
  }

  const renderCanvas = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    for (var i = 0; i < state.nh; i++) {
      for (var j = 0; j < state.nw; j++) {
        const h = i * state.dh;
        const w = j * state.dw;
        const style = state.grid[i * state.nw + j];
        if (style !== 0) {
          ctx.fillStyle = (style + state.debug) % 2 === 0 ? "red" : "green";
          ctx.fillRect(w, h, dw, dh)
        }
      }
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    const canvas: any = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const x = event.clientX - rect.left;
    const i = Math.floor(y / state.dh);
    const j = Math.floor(x / state.dw);
    let grid = state.grid;
    grid[i * state.nw + j] = 1
    setState({ ...state, grid: grid })
  };

  useEffect(() => {
    renderBGCanvas();
    renderCanvas();
  });

  const height = state.dh * state.nh;
  const width = state.dw * state.nw;

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={BGCanvasRef} height={height} width={width} style={{ border: "solid", position: "absolute" }} />
      <canvas ref={canvasRef} height={height} width={width} onClick={handleOnClick} style={{ border: "solid", position: "absolute" }} />
    </div >
  );
}

export default Editor;
