import React from "react";

interface State {
  dw: number,
  dh: number,
  nw: number,
  nh: number,
  data: number[],
  brushType: number, // TODO: Use enum
  palette: {
    colors: {
      key: number, value: string
    }[],
    selected: number,
    idCounter: number,
  }
  background: {
    imageURL: string,
    image: HTMLImageElement,
    x: number,
    y: number,
  },
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
  dw: dw,
  dh: dh,
  nw: nw,
  nh: nh,
  data: data,
  brushType: 1,
  palette: {
    colors: [{ key: 0, value: "#000000" }],
    selected: 0,
    idCounter: 1,
  },
  background: {
    imageURL: "",
    image: new Image(),
    x: 0,
    y: 0,
  },
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