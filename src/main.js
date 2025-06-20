import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

import { Raycaster } from './raycaster.js';

import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import Card from './card.js';
import RapierDebuger from './rapierDebugger.js'
import Ground from './ground.js';

await RAPIER.init();

// Use the RAPIER module here.
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
// let gravity = { x: 0.0, y: 0, z: 0.0 };
window.world = new RAPIER.World(gravity);

window.scene = new THREE.Scene();

const elementsToListen = [];

new Ground();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvasElement = renderer.domElement;

// const loader = new GLTFLoader();
// const deckGLTF = await loader.loadAsync('/assets/deck.glb');

// const deck = deckGLTF.scene.children[0]; // not the cleanest but hey, it's just a side-project

// const sceneObjects = [deck];

// window.scene.add(...sceneObjects);

const skyColor = 0xFFFFFF;
const groundColor = 0x101010;
const light = new THREE.HemisphereLight(skyColor, groundColor, 1);
window.scene.add(light);

document.body.appendChild(canvasElement);

const raycaster = new Raycaster(camera, canvasElement)

const orbitControls = new OrbitControls(camera, canvasElement);
let isOrbiting = false;
orbitControls.addEventListener('start', () => { isOrbiting = true });
orbitControls.addEventListener('end', () => { isOrbiting = false });
canvasElement.addEventListener('mousemove', (event) => {
  const selectedElement = raycaster.getPointedElement(event)?.object;
  if (!isOrbiting)
    orbitControls.enabled = !Boolean(selectedElement);
})


canvasElement.addEventListener('mousedown', (event) => {
  const intersection = raycaster.getPointedElement(event);
  const selectedElement = intersection?.object;

  // if (selectedElement === deck) {
  //   const newCard = addCard(intersection.position);
  //   console.log(newCard);
  // }
})



const card = new Card();
card.rigidBody.setTranslation({ x: 0, y: 1, z: 0 })
elementsToListen.push(card);

const card2 = new Card();
card2.rigidBody.setTranslation({ x: 0, y: 2, z: 0 })
elementsToListen.push(card2);

canvasElement.addEventListener('mousedown', (event) => {
  const intersection = raycaster.getPointedElement(event);
  const intersectedMesh = intersection?.object;
  const selectedObject = elementsToListen.find(element => element.mesh === intersectedMesh);

  if (selectedObject) {
    selectedObject?.onClick(intersection.point);
  }
})
canvasElement.addEventListener('mousemove', (event) => {
  elementsToListen.forEach(element => element?.onDrag());
})
canvasElement.addEventListener('mouseup', (event) => {
  elementsToListen.forEach(element => element?.onRelease());
})


window.debugger = new RapierDebuger();

// // Feels like this should be on of the animation function, but it breaks the physics for some reason
// const clock = new THREE.Clock()
// let delta;
function animate() {
  requestAnimationFrame(animate);

  // delta = clock.getDelta();
  // window.world.timestep = delta;
  window.world.step();
  elementsToListen.forEach(element => element?.update());
  window.debugger.update();
  renderer.render(window.scene, camera);
}
renderer.setAnimationLoop(animate);
