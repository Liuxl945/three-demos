<template>
    <div id="webgl_geometry_text"></div>
</template>

<script>

import * as THREE from "three"
import State from "three/examples/jsm/libs/stats.module"

THREE.Cache.enabled = true

export default {
    data() {
        return {
            container: undefined,
            stats: undefined,
            permalink: undefined,
            hex: undefined,
            camera: undefined,
            cameraTarget: undefined,
            scene: undefined,
            renderer: undefined,
            group: undefined,
            textMesh1: undefined,
            textMesh2: undefined,
            textGeo: undefined,
            materials: undefined,
            firstLetter: true,
            text: "three.js",
            height: 20,
            size: 70,
            hover: 30,
            curveSegments: 4,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: true,
            font: undefined,
            fontName: "optimer",
            fontWeight: "bold",
            mirror: true,
            fontMap: {
                "helvetiker": 0,
				"optimer": 1,
				"gentilis": 2,
				"droid/droid_sans": 3,
				"droid/droid_serif": 4
            },
            weightMap: {
                "regular": 0,
				"bold": 1
            },
            reverseFontMap: [],
            reverseWeightMap: [],
            targetRotation: 0,
            targetRotationOnMouseDown: 0,
            mouseX: 0,
            mouseXOnMouseDown: 0,
            windowHalfX: window.innerWidth / 2,
            fontIndex: 1
        }
    },
    methods: {
        init() {

        },
        animate() {

        },
        render() {
            
        }
    }
}
</script>