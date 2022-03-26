import React from "react";
import { StateContext } from "./State"

export interface GridStateType {
  visible: boolean,
};

export const initGridState: GridStateType = {
  visible: true,
};

export function GridEditor() {

  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

  const handleGridVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let grid = state.grid;
    const new_val = event.target.checked;
    grid.visible = new_val;
    setState({ ...state, grid: grid })
  };

  return (
    <div className="form-check form-switch">
      <label className="form-check-label" htmlFor="grid-visible">Grid</label>
      <input className="form-check-input" type="checkbox" onChange={handleGridVisibleChange} id="grid-visible" checked={state.grid.visible} />
    </div>
  );
}