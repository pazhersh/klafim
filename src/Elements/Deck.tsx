import { RapierRigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from 'three';
import { Deck as DeckData } from '../useDecksStore';
import { flipQuaternion } from "../utils";
import Card from "./Card";
import { ElementComponentProps } from "./types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

type DeckProps = ElementComponentProps & {
    deck: DeckData;
    shouldWriteTitle?: boolean;
    translation?: [number, number, number];
    shuffle?: boolean;
}

// TODO: figure out a different solution for the thickness calculation
const gltfLoader = new GLTFLoader();
const cardGLTF = await gltfLoader.loadAsync('/public/card.glb');
const gltfMesh = cardGLTF.scene.children[0] as THREE.Mesh; // not the cleanest but hey, it's just a side-project

const boundingBox = gltfMesh.geometry.boundingBox!.clone();
const cardThickness = boundingBox.max.y;

function randOffset() {
    return (0.5 - Math.random()) / 10;
}

function getRandomRotation() {
    const randQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), randOffset());
    return new THREE.Euler().setFromQuaternion(flipQuaternion.multiply(randQuaternion));
}

export default function Deck({
    translation: [translateX, translateY, translateZ] = [0, 0, 0],
    deck,
    shuffle,
    shouldWriteTitle,
}: DeckProps) {
    const drawnCount = useRef(0); // Don't use state to not re-render
    const rigidBodyRefs = useRef<(RapierRigidBody | undefined)[]>([])

    const cardValues = useMemo(() => {
        if (!shuffle) {
            return deck.cardValues;
        }

        const cards = [...deck.cardValues];
        for (let currentIndex = deck.cardValues.length - 1; currentIndex >= 0; currentIndex--) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]]
        }
        return cards;
    }, [deck, shuffle]);

    const handleDraw = (index) => {
        const rigidBody = rigidBodyRefs.current[index];
        if (rigidBody && index === cardValues.length - 1 - drawnCount.current) {
            rigidBody.lockTranslations(false, false);
            rigidBody.lockRotations(false, false);

            drawnCount.current++;
        }
    }

    return <mesh>
        {cardValues.map((value, index) => (
            <Card
                key={value}
                backText={shouldWriteTitle ? deck.name : undefined}
                frontText={value}
                rigidBodyProps={{
                    position: [randOffset() + translateX, (index + 1) * cardThickness + translateY, randOffset() + translateZ],
                    rotation: getRandomRotation(),
                    ref: ((rigidBody) => { rigidBodyRefs.current[index] = rigidBody ?? undefined }),
                    lockTranslations: true,
                    lockRotations: true
                }}
                meshProps={{
                    onPointerDown: (event) => {
                        if (event.button !== THREE.MOUSE.LEFT) {
                            return;
                        }

                        handleDraw(index);
                    }
                }}
            />
        ))}
    </mesh>;
}