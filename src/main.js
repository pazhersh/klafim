import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { getNormalizedPosition } from './utils.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvasElement = renderer.domElement;
document.body.appendChild(canvasElement);

const loader = new GLTFLoader();
const deckGLTF = await loader.loadAsync('/assets/deck.glb');

const deck = deckGLTF.scene;
scene.add(deck);

const skyColor = 0xFFFFFF;
const groundColor = 0x101010;
const light = new THREE.HemisphereLight(skyColor, groundColor, 1);
scene.add(light);

const orbitControls = new OrbitControls(camera, canvasElement);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
camera.position.z = 5;

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

const raycaster = new THREE.Raycaster();
function getElementsAtPosition({ x, y }) {
  const normalizedPosition = getNormalizedPosition({
    x,
    y,
    width: canvasElement.width,
    height: canvasElement.height
  });
  raycaster.setFromCamera(normalizedPosition, camera);
  return raycaster.intersectObjects(scene.children);
}

canvasElement.addEventListener('mousedown', (event) => {
  const { offsetX: x, offsetY: y } = event;
  const intersections = getElementsAtPosition({ x, y });
  const filterred = intersections.filter(item => !item.object.type.includes('Helper'));
  console.log(filterred);
})
