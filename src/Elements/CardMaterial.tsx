import { useLoader } from "@react-three/fiber";
import { CanvasTexture, MeshStandardMaterial, type Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { splitTextByMaxLength } from "../utils";

type CardMaterialProp = {
    backText?: string;
    frontText?: string;
};

export default function CardMaterial({ backText, frontText }: CardMaterialProp) {
    const cardGLTF = useLoader(GLTFLoader, '/public/card.glb');
    const gltfMesh = cardGLTF.scene.children[0] as Mesh; // not the cleanest but hey, it's just a side-project
    const gltfMaterial = gltfMesh.material as MeshStandardMaterial;
    const image = gltfMaterial.map?.isTexture && gltfMaterial.map.source.data

    const canvas = document.createElement('canvas');

    canvas.width = image?.width ?? 1024;
    canvas.height = image?.height ?? 1024;
    const context = canvas.getContext('2d')!;

    if (image)
        context.drawImage(image, 0, 0, image.width, image.height);


    if (frontText) {
        // top-left: 123, 277
        // width-height: 312, 480
        const lineHeight = 42;
        context.font = `${lineHeight}px serif`;
        context.fillStyle = 'black';
        const lines = splitTextByMaxLength(frontText, 10);
        lines.forEach((line, index) => {
            context.fillText(line, 123, 277 + (lineHeight * (index + 1)), 480);
        });
    }

    if (backText) {
        // top-left: 635, 277
        // width-height: 312, 480
        const lineHeight = 42;
        context.font = `${lineHeight}px serif`;
        context.fillStyle = 'blue';
        const lines = splitTextByMaxLength(backText, 10);
        lines.forEach((line, index) => {
            context.fillText(line, 635, 277 + (lineHeight * (index + 1)), 480);
        });
    }

    const texture = new CanvasTexture(canvas);
    texture.flipY = false;

    return <meshStandardMaterial {...gltfMaterial} map={texture} />
}