import React from 'react'
import Sketch from "react-p5";

class Shape {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.shape = Math.floor(Math.random() * 2);

        this.size = Math.random() * 20 + 10;

        this.rotation = Math.random() * 360;
    }
    draw(p5) {
        p5.fill("#EFF188");
        p5.push();
        p5.translate(this.x,this.y);
        p5.rotate(this.rotation);
        switch(this.shape) {
            case 0:
                p5.rect(-this.size/2, -this.size/2, this.size, this.size);
                break;
            case 1:
                p5.ellipse(0,0,this.size,this.size);
                break;
            default: 
                break;
        }
        p5.pop();
    }
}

function Border(props) {

    const percentage = 5 / 100;

    let shapes;
    let shapelength = 50;

    let centeredx = 500;

    let deg = 0;

    let last_known_scroll_position = window.scrollY;

    const setup = (p5, parent) => {
        p5.createCanvas(p5.windowWidth * percentage+50, p5.windowHeight).parent(parent);

        let maxr = percentage * p5.windowWidth + centeredx;

        shapes = Array(shapelength).fill(0).map((a, index) => {
            let theta = Math.PI * 2 * index / shapelength;
            let r = index % 3 === 0 ? maxr : Math.random() * (maxr - centeredx) + centeredx;
            return new Shape(Math.cos(theta) * r, Math.sin(theta) * r);
        })



        window.addEventListener("scroll", (e) => {
            deg += (window.scrollY - last_known_scroll_position)  * 0.001;
            last_known_scroll_position = window.scrollY;
            draw(p5);
            
        })
    }

    const draw = (p5) => {
        p5.clear();
        p5.noStroke();
        p5.push();
        p5.translate(-centeredx, p5.height/2);
        p5.rotate(deg);
        shapes.map(a => a.draw(p5));
        p5.pop();

        p5.erase();
        p5.rect(0, 0, p5.width, window.innerHeight - window.scrollY)

        p5.noErase();
        p5.noLoop();
    }

    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth * percentage + 50, p5.windowHeight);
    }

    return (
        <div id="border">
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </div>
    )
}

export default Border;
