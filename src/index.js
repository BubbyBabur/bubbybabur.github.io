import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// import React from 'react';
// import ReactDOM from 'react-dom';
// import Sketch from 'react-p5';
// // import './styles.css';

// class App extends React.Component {

//   constructor() {
//     super();
//     this.state = {
//       brr: 1
//     }
//   }

//   y = 0;
//   direction = '^';

//   render() {
//     return (
//       <div className="App" onClick={() => {this.setState({brr: this.state.brr+1})}}>
//         <h1>react-p5 {this.state.brr}</h1>
//         <Sketch
//           setup={(p5, parentRef) => {
//             p5.createCanvas(200, 200).parent(parentRef);
//           }}
//           draw={p5 => {
//             p5.background(0);
//             p5.fill(255, this.y * 1.3, 0);
//             p5.ellipse(p5.width / 2, this.y, 50);
//             if (this.y > p5.height) this.direction = '';
//             if (this.y < 0) {
//               this.direction = '^';
//             }
//             if (this.direction === '^') this.y += 8;
//             else this.y -= 4;
//           }}
//         />
//       </div>
//     );
//   }
// }

// const rootElement = document.getElementById('root');
// ReactDOM.render(<App />, rootElement);
