import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat/rapier.es.js';
import { ThreeElement, ThreeElements } from '@react-three/fiber';
import { RigidBody } from "@react-three/rapier";

const position = [0, -5, 0] as const;

export default function Ground(props: ThreeElements['mesh']) {
    return <RigidBody type='fixed'>
        <mesh position={position}>
            <boxGeometry args={[100, 10, 100]} />
            <meshBasicMaterial color='0x0000ff' />
        </mesh>
    </RigidBody>
};