import { Raycaster as ThreeRaycaster } from 'three';
import { getNormalizedPosition } from './utils.js'

export class Raycaster {
    constructor(camera, canvasElement) {
        this.caster = new ThreeRaycaster();
        this.camera = camera;
        this.canvasElement = canvasElement;
    }

    getElementsAtPosition({ x, y }) {
        const normalizedPosition = getNormalizedPosition({
            x,
            y,
            width: this.canvasElement.width,
            height: this.canvasElement.height
        });
        this.caster.setFromCamera(normalizedPosition, this.camera);
        const relevantMeshes = window.scene.children.filter(mesh => mesh !== window.debugger?.mesh);
        return this.caster.intersectObjects(relevantMeshes);
    }

    getPointedElement(event) {
        const { offsetX: x, offsetY: y } = event;
        const intersections = this.getElementsAtPosition({ x, y });

        if (!intersections.length) {
            return undefined;
        }

        const relevantIntersecttion = intersections.reduce((closestElement, currentElement) =>
            currentElement.distance < closestElement?.distance ? currentElement : closestElement
        );
        return relevantIntersecttion;
    }

    getIntersectionWith(mesh) {
        return this.caster.intersectObjects([mesh]);
    }
}