import { useMemo } from 'react';
import { type Camera, MOUSE } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

type UseOrbitControlsProps = {
    camera: Camera;
    canvasElement?: HTMLCanvasElement;
}

export default function useOrbitControls({ camera, canvasElement }: UseOrbitControlsProps) {
    useMemo<OrbitControls>(() => {
        const controls = new OrbitControls(camera, canvasElement)
        controls.mouseButtons.LEFT = undefined;
        controls.mouseButtons.MIDDLE = MOUSE.PAN;
        controls.mouseButtons.RIGHT = MOUSE.ROTATE;
        return controls;
    }, [camera, canvasElement])
}