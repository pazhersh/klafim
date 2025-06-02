import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Raycaster } from './raycaster.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvasElement = renderer.domElement;
const raycaster = new Raycaster(camera, sceneObjects, canvasElement)

const loader = new GLTFLoader();
const deckGLTF = await loader.loadAsync('/assets/deck.glb');

const deck = deckGLTF.scene.children[0]; // not the cleanest but hey, it's just a side-project

const sceneObjects = [deck];

scene.add(...sceneObjects);

const skyColor = 0xFFFFFF;
const groundColor = 0x101010;
const light = new THREE.HemisphereLight(skyColor, groundColor, 1);
scene.add(light);

document.body.appendChild(canvasElement);

const orbitControls = new OrbitControls(camera, canvasElement);
let isOrbiting = false;
orbitControls.addEventListener('start', () => { isOrbiting = true });
orbitControls.addEventListener('end', () => { isOrbiting = false });
canvasElement.addEventListener('mousemove', (event) => {
  const selectedElement = raycaster.getPointedElement(event);
  if (!isOrbiting)
    orbitControls.enabled = !Boolean(selectedElement);
})

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


canvasElement.addEventListener('mousedown', (event) => {
  const selectedElement = raycaster.getPointedElement(event);
  console.log(selectedElement);
})
