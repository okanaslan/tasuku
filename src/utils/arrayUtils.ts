export class ArrayUtils {
    static removeFrom<T>(array: T[], element: T) {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}
