// Linear interpolation
export const lerp = (x: number, y: number, a: number) => {
	return x * (1 - a) + y * a;
};

export const clamp = (a: number, min = 0, max = 1) => {
	return Math.min(max, Math.max(min, a));
};

// This works in the opposite way to the lerp. Instead of passing a decimal midpoint,
// you pass any value, and it’ll return that decimal, wherever it falls on that spectrum.
export const invlerp = (x: number, y: number, a: number) => {
	return clamp((a - x) / (y - x));
};

export const scale = (x1: number, y1: number, x2: number, y2: number, a: number) => {
	return lerp(x2, y2, invlerp(x1, y1, a));
};

export const randRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};
