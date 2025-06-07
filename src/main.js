import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

import { Raycaster } from './raycaster.js';

import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';

await RAPIER.init();

// Use the RAPIER module here.
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
let world = new RAPIER.World(gravity);

// Create the ground
const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0))
const groundShape = RAPIER.ColliderDesc.cuboid(50, 0.5, 50)
world.createCollider(groundShape, groundBody)



const rapierDebug = world.debugRender();



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvasElement = renderer.domElement;

const loader = new GLTFLoader();
const deckGLTF = await loader.loadAsync('/assets/deck.glb');

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const deck = deckGLTF.scene.children[0]; // not the cleanest but hey, it's just a side-project
const cards = [];

const sceneObjects = [deck];

scene.add(...sceneObjects);

const skyColor = 0xFFFFFF;
const groundColor = 0x101010;
const light = new THREE.HemisphereLight(skyColor, groundColor, 1);
scene.add(light);

document.body.appendChild(canvasElement);

const raycaster = new Raycaster(camera, sceneObjects, canvasElement)

const orbitControls = new OrbitControls(camera, canvasElement);
let isOrbiting = false;
orbitControls.addEventListener('start', () => { isOrbiting = true });
orbitControls.addEventListener('end', () => { isOrbiting = false });
canvasElement.addEventListener('mousemove', (event) => {
  const selectedElement = raycaster.getPointedElement(event)?.object;
  if (!isOrbiting)
    orbitControls.enabled = !Boolean(selectedElement);
})

const dragControls = new DragControls(cards, camera, canvasElement);

function addCard(position) {
  const cardGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cardMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const card = new THREE.Mesh(cardGeometry, cardMaterial);
  // card.position.set(position ?? new THREE.Vector3(0, 0, 0));

  scene.add(card);
  sceneObjects.push(card);
  cards.push(card);

  dragControls.update();

  return card;
}

canvasElement.addEventListener('mousedown', (event) => {
  const intersection = raycaster.getPointedElement(event);
  const selectedElement = intersection?.object;

  if (selectedElement === deck) {
    const newCard = addCard(intersection.position);
    console.log(newCard);
  }
})


const debugMesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 'lime' }));
debugMesh.frustrumCulled = false;
debugMesh.geometry.setAttribute('position', new THREE.BufferAttribute(rapierDebug.vertices, 3));
debugMesh.visible = true;
scene.add(debugMesh);

const elementGeometry = new THREE.BoxGeometry(1, 1, 1);
const elementMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });

const elementBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 1.0, 0.0);
const elementBody = world.createRigidBody(elementBodyDesc);
const elementBodyShape = RAPIER.ColliderDesc.cuboid(1, 1, 1).setMass(1);
world.createCollider(elementBodyShape, elementBody);


const element = {
  physicsBody: elementBody,
  mesh: new THREE.Mesh(elementGeometry, elementMaterial)
}

scene.add(element.mesh);



function updateElement() {
  element.mesh.position.copy(element.physicsBody.translation());
  element.mesh.rotation.copy(element.physicsBody.rotation());
}

const clock = new THREE.Clock()
let delta;

function animate() {
  requestAnimationFrame(animate);

  delta = clock.getDelta();
  world.timestep = delta;
  world.step();

  renderer.render(scene, camera);
  updateElement();
}
renderer.setAnimationLoop(animate);
