import { ThreeEvent } from "@react-three/fiber";
import { useContext, useEffect, useRef } from "react";
import { Mesh } from "three";
import HoldContext from "./HoldContext";

type HoldPlainProps = {
    width: number,
    height: number,
}

export default function HoldPlane({ width, height }: HoldPlainProps) {
    const { setHoldTarget, setHeldItem, holdHeight } = useContext(HoldContext);
    const meshRef = useRef<Mesh | null>(null);

    const hold = (event: ThreeEvent<MouseEvent>) => {
        setHoldTarget(event.point);
    };

    const letGo = (event: ThreeEvent<MouseEvent>) => {
        setHoldTarget(undefined);
        setHeldItem(undefined);
    };

    useEffect(() => {
        meshRef.current?.position.setY(holdHeight);
    }, [holdHeight]);

    return <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerMove={hold}
        onPointerUp={letGo}
        onPointerLeave={letGo}
    >
        <planeGeometry args={[width, height]} />
    </mesh>
}