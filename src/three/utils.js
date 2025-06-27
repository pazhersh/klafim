export function getNormalizedPosition({ x, y, width, height }) {
    // normalized = between start=-1 and end=1
    return {
        x: (x / width * 2) - 1,
        y: -(y / height * 2) + 1,
    }
};

const debounceValues = new Map();
export function debounce(inputFunction, key) {
    debounceValues.set(key, inputFunction);
};

export function bounce() {
    for (const debouncedFunction of debounceValues.values()) {
        debouncedFunction();
    }
    debounceValues.clear();
}