import { useEffect, useRef } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';
import useLightSource from '../useThree/useLightSource';
import Ground from '../elements/ground';
import Card from '../elements/card';

export default function TableTopPage() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { scene, world, camera, canvasElement, addElement } = useThree({ containerRef });
    const controls = useOrbitControls({ camera, canvasElement });
    useLightSource({ scene });

    useEffect(() => {
        const initElements = async () => {
            addElement(new Ground(scene, world));
            addElement(await Card.Create(scene, world, 'asdf'));
        }

        if (scene && world) {
            initElements();
        }
    }, [scene, world])

    return <div ref={containerRef} className={styles.container} />;
}