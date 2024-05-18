const asciiArtDOT1 = document.getElementById("ascii-art-1");
// Escoger camara environment 
// Video de entrada webcam

//navigator.mediaDevices.getUserMedia({ video: true }).then((stream1) => {
navigator.mediaDevices.getUserMedia({audio: false,video: { facingMode: { ideal: "environment" },frameRate: { ideal: 10, max: 30 }}}).then(function(stream) {
      // Create video element to display the captured frames
      const video1 = document.createElement("video");
      video1.srcObject = stream;
      video1.play();

    const asciiProcessor1 = new AsciiProcessor();
    asciiProcessor1.processVideo(video1, asciiArtDOT1);
});

class AsciiProcessor {
  constructor() {
    
// Lista de caracteres ASCII 
    // try this /  "■|•","●|/","•||", "|||", "|○|","○○○","|▓|"
    this.asciiChars = ["■■","●●","●•", "■•","—■","—•","-·","· ",]; 
    
// Tamaño en pixels de lineas ASCII
    this.width = 130;  //movil V 96 H 36 screen 198 courier / Lucida 228
    this.height = 150; //movil V 54 H 96 screen 150 courier / Lucida 150
  }

  processVideo(video1, asciiArtDOT1) {
    // Creacion del canvas para la imagen tratada
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const context = canvas.getContext("2d");

    // Boucle del procesado de la imagen en tiempo real
    const processFrame = () => {
      context.drawImage(video1, 0, 0, this.width, this.height);
      const imageData = context.getImageData(0, 0, this.width, this.height);
      const asciiData = this.imageDataToAscii(imageData);
      asciiArtDOT1.textContent = asciiData;
      requestAnimationFrame(processFrame);
    };
    requestAnimationFrame(processFrame);
  }

  imageDataToAscii(imageData) {
    let asciiData = "";
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      // try this //= 0.33 * r + 0.33 * g + 0.33 * b; // 
      // or this // = 0.2126 * r + 0.7152 * g + 0.0722 * b; //
      //= 0.299 * r + 0.587 * g + 0.114 * b;
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const asciiCharIndex = Math.floor(
        ((this.asciiChars.length - 1) * (255 - luminance)) / 255
      );
      const asciiChar = this.asciiChars[asciiCharIndex];
      asciiData += asciiChar;
      if ((i / 4 + 1) % this.width === 0) {
        asciiData += "\n";
      }
    }
    return asciiData;
  }
}
// full screen content
const enterFullscreen = document.getElementById("enter-fullscreen");
const exitFullscreen = document.getElementById("exit-fullscreen");

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    enterFullscreen.setAttribute("stroke", "transparent");
    exitFullscreen.setAttribute("stroke", "white");
  } else {
    document.exitFullscreen();
    enterFullscreen.setAttribute("stroke", "white");
    exitFullscreen.setAttribute("stroke", "transparent");
  }
}

// recordscreen
const enterrecordscreen = document.getElementById("enter-recordscreen");
const exitrecordscreen = document.getElementById("exit-recordscreen");
function togglerecordscreen() {
  if (!document.recordscreenElement) {
    enterrecordscreen.setAttribute("stroke", "transparent");
    exitrecordscreen.setAttribute("stroke", "red");
  } else {
    enterrecordscreen.setAttribute("stroke", "red");
    exitrecordscreen.setAttribute("stroke", "transparent");
  }
}
const btnrecordscreen = document.querySelector('button');

btnrecordscreen.addEventListener("click", async () => {
  const media = await navigator.mediaDevices.getDisplayMedia();
  const mediarecorder = new MediaRecorder(media);
  mediarecorder.start();
  const [video] = media.getVideoTracks();
  video.addEventListener("ended", () => {
    mediarecorder.stop();
  });

  mediarecorder.addEventListener("dataavailable", (e) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(e.data);
    link.download = "capture.webm";
    link.click();
  });
});