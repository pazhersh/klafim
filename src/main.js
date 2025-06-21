import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Raycaster } from './raycaster.js';

import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import Card, { boundingBox as cardBoundingBox } from './card.js';
import Ground from './ground.js';
import RapierDebuger from './rapierDebugger.js';

await RAPIER.init();

let gravity = { x: 0.0, y: -9.81, z: 0.0 };
window.world = new RAPIER.World(gravity);

window.scene = new THREE.Scene();

const elementsToListen = [];

const ground = new Ground();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvasElement = renderer.domElement;

const skyColor = 0xFFFFFF;
const groundColor = 0x101010;
const light = new THREE.HemisphereLight(skyColor, groundColor, 1);
window.scene.add(light);

document.body.appendChild(canvasElement);

window.raycaster = new Raycaster(camera, canvasElement)

const orbitControls = new OrbitControls(camera, canvasElement);
let isOrbiting = false;
orbitControls.addEventListener('start', () => { isOrbiting = true });
orbitControls.addEventListener('end', () => { isOrbiting = false });

canvasElement.addEventListener('mousemove', (event) => {
  const selectedElement = window.raycaster.getPointedElement()?.object;
  if (!isOrbiting)
    orbitControls.enabled = !Boolean(selectedElement);
})

const cardHeight = cardBoundingBox.max.y;

function randOffset() {
  return 0.5 - Math.random();
}

const flipQuarternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
const cardValues = [
  'On a scale of 1 to 10, why is there so much dust on the binders?',
  'On a scale of 100 to 100, how much do you like Paz?',
  'How much money would you pay to have this deck-app on your phone?',
  'On a scale of 0 to 100, how much do you think this deck-app improves the Fun Facts experiance?'
]

const deck = await Promise.all(cardValues.map(async (cardValue, index) => {
  const card = await Card.Create(cardValue);
  card.rigidBody.setTranslation({ x: randOffset() / 10, y: (index + 1) * cardHeight, z: randOffset() / 10 });
  const randQuarternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), randOffset() / 10);
  const rotationQuarternion = flipQuarternion.multiply(randQuarternion);
  card.rigidBody.setRotation(rotationQuarternion);
  card.setLocked(true);
  return card;
}));

async function drawCard() {
  if (!deck.length) {
    return;
  }

  const drawnCard = deck.pop();
  drawnCard.rigidBody.setRotation({ w: 1, x: 0, y: 0, z: 0.0 });
  drawnCard.setLocked(false);
}

elementsToListen.push(...deck);

let currentSelectedElement;

canvasElement.addEventListener('mousedown', (event) => {
  const intersection = window.raycaster.getPointedElement();
  const intersectedMesh = intersection?.object;
  const selectedElement = elementsToListen.find(element => element.mesh === intersectedMesh);

  if (selectedElement) {
    if (selectedElement === deck[deck.length - 1]) {
      drawCard();
    }

    selectedElement?.onClick?.(intersection.point);
    currentSelectedElement = selectedElement
  }
})
canvasElement.addEventListener('mousemove', (event) => {
  const groundIntersection = window.raycaster.getIntersectionWith(ground.mesh);
  currentSelectedElement?.onDrag?.(groundIntersection[0].point);
})
canvasElement.addEventListener('mouseup', (event) => {
  currentSelectedElement?.onRelease?.();
  currentSelectedElement = null;
})


// window.debugger = new RapierDebuger();

// // Feels like this should be on of the animation function, but it breaks the physics for some reason
// const clock = new THREE.Clock()
// let delta;
function animate() {
  requestAnimationFrame(animate);

  // delta = clock.getDelta();
  // window.world.timestep = delta;
  window.world.step();
  elementsToListen.forEach(element => element?.update());
  window.debugger?.update();
  renderer.render(window.scene, camera);
}
renderer.setAnimationLoop(animate);