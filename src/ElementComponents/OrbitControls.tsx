import { extend, ThreeElement, useThree } from '@react-three/fiber'
import React from 'react'
import { MOUSE } from 'three'
import { OrbitControls as ThreeOrbitControls } from 'three-stdlib'

extend({ ThreeOrbitControls })

declare module '@react-three/fiber' {
    interface ThreeElements {
        orbitControls: ThreeElement<typeof ThreeOrbitControls>
    }
}

export default function OrbitControls(props: Partial<ThreeElement<typeof ThreeOrbitControls>>) {
    const { gl, camera } = useThree();
    return <orbitControls
        args={[camera, gl.domElement]}
        mouseButtons={{
            LEFT: undefined,
            MIDDLE: MOUSE.PAN,
            RIGHT: MOUSE.ROTATE
        }}
        {...props}
    />
}