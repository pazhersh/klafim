import { RigidBody } from "@react-three/rapier";
import { ElementComponentProps } from './types';
import { Vector3 } from "three";

const width = 100;
const height = 100;
const depth = 10;

export default function Ground({ meshProps, rigidBodyProps }: ElementComponentProps) {
    return <mesh {...meshProps} >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial color='#0000dd' />
        </mesh>
        <RigidBody type='fixed' {...rigidBodyProps}>
            <mesh position={[0, -depth / 2, 0]}>
                <boxGeometry args={[width, depth, height]} />
                <meshPhongMaterial opacity={0} transparent />
            </mesh>
        </RigidBody>
    </mesh>

};