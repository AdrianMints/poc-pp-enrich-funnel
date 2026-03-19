/* Starts the device camera stream and attaches it to a video element. */
async function startCamera(videoEl) {
  if (!videoEl || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera API is not available');
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {
        ideal: 'environment'
      }
    },
    audio: false
  });
  videoEl.srcObject = stream;
  await videoEl.play();
  return stream;
}

/* Captures a still frame from an active video stream and returns a dataURL. */
function captureFrame(videoEl) {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
    return '';
  }
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.92);
}

/* Stops all tracks in a stream to release camera resources on navigation. */
function stopCamera(stream) {
  if (!stream) {
    return;
  }
  stream.getTracks().forEach(function (track) {
    track.stop();
  });
}
