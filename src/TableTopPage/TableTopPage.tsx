import { useEffect, useRef } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';

export default function TableTopPage() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { camera, canvasElement } = useThree();

    const controls = useOrbitControls({ camera, canvasElement });

    useEffect(() => {
        console.log(canvasElement)
        canvasElement && containerRef.current?.appendChild(canvasElement);
    }, [canvasElement]);

    return <div ref={containerRef} className={styles.container}>
        test
    </div>;
}