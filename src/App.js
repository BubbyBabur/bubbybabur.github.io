import './css/app.css';
import React from 'react';
import TopSketch from './components/topsketch'
import TestSketch from './components/testsketch'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brr: 1
    }
  }

  render() {
    return <div onClick={(e) => { this.setState({ brr: this.state.brr + 1 }) }}>
      <div id="canvas-container">
        <TopSketch />
      </div>
      <div id="start">
        {this.state.brr}
      </div>
      <div id="content">
        Test brr haha <br />
        Brrrr <br />
        Lorem ipsum <br />
      </div>
    </div>
  }
}

export default App;
