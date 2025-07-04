import { useCallback, useRef, useState } from "react";
import { Deck as DeckData } from "../decksUtils";
import Card, { boundingBox } from "./Card";
import { ElementComponentProps, MeshProps } from "./types";
import * as THREE from 'three';
import { RapierRigidBody } from "@react-three/rapier";

type DeckProps = ElementComponentProps & {
    deck: DeckData;
    meshProps?: MeshProps,
}

const flipQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
const cardThickness = boundingBox.max.y;

function randOffset() {
    return (0.5 - Math.random()) / 10;
}

function getRandomRotation() {
    const randQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), randOffset());
    return new THREE.Euler().setFromQuaternion(flipQuaternion.multiply(randQuaternion));
}

export default function Deck({ meshProps, deck }: DeckProps) {
    const drawnCount = useRef(0); // Don't use state to not re-render
    const rigidBodyRefs = useRef<(RapierRigidBody | undefined)[]>([])

    const handleDraw = (index) => {
        if (index === deck.cardValues.length - 1 - drawnCount.current) {
            const rigidBody = rigidBodyRefs.current[index];
            rigidBody?.lockTranslations(false, false);
            rigidBody?.lockRotations(false, false);

            rigidBody?.setRotation({ w: 1, x: 0, y: 0, z: 0.0 }, true);

            drawnCount.current++;
        }
    }

    return <mesh {...meshProps}>
        {deck.cardValues.map((value, index) => (
            <Card
                key={value}
                value={value}
                rigidBodyProps={{
                    position: [randOffset(), (index + 1) * cardThickness, randOffset()],
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