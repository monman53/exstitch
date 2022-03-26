import React, { useRef, useEffect, useState } from "react";

interface State {
  style: string,
  debug: number,
  dw: number,
  dh: number,
  nw: number,
  nh: number,
  grid: number[],
  imageURL: string,
  image: HTMLImageElement,
  eraserEnabled: boolean,
  brushType: number, // TODO: Use enum
  color: {
    key: number, value: string
  }[],
  colorSelected: number,
  colorIdCounter: number,
};

function Editor() {
  const canvasRef = useRef(null);
  const BGCanvasRef = useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext("2d");
  };

  const getBGContext = (): CanvasRenderingContext2D => {
    const canvas: any = BGCanvasRef.current;
    return canvas.getContext("2d");
  };

  const image = new Image();

  const dh = 7;
  const dw = 7;
  const nh = 80;
  const nw = 80;
  let grid: number[] = [];
  for (var i = 0; i < nh; i++) {
    for (var j = 0; j < nw; j++) {
      grid.push(-1);
    }
  }

  const imageURL = "";

  const initialState: State = {
    style: "green",
    debug: 0,
    dw: dw,
    dh: dh,
    nw: nw,
    nh: nh,
    grid: grid,
    imageURL: imageURL,
    image: image,
    eraserEnabled: false,
    brushType: 1,
    color: [{ key: 0, value: "#000000" }],
    colorSelected: 0,
    colorIdCounter: 1,
  }

  const [state, setState] = useState(initialState);

  const renderBGCanvas = () => {
    const ctx: CanvasRenderingContext2D = getBGContext();
    const height = state.nh * state.dh;
    const width = state.nw * state.dw;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.4;
    if (state.image instanceof Image) {
      ctx.drawImage(state.image, 0, 0)
    }
  }

  const renderCanvas = () => {
    const ctx: CanvasRenderingContext2D = getContext();
    const height = state.nh * state.dh;
    const width = state.nw * state.dw;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < state.nh; i++) {
      for (var j = 0; j < state.nw; j++) {
        const h = i * state.dh;
        const w = j * state.dw;
        const palette_id = state.grid[i * state.nw + j];
        if (palette_id >= 0) {
          //TODO: Optimize here
          const color = state.color.find(e => e.key === palette_id);
          if (color !== undefined) {
            ctx.fillStyle = color.value;
            ctx.fillRect(w, h, dw, dh)
          }
        }
      }
    }
    // Grids
    for (var i = 0; i < state.nh; i++) {
      ctx.fillStyle = i % 10 === 0 ? "#ddd" : "#eee";
      ctx.fillRect(0, i * state.dh, width, 1);
    }
    for (var j = 0; j < state.nw; j++) {
      ctx.fillStyle = j % 10 === 0 ? "#ddd" : "#eee";
      ctx.fillRect(j * state.dw, 0, 1, height);
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLElement>) => {
    // Calculate relative mouse coordinates (x, y) on canvas.
    const canvas: any = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const x = event.clientX - rect.left;
    const i = Math.floor(y / state.dh);
    const j = Math.floor(x / state.dw);

    let next_state = -1;
    if (state.brushType === 1) {
      next_state = state.colorSelected;
    }

    // Ignore when selected color is no longer existed.
    const color = state.color;
    //TODO: Optimize here
    const array_idx = color.findIndex(e => e.key === state.colorSelected);
    if (array_idx === -1) {
      return;
    }

    // Change grid state (fill one cell)
    let grid = state.grid;
    grid[i * state.nw + j] = next_state
    setState({ ...state, grid: grid })
  };

  const handleColorSelectedChange = (idx: number) => {
    return () => {
      setState({ ...state, colorSelected: idx })
    }
  };

  const handleColorChange = (idx: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const new_color = event.target.value;
      const color = state.color;
      //TODO: Optimize here
      const array_idx = state.color.findIndex(e => e.key === idx);
      console.log(array_idx)
      if (array_idx !== -1) {
        color[array_idx].value = new_color;
        setState({ ...state, color: color, colorSelected: idx })
      }
    }
  };

  const handleBrushTypeChange = (type: number) => {
    return () => {
      setState({ ...state, brushType: type })
    }
  };

  const handleAddColor = () => {
    const color = state.color;
    color.push({ key: state.colorIdCounter, value: "#000000" });
    setState({ ...state, colorIdCounter: state.colorIdCounter + 1, color: color })
  };

  const handleRemoveColor = (key: number) => {
    return () => {
      const color = state.color;
      //TODO: Optimize here
      const array_idx = state.color.findIndex(e => e.key === key);
      console.log(array_idx)
      if (array_idx !== -1) {
        // Delete one element
        color.splice(array_idx, 1);
        setState({ ...state, color: color })
      }
    }
  }

  const handleEraserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eraserEnabled = event.target.checked;
    setState({ ...state, eraserEnabled: eraserEnabled })
  };

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
  };

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(state)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  };

  const loadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files !== null) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e.target !== null) {
          if (typeof e.target.result === "string") {
            const data = JSON.parse(e.target.result);
            setState(data);
          }
        }
      };
    }
  };

  useEffect(() => {
    renderBGCanvas();
    renderCanvas();
  });

  const height = state.dh * state.nh;
  const width = state.dw * state.nw;

  return (
    <div>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">exstitch</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {/* Load button */}
              <li className="nav-item">
                <label>
                  <a className="nav-link" style={{ cursor: "pointer" }}><i className="bi bi-upload"></i> Load</a>
                  <input style={{ display: "none" }} className="form-control" type="file" onChange={loadData} id="load" />
                </label>
              </li>
              {/* Save button */}
              <li className="nav-item">
                <a className="nav-link" onClick={exportData} href=""><i className="bi bi-download"></i> Save</a>
              </li>
            </ul>
          </div>
        </div>
      </nav >

      <div className="container">
        <div className="row mt-3">
          {/* Control panel */}

          {/* Palette */}
          <div className="col">
            {/* Brush type */}
            <div className="btn-group" role="group">
              <input type="radio" className="btn-check" name="btnradio" id="btnradio1" onClick={handleBrushTypeChange(1)} />
              <label className="btn btn-outline-secondary" htmlFor="btnradio1">Brush</label>

              <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onClick={handleBrushTypeChange(0)} />
              <label className="btn btn-outline-secondary" htmlFor="btnradio2">Eraser</label>
            </div>
            <hr />

            {/* Color palette */}
            <div className="list-group">
              {state.color.map((c) => {
                const key = c.key;
                const id = "color_input_" + String(key);
                return (
                  <label htmlFor={id} className="list-group-item" style={{ cursor: "pointer" }}>
                    <input type="radio" id={id} name="color_input" onChange={handleColorSelectedChange(key)} />
                    <input type="color" value={c.value} onChange={handleColorChange(key)} />
                    <button className="btn-close" onClick={handleRemoveColor(key)}></button>
                  </label>
                )
              })}
              <button className="list-group-item" onClick={handleAddColor}>+ Add color</button>
            </div>
            <hr />

            {/* Image URL */}
            Image URL: <input className="form-control" type="text" value={state.imageURL} onChange={handleImageURLChange} />
          </div>

          {/* Canvases */}
          <div className="col">
            <div style={{ position: "relative" }}>
              <canvas ref={BGCanvasRef} height={height} width={width} />
              <canvas ref={canvasRef} height={height} width={width} onClick={handleOnClick} style={{ position: "absolute", top: "0", left: "0" }} />
            </div >
          </div>
        </div>
      </div>
    </div >
  );
}

export default Editor;
