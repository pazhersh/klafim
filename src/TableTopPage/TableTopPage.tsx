import { useEffect, useRef } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';
import useLightSource from '../useThree/useLightSource';
import Ground from '../elements/ground';
import Card from '../elements/card';
import * as THREE from 'three';

const flipQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);

export default function TableTopPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { scene, world, camera, addElement } = useThree({ containerRef: canvasRef });
    const controls = useOrbitControls({ camera, canvasElement: canvasRef.current });
    useLightSource({ scene });

    useEffect(() => {
        const initElements = async () => {
            addElement(new Ground(scene, world));
            const card = new Card(scene, world);
            // const card = await Card.Create(scene, world, 'asdf');
            // card.rigidBody.setTranslation(0, 100, 100);
            // card.rigidBody.setRotation(flipQuaternion);
            card.setLocked(true);
            addElement(card);
        }

        if (scene && world) {
            initElements();
        }
    }, [scene, world])

    return <div className={styles.container} >
        <canvas ref={canvasRef} />
    </div>;
}