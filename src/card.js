import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Image } from 'image-js';

const loader = new GLTFLoader();
const cardGLTF = await loader.loadAsync('/assets/card.glb');
const cardMesh = cardGLTF.scene.children[0]; // not the cleanest but hey, it's just a side-project
export const boundingBox = cardMesh.geometry.boundingBox.clone();

export default class Card {
    wasClicked = false;
    targetMovement = new THREE.Vector3();
    mesh;
    rigidBody;

    constructor() {
        this.mesh = cardMesh.clone();
        window.scene.add(this.mesh);

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic();

        this.rigidBody = window.world.createRigidBody(rigidBodyDesc);
        const points = this.mesh.geometry.attributes.position.array;
        const colliderDesc = RAPIER.ColliderDesc
            .convexHull(points)
            .setDensity(1.0);
        window.world.createCollider(colliderDesc, this.rigidBody);
    }

    static async Create(text) {
        const card = new Card();
        if (text) {
            await card.writeText(text);
        }

        return card;
    }

    async writeText(text) {
        const image = await Image.load('/assets/card.png');
        const canvas = image.getCanvas();
        const context = canvas.getContext('2d');

        // top-left: 123, 277
        // width-height: 312, 480
        context.font = "72px serif";
        const words = text.split(' ');
        const lines = words.reduce((allLines, currentWord) => {
            if (allLines[allLines.length - 1].length + 1 + currentWord.length > 10) {
                allLines.push(currentWord);
                return allLines;
            }

            allLines[allLines.length - 1] += ` ${currentWord}`;
            return allLines;
        }, ['']);

        const lineHeight = 72;
        lines.forEach((line, index) => {
            context.fillText(line, 123, 277 + (lineHeight * index), 480);
        })

        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        this.mesh.material.map = texture;
    }

    hover(targetPosition) {
        const position = this.rigidBody.translation();
        const movementForce = targetPosition.clone()
            .sub(position)
            .clampLength(0, 0.01);

        const velocity = this.rigidBody.linvel();
        const velocityVector = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
        // const dragForce = 1/2 * density * velocity^2 * Drag coefficient * cross sectional area
        const dragForce =
            velocityVector.clone().multiply(velocityVector) // velocity squeared
                .divideScalar(2)
                // .multiplyScalar(Math.pow(targetPosition.distanceTo(position), -1))
                .multiplyScalar(1) // Density
                .multiplyScalar(1) // Drag coefficient
                .multiplyScalar(1) // cross sectional area
                .multiplyScalar(-1) // against the movement direction
            ;

        // function isInvalid(number) {
        //     return !number || number === Infinity || number === -Infinity
        // }
        // function isInvalidVector({ x, y, z }) {
        //     return isInvalid(x) && isInvalid(y) && isInvalid(z);
        // }

        // if (isInvalidVector(movementForce)) {
        //     movementForce.copy({ x: 0, y: 0, z: 0 })
        //     dragForce.copy({ x: 0, y: 0, z: 0 })
        // }
        // if (isInvalidVector(dragForce)) {
        //     dragForce.copy({ x: 0, y: 0, z: 0 })
        // }

        const totalForce = velocityVector.clone().add(movementForce);
        this.rigidBody.resetForces(true);
        this.rigidBody.addForce(movementForce, true);
        // this.rigidBody.addForce(dragForce, true);
        console.log(movementForce, dragForce);
        // this.rigidBody.addForce(totalForce, true);
    }

    update() {
        this.mesh.position.copy(this.rigidBody.translation());
        const rotation = this.rigidBody.rotation();
        this.mesh.setRotationFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
        if (this.wasClicked)
            this.hover(this.targetMovement);
    }

    onClick(position) {
        // const force = this.mesh.position.clone().sub(position).normalize().divideScalar(-2);
        // this.rigidBody.addForce(new RAPIER.Vector3(force.x, force.y, force.z), true);

        this.rigidBody.setGravityScale(0);
        this.wasClicked = true;

        const bodyPosition = this.rigidBody.translation();
        this.targetMovement = new THREE.Vector3(bodyPosition.x, bodyPosition.y + 1, bodyPosition.z + 3)

        // this.rigidBody.applyImpulse(new RAPIER.Vector3(0, 0, 1), true);
        // setTimeout(() => {
        //     this.rigidBody.applyImpulse(new RAPIER.Vector3(0, 0, -2), true);
        // }, 250);
    }
    onDrag(position) {
        this.targetMovement.copy(position).setY(1);
    }
    onRelease(position) {
        this.wasClicked = false
        this.rigidBody.setGravityScale(1);
    }
    setLocked(lock) {
        this.rigidBody.lockRotations(lock);
        this.rigidBody.lockTranslations(lock);
    }
}