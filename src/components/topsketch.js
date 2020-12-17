import React from "react"
import Sketch from "react-p5";

import * as Paths from "../utils/Path"
import * as Misc from "../utils/misc"
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

        this.state = {
            clip: {
                left: 0,
                top: 0,
            },
            clipwidth: 150,
            cliprot: 0,
            cliptextwidth: 150*2.5,
            cliptextrot: 0,
            cliptextopacity: 1.0
        }

        this.started = false;

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

        // A lot of setup
        for (let i = 0; i < this.hex0.length; i++) {
            const hex = this.hex0[i];

            const pos = hex.randPoint();

            let paths = [new Paths.TimeLinearPath(pos, V.ADD(pos, V.MULT(V.RAND2D(), 300)), this.ps)];

            let num = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < num; i++) {
                let dist = paths[i].length() / 3 + Math.random() * paths[i].length() * 1 / 3;

                let inorout = Math.random() < 0.5;

                if (inorout) {
                    // in
                    let at = paths[i].length() - dist;
                    let pos = paths[i].at(at);

                    let t = Math.atan2(paths[i].slope.y, paths[i].slope.x)
                    let theta = t + 2 * Math.PI / 3 + Math.PI / 6 * Math.random();

                    if (Math.random() < 0.5) {
                        // theta *= -1;
                    }

                    let dir = new V(Math.cos(theta), Math.sin(theta));


                    let start = V.ADD(pos, V.MULT(dir, -Math.random() * 300 - 200));

                    let n = Math.random() * 400;
                    let end = V.ADD(pos, V.MULT(dir, n));

                    if (i === num - 1) {
                        // console.log(end, hex.length());
                        while (end.x < width + hex.length() && end.y < height + hex.length() && end.x > -hex.length() && end.y > -hex.length()) {
                            n += 50;
                            end = V.ADD(pos, V.MULT(dir, n));
                        }
                    }

                    let newpath = new Paths.TimeLinearPath(start, end, this.ps);

                    paths.push(newpath);
                } else {
                    // out
                    let at = paths[i].length() + dist;
                    let pos = paths[i].at(at);

                    let t = Math.atan2(paths[i].slope.y, paths[i].slope.x)
                    let theta = t + Math.PI / 3 + Math.PI / 3 * Math.random();

                    if (Math.random() < 0.5) {
                        theta *= -1;
                    }

                    let dir = new V(Math.cos(theta), Math.sin(theta));

                    let start = V.ADD(pos, V.MULT(dir, 200 + Math.random() * 100));

                    let n = Math.random() * 400;
                    let end = V.ADD(start, V.MULT(dir, n));

                    if (i === num - 1) {
                        // console.log(end, hex.length());
                        while (end.x < width + hex.length() && end.y < height + hex.length() && end.x > -hex.length() && end.y > -hex.length()) {
                            n += 50;
                            end = V.ADD(pos, V.MULT(dir, n));
                        }
                    }

                    let newpath = new Paths.TimeLinearPath(start, end, this.ps);

                    paths.push(newpath);
                }
            }

            for (let i = 0; i < num + 1; i++) {
                if (paths[i].length() > 500) {

                    let rad = Math.random() * paths[i].length() / 10 + 100;
                    if (Math.random() < 0.5) {
                        paths[i] = new Paths.PathToLoops(paths[i], [{
                            at: 1 / 3 * paths[i].length(),
                            radius: rad
                        }])
                    } else {
                        paths[i] = new Paths.PathToLoops(paths[i], [
                            {
                                at: 1 / 3 * paths[i].length(),
                                radius: rad
                            }, {
                                at: 1 / 3 * paths[i].length(),
                                radius: -rad
                            }])
                    }

                }

            }

            let path = Paths.ConnectPathsWithArcs(...paths)
            hex.setPath(path);
            hex.release();
        }

        this.started = p5.frameCount;

        this.setState({
            cliptextopacity: 0
        })
    }

    preload(p5) {
        // this.clip = p5.loadImage("paperclip.png")
        // console.log(this.clip)
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

        let clipwidth = this.state.clipwidth;
        if(this.started) {
            // clipwidth = Misc.mappedease(p5.frameCount, this.started, this.started + 30, 150, 300)
            clipwidth = Misc.moveto(clipwidth, 0, 0.1)
        }
        else if(Misc.over(p5.mouseX,p5.mouseY,pos.x-100,pos.y-100,200,200)) {
            clipwidth = Misc.moveto(clipwidth, 200, 0.1)
        } else {
            clipwidth = Misc.moveto(clipwidth, 150, 0.1)
        }
        this.setState({
            clip: {
                top: pos.y,
                left: pos.x
            },
            cliprot: p5.frameCount * 2,
            cliptextrot: p5.frameCount,
            clipwidth
        })
        
        for (let i = 0; i < this.hex0.length; i++) {
            const hex = this.hex0[i];
            hex.setPos(pos);
            hex.update(p5);
        }


        let alldone = this.hex0.every((hexpath) => hexpath.state !== 0 && hexpath.path.done)
        // console.log(alldone)

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

        const preload = (p5) => {
            this.preload(p5);
        }

        return <div> 
            <div id="front-sketch">
                <Sketch setup={setup} draw={draw} windowResized={windowResized} preload={preload} />
            </div>
            <div
                className="front-icons front-text-icons"
                id="paperclip-text"
                style={{
                    ...this.state.clip,
                    width: `${this.state.cliptextwidth}px`,
                    height: `${this.state.cliptextwidth}px`,
                    opacity: `${this.state.cliptextopacity}`,
                    transform: `translate(-50%,-50%) rotateZ(${this.state.cliptextrot}deg)`,
                    maskImage: `url(links.svg)`,
                    WebkitMaskImage: `url(links.svg)`,
                    background: `linear-gradient(${-this.state.cliptextrot}deg, rgba(248,117,117,1) 0%, rgba(255,169,163,1) 75%)`
                }}
            />
            <div 
                className="front-icons" 
                id="paperclip"
                style={{ 
                    ...this.state.clip, 
                    width: `${this.state.clipwidth}px`,
                    height: `${this.state.clipwidth}px`,
                    transform: `translate(-50%,-50%) rotateZ(${this.state.cliprot}deg)`, 
                    maskImage: `url(clip.svg)`,
                    WebkitMaskImage: `url(clip.svg)`,
                    background: `linear-gradient(${-this.state.cliprot}deg, rgba(248,117,117,1) 0%, rgba(255,169,163,1) 75%)`
                }} 
                />
            
        </div>;
    }
    
}

export default TopSketch;