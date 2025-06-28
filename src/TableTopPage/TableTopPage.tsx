import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './TableTopPage.module.css';
import useThree from '../useThree/useThree';
import useOrbitControls from '../useThree/useOrbitControls';
import useLightSource from '../useThree/useLightSource';
import Ground from '../elements/ground';
import * as THREE from 'three';
import { Element } from '../elements/types';
import useCardDeck from '../elements/useCardDeck';

export default function TableTopPage() {
    const canvasRef = useRef<HTMLCanvasElement>(undefined);
    const [elements, setElements] = useState<Element[]>([]);

    const onAnimate = useCallback(() => {
        elements.forEach((element) => element.update?.());
    }, [elements]);

    const { scene, world, camera, raycaster } = useThree({ canvasRef, onAnimate });
    const controls = useOrbitControls({ camera, canvasElement: canvasRef.current });
    useLightSource({ scene });

    const hoverPlaneGeometry = new THREE.PlaneGeometry(100, 100).rotateX(Math.PI / 2 * -1);
    const hoverPlane = new THREE.Mesh(hoverPlaneGeometry);
    hoverPlane.visible = false;
    hoverPlane.position.setY(1);
    hoverPlane.name = 'hoverPlane';
    scene.add(hoverPlane);


    const deck = useMemo(() => ({ name: 'test', cardValues: ['1', '2', '3'] }), []);
    const { cards } = useCardDeck({
        world,
        scene,
        canvasElement: canvasRef.current,
        raycaster,
        deck,
        hoverAtMesh: hoverPlane
    });

    useEffect(() => {
        const initElements = async () => {
            const ground = new Ground(scene, world);
            setElements([ground, ...cards]);
        }

        if (world && scene && cards) {
            initElements();
        }
    }, [world, scene, cards])

    return <div className={styles.container} >
        <canvas ref={canvasRef} />
    </div>;
}