const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );


    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
  
        var position_x = landmarks[4].x*window.innerWidth;
        var position_y = landmarks[4].y*document.getElementById("canvas").offsetHeight;

        document.getElementById('coursor').style.setProperty("top",  position_y + "px");
        document.getElementById('coursor').style.setProperty("left", position_x + "px");

        if( is_connected( 8, 4, landmarks ) ) {
            click(position_x - 1, position_y - 1); 
        }


        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#000",
            lineWidth: 5,
        });

        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
        }
    }
    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
});


function is_connected( first_finger, second_finger, landmarks ) {
    var position_x = landmarks[first_finger].x*window.innerWidth;
    var position_y = landmarks[first_finger].y*document.getElementById("canvas").offsetHeight;

    var position_x2 = landmarks[second_finger].x*window.innerWidth;
    var position_y2 = landmarks[second_finger].y*document.getElementById("canvas").offsetHeight;

    var by_width = false;
    if( position_x > position_x2 - 10 && position_x < position_x2 + 10 ){
        by_width = true;
    }

    var by_height = false;
    if( position_y > position_y2 - 20 && position_y < position_y + 20 ){
        by_height = true;
    }

    if( by_width && by_height ){
        return true;
    }

    return false;
}


hands.setOptions({
    maxNumHands: 2,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: window.innerWidth ,
    height: window.innerHeight,
});
camera.start();


function click(x,y){
    var ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    var el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}