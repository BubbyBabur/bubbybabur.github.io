
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
        this.slope = NaN;
    }

    update() {
        this.done = true;
    }

    draw(p5) {
        
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

        if (this.start.equals(this.end)) {
            this.done = true;
        }

        this.move.norm();

        this.slope = new V(this.move);

        this.move.mult(speed);
    }

    at(d) {
        return V.ADD(this.start, V.MULT(this.slope, d));
    }

    update() {

        if (this.done) {
            return;
        }

        this.pos.add(this.move);

        if (this.move.dot(V.SUB(this.end, this.pos)) < 0) {
            this.done = true;
        }

    }

    draw(p5) {
        p5.line(this.start.x,this.start.y, this.end.x,this.end.y);
    }
}

class FollowPath extends Path {
    /**
     * 
     * @param {V} start 
     * @param {number} speed 
     */
    constructor(start, speed) {
        super(start, new V(0, 0), speed);
    }

    /**
     *
     * @param {V} v
     */
    update(v) {
        if (this.done) {
            return;
        }
        this.end = v;
        this.move = V.SUB(this.end, this.start);

        if (this.move.mag() < this.speed) {
            this.pos = new V(this.end);
        }

        this.move.norm();
        this.move.mult(this.speed);

        this.pos.add(this.move);
    }
}

class TimeCirclePath extends Path {
    constructor(start, center, speed, cw, angle) {
        super(start, start, speed);
        this.center = center;
        let r = V.SUB(start, center);
        this.r = r.mag();
        this.angle = Math.atan2(r.y, r.x);
        this.origangle = this.angle;
        this.wspeed = this.speed / this.r;

        this.cc = !((!cw) || false);
        this.maxangle = angle || TAU;
    }

    update() {

        if (this.cc) {
            this.angle -= this.wspeed;
            if (this.angle < this.origangle - this.maxangle) {
                this.done = true;
            }
            this.pos = V.ADD(this.center, new V(this.r * Math.cos(this.angle), this.r * Math.sin(this.angle)));
        } else {
            this.angle += this.wspeed;
            if (this.angle > this.origangle + this.maxangle) {
                this.done = true;
            }
            this.pos = V.ADD(this.center, new V(this.r * Math.cos(this.angle), this.r * Math.sin(this.angle)));
        }

    }

    draw(p5) {
        if(!this.cc) {
            p5.arc(this.center.x, this.center.y, this.r * 2, this.r * 2, this.origangle, this.maxangle + this.origangle);
        } else {
            p5.arc(this.center.x, this.center.y, this.r * 2, this.r * 2, this.origangle - this.maxangle, this.origangle);
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

        if (this.currpath >= this.paths.length) {
            this.done = true;
            return;
        }

        this.paths[this.currpath].update();

        if (this.paths[this.currpath].done) {
            this.currpath++;
        }

        if (this.currpath >= this.paths.length) {
            this.done = true;
            return;
        }

        this.pos = this.paths[this.currpath].pos;

        

    }

    draw(p5) {
        for(const path of this.paths) {
            path.draw(p5);
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
    /**
     * 
     * @param {V[]} lyst 
     * @param {*} d 
     */
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

    length() {
        return this.points.length * this.d;
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

        if (!cc) {
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

    length() {
        return 6 * this.r;
    }

    draw(p5) {
        for (let i = 1; i < this.points.length; i++) {
            p5.line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }

        p5.line(this.points[0].x, this.points[0].y, this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
    }

}

class HexPath extends Hexagon {
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} r 
     * @param {number} offset
     * @param {number} rate
     * @param {Path?} p 
     */
    constructor(x, y, r, offset, rate, p) {
        super(x, y, r);
        this.offset = offset
        this.rate = rate;
        this.path = p;

        this.state = 0;
    }

    setPath(p) {
        this.path = p;
    }

    update(p5) {
        if (this.state === 0) {
            this.setPoints(this.rate * (p5.frameCount) + this.offset);
            this.draw(p5);
        } else {
            this.rope.draw(p5);
            this.rope.lerpUpdate(this.path.pos, 1);
            this.path.update();
        }

    }

    drawPath(p5) {
        if(this.state !== 0) {
            this.path.draw(p5);
        }
    } 

    release() {
        this.state = 1;
        let stuff = this.closestPoint(this.path.start);
        this.rope = new Rope(this.pointsinc(stuff, 10, this.rate > 0), 10);
    }
}

/**
 * 
 * @param {TimeLinearPath} linear 
 * @param {number}
 * @param {V} tangentpoint
 */
function PathToLoop(linear, radius, tangentpoint) {
    const part1 = new TimeLinearPath(linear.start, tangentpoint, linear.speed);
    const part3 = new TimeLinearPath(tangentpoint, linear.end, linear.speed);

    const slope = linear.slope;
    const normvec = new V(-slope.y, slope.x);
    normvec.norm();
    normvec.mult(radius);

    const part2 = new TimeCirclePath(tangentpoint, V.ADD(tangentpoint, normvec), linear.speed, radius < 0, TAU);

    const output = new CombinedPath([part1, part2, part3]);
    output.slope = linear.slope;
    return output;
}

/**
 * 
 * @param {TimeLinearPath} linear 
 * @param {{at: number?, point: V?, radius: number}[]} objs 
 */
function PathToLoops(linear, objs) {
    for (const obj of objs) {
        if (obj.at) {
            obj.point = linear.at(obj.at);
        }
    }

    const n = objs.length;
    const firstpart = new TimeLinearPath(linear.start, objs[0].point, linear.speed);
    const lastpart = new TimeLinearPath(objs[n - 1].point, linear.end, linear.speed);

    const slope = linear.slope;
    const normvec = new V(-slope.y, slope.x);
    normvec.norm();

    const paths = [];
    for (let i = 0; i < n; i++) {
        const outradius = new V(normvec);
        outradius.mult(objs[i].radius);
        paths.push(new TimeCirclePath(objs[i].point, V.ADD(objs[i].point, outradius), linear.speed, objs[i].radius < 0, TAU));

        if (i !== n - 1) {
            paths.push(new TimeLinearPath(objs[i].point, objs[i + 1].point, linear.speed));
        }
    }

    const output = new CombinedPath([firstpart, ...paths, lastpart]);
    output.slope = linear.slope;
    return output;
}

/**
 * @param {Path} path1
 * @param {Path} path2
 */
function ConnectPathsWithArc(path1, path2) {

    let slope1 = new V(path1.slope)
    let slope2 = new V(path2.slope)


    let start = path1.end;
    let end = path2.start;

    let n1 = new V( -slope1.y, slope1.x ); 
    let n2 = new V( -slope2.y, slope2.x );
    let c1 = n1.dot(start);
    let c2 = n2.dot(end);

    let f1 = -n2.x / n1.x;

    let iy = ( c1 * f1 + c2) / (n1.y * f1 + n2.y);
    let ix = ( c2 - iy * n2.y ) / n2.x;

    let intersection = new V(ix,iy);
    let dist1 = V.SUB(start,intersection);
    let dist2 = V.SUB(end,intersection);

    let add1 = true;
    let toadd;
    if(dist1.mag() < dist2.mag()) {
        let oldstart = start;
        dist1.norm();
        dist1.mult(dist2.mag());
        start = V.ADD(intersection, dist1);
        toadd = new TimeLinearPath(oldstart, start, path1.speed);
    } else {
        add1 = false;
        let oldend = end;
        dist2.norm();
        dist2.mult(dist1.mag());
        end = V.ADD(intersection, dist2);
        toadd = new TimeLinearPath(oldend, end, path1.speed);
    }


    let d1 = start.dot(slope1);
    let d2 = end.dot(slope2);

    let factor2 = -slope2.x / slope1.x;

    let y = (d1 * factor2 + d2) / (slope1.y * factor2 + slope2.y);

    let x = (d2 - y * slope2.y) / slope2.x


    let center = new V(x, y);

    let rad1 = V.SUB(start, center);
    let rad2 = V.SUB(end, center);

    let z = center.x * rad1.y - center.y * rad1.x;

    let deg1 = Math.atan2(rad1.y, rad1.x);
    let deg2 = Math.atan2(rad2.y, rad2.x);

    let deg;
    if(z > 0) {
        while (deg1 < deg2) deg1 += TAU;
        deg = deg1 - deg2;
    } else {
        while (deg2 < deg1) deg2 += TAU;
        deg = deg2 - deg1;
    }
    

    let circ = new TimeCirclePath(start, center, path1.speed, z > 0, deg)

    let arr = [circ];
    if(add1) {
        arr = [toadd, ...arr];
    }  else {
        arr = [...arr, toadd];
    }

    arr = [path1, ...arr, path2]
    const output = new CombinedPath(arr);
    return output;
}

export { Path, TimeLinearPath, TimeCirclePath, FollowPath, CombinedPath, StaticRope, Rope, Hexagon, HexPath, PathToLoop, PathToLoops, ConnectPathsWithArc };
