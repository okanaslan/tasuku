export class ArrayUtils {
	static addTo<T>(array: T[], element: T): T {
		array.push(element);
		return element;
	}

	static removeFrom<T>(array: T[], element: T) {
		const index = array.indexOf(element);
		if (index > -1) {
			array.splice(index, 1);
		}
	}
}
