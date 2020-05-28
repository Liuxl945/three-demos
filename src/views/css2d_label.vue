<template>
    <div id="css2d_label"></div>
</template>

<script>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js"

export default {
    data(){
        return {
            earth:undefined,
            moon:undefined,
            camera:undefined,
            scene:undefined,
            renderer:undefined,
            labelRenderer:undefined,
            clock:new THREE.Clock(),
            textureLoader:new THREE.TextureLoader(),
        }
    },
    mounted(){
        this.init()
        this.animate()
    },
    methods:{
        init(){
            const EARTH_RADIUS = 1*2
            const MOON_RADIUS = 0.27*2

            //创建相机对象
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 200)
            this.camera.position.set(10, 5, 20)

            //创建场景对象Scene
            this.scene = new THREE.Scene() 
            
            // 方向光
            let dirLight = new THREE.DirectionalLight(0xffffff)
            dirLight.position.set(0, 0, 1)
            this.scene.add(dirLight)

            // XYZ主轴
            let axesHelper = new THREE.AxesHelper(10)
            this.scene.add(axesHelper)


            const earthGeometry = new THREE.SphereBufferGeometry(EARTH_RADIUS, 16, 16)
            const earthMaterial = new THREE.MeshPhongMaterial({
                specular: 0x333333,
                shininess: 5,
                map: this.textureLoader.load(require("@/textures/planets/earth_atmos_2048.jpg")),
                specularMap:this.textureLoader.load( require("@/textures/planets/earth_specular_2048.jpg") ),
                normalMap: this.textureLoader.load( require("@/textures/planets/earth_normal_2048.jpg" )),
                normalScale: new THREE.Vector2( 0.85, 0.85 )
            })
            this.earth = new THREE.Mesh(earthGeometry, earthMaterial)
            this.scene.add(this.earth)

            const moonGeometry = new THREE.SphereBufferGeometry( MOON_RADIUS, 16, 16)
            const moonMaterial = new THREE.MeshPhongMaterial({
                shininess: 5,
                map: this.textureLoader.load(require("@/textures/planets/moon_1024.jpg"))
            })
            this.moon = new THREE.Mesh(moonGeometry, moonMaterial)
            this.scene.add(this.moon)


            let earthDiv = document.createElement("div")
            earthDiv.className = "label"
            earthDiv.textContent = "Earth"
            earthDiv.style.marginTop = "-1em"
            let earthLabel = new CSS2DObject(earthDiv)
            earthLabel.position.set(0, EARTH_RADIUS, 0)
            this.earth.add(earthLabel)

            let moonDiv = document.createElement("div")
            moonDiv.className = "label"
            moonDiv.textContent = "Moon"
            moonDiv.style.marginTop = "-1em"
            let moonLabel = new CSS2DObject(moonDiv)
            moonLabel.position.set(0, MOON_RADIUS, 0)
            this.moon.add(moonLabel)

            this.renderer = new THREE.WebGLRenderer()
            this.renderer.setPixelRatio( window.devicePixelRatio )
            this.renderer.setSize( window.innerWidth, window.innerHeight )
            document.querySelector("#css2d_label").appendChild( this.renderer.domElement )

            this.labelRenderer = new CSS2DRenderer()
            this.labelRenderer.setSize( window.innerWidth, window.innerHeight )
            this.labelRenderer.domElement.style.position = "absolute"
            this.labelRenderer.domElement.style.top = "0px"
            document.querySelector("#css2d_label").appendChild( this.labelRenderer.domElement )

            const controls = new OrbitControls(this.camera, this.labelRenderer.domElement)
            
            controls.minDistance = 5
            controls.maxDistance = 100
            // controls.addEventListener('change', this.render);//监听鼠标、键盘事件
        },
        render(){
            this.renderer.render(this.scene,this.camera)
            this.labelRenderer.render(this.scene, this.camera)
        },
        animate(){
            requestAnimationFrame(this.animate)

            let elapsed = this.clock.getElapsedTime()
            this.moon.position.set(Math.sin(elapsed) * 5 * 2 , 0, Math.cos( elapsed ) * 5 * 2 )

            this.render()
        }
    }
}
</script>


<style lang="scss" scoped>
.label {
    color: #FFF;
    font-family: sans-serif;
    padding: 2px;
    background: rgba( 0, 0, 0, .6 );
}
#css2d_label{
    position: relative;
}
</style>