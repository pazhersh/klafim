import { useContext } from "react"
import { MeshProps } from "./types"
import HoldingContext from "./HoldingContext";
import { ThreeEvent } from "@react-three/fiber";

type HoldingPlainProps = {
    width: number,
    height: number,
    meshProps?: MeshProps,
}

export default function HoldingPlane({ width, height, meshProps }: HoldingPlainProps) {
    const { setHoldingTarget, setHeldItem } = useContext(HoldingContext);

    const hold = (event: ThreeEvent<MouseEvent>) => {
        setHoldingTarget(event.point);
    };

    const letGo = (event: ThreeEvent<MouseEvent>) => {
        setHoldingTarget(undefined);
        setHeldItem(undefined);
    };

    return <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false} {...meshProps}
        onPointerMove={hold}
        onPointerUp={letGo}
        onPointerLeave={letGo}
    >
        <planeGeometry args={[width, height]} />
    </mesh>
}