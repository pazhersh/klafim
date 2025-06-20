import * as THREE from 'three';

export default class RapierDebuger {
    mesh
    enabled = true

    constructor() {
        this.mesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
        this.mesh.frustumCulled = false
        document.scene.add(this.mesh)
    }

    update() {
        if (this.enabled) {
            const { vertices, colors } = document.world.debugRender()
            this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
            this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
            this.mesh.visible = true
        } else {
            this.mesh.visible = false
        }
    }
}