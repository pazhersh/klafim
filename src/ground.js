import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';

export default class Ground {
    constructor() {
        const meshGeometry = new THREE.BoxGeometry(100, 100, 100)
            .translate(0, -50, 0);
        const meshMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        window.scene.add(this.mesh);

        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();

        this.rigidBody = window.world.createRigidBody(rigidBodyDesc);
        const points = this.mesh.geometry.attributes.position.array;
        const colliderDesc = RAPIER.ColliderDesc
            .convexHull(points)
            .setDensity(1.0)
            .setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL);
        window.world.createCollider(colliderDesc, this.rigidBody);
    }

    update() {
    }

    onClick(position) {
    }
    onDrag(position) {
    }
    onRelease(position) {
    }
}