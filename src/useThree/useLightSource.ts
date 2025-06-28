import { useEffect, useMemo } from 'react';
import { type Camera, HemisphereLight, MOUSE, Scene } from 'three';

type useLightSourceProps = {
    scene: Scene;
}

const skyColor = 0xFFFFFF;
const groundColor = 0x101010;
const light = new HemisphereLight(skyColor, groundColor, 1);

export default function useLightSource({ scene }: useLightSourceProps) {
    useEffect(() => {
        scene.add(light);
    }, [scene])
}