<template>
    <div id="misc_exporter_draco"></div>
</template>

<script>

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

let camera, scene, mesh, renderer

export default {
    mounted() {
        this.init()
        this.animate()
    },
    methods: {
        init() {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000)
            camera.position.set(200, 100, 200)

            scene = new THREE.Scene()
            scene.background = new THREE.Color( 0xa0a0a0 )
            scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 )
            
            let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
            hemiLight.position.set( 0, 200, 0 )
            scene.add(hemiLight)

            let directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
            directionalLight.position.set( 0, 200, 100 )
            directionalLight.castShadow = true
            directionalLight.shadow.camera.top = 180
            directionalLight.shadow.camera.bottom = - 100
            directionalLight.shadow.camera.left = - 120
            directionalLight.shadow.camera.right = 120
            scene.add( directionalLight )

            let ground = new THREE.Mesh(
                new THREE.PlaneBufferGeometry( 2000, 2000 ),
                new THREE.MeshPhongMaterial(
                    { color: 0x999999, depthWrite: false }
                )
            )
            ground.rotation.x = - Math.PI / 2
            ground.position.y = - 75
            ground.receiveShadow = true
            scene.add( ground )

            let grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 )
            grid.material.opacity = 0.2
            grid.material.transparent = true
            grid.position.y = - 75
            scene.add( grid )

            let geometry = new THREE.TorusKnotBufferGeometry( 50, 15, 200, 30 )
            let material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } )
            mesh = new THREE.Mesh( geometry, material )
            mesh.castShadow = true
            mesh.position.y = 25
            scene.add( mesh )

            renderer = new THREE.WebGLRenderer( { antialias: true } )
            renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize( window.innerWidth, window.innerHeight )
            renderer.shadowMap.enabled = true
            document.querySelector("#misc_exporter_draco").appendChild( renderer.domElement )

            let controls = new OrbitControls( camera, renderer.domElement )
            controls.target.set( 0, 25, 0 )
            controls.update()

            window.addEventListener( 'resize', this.onWindowResize, false )
        },
        onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()

            renderer.setSize( window.innerWidth, window.innerHeight )
        },
        animate() {
            requestAnimationFrame( this.animate )
            renderer.render( scene, camera )
        }
    }
}
</script>