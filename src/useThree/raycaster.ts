import { Camera, Scene, Raycaster as ThreeRaycaster, Vector2 } from 'three';
import { getNormalizedPosition } from '../legacy/utils';

export class Raycaster {
    caster: ThreeRaycaster;
    camera: Camera;
    canvasElement: HTMLCanvasElement;
    scene: Scene;

    constructor(camera: Camera, canvasElement: HTMLCanvasElement, scene: Scene) {
        this.caster = new ThreeRaycaster();
        this.camera = camera;
        this.canvasElement = canvasElement;
        this.scene = scene;

        this.canvasElement.addEventListener('mousemove', (event) => {
            this.updatePointer(event);
        });
    }

    updatePointer(event) {
        const { offsetX: x, offsetY: y } = event;
        const normalizedPosition = getNormalizedPosition({
            x,
            y,
            width: this.canvasElement.width,
            height: this.canvasElement.height
        });
        this.caster.setFromCamera(normalizedPosition as Vector2, this.camera);
    }

    getPointedElements() {
        const relevantMeshes = this.scene.children.filter(mesh => mesh.name !== 'hoverPlane');
        return this.caster.intersectObjects(relevantMeshes);
    }

    getPointedElement() {
        const intersections = this.getPointedElements();

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