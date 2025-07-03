import { ThreeElements } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export type MeshProps = ThreeElements['mesh'];

export type RigidBodyProps = React.ComponentProps<typeof RigidBody>;

export type ElementComponentProps = {
    meshProps?: MeshProps,
    rigidBodyProps?: RigidBodyProps
}