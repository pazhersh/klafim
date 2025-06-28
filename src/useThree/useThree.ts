import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Raycaster } from './raycaster.js';
import { bounce } from '../legacy/utils.js';
import { Element } from './types.js';

const gravity = { x: 0.0, y: -9.81, z: 0.0 };

export default function useThree() {
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement>();
    const [world, setWorld] = useState<any>();
    const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());
    const [raycaster, setRaycaster] = useState<Raycaster>();

    useEffect(() => {
        async function initThree() {
            await RAPIER.init();
            setWorld(new RAPIER.World(gravity));

            const elementsToListen: Element[] = [];

            const hoverPlaneGeometry = new THREE.PlaneGeometry(100, 100).rotateX(Math.PI / 2 * -1);
            const hoverPlane = new THREE.Mesh(hoverPlaneGeometry);
            hoverPlane.visible = false;
            hoverPlane.position.setY(1);
            hoverPlane.name = 'hoverPlane';
            scene.add(hoverPlane);


            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

            const orbitControls = new OrbitControls(camera, canvasElement);
            orbitControls.mouseButtons.LEFT = undefined;
            orbitControls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
            orbitControls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

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

    return { canvasElement, world, scene, raycaster };
}