import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Image } from 'image-js';
import { useContext, useEffect, useMemo, useRef } from "react";
import { CanvasTexture, MeshBasicMaterial, MOUSE, Quaternion, Vector3, type Material, type Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { flipQuaternion, interpolate, splitTextByMaxLength } from "../utils";
import HoldingContext from "./HoldingContext";
import { ElementComponentProps } from "./types";

// TODO: load in advance (make a bootstrapper)
const gltfLoader = new GLTFLoader();
const cardGLTF = await gltfLoader.loadAsync('/assets/card.glb');
const gltfMesh = cardGLTF.scene.children[0] as Mesh; // not the cleanest but hey, it's just a side-project
const gltfMaterial = gltfMesh.material as Material;
const baseTexture = await Image.load('/assets/card.png');

export const boundingBox = gltfMesh.geometry.boundingBox!.clone();

type CardProps = ElementComponentProps & {
    value?: string;
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
    value
}: CardProps) {
    const { holdingTarget, setHeldItem, heldItem, setHoldingHeight } = useContext(HoldingContext);
    const { camera } = useThree();

    const rigidBodyRef = useRef<RapierRigidBody>(null);

    const mesh = useMemo(() => {
        const clonedMesh = gltfMesh.clone();
        clonedMesh.material = gltfMaterial.clone();
        return clonedMesh;
    }, []);

    useEffect(() => {
        if (value && mesh) {
            // TODO: move to Material tsx
            const canvas = baseTexture.getCanvas();
            const context = canvas.getContext('2d')!;

            // top-left: 123, 277
            // width-height: 312, 480
            const lineHeight = 42;
            context.font = `${lineHeight}px serif`;
            const lines = splitTextByMaxLength(value, 10);

            lines.forEach((line, index) => {
                context.fillText(line, 123, 277 + (lineHeight * (index + 1)), 480);
            })

            const texture = new CanvasTexture(canvas);
            texture.flipY = false;
            (mesh.material as MeshBasicMaterial).map = texture;
        }
    }, [value, mesh]);

    useFrame(() => {
        if (rigidBodyRef.current && holdingTarget?.current && heldItem === rigidBodyRef.current) {
            const movementVector = holdingTarget?.current.clone().sub(rigidBodyRef.current.translation());
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

        const holdingHeight = Math.min(
            Math.max(
                interpolate(event.point.y, camera.position.y, 0.3) ?? event.point.y,
                event.point.y + 0.2
            ),
            camera.position.y
        );
        setHoldingHeight(holdingHeight);

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
            object={mesh}
        />
    </RigidBody>;
}