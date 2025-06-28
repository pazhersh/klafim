import * as THREE from 'three';
import { Element } from './types';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';

export default class Ground implements Element {
    mesh: THREE.Mesh;
    rigidBody: any;

    constructor(scene: THREE.Scene, world: any) {
        const meshGeometry = new THREE.BoxGeometry(100, 10, 100)
            .translate(0, -5, 0);
        const meshMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        scene.add(this.mesh);

        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();

        this.rigidBody = world.createRigidBody(rigidBodyDesc);
        const points = this.mesh.geometry.attributes.position.array;
        const colliderDesc = RAPIER.ColliderDesc
            .convexHull(points)
            .setDensity(1.0)
            .setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL);
        world.createCollider(colliderDesc, this.rigidBody);
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