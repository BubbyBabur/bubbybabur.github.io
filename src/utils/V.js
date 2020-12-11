
/**
 * @class
 * @classdesc A 2D vector class
 */
class V {
    /**
     * 
     * @constructor
     * @param {number|V} x 
     * @param {number} y 
     */
    constructor(x,y) {

        /**
         * @type {number}
         */
        this.x = 0;
        /**
         * @type {number}
         */
        this.y = 0;

        if(x instanceof V) {
            this.x = x.x;
            this.y = x.y;
        } else if(typeof x === "number") {
            this.x = x;
            this.y = y;
        }

    }

    /**
     * Adds another Vector
     * @param {V} V2 
     */
    add(V2) {
        this.x += V2.x;
        this.y += V2.y;
    }

    /**
     * Subtracts another Vector
     * @param {V} V2
     */
    sub(V2) {
        this.x -= V2.x;
        this.y -= V2.y;
    }

    opposite() {
        return new V(-this.x,-this.y);
    }

    /**
     * Multiply by a scalar
     * @param {number} num 
     */
    mult(num) {
        this.x *= num;
        this.y *= num;
    }

    /**
     * Divides by a scalar
     * @param {number} num 
     */
    div(num) {
        this.x /= num;
        this.y /= num;
    }

    mag() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }

    norm() {
        const mag = this.mag();
        if(mag !== 0) {
            this.div(mag);
        }
    }

    /**
     * 
     * @param {V} v 
     */
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * Dots with another Vector
     * @param {V} V2
     */
    dot(V2) {
        return this.x * V2.x + this.y * V2.y;
    }

    /**
     * 
     * @param {V} v1 
     * @param {V} v2 
     */
    static ADD(v1,v2) {
        return new V(v1.x+v2.x,v1.y+v2.y);
    }

    /**
     * 
     * @param {V} v1 
     * @param {V} v2 
     */
    static SUB(v1, v2) {
        return new V(v1.x - v2.x, v1.y - v2.y);
    }

    /**
     * 
     * @param {V} v
     * @param {number} num 
     */
    static MULT(v, num) {
        return new V(v.x*num,v.y*num);
    }

    /**
     * 
     * @param {V} v
     * @param {number} num 
     */
    static DIV(v, num) {
        return new V(v.x / num, v.y / num);
    }

    /**
     * 
     * @param {V} v1 
     * @param {V} v2 
     * @param {number} num 
     */
    static LERP(v1,v2,num) {
        return new V(v1.x * (1 - num) + v2.x * num, v1.y * (1 - num) + v2.y * num);
    }
}

export default V;
