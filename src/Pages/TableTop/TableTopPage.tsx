import { useMemo } from 'react';
import NavBar from '../../Components/NavBar';
import { Deck as DeckData, loadDecks } from '../../decksUtils';
import styles from './TableTopPage.module.css';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import TableScene from '../../Elements/TableScene';
import Deck from '../../Elements/Deck';
import TableTop from '../../Elements/TableTop';


// TODO: move to using useThree to set camera
const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, -2.0));
camera.lookAt(new THREE.Vector3(0, 0, 0));

export default function TableTopPage() {
    const decks = useMemo<DeckData[]>(() => Array.from(loadDecks().values()), []);

    return <div className={styles.container}>
        <div className={styles.overlay}>
            <NavBar />
        </div>
        <Canvas className={styles.canvas} camera={camera} >
            <TableScene>
                <TableTop>

                    {decks.map((deck, index) =>
                        <Deck key={deck.name} deck={deck} translation={[2 * index, 0, 0]} />
                    )}

                </TableTop>
            </TableScene>
        </Canvas>
    </div>;
}
