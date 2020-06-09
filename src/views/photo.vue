<template>
    <div id="photo"></div>
</template>

<script>


import { Viewer } from "photo-sphere-viewer"
import MarkersPlugin from "photo-sphere-viewer/dist/plugins/markers"
import "photo-sphere-viewer/dist/plugins/markers.css"
import "photo-sphere-viewer/dist/photo-sphere-viewer.css"

let viewer
let panorama = {
    // left  : require("@/textures/cube/Park3Med/px.jpg"),
    // front : require("@/textures/cube/Park3Med/nz.jpg"), 
    // right : require("@/textures/cube/Park3Med/nx.jpg"), 
    // back  : require("@/textures/cube/Park3Med/pz.jpg"), 
    // top   : require("@/textures/cube/Park3Med/py.jpg"), 
    // bottom: require("@/textures/cube/Park3Med/ny.jpg")
    left  : require("@/vr/pano_l.jpg"), // 左边
    front : require("@/vr/pano_f.jpg"), // 前面
    right : require("@/vr/pano_r.jpg"), // 右边
    back  : require("@/vr/pano_b.jpg"), // 后面
    top   : require("@/vr/pano_u.jpg"), // 顶部
    bottom: require("@/vr/pano_d.jpg"), // 底部
}


console.log(MarkersPlugin)

export default {
    methods: {
        init() {
            viewer = new Viewer({
                container: document.querySelector("#photo"),
                panorama: panorama,
                // panorama: {
                //     left  : require("@/textures/cube/Park3Med/px.jpg"),
                //     front : require("@/textures/cube/Park3Med/nx.jpg"), 
                //     right : require("@/textures/cube/Park3Med/py.jpg"), 
                //     back  : require("@/textures/cube/Park3Med/ny.jpg"), 
                //     top   : require("@/textures/cube/Park3Med/pz.jpg"), 
                //     bottom: require("@/textures/cube/Park3Med/nz.jpg")
                // },
                navbar    : null,
                plugins: [
                    [MarkersPlugin, {
                        markers: (function(){
                            var a = []

                            a.push({
                                id: "new-marker",
                                longitude: "-45deg",
                                latitude: "0deg",
                                width: 120,
                                height: 120,
                                // image: require("@/views/timg.jpg")
                                image: "https://photo-sphere-viewer.js.org/assets/pin-blue.png"
                            })

                            a.push({
                                id: "new-marker1",
                                longitude: "0deg",
                                latitude: "0deg",
                                html: `<div style="width:200px;height:200px;background:red"></div>`
                            })

                            return a
                        }())
                    }]
                ]
            });
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style lang="scss" scoped>
html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
}

#photo{
  width: 100%;
  height: 667px;
}
</style>