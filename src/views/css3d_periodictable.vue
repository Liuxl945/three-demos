<template>
    <div id="css3d_periodictable"></div>
</template>

<script>

import * as THREE from "three"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"

export default {
    data() {
        return {
            camera: undefined,
            scene: undefined,
            renderer: undefined,
            scene2: undefined,
            renderer2: undefined,
            controls: undefined
        }
    },
    methods: {
        init() {

        },
        animate() {
            
        }
    },
    mounted() {

    }
}
</script>