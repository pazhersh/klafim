import { Canvas } from "@react-three/fiber";
import * as THREE from 'three';

import { Deck as DeckData } from "../../useDecksStore";
import Deck from '../../Elements/Deck';
import TableScene from '../../Elements/TableScene';
import { useMemo } from "react";
import styles from './DeckPreview.module.css';

type DeckPreviewProps = {
    deck: DeckData;
}


export default function DeckPreview({ deck }: DeckPreviewProps) {
    const camera = useMemo(() => {
        const camera = new THREE.PerspectiveCamera(75);
        camera.position.copy(new THREE.Vector3(0.0, 2, -2.0));
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera
    }, [])

    return <div className={styles.container}>
        <Canvas camera={camera}>
            <TableScene>
                <Deck deck={deck} />
            </TableScene>
        </Canvas>;
    </div>
}