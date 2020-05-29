<template>
    <div class="about">
        <video id="test_video" controls autoplay>
            <source src="rtsp://admin:123456Aa@183.62.167.24:554/mpeg4/ch1/sub/av_stream">
        </video>
    </div>
</template>


<script>
// import streamedian from 'streamedian'

export default {
    mounted() {
        let mediaElement = rtsp.attach(document.getElementById('test_video'))

        let player = new streamedian.WSPlayer(mediaElement, {
            url: "rtsp://admin:123456Aa@183.62.167.24:554/mpeg4/ch1/sub/av_stream"
        })
    }
}
</script>