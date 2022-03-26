import React from "react";

import { BackgroundStateType, initBackgroundState } from "./Background";
import { PaletteStateType, initPaletteState } from "./Palette";
import { ClothStateType, initClothState } from "./Cloth";
import { GridStateType, initGridState } from "./Grid";

interface State {
  cloth: ClothStateType,
  palette: PaletteStateType,
  background: BackgroundStateType,
  grid: GridStateType,
};


export const initialState: State = {
  cloth: initClothState,
  palette: initPaletteState,
  background: initBackgroundState,
  grid: initGridState,
}

interface StateContextType {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
};

const initialStateContext: StateContextType = {
  state: initialState,
  setState: () => { }, // dummy
};

export const StateContext = React.createContext(
  initialStateContext
);