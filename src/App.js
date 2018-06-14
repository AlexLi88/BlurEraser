import React, { Component } from 'react';
// import BlurImage from './BlurImage';
import BlurEraser from './BlurEraser';
import './style/App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BlurEraser />
      </div>
    );
  }
}

export default App;
