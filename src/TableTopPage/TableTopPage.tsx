import { useEffect, useRef } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';
import useLightSource from '../useThree/useLightSource';
import Ground from '../elements/ground';

export default function TableTopPage() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { scene, world, camera, canvasElement, addElement } = useThree({ containerRef });
    const controls = useOrbitControls({ camera, canvasElement });
    useLightSource({ scene });

    useEffect(() => {
        if (scene && world) {
            addElement(new Ground(scene, world))
        }
    }, [scene, world])

    return <div ref={containerRef} className={styles.container} />;
}