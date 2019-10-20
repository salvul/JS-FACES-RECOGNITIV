const videoSize = {width: 780, height:380}

const video = document.querySelector("video")

video.addEventListener("play", () => {
    //fare riconoscimento multiplo
    const facesOverlay = faceapi.createCanvasFromMedia(video)
    document.body.append(facesOverlay)
    facesOverlay.style="z-index:1; position: absolute; top:0; left:0"
    faceapi.matchDimensions(facesOverlay,videoSize)
    setInterval (async ()=>{
        const facesDetected = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({inputSize:256}))
        const resizedFaces = faceapi.resizeResults(facesDetected,videoSize)
        facesOverlay.getContext("2d").clearRect(0,0,facesOverlay.width,facesOverlay.height)
        faceapi.draw.drawDetections(facesOverlay,resizedFaces)
    },100)
})

const app = () => {
    console.log("in app() ");
    const videoOptions = {
        audio: false,
        video: videoSize
    }


    navigator.mediaDevices.getUserMedia(videoOptions)
        .then(mediaStream => {
            video.srcObject = mediaStream
            video.onloadedmetadata = () => { video.play() }
        })

}

faceapi.nets.tinyFaceDetector.loadFromUri("/weights")
    .then(app)