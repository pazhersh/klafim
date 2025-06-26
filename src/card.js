import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Image } from 'image-js';

const loader = new GLTFLoader();
const cardGLTF = await loader.loadAsync('/assets/card.glb');
const cardMesh = cardGLTF.scene.children[0]; // not the cleanest but hey, it's just a side-project
export const boundingBox = cardMesh.geometry.boundingBox.clone();

export default class Card {
    targetPosition;
    mesh;
    rigidBody;

    constructor() {
        this.mesh = cardMesh.clone();
        this.mesh.material = cardMesh.material.clone();
        window.scene.add(this.mesh);

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic();

        this.rigidBody = window.world.createRigidBody(rigidBodyDesc);
        const points = this.mesh.geometry.attributes.position.array;
        const colliderDesc = RAPIER.ColliderDesc
            .convexHull(points)
            .setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL)
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
        const lineHeight = 42;
        context.font = `${lineHeight}px serif`;
        const words = text.split(' ');
        const lines = words.reduce((allLines, currentWord) => {
            if (allLines[allLines.length - 1].length + 1 + currentWord.length > 10) {
                allLines.push(currentWord);
                return allLines;
            }

            allLines[allLines.length - 1] += ` ${currentWord}`;
            return allLines;
        }, ['']);

        lines.forEach((line, index) => {
            context.fillText(line, 123, 277 + (lineHeight * (index + 1)), 480);
        })

        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        this.mesh.material.map = texture;
    }

    hover(target) {
        const movementVector = target.clone().sub(this.rigidBody.translation());
        if (movementVector.length() < 0.5) {
            this.rigidBody.resetForces(true);
            return;
        }

        const movementForce = movementVector
            .clampLength(0, 1)
            .divideScalar(1000);

        this.rigidBody.resetForces(true);
        this.rigidBody.addForce(movementForce, true);
    }

    update() {
        const translation = this.rigidBody.translation()
        this.mesh.position.copy(new THREE.Vector3(translation.x, translation.y, translation.z));

        const rotation = this.rigidBody.rotation();
        this.mesh.setRotationFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));

        if (this.targetPosition) {
            this.hover(this.targetPosition);
        }
    }

    onClick(position) {
        this.rigidBody.setGravityScale(0);
        this.targetPosition = position.clone();
    }
    onDrag(position) {
        this.targetPosition = position.clone();
    }
    onRelease(position) {
        this.targetPosition = undefined;
        this.rigidBody.setGravityScale(1);
        this.rigidBody.wakeUp();
    }
    setLocked(lock) {
        this.rigidBody.lockRotations(lock);
        this.rigidBody.lockTranslations(lock);
    }
}