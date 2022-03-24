import React, { useRef, useEffect } from "react";

function Canvas() {
  const canvasRef = useRef(null);

  const handleClick = () => {
    console.log("debug")
  };

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext("2d");
  };

  useEffect(() => {
    const ctx: CanvasRenderingContext2D = getContext();
    ctx.fillRect(100, 100, 200, 200)
  });

  return (
    <div>
      <canvas ref={canvasRef} height="400px" width="400px" onClick={handleClick} />
    </div>
  );
}

export default Canvas;
