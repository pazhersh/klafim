import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import Ground from '../ElementComponents/Ground';
import styles from './TableTopPage.module.css';

import Card, { boundingBox } from '../ElementComponents/Card';
import OrbitControls from '../ElementComponents/OrbitControls';

const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 4.0, -10.0));

type CanvasWrapperProps = {
    children: React.ReactNode;
}
export default function CanvasWrapper({ children }: CanvasWrapperProps) {
    return <div className={styles.container} >
        <Canvas camera={camera} >
            <TestPage />
        </Canvas>
    </div>;
}

function TestPage() {
    return <>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <OrbitControls />

        <Suspense fallback={<div>loading...</div>}>
            <Physics timeStep="vary">
                <Card
                    value='test'
                    meshProps={{ position: [0, boundingBox.max.y, 0] }}
                    rigidBodyProps={{ lockTranslations: true, lockRotations: true }} />
                <Ground meshProps={{ position: [0, 0, 0] }} />
            </Physics>
        </Suspense>
    </>;
}