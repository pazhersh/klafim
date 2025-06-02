export function getNormalizedPosition({ x, y, width, height }) {
    // normalized = between start=-1 and end=1
    return {
        x: (x / width * 2) - 1,
        y: -(y / height * 2) + 1,
    }
}