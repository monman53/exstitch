import React from 'react';
import ReactDOM from 'react-dom/client';

class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>exstitch</h1>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);