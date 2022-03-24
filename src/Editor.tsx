import React, { useRef, useEffect, useState } from "react";

function Editor() {
  const canvasRef = useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext("2d");
  };

  const [style, setStyle] = useState("green");

  const renderCanvs = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    ctx.fillStyle = style
    ctx.fillRect(100, 100, 200, 200)
  };

  const handleOnClick = () => {
    if (style === "green") {
      setStyle("red")
    } else {
      setStyle("green")
    }
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
