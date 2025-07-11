import { useMemo } from 'react';
import styles from './TableTopPage.module.css';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import Deck from '../../Elements/Deck';
import TableScene from '../../Elements/TableScene';

// TODO: move to using useThree to set camera
const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, -2.0));
camera.lookAt(new THREE.Vector3(0, 0, 0));

export default function TableTopPage() {
    const { decks } = useDecksStore()
    const deckValues = useMemo(() => Array.from(decks.values()), [decks])

    return <div className={styles.container}>
        <div className={styles.overlay}>
            <NavBar />
        </div>
        <Canvas className={` ${styles.canvas}`} camera={camera} >
            <TableScene>
                {deckValues.map((deck, index) =>
                    <Deck key={deck.name} deck={deck} translation={[2 * index, 0, 0]} />
                )}
            </TableScene>
        </Canvas>
    </div>;
}