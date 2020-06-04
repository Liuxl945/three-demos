<template>
    <div class="home" id="home"></div>
</template>

<script>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default {
    name: "Home",
    mounted(){

        // 创建场景对象Scene
        var scene = new THREE.Scene()

        scene.background = new THREE.CubeTextureLoader()
        .load( [ 
            require("@/textures/cube/Park3Med/px.jpg"), 
            require("@/textures/cube/Park3Med/nx.jpg"), 
            require("@/textures/cube/Park3Med/py.jpg"), 
            require("@/textures/cube/Park3Med/ny.jpg"), 
            require("@/textures/cube/Park3Med/pz.jpg"), 
            require("@/textures/cube/Park3Med/nz.jpg")
        ] );

        // 创建网格模型
        var geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
        // 球体 参数：半径60  经纬度细分数40,40
        var geometry2 = new THREE.SphereGeometry(60, 40, 40);
        // 圆柱  参数：圆柱面顶部、底部直径50,50   高度100  圆周分段数
        // var geometry = new THREE.CylinderGeometry( 50, 50, 100, 25 );
        // 正八面体
        // var geometry = new THREE.OctahedronGeometry(50);
        // 正十二面体
        // var geometry = new THREE.DodecahedronGeometry(50);
        // 正二十面体
        // var geometry = new THREE.IcosahedronGeometry(50);
        
        //材质对象Material
        var material = new THREE.MeshLambertMaterial({
            color: 0x0000ff,
            opacity:0.7,
            specular:0x4488ee,
            shininess:12,
            transparent:true,
            // wireframe:true
        });

        
        var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        var mesh2 = new THREE.Mesh(geometry2, material); //网格模型对象Mesh
        mesh.position.set(-60,0,0)
        
        
        
        // 设置产生投影的网格模型
        mesh.castShadow = true; 
        //创建一个平面几何体作为投影面
        var planeGeometry = new THREE.PlaneGeometry(300, 200);
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x999999
        });

        

        // 平面网格模型作为投影面
        var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(planeMesh); //网格模型添加到场景中
        planeMesh.rotateX(-Math.PI / 2); //旋转网格模型
        planeMesh.position.y = -60; //设置网格模型y坐标
        // 设置接收阴影的投影面
        planeMesh.receiveShadow = true;

        // 方向光
        var directionalLight = new THREE.DirectionalLight(0x333333, 1);
        // 设置光源位置
        directionalLight.position.set(60, 100, 40);
        scene.add(directionalLight);
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 300;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -100;



        mesh2.position.set(60,0,0)

        var axisHelper = new THREE.AxesHelper(2500)
        
        var group = new THREE.Group()
        //网格模型添加到group中
        
        group.add(axisHelper,mesh,mesh2)
        

        var geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
        // 绘制一个U型轮廓
        var R = 80;//圆弧半径
        var arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
        // 半圆弧的一个端点作为直线的一个端点
        var line1 = new THREE.LineCurve(new THREE.Vector2(R, 200, 0), new THREE.Vector2(R, 0, 0));
        var line2 = new THREE.LineCurve(new THREE.Vector2(-R, 0, 0), new THREE.Vector2(-R, 200, 0));
        // 创建组合曲线对象CurvePath
        var CurvePath = new THREE.CurvePath();
        // 把多个线条插入到CurvePath中
        CurvePath.curves.push(line1, arc, line2);
        //分段数200
        var points = CurvePath.getPoints(200);
        // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
        geometry.setFromPoints(points);
        //材质对象
        var material = new THREE.LineBasicMaterial({
        color: 0x000000
        });
        //线条模型对象
        var line = new THREE.Line(geometry, material);
        scene.add(line); //线条对象添加到场景中
        
        



        scene.add(group); 

        // scene.add(mesh); //网格模型添加到场景中
        // scene.add(mesh2); //网格模型添加到场景中

        //点光源
        var point = new THREE.SpotLight(0x888888);
        point.position.set(400, 200, 300); //点光源位置
        scene.add(point); //点光源添加到场景中

        //环境光
        var ambient = new THREE.AmbientLight(0x888888);
        scene.add(ambient);

        // 相机设置
        var width = window.innerWidth; //窗口宽度
        var height = window.innerHeight; //窗口高度
        var k = width / height; //窗口宽高比
        var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大

        //创建相机对象
        var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        camera.position.set(200, 300, 200); //设置相机位置
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

        // 创建渲染器对象
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色

        document.querySelector("#home").appendChild(renderer.domElement); //body元素中插入canvas对象
        //执行渲染操作   指定场景、相机作为参数
        // renderer.render(scene, camera);

        // let T0 = new Date();//上次时间
        // function render() {
        //     let T1 = new Date();//本次时间
        //     let t = T1-T0;//时间差
        //     T0 = T1;//把本次时间赋值给上次时间
        //     requestAnimationFrame(render);
        //     renderer.render(scene,camera);//执行渲染操作
        //     mesh.rotateY(0.001*t);//旋转角速度0.001弧度每毫秒
        // }
        // render();


        function render(e) {
            
            renderer.render(scene,camera);//执行渲染操作
        }
        render();
        var controls = new OrbitControls(camera,renderer.domElement);//创建控件对象
        controls.addEventListener('change', render);//监听鼠标、键盘事件

        window.onresize = () => {
            renderer.setSize(window.innerWidth,window.innerHeight);
            k = window.innerWidth/window.innerHeight;//窗口宽高比
            camera.left = -s*k;
            camera.right = s*k;
            camera.top = s;
            camera.bottom = -s;
            camera.updateProjectionMatrix ();
            render()
        }
    }
};
</script>

<style lang="scss" scoped>
#home{
    position:relative;
}
</style>