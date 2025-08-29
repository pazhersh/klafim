import { ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useContext, useMemo, useRef } from "react";
import { MOUSE, Quaternion, Vector3, type Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { flipQuaternion, interpolate } from "../utils";
import CardMaterial from "./CardMaterial";
import HoldContext from "./HoldContext";
import { ElementComponentProps } from "./types";

type CardProps = ElementComponentProps & {
    backText?: string;
    frontText?: string;
}

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
}: CardProps) {
    const { holdTarget, setHeldItem, heldItem, setHoldHeight } = useContext(HoldContext);
    const { camera } = useThree();

    const rigidBodyRef = useRef<RapierRigidBody>(null);

    const gltf = useLoader(GLTFLoader, '/public/card.glb');
    const gltfMesh = useMemo(
        // not the cleanest but hey, it's just a side-project
        () => gltf.scene.children[0].clone() as Mesh,
        [gltf]
    );

    useFrame(() => {
        if (rigidBodyRef.current && holdTarget?.current && heldItem === rigidBodyRef.current) {
            const movementVector = holdTarget?.current.clone().sub(rigidBodyRef.current.translation());
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

    const onMouseDown = (event: ThreeEvent<PointerEvent>) => {
        if (event.button !== MOUSE.LEFT) {
            return;
        }

        event.stopPropagation();

        const holdHeight = Math.min(
            Math.max(
                interpolate(event.point.y, camera.position.y, 0.3) ?? event.point.y,
                event.point.y + 0.2
            ),
            camera.position.y
        );
        setHoldHeight(holdHeight);

        // TODO: typing fix
        (onPointerDown as (event: ThreeEvent<PointerEvent>) => void | undefined)?.(event);
        rigidBodyRef.current && setHeldItem(rigidBodyRef.current);

        const quaternion = rigidBodyRef.current && new Quaternion().copy(rigidBodyRef.current.rotation());
        const downwards = new Quaternion().setFromAxisAngle(new Vector3(0, 0, Math.PI / 2), -90);

        if (quaternion && (quaternion?.angleTo(downwards) < (Math.PI / 2))) {
            rigidBodyRef.current?.setRotation(quaternion.multiply(flipQuaternion), true);
        }
    }

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
        colliders='hull'
        {...rigidBodyProps}
    >
        <primitive
            {...meshProps}
            onPointerDown={onMouseDown}
            object={gltfMesh}
        >
            <CardMaterial frontText={frontText} backText={backText} />
        </primitive>
    </RigidBody>;
}