const startBtn = document.getElementById('start-recording');
const stopBtn = document.getElementById('stop-recording');
const cameraPreview = document.getElementById('camera-preview');

let recordRTC;

const startRecording = () => {
  startBtn.disabled = true;
  navigator.getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      }
    }
  }, (stream) => {
    cameraPreview.src = window.URL.createObjectURL(stream);
    cameraPreview.muted=true; //Eliminate feedback
    cameraPreview.controls=false; //no need for controls while recording
    cameraPreview.play();
    recordRTC = RecordRTC(stream, { bufferSize: 16384 });
    recordRTC.startRecording();
    stopBtn.disabled = false;
  }, (error) => {
    alert(JSON.stringify(error));
    console.error(error);
  });
};

const stopRecording = () => {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  recordRTC.stopRecording(() => {
    cameraPreview.src = URL.createObjectURL(recordRTC.blob);
    cameraPreview.muted = false;
    cameraPreview.controls = true;
    const file = new File([recordRTC.getBlob()], `${Date.now()}.webm`);
    console.log(file);
    //a File object can be easily uploaded to any server
    //https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
  });
};

startBtn.onclick = startRecording;
stopBtn.onclick = stopRecording;