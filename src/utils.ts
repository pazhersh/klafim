import * as THREE from 'three';

export function splitTextByMaxLength(text: string, maxLineLength: number) {
    const matchIndices = Array.from(text.matchAll(/(\s|$)/g), (match) => match.index);

    const splitIndices = matchIndices.reduce((relevantIndices, currentIndex) => {
        if (currentIndex - (relevantIndices.at(-2)! || 0) > maxLineLength) {
            relevantIndices.push(currentIndex);
            return relevantIndices;
        }
        relevantIndices[relevantIndices.length - 1] = currentIndex;
        return relevantIndices;
    }, [0]);

    return splitIndices.reduce<string[]>((lines, indexToSplit, index) => {
        // +1 to skip the \s itself
        lines.push(text.slice((splitIndices[index - 1] ?? -1) + 1, indexToSplit))
        return lines;
    }, []);
}

export const flipQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);

type ClassName = string | undefined | false | null;
export function cx(...classes: (ClassName | (() => ClassName))[]) {
    return classes
        .map((cls) => typeof cls === 'function' ? cls() : cls)
        .filter((cls) => typeof cls === 'string' && cls)
        .join(' ');
}