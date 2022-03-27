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
      <input type="radio" className="btn-check" name="btnradio" id="btnradio1" onClick={handleBrushTypeChange(1)} checked={state.palette.brushType === 1} />
      <label className="btn btn-outline-secondary" htmlFor="btnradio1">Brush</label>
      <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onClick={handleBrushTypeChange(0)} checked={state.palette.brushType === 0} />
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
      let column = palette.columns.find(column => column.key === column_key);
      if (column !== undefined) {
        column.selected = key;
        setState({ ...state, palette: palette })
      }
    }
  };

  const handleColumnSelectedChange = (column_key: number) => {
    return () => {
      let palette = state.palette;
      palette.selectedColumns = column_key;
      setState({ ...state, palette: palette })
    }
  };

  const handleColorChange = (column_key: number, key: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const new_color = event.target.value;
      let palette = state.palette;
      //TODO: Optimize here
      let column = palette.columns.find(column => column.key === column_key);
      if (column !== undefined) {
        const array_idx = column.colors.findIndex(color => color.key === key);
        if (array_idx !== -1) {
          palette.selectedColumns = column_key;
          column.selected = key;
          column.colors[array_idx].value = new_color;
          setState({ ...state, palette: palette })
        }
      }
    }
  };

  const handleAddColumn = () => {
    const palette = state.palette;
    const len = palette.columns.length;
    if (len === 0) {
      palette.columns.push(initColumnState);
    } else {
      const column_idx = palette.columns.findIndex(column => column.key === palette.selectedColumns);
      let new_column = clone(palette.columns[column_idx]);
      new_column.key = palette.columnKeyCounter;
      palette.columns.push(new_column);
    }
    palette.selectedColumns = palette.columnKeyCounter;
    palette.columnKeyCounter += 1;
    setState({ ...state, palette: palette })
  };

  const handleRemoveColumn = (key: number) => {
    return () => {
      const palette = state.palette;
      //TODO: Optimize here
      const column_idx = palette.columns.findIndex(column => column.key === key);
      if (column_idx !== -1) {
        // Delete one element
        palette.columns.splice(column_idx, 1);
        palette.selectedColumns = palette.columns[palette.columns.length - 1].key;
      }
      setState({ ...state, palette: palette })
    }
  }

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
      const cloth = state.cloth;
      for (let k = 0; k < cloth.nh * cloth.nw; k++) {
        if (cloth.data[k] === key) {
          cloth.data[k] = -1;
        }
      }
      setState({ ...state, palette: palette, cloth: cloth })
    }
  }

  return (
    <div>
      {/* Tabs */}
      <ul className="nav nav-pills">
        {state.palette.columns.map((column) => {
          const active = column.key === state.palette.selectedColumns ? "active" : "";
          return (
            <li className="nav-item">
              <button className={"nav-link " + active} onClick={handleColumnSelectedChange(column.key)}>{column.key}</button>
            </li>
          );
        })}
        <li className="nav-item">
          <button className="nav-link btn btn-outline-secondary" onClick={handleAddColumn}>+ Add column</button>
        </li>
      </ul>

      {/* Color list */}
      <div className="mt-2">
        {state.palette.columns.map((column) => {
          const visibility = column.key === state.palette.selectedColumns ? "" : "d-none";
          return (
            <div className={"" + visibility}>
              <div className={"list-group"}>
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
              {state.palette.columns.length > 1 && <button className="btn btn-outline-secondary mt-2" onClick={handleRemoveColumn(column.key)}>Remove column</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}