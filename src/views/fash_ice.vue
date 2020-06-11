<template>
    <div id="fash_ice">

    </div>
</template>


<script>

import * as THREE from "three"
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

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
            touchX: undefined,
            touchY: undefined,
            target: new THREE.Vector3(),
        }
    },
    mounted() {
        this.init()
        this.animate()
    },
    methods: {
        init() {
            this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000)
            this.camera.position.z = 0.1

            this.scene = new THREE.Scene()
            var box = new THREE.BoxGeometry(20, 20, 20)
            // 6张全景图的名称
            let pathArr = [
                require("@/textures/cube/Park3Med/px.jpg"), 
                require("@/textures/cube/Park3Med/nx.jpg"), 
                require("@/textures/cube/Park3Med/py.jpg"), 
                require("@/textures/cube/Park3Med/ny.jpg"), 
                require("@/textures/cube/Park3Med/pz.jpg"), 
                require("@/textures/cube/Park3Med/nz.jpg")
            ]
            // 声明一个数组，用来存储六张全景图对应的纹理对象Texture
            let materialArr = []
            pathArr.forEach(elem => {
                var textureLoader = new THREE.TextureLoader()
                var texture = textureLoader.load(elem)
                var material = new THREE.MeshBasicMaterial({
                    map:texture,
                    side:THREE.BackSide,
                });
                materialArr.push(material)
            })

            // var geometry = new THREE.PlaneBufferGeometry( 5, 5, 5 );

            // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            // var cube = new THREE.Mesh( geometry, material );
            // cube.position.x = -10
            // this.scene.add( cube );



            var mesh = new THREE.Mesh(box, materialArr)

            this.scene.add(mesh)

            this.renderer = new THREE.WebGLRenderer()
            this.renderer.setSize(window.innerWidth, window.innerHeight);//设置渲染区域尺寸
            this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色

            document.querySelector("#fash_ice").appendChild(this.renderer.domElement); //body元素中插入canvas对象
            

            // var controls = new OrbitControls(this.camera,this.renderer.domElement);//创建控件对象
            
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
            
            this.camera.fov = THREE.MathUtils.clamp( fov, 10, 80 )
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
            this.renderer.render(this.scene,this.camera)
        }
    }
}
</script>