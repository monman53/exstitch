import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = props.canvasHeight;
    canvas.width = props.canvasWidth;
    const context = canvas.getContext("2d");
    draw(context);
  }, [props]);

  return <canvas ref={canvasRef} />;
};

const Textbox = (props) => {
  return (
    <input type="text" value={props.value} onChange={props.handler}></input>
  );
};

const Controlls = (props) => {
  return (
    <div>
      <Textbox handler={props.handleCanvasHeight} value={props.canvasHeight} />
      <Textbox handler={props.handleCanvasWidth} value={props.canvasWidth} />
    </div>
  );
};

// class Root extends React.Component {
const Root = (props) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     canvasHeight: 512,
  //     canvasWidth: 512,
  //   };
  // }

  const [state, setState] = useState({
    canvasHeight: 512,
    canvasWidth: 512,
  });

  const handleCanvasHeight = (event) => {
    setState({ ...state, canvasHeight: event.target.value });
  };

  const handleCanvasWidth = (event) => {
    setState({ ...state, canvasWidth: event.target.value });
  };

  // handleCreator(stateName) {
  //   return (event) => {
  //     this.setState({ [stateName]: event.target.value });
  //   };
  // }

  return (
    <div>
      <h1>exstitch</h1>
      <Canvas
        canvasHeight={state.canvasHeight}
        canvasWidth={state.canvasWidth}
      />
      <Controlls
        handleCanvasHeight={handleCanvasHeight}
        handleCanvasWidth={handleCanvasWidth}
        canvasHeight={state.canvasHeight}
        canvasWidth={state.canvasWidth}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
