import React from "react";

// Original components
import { Header } from "./Header";
import { initialState, StateContext } from "./State";
import { BrushType, Palette } from "./Palette";
import { GridEditor } from "./Grid";
import { ImageURL, BackgroundCanvas } from "./Background";
import { CellStyle, ClothCanvas } from "./Cloth";

function Editor() {
  // Prepare state and context
  const [state, setState] = React.useState(initialState);
  const valueStateContext = { state: state, setState: setState };

  return (
    // Use StateContext
    <StateContext.Provider value={valueStateContext}>
      <div>
        {/* Header */}
        <Header></Header>

        <div className="container">
          <div className="row mt-3">
            {/* Control panel */}
            <div className="col">
              {/* Brush type */}
              <div>
                Edit mode: <BrushType></BrushType>
              </div>
              <div className="mt-2">
                Cell type: <CellStyle></CellStyle>
              </div>
              <hr />

              {/* Color palette */}
              <Palette></Palette>

              <hr />

              {/* Image URL */}
              <ImageURL></ImageURL>
              <hr />

              {/* Grid */}
              <GridEditor></GridEditor>
            </div>

            {/* Canvases */}
            <div className="col">
              <div style={{ position: "relative" }}>
                <BackgroundCanvas></BackgroundCanvas>
                <ClothCanvas style={{ position: "absolute", top: "0", left: "0" }}></ClothCanvas>
              </div >
            </div>
          </div>
        </div>
      </div >
    </StateContext.Provider>
  );
}

export default Editor;
