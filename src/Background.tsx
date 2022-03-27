import React from "react";
import { StateContext } from "./State"

export interface BackgroundStateType {
  imageURL: string,
  image: HTMLImageElement,
  x: number,
  y: number,
  p: number
};

export const initBackgroundState: BackgroundStateType = {
  imageURL: "",
  image: new Image(),
  x: 0,
  y: 0,
  p: 1
}

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
    const height = state.cloth.nh * state.cloth.dh;
    const width = state.cloth.nw * state.cloth.dw;
    ctx.clearRect(0, 0, width, height);
    // Set background transparency
    ctx.globalAlpha = 0.6;
    if (state.background.image instanceof Image) {
      ctx.drawImage(state.background.image, state.background.x, state.background.y, state.background.image.naturalWidth*state.background.p, state.background.image.naturalHeight*state.background.p)
    }
  }

  React.useEffect(() => {
    renderCanvas();
  });

  const height = state.cloth.dh * state.cloth.nh;
  const width = state.cloth.dw * state.cloth.nw;

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

  // change image scale by setting percentage
  const scaleChange = (dp: number) => {
    return () => {
      let background = state.background;
      background.p += dp;
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
        <button className="btn btn-outline-secondary" onClick={scaleChange(0.01)}>+</button>
        <button className="btn btn-outline-secondary" onClick={scaleChange(-0.01)}>-</button>
      </div>
    </div>
  );
};