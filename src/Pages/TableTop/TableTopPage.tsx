import { useMemo, useState } from 'react';
import NavBar from '../../Components/NavBar';
import type { Deck } from '../../useDecksStore';
import useDecksStore from '../../useDecksStore';
import styles from './TableTopPage.module.css';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { useSearchParams } from 'react-router';
import DeckElement from '../../Elements/Deck';
import TableScene from '../../Elements/TableScene';
import DecksPicker from './DecksPicker';
import NotFound from '../../Components/NotFound';

// TODO: move to using useThree to set camera
const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, -2.0));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const DECKS_SEARCH_PARAM = 'decks';
const SHOULD_SHUFFLE_SEARCH_PARAM = 'shuffle';

export default function TableTopPage() {
    const { decks } = useDecksStore();
    const [serachParams, setSearchParams] = useSearchParams();
    const {selectedDecks, notFoundDeckIds} = useMemo(() => {
        const ids = serachParams.getAll(DECKS_SEARCH_PARAM);
        return ids.reduce(({selectedDecks, notFoundDeckIds}, id) => {
            const deck = decks.get(id);
            if (deck) {
                selectedDecks.push(deck);
            } else {
                notFoundDeckIds.push(id);
            }
            return {selectedDecks, notFoundDeckIds};
        }, {selectedDecks: [] as Deck[], notFoundDeckIds: [] as string[]});
    }, [serachParams]);
    
    const shouldShuffle = useMemo(() => serachParams.has(SHOULD_SHUFFLE_SEARCH_PARAM), [serachParams]);
    const setShouldShuffle = (value:boolean) => {
        setSearchParams(currentParams => {
            if (value){
                currentParams.set(SHOULD_SHUFFLE_SEARCH_PARAM, '');
            }
            else {
                currentParams.delete(SHOULD_SHUFFLE_SEARCH_PARAM);
            }
            return currentParams
        })
    };

    return (!selectedDecks.length || notFoundDeckIds.length) ?
        (<div className={styles.clickable}>
            <NavBar />

            { notFoundDeckIds 
                ? <NotFound resourceType='decks' resources={notFoundDeckIds}/> 
                : null
            }

            <h1>Choose your decks</h1>

            <input
                type='checkbox'
                checked={shouldShuffle}
                onChange={(event) => setShouldShuffle(event.target.checked)}
            />
            shuffle 'em

            <DecksPicker
                decks={decks}
                onSelect={(ids) => setSearchParams(currentParams => {
                    currentParams.delete(DECKS_SEARCH_PARAM);
                    ids.forEach(id => currentParams.append(DECKS_SEARCH_PARAM, id));
                    return currentParams;
                })}
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