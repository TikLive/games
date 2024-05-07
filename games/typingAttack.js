/*
TODO: 
- Add connection with TikTok Chat
- Add player ranking
*/

// Array to store balloon objects
let balloons = [];

// Initial vertical offset for balloons
let yOffset = 10;

// Index for iterating through themes array
let index = 0;

// Index of the selected balloon for typing
let selectedBalloonIndex = 0;

// Countdown for typing each word
let countdown = 8;

// Length of the word to type
let wordLength = 0;

// Player's score
let score = 0;

// Get the canvas element and its 2D context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions based on window size
const canvasHeight = window.innerHeight * 0.7;
const canvasWidth = canvasHeight * (9 / 16);
canvas.height = canvasHeight;
canvas.width = canvasWidth;

// Store the best score
let bestScore = localStorage.getItem("bestScore") || 0; // Get the best score from local storage

// Array of colors for balloons
const balloonColors = ["#DB291D", '#F85F68', '#77B1AD', '#F0B99A', '#E1CF79', '#F5998E', '#B16774', "#FAB301",
    "#F85F68", "#4FAA6D", "orange", "green", "#58A8C9", "#CDD6D5", "#ECD2A2", "#FF5733", "#FFC300", "#C70039",
    "#900C3F", "#581845", "#6E2C00", "#154360", "#1B4F72", "#000080"
];

// Array of themes or words for the balloons
const themes = ["paella", "tortilla", "empanadas", "churros", "gazpacho", "tacos", "cebiche", "pulpo", 
    "croquetas", "sangria", "jamon", "ensaladilla", "fabada", "crema", "tapas", "tarta", 
    "fideua", "bravas", "calamares", "gambas", "pinchos", "pisto", "marmitako", "cochinillo"
];

// Constructor function for creating balloon objects
function Balloon(x, y, radius, color, dy, text, typedWord) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.radius = radius; // radius of the balloon
    this.color = color; // color of the balloon
    this.dy = dy; // vertical speed
    this.text = text; // word displayed on the balloon
    this.typedWord = typedWord; // word typed by the player

    // Method to draw the balloon on the canvas
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.font = "15px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x - 25, this.y + 3);
    }

    // Method to update the position of the balloon
    this.update = function () {
        this.type(); // Display typed word
        this.y += this.dy; // Move balloon vertically
    }

    // Method to display the typed word on the canvas
    this.type = function () {
        ctx.font = '40px Arial';
        ctx.strokeStyle = 'lightgrey';
        ctx.strokeText(this.typedWord, 670, 580);
    }
}

// Function to initialize the game by creating balloon objects
function initGame() {
    balloons = [];
    score = 0;
    countdown = 8;
    selectedBalloonIndex = 0;
    wordLength = 0;
    index = 0;
    for (let i = 0; i < themes.length; i++) {
        let x = Math.random() * (canvas.width - 60) + 30;
        yOffset -= 60;
        let radius = 30;
        let dy = 1;
        let color = balloonColors[Math.floor(Math.random() * (balloonColors.length - 1))];
        let text = themes[index];
        index++;
        balloons.push(new Balloon(x, yOffset, radius, color, dy, text, ''));
    }
}

// Function to animate the game
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "18px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("SCORE:", 10, 60);

    ctx.fillText(score, 10, 80);

    // Display best score
    ctx.fillText("BEST SCORE: " + bestScore, 10, 100);

    ctx.font = "0px Arial";
    ctx.strokeStyle = 'white';
    ctx.strokeText("TYPING!", 10, 40);
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 20, canvas.height - 50, 50, 50);
    ctx.fill();
    for (let m = 0; m < balloons.length; m++) {
        balloons[m].draw();
    }
    for (let p = 0; p < balloons.length; p++) {
        balloons[p].update();
        if (balloons[p].y >= canvasHeight) {
            if (balloons[p].radius > 0) {
                // Game over, check for best score
                if (score > bestScore) {
                    bestScore = score;
                    localStorage.setItem("bestScore", bestScore); // Save the best score to local storage
                }
                alert("Game over!! Score: " + score);
                initGame();
                animate();
            }
        }
    }
}

// Event listener for the "play again" button
document.getElementById("play-again").addEventListener("click", function() {
    initGame();
    animate();
});

// Event listener for keyup events to handle typing
window.addEventListener("keyup", function (event) {
    let char = String.fromCharCode(event.keyCode).toLowerCase();
    if (countdown == 8) {
        for (let g = 0; g < balloons.length; g++) {
            if (balloons[g].y >= 0 && balloons[g].text.substring(0, 1) === char) {
                selectedBalloonIndex = g;
                wordLength = balloons[selectedBalloonIndex].text.length;
                break;
            }
        }
    }
    if (balloons[selectedBalloonIndex].text.substring(0, 1) === char) {
        let word = balloons[selectedBalloonIndex].text.substring(0, 1);
        balloons[selectedBalloonIndex].typedWord = word;
        balloons[selectedBalloonIndex].text = (balloons[selectedBalloonIndex].text).replace(word, "");
        countdown--;
        if (balloons[selectedBalloonIndex].text.length == 0) {
            countdown += wordLength;
            balloons[selectedBalloonIndex].radius = 0;
            balloons[selectedBalloonIndex].y = 0;
            score++;
            balloons[selectedBalloonIndex].typedWord = '';
        }
    }
});

// Detect if the game is loaded from a mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Function to focus on the hidden input if it's a mobile device
function focusMobileInput() {
    const mobileInput = document.getElementById("mobileInput");
    if (isMobile) {
        mobileInput.focus();
    }
}

// Call the function when the page is loaded
window.addEventListener("load", focusMobileInput);

// Initialize the game and start the animation loop
initGame();
animate();
