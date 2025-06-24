import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Raycaster } from './raycaster.js';

import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import Card, { boundingBox as cardBoundingBox } from './card.js';
import Ground from './ground.js';
import RapierDebuger from './rapierDebugger.js';
import { bounce, debounce } from './utils.js';

await RAPIER.init();

let gravity = { x: 0.0, y: -9.81, z: 0.0 };
window.world = new RAPIER.World(gravity);

window.scene = new THREE.Scene();

const elementsToListen = [];

const ground = new Ground();

const hoverPlaneGeometry = new THREE.PlaneGeometry(100, 100).rotateX(Math.PI / 2 * -1);
const hoverPlane = new THREE.Mesh(hoverPlaneGeometry);
hoverPlane.visible = false;
hoverPlane.position.setY(1);
hoverPlane.name = 'hoverPlane';
window.scene.add(hoverPlane);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(new THREE.Vector3(0.0, 4.0, 4.0));

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
orbitControls.mouseButtons.LEFT = undefined;
orbitControls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
orbitControls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

const cardHeight = cardBoundingBox.max.y;

function randOffset() {
  return (0.5 - Math.random()) / 10;
}

const flipQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
const cardValues = [
  'On a scale of 1 to 10, why is there so much dust on the blinds?',
  'On a scale of 90 to 100, how much do you like Paz?',
  'How much money would you pay to have this deck-app on your phone?',
  'On a scale of 0 to 100, how much do you think this deck-app improves the Fun Facts experiance?'
]

const deck = await Promise.all(cardValues.map(async (cardValue, index) => {
  const card = await Card.Create(cardValue);
  card.rigidBody.setTranslation({ x: randOffset(), y: (index + 1) * cardHeight, z: randOffset() });
  const randQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), randOffset());
  const rotationQuarternion = flipQuaternion.multiply(randQuaternion);
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
  if (event.button !== THREE.MOUSE.LEFT)
    return;

  const intersection = window.raycaster.getPointedElement();
  const intersectedMesh = intersection?.object;
  const selectedElement = elementsToListen.find(element => element.mesh === intersectedMesh);

  if (selectedElement) {
    if (selectedElement === deck.at(-1)) {
      drawCard();
    }

    debounce(
      () => selectedElement?.onClick?.(intersection.point),
      ['mousedown', selectedElement]
    )
    currentSelectedElement = selectedElement
  }
})
canvasElement.addEventListener('mousemove', (event) => {
  const hoverPlaneIntersection = window.raycaster.getIntersectionWith(hoverPlane);
  debounce(
    () => currentSelectedElement?.onDrag?.(hoverPlaneIntersection[0].point),
    ['mousemove', currentSelectedElement]
  );
})

canvasElement.addEventListener('mouseup', (event) => {
  debounce(() => {
    currentSelectedElement?.onRelease?.();
    currentSelectedElement = null;
  }, ['mouseup', currentSelectedElement]);
})


const testers = document.querySelectorAll('.tester');
testers[0].addEventListener('click', () => {
  console.log(JSON.stringify(camera.quaternion));
  console.log(JSON.stringify(camera.position));
});
testers[1].addEventListener('click', () => {
})

// window.debugger = new RapierDebuger();

const clock = new THREE.Clock()
let delta;
function animate() {
  requestAnimationFrame(animate);

  delta = clock.getDelta();
  // // Feels like this should be on of the animation function, but it breaks the physics for some reason
  // window.world.timestep = delta;
  window.world.step();
  bounce();
  elementsToListen.forEach(element => element?.update());
  window.debugger?.update();
  renderer.render(window.scene, camera);
}
renderer.setAnimationLoop(animate);