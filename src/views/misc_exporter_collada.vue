<template>
    <div id="misc_exporter_collada">

    </div>
</template>

<script>

import * as THREE from "three"
import { GUI } from "three/examples/jsm/libs/dat.gui.module"

let camera, scene, renderer, cameraControls, effectController, ambientLight, light

export default {
    methods: {
        init() {
            let container = document.createElement( 'div' )
            document.querySelector("#misc_exporter_collada").appendChild( container )
            let canvasWidth = window.innerWidth
            let canvasHeight = window.innerHeight

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 80000 )
            camera.position.set( - 600, 550, 1300 )

            ambientLight = new THREE.AmbientLight( 0x333333 )
            light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 )

            let loader = new THREE.TextureLoader()
            let textureMap = loader.load( require("@/textures/uv_grid_opengl.jpg") )
            textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping
            textureMap.anisotropy = 16
            textureMap.encoding = THREE.sRGBEncoding


            scene = new THREE.Scene()
            scene.background = new THREE.Color( 0xAAAAAA )
            scene.add( ambientLight )
            scene.add( light )



            renderer = new THREE.WebGLRenderer( { antialias: true } )
            renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize( canvasWidth, canvasHeight )
            renderer.outputEncoding = THREE.sRGBEncoding
            container.appendChild( renderer.domElement )
            
        },
        animate() {
            renderer.render( scene, camera )
        }
    },
    mounted() {

    }
}
</script>