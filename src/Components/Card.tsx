import { ThreeEvent, useFrame, useLoader } from "@react-three/fiber";
import { ElementComponentProps } from "./types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { CanvasTexture, MeshBasicMaterial, MOUSE, Vector3, type Material, type Mesh } from "three";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Image } from 'image-js';
import { splitTextByMaxLength } from "../utils";
import HoldingContext from "./HoldingContext";

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
    const { holdingTarget, setHeldItem, heldItem } = useContext(HoldingContext);

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
                this.rigidBody.resetForces(true);
            }
            else {
                const movementForce = movementVector
                    .divideScalar(1.5)
                    .clampLength(0, 2);

                rigidBodyRef.current.resetForces(true);
                rigidBodyRef.current.addForce(movementForce, true);
            }
        }
        else {
            rigidBodyRef.current?.resetForces(true);
        }
    });

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
            onPointerDown={(event: ThreeEvent<PointerEvent>) => {
                if (event.button !== MOUSE.LEFT) {
                    return;
                }

                event.stopPropagation();
                // TODO: typing fix
                (onPointerDown as (event: ThreeEvent<PointerEvent>) => void | undefined)?.(event);
                console.log('down');
                rigidBodyRef.current && setHeldItem(rigidBodyRef.current);
            }}
            onPointerUp={(event: ThreeEvent<PointerEvent>) => {
                // event.stopPropagation();
                // // onPointerUp?.(event);
                // console.log('up');
                // setIsHeld(false);
            }}
            object={mesh}
        />
    </RigidBody>;
}