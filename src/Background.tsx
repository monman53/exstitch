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
    if (state.image instanceof Image) {
      ctx.drawImage(state.image, 0, 0)
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
    // Get new imageURL
    const url = event.target.value;
    setState({ ...state, imageURL: url })

    // Load image
    let image = new Image();
    image.src = url;
    image.onload = () => {
      setState({ ...state, image: image, imageURL: url })
    };
    image.onerror = () => {
      setState({ ...state, image: new Image(), imageURL: url })
    };
  };

  return (
    <div>
      Image URL: <input className="form-control" type="text" value={state.imageURL} onChange={handleImageURLChange} />
    </div>
  );
};