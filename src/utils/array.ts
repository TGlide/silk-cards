export const range = (start: number, end: number): number[] => {
	const result: number[] = [];
	for (let i = start; i <= end; i++) {
		result.push(i);
	}
	return result;
};

// function that given an array of numbers, and a percentage, returns the value at that percentage.
// e.g. given [0, 100, 50] and 0.25, returns 50
export const getValueAtPercentage = (values: number[], percentage: number): number => {
	const lowerBound = Math.floor(percentage * (values.length - 1));
	const upperBound = Math.ceil(percentage * (values.length - 1));

	const lowerValue = values[lowerBound];
	const upperValue = values[upperBound];
	const valueDiff = Math.abs(lowerValue - upperValue);
	const multiplier = lowerValue > upperValue ? -1 : 1;
	if (valueDiff === 0) return lowerValue;

	const lowerPercentage = lowerBound / (values.length - 1);
	const upperPercentage = upperBound / (values.length - 1);
	const percentageDiff = upperPercentage - lowerPercentage;

	return lowerValue + valueDiff * ((percentage - lowerPercentage) / percentageDiff) * multiplier;
};
