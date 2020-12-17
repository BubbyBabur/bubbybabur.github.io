import React from "react"
import Sketch from "react-p5";

import * as Paths from "../utils/Path"
import * as Misc from "../utils/misc"
import Net from "../utils/Net"
import V from "../utils/V"

const PI = 3.14159265358979323846264338327950288;

function Icon(props) {
    return <div
        className="front-icons"
        style={{
            left: props.left,
            top: props.top,
            width: `${props.width}px`,
            height: `${props.width}px`,
            opacity: `${props.opacity}`,
            transform: `translate(-50%,-50%) rotateZ(${props.rotate}deg)`,
            maskImage: `url(${props.imgurl})`,
            WebkitMaskImage: `url(${props.imgurl})`,
            background: `linear-gradient(${-props.rotate}deg, rgba(248,117,117,1) 0%, rgba(255,169,163,1) 75%)`
        }}
    />
}

class TopSketch extends React.Component {

    constructor(props) {
        super();

        // Utils
        this.mx = 0;
        this.my = 0;

        // Hexes
        this.hexes = [];
        this.hexpos = [];

        this.center = new V(window.innerWidth/2,window.innerHeight/2);
        for(let i = 0; i < 4; i++) {
            this.hexpos.push(new V(this.center));
            this.hexes.push(new Paths.FullRing(this.center))
        }
        
        this.hcenter = new V(200, window.innerHeight);

        this.ps = 30;

        // this.hex0 = new Paths.FullRing(this.hcenter);

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
            cliptextopacity: 1.0,
            positions: this.hexpos
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

        // this.hex0.release(p5);
        for(const hex of this.hexes) {
            hex.release(p5);
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


        for (let i = 0; i < this.hexes.length; i++) {
            let add = V.POLAR(Misc.map(this.sketchGlobals.y, 0, this.sketchGlobals.maxY, 200, 400), i / 4 * PI * 2 + Misc.map(this.sketchGlobals.y, 0, this.sketchGlobals.maxY, 0, PI / 2))
            this.hexpos[i] = V.ADD(add, this.center);
            this.hexes[i].update(p5, this.hexpos[i]);
        }

        this.setState({
            clip: {
                top: pos.y,
                left: pos.x
            },
            cliprot: p5.frameCount * 2,
            cliptextrot: p5.frameCount,
            clipwidth,
            positions: this.hexpos
        })
        

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
            <Icon
                width={this.state.cliptextwidth}
                top={this.state.clip.top}
                left={this.state.clip.left}
                opacity={this.state.cliptextopacity}
                rotate={this.state.cliptextrot}
                imgurl="links.svg"
             />
            <Icon 
                width={this.state.clipwidth}
                top={this.state.clip.top}
                left={this.state.clip.left}
                rotate={this.state.cliprot}
                opacity={1}
                imgurl="clip.svg"
            />

            {this.state.positions.map((pos) => {
                return <Icon
                    width={this.state.cliptextwidth}
                    top={pos.y}
                    left={pos.x}
                    opacity={this.state.cliptextopacity}
                    rotate={this.state.cliptextrot}
                    imgurl="links.svg"
                />
            })}
            {this.state.positions.map((pos) => {
                return <Icon
                    width={this.state.clipwidth}
                    top={pos.y}
                    left={pos.x}
                    opacity={1}
                    rotate={this.state.cliprot}
                    imgurl="clip.svg"
                />
            })}
            
        </div>;
    }
    
}

export default TopSketch;