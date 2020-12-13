import React from "react"
import Sketch from "react-p5";

import * as Paths from "../utils/Path"
import Net from "../utils/Net"
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


        this.sketchGlobals = {
            y: 0,
            maxY: window.innerHeight,
        }

        this.net = new Net(this.sketchGlobals);
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
        } else {
            this.sketchGlobals.y = this.sketchGlobals.maxY;
        }

    }

    mouseClicked(p5, e) {

        const width = p5.width;
        const height = p5.height;

        for (let i = 0; i < this.hex0.length - 1; i++) {
            const hex = this.hex0[i];

            const pos = hex.randPoint();

            let path = new Paths.TimeLinearPath(pos, new V(p5.width + hex.length(), 100 * i + 100), this.ps);

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
        const pos = hex.randPoint();

        let paths = [new Paths.TimeLinearPath(pos, new V(1000, 500), this.ps)];

        for(let i = 0; i < 3; i++) {
            let dist = paths[i].length() / 3 + Math.random() * paths[i].length() * 1/3;

            let inorout = Math.random() < 0.5;
            
            if(inorout) {
                // in
                let at = paths[i].length() - dist;
                let pos = paths[i].at(at);
                let dir = V.RAND2D();
                

                let start = V.ADD(pos, V.MULT(dir, -Math.random() * 300));
                let end = V.ADD(pos, V.MULT(dir, Math.random() * 400));

                let newpath = new Paths.TimeLinearPath(start,end,this.ps);

                paths.push(newpath);
            } else {
                // out
                let at = paths[i].length() + dist;
                let pos = paths[i].at(at);
                let dir = V.RAND2D();

                let start = V.ADD(pos, V.MULT(dir, 200 + Math.random() * 500));
                let end = V.ADD(start, V.MULT(dir, Math.random() * 500));

                let newpath = new Paths.TimeLinearPath(start, end, this.ps);

                paths.push(newpath);
            }
        }

        // let path2 = new Paths.TimeLinearPath(new V(1000,300),new V(300, 500), this.ps);
        
        // let path3 = new Paths.TimeLinearPath(new V(300,800), new V(1000,500),this.ps);
        // let path3 = new Paths.TimeLinearPath(new V(700,200), new V(600,1000), this.ps)

        // path1 = new Paths.PathToLoops(path1, [
        //     {
        //         at: 100,
        //         radius: 100
        //     }, 
        //     {
        //         at: 500,
        //         radius:-100
        //     }
        // ])

        let path = Paths.ConnectPathsWithArcs(...paths)
        hex.setPath(path);
        hex.release();

    }

    setup(p5, parent) {

        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(parent);

        p5.frameRate(30);

        this.net.setup(p5,parent);

        const c = p5.select("#start");
        c.mouseClicked((e) => {
            this.mouseClicked(p5, e);
        });

        c.mouseWheel((e) => {
            this.mouseWheel(p5, e);
            this.net.mouseWheel(p5,e);
        })

    }

    draw(p5) {

        [this.mx, this.my] = [p5.mouseX, p5.mouseY];

        this.net.draw(p5);

        p5.stroke(255);
        p5.strokeWeight(1);
        p5.noFill();

        const drop = new V(0, -this.sketchGlobals.y);
        const pos = V.ADD(this.hcenter, drop);

        for (let i = 0; i < this.hex0.length; i++) {
            const hex = this.hex0[i];
            hex.update(p5);
            hex.setPos(pos);

            if(i === 2 && hex.state !== 0) {
                hex.path.draw(p5);
            }
        }

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