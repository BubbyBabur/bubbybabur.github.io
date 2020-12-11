import React from "react"
import Sketch from "react-p5";
import * as Paths from "../utils/path"
import V from "../utils/V"

const PI = 3.14159265358979323846264338327950288;


class TopSketch extends React.Component {

    constructor(props) {
        super();

        // Utils
        this.mx = 0;
        this.my = 0;

        // Hexes

        this.hcenter = new V(200, window.innerHeight);

        this.ps = 30;

        this.hex0 = [];

        for (let i = 0; i < 3; i++) {
            this.hex0.push(new Paths.HexPath(this.hcenter.x, this.hcenter.y, 
                100 * (1.18 ** i),PI / 3 * i, 
                1 / 100 * PI * ((-1) ** i) * (1.5 ** i), 
                null));
        }

        // Background
        this.d = 150;
        this.r = 150;

        this.sketchGlobals = {
            y: 0,
            maxY: window.innerHeight,
        }

        this.count = 0;
    }

    mouseMoved(p5, e) {
        this.count += (Math.abs(p5.movedX) + Math.abs(p5.movedY)) / 10;
    }

    mouseWheel(p5, e) {

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
        } else {
            this.sketchGlobals.y = this.sketchGlobals.maxY;
        }

    }

    mouseClicked(p5, e) {
        for (let i = 0; i < this.hex0.length - 1; i++) {
            const hex = this.hex0[i];

            let path = new Paths.TimeLinearPath(new V(hex.x,hex.y), new V(p5.width + hex.length(), 100 * i + 100), this.ps);

            path = Paths.PathToLoops(path, [
                {
                    radius: 200,
                    at: 300
                }, {
                    radius: -200,
                    at: 700
                }, {
                    radius: 200,
                    at: 700
                }]);

            hex.setPath(path);
            hex.release();
        } 

        const hex = this.hex0[2];

        let path1 = new Paths.TimeLinearPath(new V(hex.x,hex.y), new V(1000,500), this.ps);
        let path2 = new Paths.TimeLinearPath(new V(1000,200),new V(300, 1000), this.ps);

        let path = Paths.ConnectPathsWithArc(path1,path2)
        hex.setPath(path);
        hex.release();

    }

    setup(p5, parent) {

        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(parent);

        p5.frameRate(30);

        const c = p5.select("#start");
        c.mouseMoved((e) => {
            this.mouseMoved(p5, e);
        })

        c.mouseWheel((e) => {
            this.mouseWheel(p5, e);
        })

        c.mouseClicked((e) => {
            this.mouseClicked(p5, e);
        });

    }

    draw(p5) {

        const domy = document.documentElement.scrollTop;
        if (domy !== 0) {
            this.sketchGlobals.y = this.sketchGlobals.maxY;
        }
        [this.mx, this.my] = [p5.mouseX, p5.mouseY];

        p5.background(20);

        let func = x => 1 / (p5.exp(-10 * (x - 0.5)) + 1);
        let noisefunc = (x, y, z) => (func(p5.noise(x, y, z)));

        let positions = [];
        for (let i = 0; i < p5.width / this.d + 2; i++) {
            positions.push([]);
            for (let j = 0; j < p5.height / this.d + 2; j++) {
                positions[i].push(p5.createVector(
                    (noisefunc(i * this.d * 10, j * this.d * 10, this.count / this.r + i * 100) + i - 1) * this.d,
                    (noisefunc(i * this.d * 10, j * this.d * 10, this.count / 500 + this.r) + j - 1) * this.d));
            }
        }

        p5.strokeWeight(1);

        for (let i = 1; i < p5.width / this.d + 1; i++) {
            for (let j = 1; j < p5.height / this.d + 1; j++) {


                for (let i1 = -1; i1 <= 1; i1++) {
                    for (let j1 = -1; j1 <= 1; j1++) {
                        let di = p5.dist(positions[i][j].x, positions[i][j].y, positions[i + i1][j + j1].x, positions[i + i1][j + j1].y);
                        let d2 = p5.dist(positions[i][j].x, positions[i][j].y, p5.width / 2, p5.height / 2) * this.d * this.d / 300 * 0;
                        p5.stroke(255, 255, 255, p5.map(di * di + d2, this.d * this.d * 3, 0, 0, 100));
                        p5.line(positions[i][j].x, positions[i][j].y, positions[i + i1][j + j1].x, positions[i + i1][j + j1].y)
                    }
                }
            }
        }

        p5.stroke(255);
        p5.strokeWeight(1);
        p5.noFill();


        const drop = new V(0, -this.sketchGlobals.y);
        const pos = V.ADD(this.hcenter, drop);

        for (let i = 0; i < this.hex0.length; i++) {
            const hex = this.hex0[i];
            hex.update(p5);
            hex.setPos(pos);
        }

        // p.noLoop();
        this.count += 0.5;

    }

    windowResized(p5) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    render() {
        const setup = (p5, parent) => {
            this.setup(p5,parent);
        }

        const draw = (p5) => {
            this.draw(p5);
        }

        const windowResized = (p5) => {
            this.windowResized(p5);
        }

        return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
    }
    
}

export default TopSketch;