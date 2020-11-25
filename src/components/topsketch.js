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
        this.stage = 0;

        this.hcenter = new V(200, window.innerHeight);

        this.h0 = new Paths.Hexagon(200, 200, 100);
        this.h1 = new Paths.Hexagon(200, 200, 100 * 1.18)
        this.h2 = new Paths.Hexagon(200, 200, 100 * 1.18 * 1.18)

        this.startpath = new V(200, 200);
        this.secondend = new V(300, 300);
        this.center = new V(400, 200);
        this.end = new V(600, 600)

        this.ps = 40;

        const path0 = new Paths.TimeLinearPath(this.startpath, this.secondend, this.ps)
        const path1 = new Paths.TimeCirclePath(this.secondend, this.center, this.ps, true);
        const path2 = new Paths.TimeLinearPath(this.secondend, this.end, this.ps);

        this.path = new Paths.CombinedPath([path0, path1, path2]);

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
        let stuff = this.h0.closestPoint(new V(this.mx, this.my));
        this.rope = new Paths.Rope(this.h0.pointsinc(stuff, 10, true), 10);
        stuff = this.h1.closestPoint(this.startpath);
        this.rope2 = new Paths.Rope(this.h1.pointsinc(stuff, 10), 10);
        this.stage++;
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

        if (this.stage === 0) {

            const drop = new V(0, -this.sketchGlobals.y);
            const pos = V.ADD( this.hcenter, drop );

            this.h0.setPos(pos);
            this.h1.setPos(pos);
            this.h2.setPos(pos);

            this.h0.draw(p5);
            this.h0.setPoints(-p5.frameCount / 100);
            this.h1.draw(p5);
            this.h1.setPoints(PI / 3 + p5.frameCount / 100);
            this.h2.draw(p5);
            this.h2.setPoints(-2 * p5.frameCount / 100);
            
            // let stuff = this.h.closestPoint(new V(p5.mouseX, p5.mouseY));
            // let p = this.h.points[stuff];
            // p5.ellipse(p.x, p.y, 10, 10);

        } else {

            this.path.update();
            // p5.ellipse(this.path.pos.x, this.path.pos.y, 10, 10);

            this.rope.draw(p5);
            this.rope.lerpUpdate(new V(p5.mouseX, p5.mouseY), 0.2);

            this.rope2.draw(p5);
            this.rope2.lerpUpdate(this.path.pos, 0.2);
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