<template>
    <div id="misc_controls_drag"></div>
</template>

<script>

import * as THREE from "three"
import { DragControls } from "three/examples/jsm/controls/DragControls"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default {
    data() {
        return {
            container: undefined,
            camera: undefined,
            scene: undefined,
            renderer: undefined,
            controls: undefined,
            group: undefined,
            objects: [],
            enableSelection: false,
            mouse: new THREE.Vector2(),
            raycaster: new THREE.Raycaster()
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.container = document.createElement("div")
            document.querySelector("#misc_controls_drag").appendChild(this.container)

            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth/ window.innerHeight, 1, 5000)
            this.camera.position.z = 1000

            this.scene = new THREE.Scene()
            this.scene.background = new THREE.Color(0xf0f0f0)

            this.scene.add(new THREE.AmbientLight(0x505050))


            let light = new THREE.SpotLight( 0xffffff, 1.5 )
            light.position.set( 0, 500, 2000 )
            light.angle = Math.PI / 9

            light.castShadow = true
            light.shadow.camera.near = 1000
            light.shadow.camera.far = 4000
            light.shadow.mapSize.width = 1024
            light.shadow.mapSize.height = 1024
            this.scene.add(light)

            this.group = new THREE.Group()
            this.scene.add(this.group)

            let geometry = new THREE.BoxBufferGeometry( 40, 40, 40 )


            for ( let i = 0 ;i < 200 ;i ++ ) {

                let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) )

                object.position.x = Math.random() * 1000 - 500
                object.position.y = Math.random() * 600 - 300
                object.position.z = Math.random() * 800 - 400

                object.rotation.x = Math.random() * 2 * Math.PI
                object.rotation.y = Math.random() * 2 * Math.PI
                object.rotation.z = Math.random() * 2 * Math.PI

                object.scale.x = Math.random() * 2 + 1
                object.scale.y = Math.random() * 2 + 1
                object.scale.z = Math.random() * 2 + 1

                object.castShadow = true
                object.receiveShadow = true

                this.scene.add( object )

                this.objects.push( object )
            }

            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            })
            this.renderer.setPixelRatio( window.devicePixelRatio )
            this.renderer.setSize( window.innerWidth, window.innerHeight )

            this.renderer.shadowMap.enabled = true
            this.renderer.shadowMap.type = THREE.PCFShadowMap

            this.container.appendChild( this.renderer.domElement )

            this.controls = new DragControls( [ ... this.objects ], this.camera, this.renderer.domElement )
            this.controls.addEventListener( 'drag', this.render )


            window.addEventListener( 'resize', this.onWindowResize, false )
            document.addEventListener( 'click', this.onClick, false )
            window.addEventListener( 'keydown', this.onKeyDown, false )
            window.addEventListener( 'keyup', this.onKeyUp, false )

            // var controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            // controls.addEventListener('change', this.render);//监听鼠标、键盘事件

            this.render()
        },
        onWindowResize() {

            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()

            this.renderer.setSize( window.innerWidth, window.innerHeight )

            this.render()

        },

        onKeyDown( event ) {

            this.enableSelection = ( event.keyCode === 16 ) ? true : false

        },

        onKeyUp() {

            this.enableSelection = false

        },

        onClick( event ) {

            event.preventDefault()

            if ( this.enableSelection === true ) {

                let draggableObjects = this.controls.getObjects()
                draggableObjects.length = 0

                this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
                this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

                this.raycaster.setFromCamera( this.mouse, this.camera )

                let intersections = this.raycaster.intersectObjects( this.objects, true )


                if ( intersections.length > 0 ) {

                    let object = intersections[ 0 ].object

                    if ( this.group.children.includes( object ) === true ) {

                        object.material.emissive.set( 0x000000 )
                        this.scene.attach( object )

                    } else {

                        object.material.emissive.set( 0xaaaaaa )
                        this.group.attach( object )

                    }

                    this.controls.transformGroup = true
                    draggableObjects.push( this.group )

                }

                if ( this.group.children.length === 0 ) {

                    this.controls.transformGroup = false
                    draggableObjects.push( ...this.objects )

                }

            }

            this.render()

        },
        render() {
            this.renderer.render( this.scene, this.camera )
        }
    }
}
</script>