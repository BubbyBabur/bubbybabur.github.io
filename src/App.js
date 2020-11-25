import './css/app.css';
import React from 'react';
import TopSketch from './topsketch'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brr: "asdfsdaa"
    }
  }

  render() {
    return <div>
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
