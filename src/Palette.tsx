import React from "react";
import clone from "clone";
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
  idCounter: number, // TODO: rename id to key
  columnKeyCounter: number,
};

const initColumnState = {
  key: 0,
  colors: [{ key: 0, value: "#000000" }],
  selected: 0,
};

export const initPaletteState: PaletteStateType = {
  brushType: 1,
  columns: [
    initColumnState,
  ],
  selectedColumns: 0,
  idCounter: 1,
  columnKeyCounter: 1,
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

  const handleColorSelectedChange = (column_key: number, key: number) => {
    return () => {
      let palette = state.palette;
      palette.selectedColumns = column_key;
      palette.columns[palette.selectedColumns].selected = key;
      setState({ ...state, palette: palette })
    }
  };

  const handleColorChange = (column_key: number, key: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const new_color = event.target.value;
      const palette = state.palette;
      //TODO: Optimize here
      const array_idx = palette.columns[column_key].colors.findIndex(color => color.key === key);
      if (array_idx !== -1) {
        palette.selectedColumns = column_key;
        palette.columns[column_key].selected = key;
        palette.columns[column_key].colors[array_idx].value = new_color;
        setState({ ...state, palette: palette })
      }
    }
  };

  const handleAddColumn = () => {
    const palette = state.palette;
    const len = palette.columns.length;
    if (len === 0) {
      palette.columns.push(initColumnState);
    } else {
      let new_column = clone(palette.columns[len - 1]);
      new_column.key = palette.columnKeyCounter;
      palette.columns.push(new_column);
    }
    palette.columnKeyCounter += 1;
    setState({ ...state, palette: palette })
  };

  const handleAddColor = () => {
    const palette = state.palette;
    for (let column of palette.columns) {
      column.colors.push({ key: palette.idCounter, value: "#000000" });
    }
    palette.idCounter += 1;
    setState({ ...state, palette: palette })
  };

  const handleRemoveColor = (key: number) => {
    return () => {
      const palette = state.palette;
      //TODO: Optimize here
      for (let column of palette.columns) {
        const array_idx = column.colors.findIndex(color => color.key === key);
        if (array_idx !== -1) {
          // Delete one element
          column.colors.splice(array_idx, 1);
        }
      }
      setState({ ...state, palette: palette })
    }
  }

  return (
    <div>
      {state.palette.columns.map((column) => {
        return (
          <div className="list-group">
            {column.colors.map((color) => {
              const key = color.key;
              const id = "color_input_" + String(column.key) + " " + String(key);
              const checked = state.palette.selectedColumns === column.key && column.selected === key;
              return (
                <label htmlFor={id} className="list-group-item" style={{ cursor: "pointer" }}>
                  <input type="radio" id={id} name="color_input" onChange={handleColorSelectedChange(column.key, key)} checked={checked} />
                  <input type="color" value={color.value} onChange={handleColorChange(column.key, key)} />
                  <button className="btn-close" onClick={handleRemoveColor(key)}></button>
                </label>
              )
            })}
            <button className="list-group-item" onClick={handleAddColor}>+ Add color</button>
          </div>
        );
      })}
      <button className="btn btn-outline-secondary" onClick={handleAddColumn}>+ Add column</button>
    </div>
  );
}