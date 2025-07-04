import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Deck as DeckData } from '../decksUtils';
import Ground from './Ground';

import Deck from './Deck';
import HoldingContext from './HoldingContext';
import HoldingPlane from './HoldingPlane';
import OrbitControls from './OrbitControls';
import styles from './TableTop.module.css';

// TODO: move to using useThree to set camera
const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, -10.0));

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
    return <>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <OrbitControls />

        <Suspense
            fallback={<mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={'orange'} />
            </mesh>}
        >
            <HoldingContext.Provider>
                <Physics timeStep="vary">
                    {decks.map((deck, index) =>
                        <Deck key={deck.name} deck={deck} translation={[2 * index, 0, 0]} />
                    )}
                    <HoldingPlane width={100} height={100} meshProps={{ position: [0, 1, 0] }} />
                    <Ground meshProps={{ position: [0, 0, 0] }} />
                </Physics>
            </HoldingContext.Provider>
        </Suspense>
    </>;
}