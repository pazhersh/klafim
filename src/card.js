import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cardGLTF = await loader.loadAsync('/assets/deck.glb');
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

    hover(targetPosition) {
        const position = this.rigidBody.translation();
        const movementForce = targetPosition.clone()
            .sub(position)
            .divideScalar(100);

        const velocity = this.rigidBody.linvel();
        const velocityVector = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
        // const dragForce = 1/2 * density * velocity^2 * Drag coefficient * cross sectional area
        const dragForce =
            velocityVector.clone().multiply(velocityVector) // velocity squeared
                .divideScalar(2)
                .multiplyScalar(Math.pow(targetPosition.distanceTo(position), -1)) // density
                .multiplyScalar(1) // Drag coefficient
                .multiplyScalar(1) // cross sectional area
                .multiplyScalar(-1) // against the movement direction
            ;

        const totalForce = velocityVector.clone().add(movementForce);
        // console.log(force, dragVector);
        this.rigidBody.resetForces(true);
        this.rigidBody.addForce(movementForce, true);
        this.rigidBody.addForce(dragForce, true);
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