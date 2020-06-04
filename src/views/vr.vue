<template>
    <div id="vr"></div>
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
            touchY: undefined,
            divElement: undefined,
            clOpen: false //窗帘状态
        }
    },
    mounted() {
        this.init()
        this.animate()
    },
    methods: {
        init() {
            this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000)
            this.scene = new THREE.Scene()

            const sides = [
                {
                    // 前面
                    url: require("@/vr/pano_f.jpg"),
                    position: [ 0, 0, 652 ],
                    rotation: [ 0, Math.PI, 0 ]
                },
                {
                    // 右边
                    url: require("@/vr/pano_r.jpg"),
                    position: [ - 652, 0, 0 ],
                    rotation: [ 0, Math.PI / 2, 0 ]
                },
                {
                    // 左边
                    url: require("@/vr/pano_l.jpg"),
                    position: [ 652, 0, 0 ],
                    rotation: [ 0, - Math.PI / 2, 0 ]
                },
                {
                    // 顶部
                    url: require("@/vr/pano_u.jpg"),
                    position: [ 0, 652, 0 ],
                    rotation: [ Math.PI / 2, 0, Math.PI ]
                },
                {
                    // 底部
                    url: require("@/vr/pano_d.jpg"),
                    position: [ 0, - 652, 0 ],
                    rotation: [ - Math.PI / 2, 0, Math.PI ]
                },
                {
                    // 后面
                    url: require("@/vr/pano_b.jpg"),
                    position: [ 0, 0, - 652 ],
                    rotation: [ 0, 0, 0 ]
                }
            ]

            sides.forEach(side => {
                let element = document.createElement( 'img' )
                element.width = 1304; // 2 pixels extra to close the gap.
                element.src = side.url;

                let object = new CSS3DObject( element)
                object.position.fromArray( side.position)
                object.rotation.fromArray( side.rotation )
                this.scene.add( object )
            })

            // 窗帘背景
            let divElement = document.createElement("div")
            divElement.style.width = "706px"
            divElement.style.height = "594px"
            // divElement.style.background = "red"
            divElement.style.backgroundImage = `url(${require("@/vr/cl_d.png")})`
            divElement.style.backgroundSize = `730%`

            let div3DElement = new CSS3DObject(divElement)
            div3DElement.position.fromArray([ -16, 26, 652 ])
            div3DElement.rotation.fromArray([0, Math.PI , 0 ])
            this.divElement = divElement
            this.scene.add( div3DElement )

            // 电视机
            let tvElement = document.createElement("div")
            tvElement.style.width = "640px"
            tvElement.style.height = "240px"
            tvElement.style.background = "red"
            let Tv3DElement = new CSS3DObject(tvElement)
            Tv3DElement.position.fromArray([ 625, -16, 625 ])
            Tv3DElement.rotation.fromArray([ 0, - Math.PI / 2, 0])
            this.tvElement = tvElement
            this.scene.add( Tv3DElement )

            // let tvElement1 = document.createElement("div")
            // tvElement1.style.width = "156px"
            // tvElement1.style.height = "240px"
            // tvElement1.style.background = "red"
            // let Tv3DElement1 = new CSS3DObject(tvElement1)
            // Tv3DElement1.position.fromArray([ 652, -16, 652 ])
            // Tv3DElement1.rotation.fromArray([0, Math.PI , 0 ])
            // this.tvElement1 = tvElement1
            // this.scene.add( Tv3DElement1 )


            
            
            
            // divElement.style.backgroundPositionX = `100%`
            // divElement.style.backgroundPositionY = `50%`

            
            
            // 红色图片
            let element = document.createElement( 'img' )
            element.id = "timg"
            // element.width = 1026; // 2 pixels extra to close the gap.
            element.src = require("@/views/timg.jpg")
            
            this.image = new CSS3DObject(element)
            this.image.position.fromArray([ 0, -400, 652 ])
            this.image.rotation.fromArray([0, Math.PI, 0 ])
            this.scene.add( this.image )




            this.renderer = new CSS3DRenderer()
            this.renderer.setSize( window.innerWidth, window.innerHeight )
            document.querySelector("#vr").appendChild( this.renderer.domElement )


            document.addEventListener( 'mousedown', this.onDocumentMouseDown, false )
            document.addEventListener( 'click', this.onclick, false )
            document.addEventListener( 'wheel', this.onDocumentMouseWheel, false )
            document.addEventListener( 'touchstart', this.onDocumentTouchStart, { passive: false } )
            document.addEventListener( 'touchmove', this.onDocumentTouchMove, { passive: false } )
            window.addEventListener( 'resize', this.onWindowResize, false )
        },

        async openClAnimation(){
            for(let i = 6;i >= 0; i--){
                this.divElement.style.backgroundPositionX = `99.4%`
                this.divElement.style.backgroundPositionY = `${((100/6) * i) - 0.21 * i}%`
                if(i === 6){
                    await this.sleep()
                }
                for(let z = 6; z >= 0; z--){
                    this.divElement.style.backgroundPositionX = `${((100/6) * z - 0.1 * z)}%`
                    if(z === 6){
                        await this.sleep()
                    }
                }
            }
            this.clOpen = false
        },

        async closeClAnimation(){
            for(let i = 0;i < 7; i++){
                this.divElement.style.backgroundPositionX = `0%`
                this.divElement.style.backgroundPositionY = `${((100/6) * i) - 0.21 * i}%`
                if(i === 0){
                    await this.sleep()
                }
                for(let z = 0; z < 7; z++){
                    this.divElement.style.backgroundPositionX = `${((100/6) * z - 0.1 * z)}%`
                    if(z === 0){
                        await this.sleep()
                    }
                }
            }
            this.clOpen = true
        },

        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()

            this.renderer.setSize( window.innerWidth, window.innerHeight )
        },
        sleep(time = 100){
            return new Promise((resolve,reject) => {
                setTimeout(() => {
                    resolve()
                }, time)
            })
        },
        
        // 控制窗帘的状态
        async changeClState(event){
            if(event.target.id === "timg"){

                if(this.clOpen){
                    this.openClAnimation()
                }else{
                    this.closeClAnimation() //窗帘动画
                }
                // this.scene.remove(this.image)

                // const Y = 0
                // const X = 90
                // const F = 45
                
                // let lonMax = Math.max(Y,this.lon)
                // let lonMin = Math.min(Y,this.lon)
                // let latMax = Math.max(X,this.lat)
                // let latMin = Math.min(X,this.lat)
                
                

                // // 120 => 151 -7 => 90
                
                // let lonMinus =  lonMax - lonMin 
                // let latMinus =  latMax - latMin 
                // let min = Math.min(lonMinus,latMinus)
                // let max = Math.max(lonMinus,latMinus)

                
                
                // for(let i = 0; i < Math.min(lonMinus,latMinus); i++){
                //     let fov = this.camera.fov

                //     await this.sleep()
                //     this.lon += this.lon < Y ? 1 : -1
                //     this.lat += this.lat < X ? latMinus / lonMinus : -(latMinus / lonMinus)
                    
                //     fov += fov < F ? Math.max(fov,F) / Math.min(fov,F) : -(Math.max(fov,F) / Math.min(fov,F))

                //     // 视野广度
                //     this.camera.fov = THREE.MathUtils.clamp( fov, 10, 90 )
                //     this.camera.updateProjectionMatrix()
                // }
            }else{
                // this.scene.add(this.image)
            }
        },

        async onclick(event){
            event.preventDefault()
            this.changeClState(event)// 控制窗帘的状态
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

            this.camera.fov = THREE.MathUtils.clamp( fov, 10, 70 )
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