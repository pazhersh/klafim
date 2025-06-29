import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import Ground from '../ElementComponents/Ground';
import { TestElementComponent } from '../ElementComponents/testElementComponent';
import { TestElementComponentWithPhysics } from '../ElementComponents/testElementComponentWithPhsycs';
import styles from './TableTopPage.module.css';
import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75);
camera.position.copy(new THREE.Vector3(0.0, 30.0, 100.0));

export default function TestPage() {
    return <div className={styles.container} >
        <Canvas camera={camera}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

            <Suspense fallback={<TestElementComponent />}>
                <Physics timeStep="vary">
                    <TestElementComponentWithPhysics />
                    <Ground />
                </Physics>
            </Suspense>
        </Canvas>
    </div>;
}