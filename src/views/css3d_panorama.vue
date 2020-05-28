<template>
    <div id="css3d_panorama"></div>
</template>

<script>

import * as THREE from "three"
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"

export default {
    data() {
        return {
            camera: undefined,
            scene: undefined,
            renderer: undefined,
            target: new THREE.Vector3(),
            lon: 90,
            lat: 0,
            phi: 0,
            theta: 0,
            touchX: undefined,
            touchY: undefined
        }
    },
    mounted() {
        this.init()
        this.animate()
    },
    methods: {
        init() {
            this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000)
            this.scene = new THREE.Scene()

            const sides = [
                // {
                //     url: require("@/views/1.jpg"),
                //     position: [ - 512, 0, 0 ],
                //     rotation: [ 0, Math.PI / 2, 0 ]
                // },
                // {
                //     url: require("@/views/2.jpg"),
                //     position: [ 512, 0, 0 ],
                //     rotation: [ 0, - Math.PI / 2, 0 ]
                // },
                // {
                //     url: require("@/views/3.jpg"),
                //     position: [ 0, 512, 0 ],
                //     rotation: [ Math.PI / 2, 0, Math.PI ]
                // },
                // {
                //     url: require("@/views/4.jpg"),
                //     position: [ 0, - 512, 0 ],
                //     rotation: [ - Math.PI / 2, 0, Math.PI ]
                // },
                // {
                //     url: require("@/views/5.jpg"),
                //     position: [ 0, 0, 512 ],
                //     rotation: [ 0, Math.PI, 0 ]
                // },
                // {
                //     url: require("@/views/6.jpg"),
                //     position: [ 0, 0, - 512 ],
                //     rotation: [ 0, 0, 0 ]
                // },

                // {
                //     url: require("@/views/7.jpg"),
                //     position: [ 0, -256, - 512],
                //     rotation: [ 0, 0, 0 ]
                // },
                // {
                //     url: require("@/views/8.png"),
                //     position: [ 0, 256, - 512 ],
                //     rotation: [ 0, 0, 0 ]
                // },

                {
                    url: require("@/textures/cube/Bridge2/posx.jpg"),
                    position: [ - 512, 0, 0 ],
                    rotation: [ 0, Math.PI / 2, 0 ]
                },
                {
                    url: require("@/textures/cube/Bridge2/negx.jpg"),
                    position: [ 512, 0, 0 ],
                    rotation: [ 0, - Math.PI / 2, 0 ]
                },
                {
                    url: require("@/textures/cube/Bridge2/posy.jpg"),
                    position: [ 0, 512, 0 ],
                    rotation: [ Math.PI / 2, 0, Math.PI ]
                },
                {
                    url: require("@/textures/cube/Bridge2/negy.jpg"),
                    position: [ 0, - 512, 0 ],
                    rotation: [ - Math.PI / 2, 0, Math.PI ]
                },
                {
                    url: require("@/textures/cube/Bridge2/posz.jpg"),
                    position: [ 0, 0, 512 ],
                    rotation: [ 0, Math.PI, 0 ]
                },
                {
                    url: require("@/textures/cube/Bridge2/negz.jpg"),
                    position: [ 0, 0, - 512 ],
                    rotation: [ 0, 0, 0 ]
                }
            ]

            sides.forEach(side => {
                let element = document.createElement( 'img' )
                element.width = 1026; // 2 pixels extra to close the gap.
                element.src = side.url;

                let object = new CSS3DObject( element)
                object.position.fromArray( side.position)
                object.rotation.fromArray( side.rotation )
                this.scene.add( object )
            })

            this.renderer = new CSS3DRenderer()
            this.renderer.setSize( window.innerWidth, window.innerHeight )
            document.querySelector("#css3d_panorama").appendChild( this.renderer.domElement )

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

            this.camera.fov = THREE.MathUtils.clamp( fov, 10, 75 )

            this.camera.updateProjectionMatrix()
        },
        onDocumentTouchStart(event) {
            event.preventDefault()

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
            requestAnimationFrame( this.animate )

            // this.lon += 0.1
            this.lat = Math.max( - 85, Math.min( 85, this.lat ) )
            this.phi = THREE.MathUtils.degToRad( 90 - this.lat )
            this.theta = THREE.MathUtils.degToRad( this.lon )
            this.target.x = Math.sin( this.phi ) * Math.cos( this.theta )
            this.target.y = Math.cos( this.phi )
            this.target.z = Math.sin( this.phi ) * Math.sin( this.theta )
            this.camera.lookAt( this.target )
            
            this.renderer.render(this.scene, this.camera)
        }
    }
}
</script>