import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./Canvas";

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    <div>
      <header>
        <h1>
          exstitch
        </h1>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
      <Canvas id="hoge" height="256" width="256" dummy={1} />
    </div >
  );
}

export default App;
