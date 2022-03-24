import React, { useRef, useEffect, useState } from "react";

interface State {
  style: string,
  debug: number,
  dw: number,
  dh: number,
  nw: number,
  nh: number,
  grid: number[],
  imageURL: string,
  image: HTMLImageElement,
  eraserEnabled: boolean,
  color: string,
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

  const image = new Image();

  const dh = 7;
  const dw = 7;
  const nh = 80;
  const nw = 80;
  let grid: number[] = [];
  for (var i = 0; i < nh; i++) {
    for (var j = 0; j < nw; j++) {
      // grid.push((i + j) % 2);
      grid.push(0);
    }
  }

  const imageURL = "";

  const initialState: State = {
    style: "green",
    debug: 0,
    dw: dw,
    dh: dh,
    nw: nw,
    nh: nh,
    grid: grid,
    imageURL: imageURL,
    image: image,
    eraserEnabled: false,
    color: "0x00000000",
  }

  const [state, setState] = useState(initialState);

  const renderBGCanvas = () => {
    const ctx: CanvasRenderingContext2D = getBGContext();
    const height = state.nh * state.dh;
    const width = state.nw * state.dw;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(state.image, 0, 0)
  }

  const renderCanvas = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    const height = state.nh * state.dh;
    const width = state.nw * state.dw;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < state.nh; i++) {
      for (var j = 0; j < state.nw; j++) {
        const h = i * state.dh;
        const w = j * state.dw;
        const style = state.grid[i * state.nw + j];
        if (style !== 0) {
          ctx.fillStyle = state.color;
          ctx.fillRect(w, h, dw, dh)
        }
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

    let next_state = 0;
    if (!state.eraserEnabled) {
      next_state = 1;
    }

    // Change grid state (fill one cell)
    let grid = state.grid;
    grid[i * state.nw + j] = next_state
    setState({ ...state, grid: grid })
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setState({ ...state, color: color })
  };

  const handleEraserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eraserEnabled = event.target.checked;
    setState({ ...state, eraserEnabled: eraserEnabled })
  };

  const handleImageURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get new imageURL
    const url = event.target.value;
    setState({ ...state, imageURL: url })

    // Load image
    let image = new Image();
    image.src = url;
    image.onload = () => {
      setState({ ...state, image: image, imageURL: url })
    };
  };

  useEffect(() => {
    renderBGCanvas();
    renderCanvas();
  });

  const height = state.dh * state.nh;
  const width = state.dw * state.nw;

  return (
    <div>
      <hr />
      <div style={{ position: "relative" }}>
        <canvas ref={BGCanvasRef} height={height} width={width} />
        <canvas ref={canvasRef} height={height} width={width} onClick={handleOnClick} style={{ position: "absolute", top: "0", left: "0" }} />
      </div>
      <hr />
      <div>
        Color: <input type="color" value={state.color} onChange={handleColorChange} />
        Eraser: <input type="checkbox" checked={state.eraserEnabled} onChange={handleEraserChange} />
        <br />
        Image URL: <input type="text" value={state.imageURL} onChange={handleImageURLChange} />
      </div>
    </div>
  );
}

export default Editor;
