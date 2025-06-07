import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';

export class Card {
    constructor() {
        const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
        const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        document.scene.add(this.mesh);

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 2.0, 0.0)
            .setRotation({ w: 1.0, x: 0.5, y: 0.5, z: 0.0 });

        this.rigidBody = document.world.createRigidBody(rigidBodyDesc);
        // const points = this.mesh.geometry.attributes.position.array;
        // const colliderDesc = RAPIER.ColliderDesc
        //     .convexHull(points)
        //     .setDensity(1.0);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(1.0, 1.0, 1.0);
        document.world.createCollider(colliderDesc, this.rigidBody);
    }


    update() {
        const position = this.rigidBody.translation();
        this.mesh.position.copy(new THREE.Vector3(position.x, position.y, position.z));
        const rotation = this.rigidBody.rotation();
        this.mesh.setRotationFromEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z));
    }

    onClick(position) {
        const force = this.mesh.position.clone().sub(position).normalize();
        this.rigidBody.addForce(new RAPIER.Vector3(force.x, force.y, force.z), true);
    }
}