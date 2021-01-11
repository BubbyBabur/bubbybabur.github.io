import React from 'react'
import Sketch from "react-p5";

class Shape {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.shape = Math.floor(Math.random() * 4);

        this.size = Math.random() * 30 + 10;

        this.rotation = Math.random() * 360;
    }

    draw(p5) {
        p5.fill("#EFF188");
        p5.push();
        p5.translate(this.x,this.y);
        p5.rotate(this.rotation);
        switch(this.shape) {
            case 0:
                p5.rect(-this.size/2 / Math.sqrt(2), -this.size/2 / Math.sqrt(2), this.size / Math.sqrt(2), this.size / Math.sqrt(2));
                break;
            case 1:
                p5.ellipse(0,0,this.size,this.size);
                break;
            case 2:
                p5.beginShape();
                const R = this.size / 2;
                const r = Math.sin(18 * Math.PI/180) / Math.sin(126 * Math.PI/180) * R;
                for(let i = 0; i < 5; i++) {
                    const deg1 = i / 5 * 2 * Math.PI;
                    const deg2 = deg1 + Math.PI / 5;
                    p5.vertex(R * Math.sin(deg1), R * Math.cos(deg1));
                    p5.vertex(r * Math.sin(deg2), r * Math.cos(deg2));
                }
                p5.endShape(p5.CLOSE);
                break;
            case 3:
                p5.beginShape();
                const r3 = this.size / 2;
                for (let i = 0; i < 3; i++) {
                    const deg = i / 3 * 2 * Math.PI;
                    p5.vertex(r3 * Math.cos(deg), r3 * Math.sin(deg));
                }
                p5.endShape(p5.CLOSE);
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

    let margin = 50;

    let centeredx = props.x;

    let deg = 0;

    let last_known_scroll_position = window.scrollY;

    const setup = (p5, parent) => {
        p5.createCanvas(p5.windowWidth * percentage + margin, p5.windowHeight).parent(parent);

        let maxr = percentage * p5.windowWidth + Math.abs( centeredx );

        shapes = Array(shapelength).fill(0).map((a, index) => {
            let theta = Math.PI * 2 * index / shapelength;
            let r = index % 3 === 0 ? maxr : Math.random() * (maxr - Math.abs( centeredx ) ) + Math.abs( centeredx );
            return new Shape(Math.cos(theta) * r, Math.sin(theta) * r);
        })

        window.addEventListener("scroll", (e) => {
            deg += (window.scrollY - last_known_scroll_position) * 0.001 * (centeredx < 0 ? -1 : 1);
            shapes.map(shape => {
                shape.rotation += (window.scrollY - last_known_scroll_position) * 0.01 * (centeredx < 0 ? -1 : 1);
                return null;
            })
            last_known_scroll_position = window.scrollY;
            draw(p5)
            
        })
    }

    const draw = (p5) => {
        p5.clear();
        p5.noStroke();
        p5.push();

        // p5.scale(-1,1);
        p5.translate(centeredx < 0 ? margin + percentage * window.innerWidth : 0, 0);

        p5.translate(-(centeredx), p5.height/2);
        p5.rotate(deg);
        shapes.map(a => a.draw(p5));
        p5.pop();

        p5.erase();
        p5.rect(0, 0, p5.width, window.innerHeight - window.scrollY)

        p5.noErase();
        p5.noLoop();
    }

    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth * percentage + margin, p5.windowHeight);
    }

    return (
        <div id={`${props.id}`} className="border" >
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </div>
    )
}

export default Border;
