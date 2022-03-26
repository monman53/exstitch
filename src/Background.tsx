import React from "react";
import { StateContext } from "./State"

export function ImageURL() {

  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

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
    image.onerror = () => {
      setState({ ...state, image: new Image(), imageURL: url })
    };
  };

  return (
    <div>
      Image URL: <input className="form-control" type="text" value={state.imageURL} onChange={handleImageURLChange} />
    </div>
  );
}