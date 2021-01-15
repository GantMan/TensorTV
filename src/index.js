import "./styles.css";
import * as tf from "@tensorflow/tfjs";

const blankScreenCanvas = document.getElementById("bsod");
const blankScreen = tf.fill([250, 350, 1], 0.2);
tf.browser.toPixels(blankScreen, blankScreenCanvas);

// CHALLENGE
// make a function getImage that takes the number of channels as an argument
// and returns a tensor image with that many channels of random pixel values
// that is 250 pixels tall and 350 pixels wide
// EXAMPLES:
// getImage(1) should return a black and white static image
// getImage(3) should return a random color static image

// ANSWER
let backImage = blankScreen;
const img = new Image();
img.crossOrigin = "anonymous";

function getImage(channels) {
  return tf
    .randomUniform([250, 350, channels], 0, 255, "int32")
    .add(backImage)
    .div(512);
}

// END OF YOUR CODE
// Feel free to look at the rest to see how this works,
// but the tensor image generation is done by you!

// Here's a bunch of variables and references to DOM elements to make things work!
let imgIndex = 0;
let canvasArr;
let tensorArr;
let tvPower = true;
const screen = document.getElementById("screen");
const rgbButton = document.getElementById("rgb");
const bwButton = document.getElementById("bw");
const powerButton = document.getElementById("power");

// This function creates 20 canvas elements based on your tensor function and
// loads them to the page with display = 'none'
function loadImages(channels) {
  screen.innerHTML = "";
  canvasArr = [];
  tensorArr = [];
  for (let i = 0; i < 20; i++) {
    const canvas = document.createElement("canvas");
    screen.appendChild(canvas);
    canvasArr.push(canvas);
    canvas.style.display = "none";
    // Your getImage function at work!
    const staticImg = getImage(channels);
    tensorArr.push(staticImg);
    tf.browser.toPixels(staticImg, canvas);
  }
}

// this function animates the static by looping over the array of canvas elements
// and toggling their display to be visible one at a time if the TV is "on"
function animatetvStatic() {
  requestAnimationFrame(() => {
    canvasArr[imgIndex].style.display = "none";
    imgIndex++;
    if (imgIndex >= canvasArr.length) imgIndex = 0;
    if (tvPower) {
      canvasArr[imgIndex].style.display = "block";
    }
    animatetvStatic();
  });
}

// this changes the array of canvas elements to be all black and white static
bwButton.onclick = function () {
  // some image here
  img.src = "/ganticorn.png";
  img.onload = (result) => {
    backImage = tf.image.resizeBilinear(
      tf.browser.fromPixels(img, 1),
      [250, 350],
      true
    );
    // prevent memory leaks!
    tf.dispose(tensorArr);
    loadImages(1);
  };
};

// this changes the array of canvas elements to be all color static
function doColor() {
  // some image here
  img.src = "/ganticorn.png";
  img.onload = () => {
    backImage = tf.image.resizeBilinear(
      tf.browser.fromPixels(img),
      [250, 350],
      true
    );
    // prevent memory leaks!
    tf.dispose(tensorArr);
    loadImages(3);
  };
}

rgbButton.onclick = doColor;

// toggles a boolean that our animation function uses to decide
// whether or not to display canvas elements
powerButton.onclick = function () {
  tvPower = !tvPower;
  powerButton.textContent = tvPower ? "Off" : "On";
};

loadImages(3);
doColor();
animatetvStatic();
