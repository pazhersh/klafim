import { useState } from 'react';
import NavBar from '../../Components/NavBar';
import type { Deck } from '../../useDecksStore';
import useDecksStore from '../../useDecksStore';
import styles from './TableTopPage.module.css';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import DeckElement from '../../Elements/Deck';
import TableScene from '../../Elements/TableScene';
import DecksPicker from './DecksPicker';

// TODO: move to using useThree to set camera
const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, -2.0));
camera.lookAt(new THREE.Vector3(0, 0, 0));

export default function TableTopPage() {
    const { decks } = useDecksStore();
    const [selectedDecks, setSelectedDecks] = useState<Deck[]>([]);
    const [shouldShuffle, setShouldShuffle] = useState(true);

    return !selectedDecks.length ?
        (<div className={styles.clickable}>
            <NavBar />

            <h1>Choose your decks</h1>

            <input
                type='checkbox'
                checked={shouldShuffle}
                onChange={(event) => setShouldShuffle(event.target.checked)}
            />
            shuffle 'em

            <DecksPicker
                decks={decks}
                onSelect={setSelectedDecks}
            />
        </div>)
        :
        (<div className={styles.container}>
            <div className={styles.overlay}>
                <NavBar />
            </div>
            <Canvas className={styles.canvas} camera={camera} >
                <TableScene>
                    {selectedDecks.map((deck, index) =>
                        <DeckElement
                            key={deck.name}
                            deck={deck}
                            translation={[2 * index, 0, 0]}
                            shuffle={shouldShuffle}
                            shouldWriteTitle={selectedDecks.length > 1}
                        />
                    )}
                </TableScene>
            </Canvas>
        </div>);
}