import React from "react";
import { StateContext } from "./State"

export function BackgroundCanvas() {
  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;

  const CanvasRef = React.useRef(null);

  const getBGContext = (): CanvasRenderingContext2D => {
    const canvas: any = CanvasRef.current;
    return canvas.getContext("2d");
  };

  const renderCanvas = () => {
    const ctx: CanvasRenderingContext2D = getBGContext();
    const height = state.nh * state.dh;
    const width = state.nw * state.dw;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.4;
    if (state.background.image instanceof Image) {
      ctx.drawImage(state.background.image, state.background.x, state.background.y)
    }
  }

  React.useEffect(() => {
    renderCanvas();
  });

  const height = state.dh * state.nh;
  const width = state.dw * state.nw;

  return (
    <canvas ref={CanvasRef} height={height} width={width} />
  );
};

export function ImageURL() {
  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

  const handleImageURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let background = state.background;

    // Get new imageURL
    background.imageURL = event.target.value;
    setState({ ...state, background: background });

    // Load image
    let image = new Image();
    image.src = background.imageURL;
    image.onload = () => {
      background.image = image;
      setState({ ...state, background: background });
    };
    image.onerror = () => {
      background.image = new Image();
      setState({ ...state, background: background });
    };
  };

  const handlePositionChange = (dx: number, dy: number) => {
    return () => {
      let background = state.background;
      background.x += dx;
      background.y += dy;
      setState({ ...state, background: background });
    }
  }

  return (
    <div>
      Image URL: <input className="form-control" type="text" value={state.background.imageURL} onChange={handleImageURLChange} />
      <div className="btn-group my-2" role="group">
        <button className="btn btn-outline-secondary" onClick={handlePositionChange(-1, 0)}>←</button>
        <button className="btn btn-outline-secondary" onClick={handlePositionChange(0, -1)}>↑</button>
        <button className="btn btn-outline-secondary" onClick={handlePositionChange(0, 1)}>↓</button>
        <button className="btn btn-outline-secondary" onClick={handlePositionChange(1, 0)}>→</button>
      </div>
    </div>
  );
};