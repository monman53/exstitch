import React, { useRef, useEffect, useState } from "react";
import { initialState, StateContext } from "./State";
import { Palette } from "./Palette";
import { GridEditor } from "./Grid";

function Editor() {
  const [state, setState] = useState(initialState);
  const valueStateContext = { state: state, setState: setState };

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
    for (let i = 0; i < state.nh; i++) {
      for (let j = 0; j < state.nw; j++) {
        const h = i * state.dh;
        const w = j * state.dw;
        const palette_id = state.data[i * state.nw + j];
        if (palette_id >= 0) {
          //TODO: Optimize here
          const color = state.palette.colors.find(e => e.key === palette_id);
          if (color !== undefined) {
            ctx.fillStyle = color.value;
            ctx.fillRect(w, h, state.dw, state.dh)
          }
        }
      }
    }

    if (state.grid.visible) {
      // Grids
      for (let i = 0; i < state.nh; i++) {
        ctx.fillStyle = i % 10 === 0 ? "#ddd" : "#eee";
        ctx.fillRect(0, i * state.dh, width, 1);
      }
      for (let j = 0; j < state.nw; j++) {
        ctx.fillStyle = j % 10 === 0 ? "#ddd" : "#eee";
        ctx.fillRect(j * state.dw, 0, 1, height);
      }
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
      next_state = state.palette.selected;
    }

    // Ignore when selected color is no longer existed.
    const colors = state.palette.colors;
    //TODO: Optimize here
    const array_idx = colors.findIndex(color => color.key === state.palette.selected);
    if (array_idx === -1) {
      return;
    }

    // Change grid state (fill one cell)
    let data = state.data;
    data[i * state.nw + j] = next_state
    setState({ ...state, data: data })
  };

  const handleBrushTypeChange = (type: number) => {
    return () => {
      setState({ ...state, brushType: type })
    }
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
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
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
    <StateContext.Provider value={valueStateContext}>
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
                    <span className="nav-link" style={{ cursor: "pointer" }}><i className="bi bi-upload"></i> Load</span>
                    <input style={{ display: "none" }} className="form-control" type="file" onChange={loadData} id="load" />
                  </label>
                </li>
                {/* Save button */}
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={exportData}><i className="bi bi-download"></i> Save</span>
                </li>
              </ul>
            </div>
          </div>
        </nav >

        <div className="container">
          <div className="row mt-3">
            {/* Control panel */}
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
              <Palette></Palette>
              <hr />

              {/* Image URL */}
              Image URL: <input className="form-control" type="text" value={state.imageURL} onChange={handleImageURLChange} />
              <hr />

              {/* Grid */}
              <GridEditor></GridEditor>
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
    </StateContext.Provider>
  );
}

export default Editor;
