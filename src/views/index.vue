<template>
    <div id="index"></div>
</template>

<script>

import * as THREE from "three"

let camera,scene,renderer

export default {
    data() {
        return {
            initdata: {
                
            }
        }
    },
    methods: {
        init() {
            scene = new THREE.Scene()
            scene.background = new THREE.CubeTextureLoader()
            .load( [
                require("@/textures/cube/Park3Med/px.jpg"), 
                require("@/textures/cube/Park3Med/nx.jpg"), 
                require("@/textures/cube/Park3Med/py.jpg"), 
                require("@/textures/cube/Park3Med/ny.jpg"), 
                require("@/textures/cube/Park3Med/pz.jpg"), 
                require("@/textures/cube/Park3Med/nz.jpg")
            ] )
            console.log(scene)
            // 创建网格模型
            var geometry = new THREE.BoxGeometry(100, 100, 100) //创建一个立方体几何对象Geometry

            //材质对象Material
            var material = new THREE.MeshLambertMaterial({
                color: 0x0000ff,
                opacity:0.7,
                // specular:0x4488ee,
                // shininess:12,
                transparent:true,
                // wireframe:true
            })

            var mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
            mesh.position.set(-60,0,0)
            // 设置产生投影的网格模型
            mesh.castShadow = true
            scene.add(mesh)

            // 方向光
            var directionalLight = new THREE.DirectionalLight(0x333333, 1)
            // 设置光源位置
            directionalLight.position.set(60, 100, 40)
            scene.add(directionalLight)


            // 相机设置
            var width = window.innerWidth //窗口宽度
            var height = window.innerHeight //窗口高度
            var k = width / height //窗口宽高比
            var s = 150 //三维场景显示范围控制系数，系数越大，显示的范围越大

            camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
            camera.position.set(200, 300, 200) //设置相机位置
            camera.lookAt(scene.position) //设置相机方向(指向的场景对象)

            // 创建渲染器对象
            renderer = new THREE.WebGLRenderer()
            renderer.setSize(width, height)//设置渲染区域尺寸
            // renderer.setClearColor(0xb9d3ff, 1) //设置背景颜色

            document.querySelector("#index").appendChild(renderer.domElement); //body元素中插入canvas对象

            renderer.render(scene,camera);//执行渲染操作
        }
    },
    mounted() {
        this.init()
    }
}
</script>