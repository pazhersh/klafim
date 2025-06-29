import { ThreeElements } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export type ElementComponentProps = {
    meshProps?: ThreeElements['mesh'],
    rigidBodyProps?: React.ComponentProps<typeof RigidBody>

}