import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';

export class Card {
    constructor(scene, world) {
        const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
        const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        scene.add(this.mesh);

        const physicsDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 1.0, 0.0);
        const physicsShape = RAPIER.ColliderDesc.cuboid(1, 1, 1).setMass(1);
        this.physicsBody = world.createRigidBody(physicsDesc);
        world.createCollider(physicsShape, this.physicsBody);
    }


    update() {
        this.mesh.position.copy(this.physicsBody.translation());
        this.mesh.rotation.copy(this.physicsBody.rotation());
    }
}