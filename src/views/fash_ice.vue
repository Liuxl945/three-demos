<template>
    <div id="fash_ice">

    </div>
</template>


<script>

import * as THREE from "three"
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"

export default {
    data() {
        return {
            camera: undefined,
            geometry: undefined,
            sushe_low: undefined,
            mesh: undefined,
            scene: undefined,
            renderer: undefined,
            lon: 90,
            lat: 0,
            phi: 0,
            theta: 0,
            target: new THREE.Vector3(),
        }
    },
    mounted() {
        this.init()
        this.animate()
    },
    methods: {
        init() {
            this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 1000)
            

            this.scene = new THREE.Scene()
            this.geometry = new THREE.SphereGeometry( 500, 60, 60 )
            this.geometry.scale( - 1, 1, 1 )

            this.sushe_low = new THREE.MeshBasicMaterial( {
                map: new THREE.TextureLoader().load( require("@/views/sushe.jpg"))
            })

            // let geometry2 = new THREE.SphereGeometry( 500, 40, 40 )

            


            this.mesh = new THREE.Mesh( this.geometry, this.sushe_low )

            let moonDiv = document.createElement("div")
            moonDiv.className = "label"
            moonDiv.textContent = "Moon"
            moonDiv.style.marginTop = "-1em"
            let moonLabel = new CSS2DObject(moonDiv)
            moonLabel.position.set(0, 0.2, 0)
            this.mesh.add(moonLabel)

            this.scene.add( this.mesh )

            this.renderer = new THREE.WebGLRenderer()
            this.renderer.setPixelRatio( window.devicePixelRatio )
            this.renderer.setSize( window.innerWidth, window.innerHeight )

            document.querySelector("#fash_ice").appendChild( this.renderer.domElement )

            document.addEventListener( 'mousedown', this.onDocumentMouseDown, false )
            document.addEventListener( 'wheel', this.onDocumentMouseWheel, false )
            document.addEventListener( 'touchstart', this.onDocumentTouchStart, { passive: false } )
            document.addEventListener( 'touchmove', this.onDocumentTouchMove, { passive: false } )
            window.addEventListener( 'resize', this.onWindowResize, false )
        },
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()

            this.renderer.setSize( window.innerWidth, window.innerHeight )
        },
        onDocumentMouseDown(event) {
            event.preventDefault()
            document.addEventListener( 'mousemove', this.onDocumentMouseMove, false )
            document.addEventListener( 'mouseup', this.onDocumentMouseUp, false )
        },
        onDocumentMouseMove(event) {
            let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
            let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

            this.lon -= movementX * 0.1
            this.lat += movementY * 0.1
        },
        onDocumentMouseUp() {
            document.removeEventListener( 'mousemove', this.onDocumentMouseMove )
            document.removeEventListener( 'mouseup', this.onDocumentMouseUp )
        },
        onDocumentMouseWheel(event) {
            
            var fov = this.camera.fov + event.deltaY * 0.05

            this.camera.fov = THREE.MathUtils.clamp( fov, 10, 90 )
            this.camera.updateProjectionMatrix()
        },
        onDocumentTouchStart(event) {
            event.preventDefault()
            this.changeClState(event)// 控制窗帘的状态

            let touch = event.touches[ 0 ]

            this.touchX = touch.screenX
            this.touchY = touch.screenY
        },
        onDocumentTouchMove(event) {
            event.preventDefault()

            let touch = event.touches[ 0 ]

            this.lon -= ( touch.screenX - this.touchX ) * 0.1
            this.lat += ( touch.screenY - this.touchY ) * 0.1

            this.touchX = touch.screenX
            this.touchY = touch.screenY
        },

        animate() {
            requestAnimationFrame(this.animate)
            this.lat = Math.max( - 85, Math.min( 85, this.lat ) )
            this.phi = THREE.MathUtils.degToRad( 90 - this.lat )
            this.theta = THREE.MathUtils.degToRad( this.lon )
            this.target.x = Math.sin( this.phi ) * Math.cos( this.theta )
            this.target.y = Math.cos( this.phi )
            this.target.z = Math.sin( this.phi ) * Math.sin( this.theta )
            this.camera.lookAt( this.target )
            this.renderer.render( this.scene, this.camera )
        }
    }
}
</script>