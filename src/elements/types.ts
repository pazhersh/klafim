import type { Mesh, Vector3 } from "three";

export type Element = {
    rigidBody: any;
    mesh: Mesh;
    update?: () => void;
    onClick?: (position: Vector3) => void;
    onDrag?: (position: Vector3) => void;
    onRelease?: (position: Vector3) => void;
}