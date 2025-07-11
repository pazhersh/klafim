import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Deck as DeckData } from '../decksUtils';

import Deck from '../Elements/Deck';
import TableScene from '../Elements/TableScene';
import styles from './TableTop.module.css';

// TODO: move to using useThree to set camera
const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, -2.0));
camera.lookAt(new THREE.Vector3(0, 0, 0));

type TableTopProps = {
    className?: string;
    decks: DeckData[];
}

export default function CanvasWrapper({ className, ...tableTopProps }: TableTopProps) {
    return <Canvas className={`${styles.canvas} ${className ?? ''}`} camera={camera} >
        <TableTop {...tableTopProps} />
    </Canvas>;
}

function TableTop({ decks }: TableTopProps) {
    return <TableScene>
        {decks.map((deck, index) =>
            <Deck key={deck.name} deck={deck} translation={[2 * index, 0, 0]} />
        )}
    </TableScene>;
}