import React from "react"
import Sketch from "react-p5";

class TopSketch extends React.Component {

    constructor(props) {
        super();
        
        this.d = 150;
        this.r = 150;

        this.sketchGlobals = {
            y: 0,
            maxY: 2000,
        }

        this.count = 0;
    }

    render() {
        const setup = (p, parent) => {

            p.createCanvas(p.windowWidth, p.windowHeight).parent(parent);

            const c = p.select("#start");
            c.mouseMoved( () => {
                this.count += (Math.abs(p.movedX) + Math.abs(p.movedY)) / 10;
                requestAnimationFrame(p.draw);
            })

            c.mouseWheel( (e) => {

                const domy = document.documentElement.scrollTop;

                if (domy === 0) {
                    this.sketchGlobals.y += e.deltaY;
                } else {
                    this.sketchGlobals.y = this.sketchGlobals.maxY;
                }

                if (this.sketchGlobals.y <= 0) {
                    this.sketchGlobals.y = 0;
                }

                if (this.sketchGlobals.y < this.sketchGlobals.maxY) {
                    e.preventDefault();
                    this.count += Math.abs(e.deltaY) / 10;
                    requestAnimationFrame(p.draw);
                } else {
                    this.sketchGlobals.y = this.sketchGlobals.maxY;
                }

            })

        }

        const draw = (p) => {

            p.background(20);

            let func = x => 1 / (p.exp(-10 * (x - 0.5)) + 1);
            let noisefunc = (x, y, z) => (func(p.noise(x, y, z)));

            let positions = [];
            for (let i = 0; i < p.width / this.d + 2; i++) {
                positions.push([]);
                for (let j = 0; j < p.height / this.d + 2; j++) {
                    positions[i].push(p.createVector(
                        (noisefunc(i * this.d * 10, j * this.d * 10, this.count / this.r + i * 100) + i - 1) * this.d,
                        (noisefunc(i * this.d * 10, j * this.d * 10, this.count / 500 + this.r) + j - 1) * this.d));
                }
            }

            for (let i = 1; i < p.width / this.d + 1; i++) {
                for (let j = 1; j < p.height / this.d + 1; j++) {


                    for (let i1 = -1; i1 <= 1; i1++) {
                        for (let j1 = -1; j1 <= 1; j1++) {
                            let di = p.dist(positions[i][j].x, positions[i][j].y, positions[i + i1][j + j1].x, positions[i + i1][j + j1].y);
                            let d2 = p.dist(positions[i][j].x, positions[i][j].y, p.width / 2, p.height / 2) * this.d * this.d / 300 * 0;
                            p.stroke(255, 255, 255, p.map(di * di + d2, this.d * this.d * 3, 0, 0, 100));
                            p.line(positions[i][j].x, positions[i][j].y, positions[i + i1][j + j1].x, positions[i + i1][j + j1].y)
                        }
                    }
                }
            }

            p.noLoop();
            // count += 0.1;
        }

        const windowResized = (p) => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }

        return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
    }
    
}

export default TopSketch;