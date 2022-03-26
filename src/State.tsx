import React from "react";

interface State {
  style: string,
  debug: number,
  dw: number,
  dh: number,
  nw: number,
  nh: number,
  data: number[],
  imageURL: string,
  image: HTMLImageElement,
  eraserEnabled: boolean,
  brushType: number, // TODO: Use enum
  color: {
    key: number, value: string
  }[],
  colorSelected: number,
  colorIdCounter: number,
  grid: {
    visible: boolean,
  },
};

const dh = 7;
const dw = 7;
const nh = 80;
const nw = 80;
let data: number[] = [];
for (var i = 0; i < nh; i++) {
  for (var j = 0; j < nw; j++) {
    data.push(-1);
  }
}

export const initialState: State = {
  style: "green",
  debug: 0,
  dw: dw,
  dh: dh,
  nw: nw,
  nh: nh,
  data: data,
  imageURL: "",
  image: new Image(),
  eraserEnabled: false,
  brushType: 1,
  color: [{ key: 0, value: "#000000" }],
  colorSelected: 0,
  colorIdCounter: 1,
  grid: {
    visible: true,
  },
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