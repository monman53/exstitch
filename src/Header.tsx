import React from "react";
import { StateContext } from "./State"

export function Header() {
  const stateContext = React.useContext(StateContext)
  const state = stateContext.state;
  const setState = stateContext.setState;

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

  return (
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
  );
};