import React, { useRef, useEffect, useState } from "react";

interface State {
  style: string;
  dw: number;
  dh: number;
  nw: number;
  nh: number;
};

function Editor() {
  const canvasRef = useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext("2d");
  };

  const initialState: State = {
    style: "green",
    dw: 8,
    dh: 8,
    nw: 120,
    nh: 120,
  }

  const [state, setState] = useState(initialState);

  const renderCanvas = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    ctx.fillStyle = state.style
    ctx.fillRect(100, 100, 200, 200)
  };

  const handleOnClick = () => {
    if (state.style === "green") {
      setState({ ...state, style: "red" })
    } else {
      setState({ ...state, style: "green" })
    }
  };

  useEffect(() => {
    renderCanvas();
  });

  const height = state.dh * state.nh;
  const width = state.dw * state.nw;

  return (
    <div>
      <canvas ref={canvasRef} height={height} width={width} onClick={handleOnClick} />
    </div>
  );
}

export default Editor;
