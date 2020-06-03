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
            image: undefined,
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
            this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000)
            this.scene = new THREE.Scene()

            const sides = [
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

            let element = document.createElement( 'img' )
            element.id = "timg"
            // element.width = 1026; // 2 pixels extra to close the gap.
            element.src = require("@/views/timg.jpg")
            
            this.image = new CSS3DObject(element)
            this.image.position.fromArray([-512, 0, 0])
            this.image.rotation.fromArray([0, Math.PI / 2, 0 ])
            this.scene.add( this.image )




            this.renderer = new CSS3DRenderer()
            this.renderer.setSize( window.innerWidth, window.innerHeight )
            document.querySelector("#css3d_panorama").appendChild( this.renderer.domElement )

            document.addEventListener( 'mousedown', this.onDocumentMouseDown, false )
            document.addEventListener( 'click', this.onclick, false )
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
        sleep(){
            return new Promise((resolve,reject) => {
                setTimeout(() => {
                    resolve()
                }, 10)
            })
        },
        async onclick(event){
            event.preventDefault()
            if(event.target.id === "timg"){

                const Y = 0
                const X = 90
                const F = 45
                
                let lonMax = Math.max(Y,this.lon)
                let lonMin = Math.min(Y,this.lon)
                let latMax = Math.max(X,this.lat)
                let latMin = Math.min(X,this.lat)
                
                this.scene.remove(this.image)

                // 120 => 151 -7 => 90
                
                let lonMinus =  lonMax - lonMin 
                let latMinus =  latMax - latMin 
                let min = Math.min(lonMinus,latMinus)
                let max = Math.max(lonMinus,latMinus)

                
                
                for(let i = 0; i < Math.min(lonMinus,latMinus); i++){
                    let fov = this.camera.fov

                    await this.sleep()
                    this.lon += this.lon < Y ? 1 : -1
                    this.lat += this.lat < X ? latMinus / lonMinus : -(latMinus / lonMinus)
                    
                    fov += fov < F ? Math.max(fov,F) / Math.min(fov,F) : -(Math.max(fov,F) / Math.min(fov,F))

                    // 视野广度
                    this.camera.fov = THREE.MathUtils.clamp( fov, 10, 90 )
                    this.camera.updateProjectionMatrix()
                }
            }else{
                this.scene.add(this.image)
            }
            
            console.log(this.camera)
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