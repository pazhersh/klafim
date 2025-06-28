import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

import { bounce } from '../legacy/utils.js';
import { Raycaster } from './raycaster.js';
import { Element } from './types.js';

const gravity = { x: 0.0, y: -9.81, z: 0.0 };

export default function useThree() {
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement>();
    const [world, setWorld] = useState<any>();
    const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());
    const [raycaster, setRaycaster] = useState<Raycaster>();
    const [camera, setCamera] = useState<THREE.Camera>(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

    useEffect(() => {
        async function initThree() {
            await RAPIER.init();
            setWorld(new RAPIER.World(gravity));

            const elementsToListen: Element[] = [];

            camera.position.copy(new THREE.Vector3(0.0, 4.0, 4.0));


            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);

            const canvasElement = renderer.domElement;
            setCanvasElement(renderer.domElement);

            const skyColor = 0xFFFFFF;
            const groundColor = 0x101010;
            const light = new THREE.HemisphereLight(skyColor, groundColor, 1);
            scene.add(light);

            setRaycaster(new Raycaster(camera, canvasElement, scene));

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            const clock = new THREE.Clock()
            let delta;
            function animate() {
                requestAnimationFrame(animate);

                delta = clock.getDelta();
                // // Feels like this should be on of the animation function, but it breaks the physics for some reason
                // world.timestep = delta;
                world?.step();
                bounce();
                elementsToListen.forEach(element => element.update?.());
                // window.debugger?.update();
                renderer.render(scene, camera);
            }
            renderer.setAnimationLoop(animate);
        };
        initThree();
    }, []);

    return { canvasElement, world, scene, raycaster, camera };
}