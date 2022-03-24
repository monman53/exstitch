import React, { useRef, useEffect } from "react";

function Editor() {
  const canvasRef = useRef(null);

  var style: string = "green";

  const renderCanvs = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    ctx.fillStyle = style
    ctx.fillRect(100, 100, 200, 200)
  };

  const handleOnClick = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    if (style == "green") {
      style = "red";
    } else {
      style = "green";
    }
    renderCanvs();
  };

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext("2d");
  };

  useEffect(() => {
    renderCanvs();
  });

  return (
    <div>
      <canvas ref={canvasRef} height="400px" width="400px" onClick={handleOnClick} />
    </div>
  );
}

export default Editor;
