import React from "react";

type Props = {
  id?: string;
  width?: string;
  height?: string;
  dummy?: number;
};

const Canvas = (props: Props) => {
  return <canvas {...props} />
}

export default Canvas;
