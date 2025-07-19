import { RigidBody } from "@react-three/rapier";
import { ElementComponentProps } from './types';
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const width = 100;
const height = 100;
const depth = 10;

export default function Table({ meshProps, rigidBodyProps }: ElementComponentProps) {
    const colorMap = useLoader(TextureLoader, '/public/IMG_20250719_141810.jpg')
    return <mesh {...meshProps} >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={colorMap} />
        </mesh>
        <RigidBody type='fixed' {...rigidBodyProps}>
            <mesh position={[0, -depth / 2, 0]}>
                <boxGeometry args={[width, depth, height]} />
                <meshPhongMaterial opacity={0} transparent />
            </mesh>
        </RigidBody>
    </mesh>
};