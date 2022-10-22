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
    data,
    image,
    imageVisible,
    imageOpacity
  ) => {
    // Background image
    ctx.globalAlpha = imageOpacity;
    if (imageVisible && image) {
      ctx.drawImage(image, 0, 0, cellN * cellSize, cellN * cellSize);
    }

    // Cell drawing
    ctx.globalAlpha = 1.0;
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
    ctx.strokeStyle = "#000000";
    if (gridEnabled) {
      for (let i = 0; i < cellN; i++) {
        // Color
        if (i % 10 === 0) {
          // Major grid
          ctx.globalAlpha = 0.8;
        } else if (i % 5 === 0) {
          // Middle grid
          ctx.globalAlpha = 0.4;
        } else {
          // Minor grid
          ctx.globalAlpha = 0.2;
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
    ctx.globalAlpha = 0.8;
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
      props.data,
      props.image,
      props.imageVisible,
      props.imageOpacity
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
