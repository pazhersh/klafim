import { ThreeEvent } from "@react-three/fiber";
import { useContext, useEffect, useRef } from "react";
import { Mesh } from "three";
import HoldingContext from "./HoldingContext";

type HoldingPlainProps = {
    width: number,
    height: number,
}

export default function HoldingPlane({ width, height }: HoldingPlainProps) {
    const { setHoldingTarget, setHeldItem, holdingHeight } = useContext(HoldingContext);
    const meshRef = useRef<Mesh | null>(null);

    const hold = (event: ThreeEvent<MouseEvent>) => {
        setHoldingTarget(event.point);
    };

    const letGo = (event: ThreeEvent<MouseEvent>) => {
        setHoldingTarget(undefined);
        setHeldItem(undefined);
    };

    useEffect(() => {
        meshRef.current?.position.setY(holdingHeight);
        console.log(meshRef.current?.position);
    }, [holdingHeight]);

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