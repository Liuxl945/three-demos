<template>
    <div id="raycaster"></div>
</template>


<script>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

let scene, camera, controls, group, container, renderer
let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2()

export default {
    mounted() {
        this.init()
    },
    methods: {
        init() {
            container = document.createElement("div")
            document.querySelector("#raycaster").appendChild(container)

            camera = new THREE.PerspectiveCamera(70, window.innerWidth/ window.innerHeight, 1, 5000)
            camera.position.z = 1000

            scene = new THREE.Scene()
            // scene.background = new THREE.Color(0xf0f0f0)
            scene.add(new THREE.AmbientLight(0x505050))


            let light = new THREE.SpotLight( 0xffffff, 1.5 )
            light.position.set( 0, 500, 2000 )
            light.angle = Math.PI / 9

            light.castShadow = true
            light.shadow.camera.near = 1000
            light.shadow.camera.far = 4000
            light.shadow.mapSize.width = 1024
            light.shadow.mapSize.height = 1024
            scene.add(light)

            group = new THREE.Group()
            scene.add(this.group)

            let geometry = new THREE.BoxBufferGeometry( 40, 40, 40 )


            for ( let i = 0 ;i < 1 ;i ++ ) {

                let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
                    color: Math.random() * 0xffffff,
                    name: i,
                } ) )
                object.name = i

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

                scene.add( object )
            }

            let spriteMaterial = new THREE.SpriteMaterial({
                map:  new THREE.TextureLoader().load(require("@/assets/end_slogan.png")),
                color: 0xffffff,
                fog: true
            })

            let sprite = new THREE.Sprite(spriteMaterial)

            sprite.position.x = Math.random() * 1000 - 500
            sprite.position.y = Math.random() * 600 - 300
            sprite.position.z = Math.random() * 800 - 400
            
            sprite.scale.x = 168
            sprite.scale.y = 100
            sprite.scale.z = 1
            
            sprite.name = "sprite"
            scene.add( sprite )


            renderer = new THREE.WebGLRenderer({
                antialias: true
            })
            renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize( window.innerWidth, window.innerHeight )

            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFShadowMap

            container.appendChild( renderer.domElement )


            window.addEventListener( 'click', this.onClick, false )


            this.render()

            var controls = new OrbitControls(camera,renderer.domElement);//创建控件对象
            controls.addEventListener('change', this.render);//监听鼠标、键盘事件

        },
        onClick(event) {
            event.preventDefault()
            
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            raycaster.setFromCamera( mouse, camera );
            var intersects = raycaster.intersectObjects( scene.children );
            if ( intersects.length > 0 ) {

                var object = intersects[ 0 ].object;
                
                console.log(object.name)

                if(object.name === "sprite") {
                    alert("操作")
                }
            }
        },
        render() {
            // requestAnimationFrame(this.renderer)
            renderer.render( scene, camera )
        }
    }
}
</script>