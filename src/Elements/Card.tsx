import { ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useCallback, useMemo, useRef } from "react";
import { MOUSE, Quaternion, Vector3, type Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { flipQuaternion } from "../utils";
import CardMaterial from "./CardMaterial";
import { ElementComponentProps } from "./types";

export type CardRigidBodyUserData = {
    disabled?: boolean;
}

type CardProps = ElementComponentProps & {
    backText?: string;
    frontText?: string;
    disabled?: boolean;
}

const HOLD_HEIGHT = 2;

export default function Card({
    rigidBodyProps: {
        ref: propsRigidBodyRef,
        ...rigidBodyProps
    } = {},
    meshProps: {
        onPointerDown,
        onPointerUp,
        ...meshProps
    } = {},
    frontText,
    backText,
    disabled,
}: CardProps) {
    const isHolding = useRef(false);
    const projectedClickZ = useRef<number>(0);
    const clickPosition = useRef<Vector3 | undefined>(undefined);

    const rigidBodyRef = useRef<RapierRigidBody>(null);

    const gltf = useLoader(GLTFLoader, '/assets/card.glb');
    const gltfMesh = useMemo(
        // not the cleanest but hey, it's just a side-project
        () => gltf.scene.children[0].clone() as Mesh,
        [gltf]
    );

    useFrame((state) => {
        if (rigidBodyRef.current && isHolding.current && projectedClickZ.current && clickPosition.current) {
            const target = new Vector3(state.pointer.x, state.pointer.y, projectedClickZ.current)
                .unproject(state.camera)
                .projectOnPlane(new Vector3(0, 1, 0))
                .add({ x: 0, y: clickPosition.current.y + HOLD_HEIGHT, z: 0 });

            const movementVector = new Vector3().subVectors(target, rigidBodyRef.current.translation());
            if (movementVector.length() < 0.5) {
                rigidBodyRef.current.resetForces(true);
            }
            else {
                const movementForce = movementVector
                    .divide({
                        x: 5 - Math.min(movementVector.length(), 4.9),
                        y: 5 - Math.min(movementVector.length(), 4.9),
                        z: 4 - Math.min(movementVector.length(), 2.5)
                    });
                rigidBodyRef.current?.rotation()
                rigidBodyRef.current.resetForces(true);
                rigidBodyRef.current.addForce(movementForce, true);
            }
        }
        else {
            rigidBodyRef.current?.resetForces(true);
        }
    });

    const onMouseDown = useCallback((event: ThreeEvent<PointerEvent>) => {
        if (event.button !== MOUSE.LEFT || (rigidBodyRef.current?.userData as CardRigidBodyUserData)?.disabled) {
            return;
        }

        (onPointerDown as (event: ThreeEvent<PointerEvent>) => void | undefined)?.(event);

        event.stopPropagation();

        // Start dragging it
        clickPosition.current = event.point.clone();
        projectedClickZ.current = event.point.clone().project(event.camera).z;
        isHolding.current = true;

        if (event.target && 'setPointerCapture' in event.target && typeof event.target.setPointerCapture === 'function') {
            event.target?.setPointerCapture(event.pointerId);
        }

        // Flip card if it's upside down
        const quaternion = rigidBodyRef.current && new Quaternion().copy(rigidBodyRef.current.rotation());
        const downwards = new Quaternion().setFromAxisAngle(new Vector3(0, 0, Math.PI / 2), -90);
        if (quaternion && (quaternion?.angleTo(downwards) < (Math.PI / 2))) {
            rigidBodyRef.current?.setRotation(quaternion.multiply(flipQuaternion), true);
        }
    }, [onPointerDown, rigidBodyRef])
    const onMouseUp = useCallback((event: ThreeEvent<PointerEvent>) => {
        isHolding.current = false;

        if (event.target && 'releasePointerCapture' in event.target && typeof event.target.releasePointerCapture === 'function') {
            event.target?.releasePointerCapture(event.pointerId);
        }
    }, []);

    return <RigidBody
        ref={(rigidBody) => {
            rigidBodyRef.current = rigidBody;
            if (propsRigidBodyRef) {
                if (typeof propsRigidBodyRef === 'function')
                    propsRigidBodyRef(rigidBody);
                else {
                    propsRigidBodyRef.current = rigidBody
                }
            }
        }}
        colliders='cuboid'
        {...rigidBodyProps}
    >
        <primitive
            {...meshProps}
            onPointerDown={disabled ? undefined : onMouseDown}
            onPointerUp={onMouseUp}
            object={gltfMesh}
        >
            <CardMaterial frontText={frontText} backText={backText} />
        </primitive>
    </RigidBody>;
}