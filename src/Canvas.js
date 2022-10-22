import React, { useRef, useEffect } from "react";

export const Canvas = (props) => {
  const canvasRef = useRef(null);

  const draw = (
    ctx,
    cellN,
    cellSize,
    gridEnabled,
    mouseI,
    mouseJ,
    palette,
    data
  ) => {
    // Cell drawing
    for (let i = 0; i < cellN; i++) {
      for (let j = 0; j < cellN; j++) {
        const colorIdx = data[i * cellN + j].colorIdx;
        if (colorIdx !== null) {
          ctx.fillStyle = palette[colorIdx].value;
          ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
      }
    }

    // Grid drawing
    if (gridEnabled) {
      for (let i = 0; i < cellN; i++) {
        // Color
        if (i % 10 === 0) {
          // Major grid
          ctx.strokeStyle = "#999";
        } else if (i % 5 === 0) {
          ctx.strokeStyle = "#ddd";
        } else {
          // Minor grid
          ctx.strokeStyle = "#eee";
        }

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize + 0.5);
        ctx.lineTo(cellN * cellSize, i * cellSize + 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(i * cellSize + 0.5, 0);
        ctx.lineTo(i * cellSize + 0.5, cellN * cellSize);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Highlighted cell
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.rect(mouseJ * cellSize, mouseI * cellSize, cellSize, cellSize);
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const size = props.cellN * props.cellSize;

    // Update canvas size
    canvas.height = size;
    canvas.width = size;

    // Re-drawing canvas contents
    const context = canvas.getContext("2d");
    draw(
      context,
      props.cellN,
      props.cellSize,
      props.gridEnabled,
      props.mouseI,
      props.mouseJ,
      props.palette,
      props.data
    );
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={props.mouseHandlerCreator(canvasRef)}
      onMouseDown={props.mouseHandlerCreator(canvasRef)}
    />
  );
};
