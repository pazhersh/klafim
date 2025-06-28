import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';
import useLightSource from '../useThree/useLightSource';
import Ground from '../elements/ground';
import Card from '../elements/card';
import * as THREE from 'three';
import { Element } from '../elements/types';

const flipQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);

export default function TableTopPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [elements, setElements] = useState<Element[]>([]);

    const onAnimate = () => {
        if (elements.length) {
            console.log('here', elements);
            elements.forEach((element) => element.update?.());
        }
    }

    const { scene, world, camera } = useThree({ canvasRef, onAnimate });
    const isLoaded = useMemo(() => (world && scene), [world, scene]);
    const controls = useOrbitControls({ camera, canvasElement: canvasRef.current });
    useLightSource({ scene });

    useEffect(() => {
        const initElements = async () => {
            const ground = new Ground(scene, world);

            const card = await Card.Create(scene, world, 'asdf');
            card.rigidBody.setTranslation(0, 100, 100);
            card.rigidBody.setRotation(flipQuaternion);
            card.setLocked(true);

            console.log('set', [ground, card]);
            setElements([ground, card]);
        }

        if (isLoaded) {
            initElements();
        }
    }, [isLoaded, setElements])

    return <div className={styles.container} >
        <canvas ref={canvasRef} />
    </div>;
}