<template>
    <div id="misc_controls_pointerlock">
        <div id="blocker">
            <div id="instructions">
                <span style="font-size:36px">Click to play</span>
                <br /><br />
                Move: WASD<br/>
                Jump: SPACE<br/>
                Look: MOUSE
            </div>
        </div>
    </div>
</template>

<script>

import * as THREE from "three"
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls"

let camera, scene, renderer, controls
let objects = []
let raycaster

let prevTime = performance.now()
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()
let vertex = new THREE.Vector3()
let color = new THREE.Color()

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false


export default {
    methods: {
        init() {
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000 )
            camera.position.y = 10

            scene = new THREE.Scene()
            scene.background = new THREE.Color(0xffffff)
            scene.fog = new THREE.Fog(0xffffff, 0, 750)

            let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
            light.position.set(0.5, 1, 0.75)
            scene.add(light)

            controls = new PointerLockControls(camera, document.body)
            var blocker = document.getElementById( 'blocker' )
            var instructions = document.getElementById( 'instructions' )

            instructions.addEventListener( 'click', function () {
                controls.lock()
            }, false )

            controls.addEventListener( 'lock', function () {
                instructions.style.display = 'none'
                blocker.style.display = 'none'
            } )

            controls.addEventListener( 'unlock', function () {
                blocker.style.display = 'block'
                instructions.style.display = ''
            } )

            scene.add( controls.getObject() )



            raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 )
            let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 )
            floorGeometry.rotateX( - Math.PI / 2 )
            let position = floorGeometry.attributes.position
            console.log(position)
            for ( let i = 0, l = position.count; i < l; i ++ ) {
                vertex.fromBufferAttribute( position, i )
                vertex.x += Math.random() * 20 - 10
                vertex.y += Math.random() * 2
                vertex.z += Math.random() * 20 - 10
                position.setXYZ( i, vertex.x, vertex.y, vertex.z )
            }

            floorGeometry = floorGeometry.toNonIndexed()
            position = floorGeometry.attributes.position
            let colors = []
            for ( let i = 0, l = position.count; i < l; i ++ ) {
                color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 )
                colors.push( color.r, color.g, color.b )
            }

            floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) )
            var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } )
            var floor = new THREE.Mesh( floorGeometry, floorMaterial )
            scene.add( floor )

            var boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 )
            boxGeometry = boxGeometry.toNonIndexed()
            position = boxGeometry.attributes.position
            colors = []
            for ( var i = 0, l = position.count; i < l; i ++ ) {
                color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 )
                colors.push( color.r, color.g, color.b )
            }

            boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) )

            for ( var i = 0; i < 500; i ++ ) {
                var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } )
                boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 )
                var box = new THREE.Mesh( boxGeometry, boxMaterial )
                box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20
                box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10
                box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20

                scene.add( box )
                objects.push( box )
            }

            renderer = new THREE.WebGLRenderer( { antialias: true } )
            renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize( window.innerWidth, window.innerHeight )
            document.querySelector("#misc_controls_pointerlock").appendChild( renderer.domElement )


            document.addEventListener( 'keydown', this.onKeyDown, false )
            document.addEventListener( 'keyup', this.onKeyUp, false )
            window.addEventListener( 'resize', this.onWindowResize, false )


        },
        onKeyDown(event) {
            switch ( event.keyCode ) {

                case 38: // up
                case 87: // w
                    moveForward = true
                    break

                case 37: // left
                case 65: // a
                    moveLeft = true
                    break

                case 40: // down
                case 83: // s
                    moveBackward = true
                    break

                case 39: // right
                case 68: // d
                    moveRight = true
                    break

                case 32: // space
                    if ( canJump === true ) velocity.y += 350
                    canJump = false
                    break
            }
        },
        onKeyUp(event) {
            switch ( event.keyCode ) {

                case 38: // up
                case 87: // w
                    moveForward = false
                    break

                case 37: // left
                case 65: // a
                    moveLeft = false
                    break

                case 40: // down
                case 83: // s
                    moveBackward = false
                    break

                case 39: // right
                case 68: // d
                    moveRight = false
                    break
            }
        },
        onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize( window.innerWidth, window.innerHeight )
        },
        animate() {
            requestAnimationFrame( this.animate )
            
            if ( controls.isLocked === true ) {
                raycaster.ray.origin.copy( controls.getObject().position )
                raycaster.ray.origin.y -= 10
                let intersections = raycaster.intersectObjects( objects )
                let onObject = intersections.length > 0
                let time = performance.now()
                let delta = ( time - prevTime ) / 1000

                velocity.x -= velocity.x * 10.0 * delta
                velocity.z -= velocity.z * 10.0 * delta
                velocity.y -= 9.8 * 100.0 * delta

                direction.z = Number( moveForward ) - Number( moveBackward )
                direction.x = Number( moveRight ) - Number( moveLeft )
                direction.normalize()

                if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta
                if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta

                if ( onObject === true ) {
                    velocity.y = Math.max( 0, velocity.y )
                    canJump = true
                }

                controls.moveRight( - velocity.x * delta )
                controls.moveForward( - velocity.z * delta )
                controls.getObject().position.y += ( velocity.y * delta )

                if ( controls.getObject().position.y < 10 ) {
                    velocity.y = 0
                    controls.getObject().position.y = 10
                    canJump = true
                }

                prevTime = time
            }
            renderer.render( scene, camera )
        }
    },
    mounted() {
        this.init()
        this.animate()
    }
}
</script>

<style lang="scss" scoped>
#blocker {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}

#instructions {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-family: Arial;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
}
</style>