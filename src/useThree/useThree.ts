import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

import { Raycaster } from './raycaster.js';

type UseThreeProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    onAnimate?: () => void;
}

const gravity = { x: 0.0, y: -9.81, z: 0.0 };

export default function useThree({ canvasRef, onAnimate }: UseThreeProps) {
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
    const [world, setWorld] = useState<any>();
    const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());
    const [raycaster, setRaycaster] = useState<Raycaster>();
    const [camera, setCamera] = useState<THREE.Camera>(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

    useEffect(() => {
        async function initThree() {
            if (!canvasRef.current) {
                return;
            }

            await RAPIER.init();
            setWorld(new RAPIER.World(gravity));

            camera.position.copy(new THREE.Vector3(0.0, 4.0, 4.0));

            setRenderer(new THREE.WebGLRenderer({ canvas: canvasRef.current }));

        };
        initThree();
    }, [canvasRef.current]);

    useEffect(() => {
        if (renderer && canvasRef.current) {
            renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);

            setRaycaster(new Raycaster(camera, canvasRef.current, scene));

            // const clock = new THREE.Clock()
            // let delta;
            function animate() {
                requestAnimationFrame(animate);

                // delta = clock.getDelta();
                // // Feels like this should be on of the animation function, but it breaks the physics for some reason
                // world.timestep = delta;
                world?.step();
                onAnimate?.();
                renderer?.render(scene, camera);
            }
            renderer.setAnimationLoop(animate);
        }
    }, [renderer, canvasRef, onAnimate]);

    return { world, scene, raycaster, camera };
}