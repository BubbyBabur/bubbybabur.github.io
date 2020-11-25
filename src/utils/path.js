
import V from "./V"

const TAU = 6.28318530717958647692528676655900576839433879875021;

class Path {

    /**
     * @constructor
     * @param {V} start
     * @param {V} end
     * @param {number} speed
     */
    constructor(start, end, speed) {
        this.start = start;
        this.end = end;
        this.speed = speed;
        this.pos = new V(start.x, start.y);
        this.done = false;
    }

    update() {
        this.done = true;
    }

}

class TimeLinearPath extends Path {

    /**
     * 
     * @param {V} start 
     * @param {V} end 
     * @param {number} speed 
     */
    constructor(start, end, speed) {
        super(start, end, speed);
        this.move = V.SUB(end, start);
        this.move.norm();
        this.move.mult(speed);
    }

    update() {

        if(this.done) {
            return;
        }

        this.pos.add(this.move);

        if (this.move.dot(V.SUB(this.end, this.pos)) < 0) {
            this.done = true;
        }

    }
}

class TimeCirclePath extends Path {
    constructor(start, center, speed, cc) {
        super(start, start, speed);
        this.center = center;
        let r = V.SUB(start, center);
        this.r = r.mag();
        this.angle = Math.atan2(r.y, r.x);
        this.origangle = this.angle;
        this.wspeed = this.speed / this.r;

        this.cc = cc || true;
    }

    update() {

        if(this.cc) {
            this.angle -= this.wspeed;
            if (this.angle < this.origangle - TAU) {
                this.done = true;
            }
            this.pos = V.ADD(this.center, new V(this.r * Math.cos(this.angle), this.r * Math.sin(this.angle)));
        } else {
            this.angle += this.wspeed;
            if (this.angle > this.origangle + TAU) {
                this.done = true;
            }
            this.pos = V.ADD(this.center, new V(this.r * Math.cos(this.angle), this.r * Math.sin(this.angle)));
        }

    }
}

class CombinedPath extends Path {
    
    /**
     * @constructor
     * @param {Path[]} paths 
     */
    constructor(paths) {
        super(paths[0].start, paths[paths.length - 1].end, paths[0].speed);
        this.paths = paths;
        this.currpath = 0;
    }

    update() {

        if(this.currpath >= this.paths.length) {
            this.done = true;
            return;
        }

        this.paths[this.currpath].update();

        this.pos = this.paths[this.currpath].pos;

        if(this.paths[this.currpath].done) {
            this.currpath++;
        }

    }
}

class StaticRope {
    constructor(lyst) {
        this.points = lyst;
    }

    update(p) {
        this.points.pop();
        this.points = [p, ...this.points];
    }

    head() {
        return this.points[0];
    }

    draw(p5) {

        for (let i = 1; i < this.points.length; i++) {
            p5.line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }

    }
}

class Rope {
    constructor(lyst, d) {
        this.points = lyst;
        this.d = d;
    }

    at(pp, p, d) {
        let dir = new V(p.x - pp.x, p.y - pp.y);
        dir.norm();
        dir.mult(d);
        return V.SUB(p, dir);
    }

    head() {
        return this.points[0];
    }

    update(p) {
        this.points[0] = p;
        this.points[1] = this.at(this.points[0], p, this.d);
        for (let i = 2; i < this.points.length; i++) {
            this.points[i] = this.at(this.points[i], this.points[i - 1], this.d);
        }
    }

    lerpUpdate(p, d) {
        this.update(V.LERP(this.head(), p, d));
    }

    draw(p5) {
        for (let i = 1; i < this.points.length; i++) {
            p5.line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }

    }
}

class Hexagon {

    /**
     * 
     * @param {number} x X Position
     * @param {number} y Y Position
     * @param {number} r Radius
     */
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.deg = 0;
        this.setPoints(0);
    }

    /**
     * 
     * @param {V} v 
     */
    setPos(v) {
        this.x = v.x;
        this.y = v.y;
    }

    setPoints(deg) {
        this.deg = deg;
        this.points = [];
        for (let i = 0; i < 6; i++) {
            this.points[i] = new V(this.x + this.r * Math.cos(TAU / 6 * i + deg), this.y + this.r * Math.sin(TAU / 6 * i + deg));
        }
    }

    pointsinc(start, d, cc) {

        if(!cc) {
            let newps = [];
            for (let i = start; i < start + 6; i++) {
                for (let j = 0; j < 1; j += d / this.r) {
                    newps.push(V.LERP(this.points[i % 6], this.points[(i + 1) % 6], j));
                }
            }
            return newps;
        } else {
            let newps = [];
            for (let i = start + 12; i > start + 6; i--) {
                for (let j = 0; j < 1; j += d / this.r) {
                    newps.push(V.LERP(this.points[i % 6], this.points[(i - 1) % 6], j));
                }
            }
            return newps;
        }
        
    }

    closestPoint(v) {
        let newv = V.SUB(v, new V(this.x, this.y));
        let angle = Math.atan2(newv.y, newv.x);

        angle -= this.deg;
        while (angle < 0) {
            angle += TAU;
        }
        angle *= 6 / TAU;
        let p = Math.round(angle);
        return (p) % 6;
    }

    draw(p5) {
        for (let i = 1; i < this.points.length; i++) {
            p5.line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }

        p5.line(this.points[0].x, this.points[0].y, this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
    }

}

export { Path, TimeLinearPath, TimeCirclePath, CombinedPath, StaticRope, Rope, Hexagon };
