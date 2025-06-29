import { useLoader } from "@react-three/fiber";
import { ElementComponentProps } from "./types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { RigidBody } from "@react-three/rapier";
import { CanvasTexture, MeshBasicMaterial, type Material, type Mesh } from "three";
import { useEffect, useMemo } from "react";
import { Image } from 'image-js';
import { splitTextByMaxLength } from "../utils";

// TODO: load in advance (make a bootstrapper)
const gltfLoader = new GLTFLoader();
const cardGLTF = await gltfLoader.loadAsync('/assets/card.glb');
const cardMesh = cardGLTF.scene.children[0] as Mesh; // not the cleanest but hey, it's just a side-project
const cardMaterial = cardMesh.material as Material;
const cardTexture = await Image.load('/assets/card.png');

export const boundingBox = cardMesh.geometry.boundingBox!.clone();

type CardProps = ElementComponentProps & {
    value?: string;
}

export default function Card({ rigidBodyProps, meshProps, value }: CardProps) {
    const mesh2 = useMemo(() => {
        const clonedMesh = cardMesh.clone();
        clonedMesh.material = cardMaterial.clone();
        return clonedMesh;
    }, []);

    useEffect(() => {
        if (value && mesh2) {
            const canvas = cardTexture.getCanvas();
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
            (mesh2.material as MeshBasicMaterial).map = texture;
        }
    }, [value, mesh2]);

    return <RigidBody colliders='hull' {...rigidBodyProps}>
        <primitive {...meshProps} object={mesh2} />
    </RigidBody>;
}