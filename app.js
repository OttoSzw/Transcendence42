// Récupérer les éléments du DOM
const playButton = document.getElementById('play-button');
const aboutButton = document.getElementById('about-button');
const backToHomeButtons = document.querySelectorAll('.back-to-home'); 

const homePage = document.getElementById('home-page');
const gamePage = document.getElementById('game-page');
const aboutPage = document.getElementById('about-page');

// Récupérer le canvas et son contexte
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Variables du jeu Pong
const paddleWidth = 10, paddleHeight = 100, ballSize = 10;
let paddleSpeed = 4, ballSpeedX = 4, ballSpeedY = 4;
let leftPaddleY = (canvas.height - paddleHeight) / 2, rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;

// Contrôles des paddles
let upArrow = false, downArrow = false, wKey = false, sKey = false;

// Fonction pour dessiner la raquette
function drawPaddle(x, y) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Fonction pour dessiner la balle
function drawBall() {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
}

// Fonction pour mettre à jour la position des éléments
function updateGame() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Déplacer les paddles
    if (upArrow && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    if (downArrow && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
    if (wKey && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (sKey && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
    
    // Déplacer la balle
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision avec le mur supérieur et inférieur
    if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Collision avec les paddles
    if (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballSize > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Réinitialiser la balle si elle sort de l'écran
    if (ballX - ballSize < 0 || ballX + ballSize > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    // Dessiner les éléments
    drawPaddle(0, leftPaddleY); // Raquette gauche
    drawPaddle(canvas.width - paddleWidth, rightPaddleY); // Raquette droite
    drawBall();
    
    requestAnimationFrame(updateGame); // Appeler la fonction à nouveau pour créer l'animation
}

// Fonction pour changer de page
function changePage(page) {
    homePage.style.display = 'none';
    gamePage.style.display = 'none';
    aboutPage.style.display = 'none';

    // Afficher la page correspondante
    if (page === 'home') {
        homePage.style.display = 'block';
    } else if (page === 'game') {
        gamePage.style.display = 'block';
        updateGame(); // Démarrer le jeu Pong lorsque la page du jeu est affichée
    } else if (page === 'about') {
        aboutPage.style.display = 'block';
    }

    // Manipuler l'URL sans recharger la page
    history.pushState({ page: page }, page, `#${page}`);
}

// Gestion du clic sur "Jouer" pour afficher la page du jeu
playButton.addEventListener('click', () => changePage('game'));

// Gestion du clic sur "À propos" pour afficher la page "À propos"
aboutButton.addEventListener('click', () => changePage('about'));

// Retour à l'accueil depuis le jeu
backToHomeButtons.forEach(button => {
    button.addEventListener('click', () => changePage('home'));
});

// Gérer les événements lorsque l'utilisateur utilise les boutons retour du navigateur
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        changePage(event.state.page);
    }
});

// Gérer les entrées clavier pour les paddles
document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp") upArrow = true;
    if (event.key === "ArrowDown") downArrow = true;
    if (event.key === "w") wKey = true;
    if (event.key === "s") sKey = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowUp") upArrow = false;
    if (event.key === "ArrowDown") downArrow = false;
    if (event.key === "w") wKey = false;
    if (event.key === "s") sKey = false;
});

// Au chargement initial, afficher la page en fonction de l'URL
if (window.location.hash) {
    changePage(window.location.hash.substring(1)); // Enlever le "#"
} else {
    changePage('home'); // Par défaut, afficher la page d'accueil
}
