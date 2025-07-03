import { Deck as DeckData } from "../decksUtils";
import Card, { boundingBox } from "./Card";
import { ElementComponentProps, MeshProps } from "./types";
import * as THREE from 'three';

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
    return <mesh {...meshProps}>
        {deck.cardValues.map((value, index) => (
            <Card
                key={value}
                value={value}
                rigidBodyProps={{
                    position: [randOffset(), (index + 1) * cardThickness, randOffset()],
                    rotation: getRandomRotation(),
                    lockTranslations: true,
                    lockRotations: true
                }}
            />
        ))}
    </mesh>;
}