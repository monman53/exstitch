import React from "react";
import { StateContext } from "./State"

export interface PaletteStateType {
  brushType: number, // TODO: Use enum
  columns: {
    key: number,
    colors: {
      key: number, value: string
    }[],
    selected: number,
  }[],
  selectedColumns: number,
  idCounter: number,
};

export const initPaletteState: PaletteStateType = {
  brushType: 1,
  columns: [
    {
      key: 0,
      colors: [{ key: 0, value: "#000000" }],
      selected: 0,
    },
  ],
  selectedColumns: 0,
  idCounter: 1,
}

export function BrushType() {

  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

  const handleBrushTypeChange = (type: number) => {
    return () => {
      let palette = state.palette;
      palette.brushType = type;
      setState({ ...state, palette: palette })
    }
  };

  return (
    <div className="btn-group" role="group">
      <input type="radio" className="btn-check" name="btnradio" id="btnradio1" onClick={handleBrushTypeChange(1)} />
      <label className="btn btn-outline-secondary" htmlFor="btnradio1">Brush</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onClick={handleBrushTypeChange(0)} />
      <label className="btn btn-outline-secondary" htmlFor="btnradio2">Eraser</label>
    </div>
  );
}

export function Palette() {

  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

  const handleColorSelectedChange = (key: number) => {
    return () => {
      let palette = state.palette;
      palette.columns[palette.selectedColumns].selected = key;
      setState({ ...state, palette: palette })
    }
  };

  const handleColorChange = (key: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const new_color = event.target.value;
      const palette = state.palette;
      //TODO: Optimize here
      const array_idx = palette.columns[palette.selectedColumns].colors.findIndex(color => color.key === key);
      if (array_idx !== -1) {
        palette.columns[palette.selectedColumns].colors[array_idx].value = new_color;
        palette.columns[palette.selectedColumns].selected = key;
        setState({ ...state, palette: palette })
      }
    }
  };

  const handleAddColor = () => {
    const palette = state.palette;
    palette.columns[palette.selectedColumns].colors.push({ key: palette.idCounter, value: "#000000" });
    palette.idCounter += 1;
    setState({ ...state, palette: palette })
  };

  const handleRemoveColor = (key: number) => {
    return () => {
      const palette = state.palette;
      //TODO: Optimize here
      const array_idx = palette.columns[palette.selectedColumns].colors.findIndex(color => color.key === key);
      console.log(array_idx)
      if (array_idx !== -1) {
        // Delete one element
        palette.columns[palette.selectedColumns].colors.splice(array_idx, 1);
        setState({ ...state, palette: palette })
      }
    }
  }

  return (
    <div className="list-group">
      {state.palette.columns[state.palette.selectedColumns].colors.map((c) => {
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
  );
}