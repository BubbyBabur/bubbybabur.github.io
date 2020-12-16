
const ease = (x) => Math.sin(Math.PI / 2 * x) ** 2;

const map = (x, low, high, newlow, newhigh) => (x - low) * (newhigh - newlow) / (high - low) + newlow;

const constrain = (x, low, high) => (x < low) ? low : (x > high) ? high : x;

const mappedease = (x, t0, t1, a, b) => map(ease(constrain(map(x, t0, t1, 0, 1), 0, 1)), 0, 1, a, b);

const moveto = (from, to, factor) => from + (to - from) * factor;

const over = (x,y,l,r,w,h) => x > l && y > r && x < l + w && y < r + h;

export { ease, map, constrain, mappedease, moveto, over };
