import { Canvas } from "@react-three/fiber";
import * as THREE from 'three';

import { Deck as DeckData } from "../useDecksStore";
import Deck from '../Elements/Deck';
import TableScene from '../Elements/TableScene';

type DeckPreviewProps = {
    deck: DeckData;
}

// TODO: move to using useThree to set camera
const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 3.0, -2.0));
camera.lookAt(new THREE.Vector3(0, 0, 0));

export default function DeckPreview({ deck }: DeckPreviewProps) {
    return <Canvas camera={camera}>
        <TableScene>
            <Deck deck={deck} />
        </TableScene>
    </Canvas>;
}