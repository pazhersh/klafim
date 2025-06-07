import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';

export class Card {
    constructor(scene, world) {
        const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
        const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        scene.add(this.mesh);

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 1.0, 0.0);

        this.rigidBody = world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(1.0, 1.0, 1.0);
        world.createCollider(colliderDesc, this.rigidBody);
    }


    update() {
        const position = this.rigidBody.translation();
        this.mesh.position.copy(new THREE.Vector3(position.x, position.y, position.z));
        const rotation = this.rigidBody.rotation();
        this.mesh.rotation.copy(new THREE.Euler(rotation.x, rotation.y, rotation.z));
    }
}