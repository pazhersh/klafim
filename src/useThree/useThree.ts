import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';

import { Raycaster } from './raycaster.js';
import { Element } from '../elements/types.js';
import useDebounceToUpdate from './useDebounceToUpdate.js';

type UseThreeProps = {
    containerRef: React.RefObject<HTMLCanvasElement | null>;
}

const gravity = { x: 0.0, y: -9.81, z: 0.0 };

export default function useThree({ containerRef }: UseThreeProps) {
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
    const [world, setWorld] = useState<any>();
    const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());
    const [raycaster, setRaycaster] = useState<Raycaster>();
    const [camera, setCamera] = useState<THREE.Camera>(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

    const { debounceToUpdate, onUpdate } = useDebounceToUpdate();

    const [elements, setElements] = useState<Element[]>([]);
    const addElement = useCallback((element: Element) => {
        setElements([...elements, element])
    }, []);

    useEffect(() => {
        async function initThree() {
            if (!containerRef.current) {
                return;
            }

            await RAPIER.init();
            setWorld(new RAPIER.World(gravity));

            camera.position.copy(new THREE.Vector3(0.0, 4.0, 4.0));

            setRenderer(new THREE.WebGLRenderer({ canvas: containerRef.current }));
            renderer!.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

            setRaycaster(new Raycaster(camera, containerRef.current, scene));

            // const clock = new THREE.Clock()
            // let delta;
            function animate() {
                requestAnimationFrame(animate);

                // delta = clock.getDelta();
                // // Feels like this should be on of the animation function, but it breaks the physics for some reason
                // world.timestep = delta;
                world?.step();
                onUpdate();
                elements.forEach(element => element.update?.());
                renderer!.render(scene, camera);
            }
            renderer!.setAnimationLoop(animate);
        };
        initThree();
    }, [containerRef.current]);

    return { world, scene, raycaster, camera, addElement, debounceToUpdate };
}