import { useEffect, useRef } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';
import useLightSource from '../useThree/useLightSource';

export default function TableTopPage() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { scene, camera, canvasElement } = useThree({ containerRef });
    const controls = useOrbitControls({ camera, canvasElement });
    useLightSource({ scene });

    return <div ref={containerRef} className={styles.container} />;
}