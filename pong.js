let ia = false;
let lastIaUpdate = Date.now();
let speedFactor = 5;
var isTournament = false;

function initPongGame() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Utilisation de la section #choix-PONG pour le rendu
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
    
    // Définir un fond bleu pour la scène
    scene.background = new THREE.Color(0x161a22); // Bleu

    const loader = new THREE.TextureLoader();
    loader.load('textures/stardust.png', function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        // Création du matériau avec transparence
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true, // Active la transparence si l'image a un fond noir
        });

        // Création du plan qui affichera la texture
        const geometry = new THREE.PlaneGeometry(20, 20);
        const background = new THREE.Mesh(geometry, material);
        background.position.set(0, 0, -10); // Place le plan en arrière-plan
        scene.add(background);
    });

    let gameOver = false; // Variable pour stopper le jeu une seule fois

    // Trouver la section PONG et y ajouter le renderer
    const pongSection = document.getElementById('choix-PONG');
    pongSection.appendChild(renderer.domElement);

    // Position de la caméra (légèrement inclinée pour une meilleure vue)
    // camera.position.set(0, 6, 10);
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    // Plateau (plus large)
    const plateGeometry = new THREE.BoxGeometry(14, 0.1, 10);
    const plateMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.set(0, 0, 0);
    scene.add(plate);

    let player1Score = 0;
    let player2Score = 0;

    // Fonction pour mettre à jour le score dans l'HTML
    function updateScore()
    {
        const scoreBoard = document.getElementById('scoreBoard');
        scoreBoard.innerHTML = `Player 1 ${player1Score} : ${player2Score} Player 2 `;
    }

    function resetScore()
    {
        player1Score = 0;
        player2Score = 0;
        updateScore();
    }

    // Bordures horizontales (haut/bas) en rouge
    const bordHGeometry = new THREE.BoxGeometry(14, 0.5, 0.5);
    const bordHMaterial = new THREE.MeshStandardMaterial({ color: 0x434788 });

    const bordHaut = new THREE.Mesh(bordHGeometry, bordHMaterial);
    bordHaut.position.set(0, 0.5, 5);
    scene.add(bordHaut);

    const bordBas = new THREE.Mesh(bordHGeometry, bordHMaterial);
    bordBas.position.set(0, 0.5, -5);
    scene.add(bordBas);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 5).normalize();
    scene.add(directionalLight);

    // Création de la géométrie de la balle (sphère)
    const geometry = new THREE.SphereGeometry(0.25, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const ball = new THREE.Mesh(geometry, material);
    ball.position.set(0, 0.5, 0);
    scene.add(ball);

    // Initialisation des vitesses (physique simple)
    let ballVelocity = new THREE.Vector3(0.05, 0, 0.05); // Vitesse initiale de la balle
    const ballSpeed = 0.1; // Contrôle de la vitesse de la balle

    // Création des paddles
    const paddleLG = new THREE.BoxGeometry(0.1, 0.5, 1.5);
    const paddleLM = new THREE.MeshStandardMaterial({ color: 0x6478ff });
    const paddleLeft = new THREE.Mesh(paddleLG, paddleLM);
    paddleLeft.position.set(-6.5, 0.5, 0);
    scene.add(paddleLeft);

    const paddleRG = new THREE.BoxGeometry(0.1, 0.5, 1.5);
    const paddleRM = new THREE.MeshStandardMaterial({ color: 0x6478ff });
    const paddleRight = new THREE.Mesh(paddleRG, paddleRM);
    paddleRight.position.set(6.5, 0.5, 0);
    scene.add(paddleRight);

    // Variables pour la gestion du mouvement des paddles
    let paddleLeftSpeed = 0;
    let paddleRightSpeed = 0;
    const paddleMaxSpeed = 0.1;

    // Contrôles du clavier
    window.addEventListener('keydown', (event) => {
        if (event.key === 'w') paddleLeftSpeed = -paddleMaxSpeed;
        if (event.key === 's') paddleLeftSpeed = paddleMaxSpeed;
        if (event.key === 'ArrowUp') paddleRightSpeed = -paddleMaxSpeed;
        if (event.key === 'ArrowDown') paddleRightSpeed = paddleMaxSpeed;
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'w' || event.key === 's') paddleLeftSpeed = 0;
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') paddleRightSpeed = 0;
    });
    
    // Condition Victoire
    function checkWin()
    {
        console.log(isTournament);
        if (isTournament == false)
        {
            if (player1Score === 3)
            {
                gameOver = true; // Empêche que cela se répète
                document.getElementById('choix-jeu').style.display = 'block'; // Affiche la section
                document.getElementById('choix-PONG').style.display = 'none'; // Cache le jeu
                resetScore();
                return true; // Stopper l'animation
            }
            if (player2Score === 3)
            {
                gameOver = true; // Empêche que cela se répète
                document.getElementById('choix-jeu').style.display = 'block'; // Affiche la section
                document.getElementById('choix-PONG').style.display = 'none'; // Cache le jeu
                resetScore();
                return true; // Stopper l'animation
            }
        }
        else
        {
            if (player1Score === 3) {
                gameOver = true;
                document.getElementById('match-display').style.display = 'block';
                document.getElementById('choix-PONG').style.display = 'none';
                resetScore();
                finishMatch(currentMatchIndex, "Player 1");
                return true;
            }
            if (player2Score === 3) {
                gameOver = true;
                document.getElementById('match-display').style.display = 'block';
                document.getElementById('choix-PONG').style.display = 'none';
                resetScore();
                finishMatch(currentMatchIndex, "Player 2");
                return true;
            }
        }
        return false;
    }


    function updateAI() {
        // Position actuelle de la balle
        let ballX = ball.position.x;
        let ballZ = ball.position.z;
        
        // Vitesse de la balle
        let speedX = ballVelocity.x;
        let speedZ = ballVelocity.z;
    
        // La position de la ligne de but sur le côté droit
        let targetX = 6.5;  // Côté droit du terrain
    
        // Calculer le temps nécessaire pour que la balle atteigne x = 6.5
        if (speedX !== 0) {
            let timeToReachX = (targetX - ballX) / speedX;
    
            // Si le temps est positif, cela signifie que la balle se dirige vers la ligne de but du côté droit
            if (timeToReachX > 0) {
                // Calcul de la position de la balle en Z au moment où elle atteindra x = 6.5
                let predictedZAtX = ballZ + speedZ * timeToReachX;
    
                // Dessiner un point rouge à l'endroit où la balle va toucher x = 6.5
                drawRedPoint(targetX, predictedZAtX);
            }
        }
    }
    
    function drawRedPoint(x, z) {
        // Code pour dessiner un point rouge à la position (x, z)
        // Cela peut varier en fonction de la bibliothèque graphique que vous utilisez
        // Exemple pour un contexte 3D avec Three.js
        let geometry = new THREE.SphereGeometry(0.1, 32, 32); // Petite sphère
        let material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Couleur rouge
        let point = new THREE.Mesh(geometry, material);
        point.position.set(x, 0, z); // Placer le point aux coordonnées x, z
        scene.add(point); // Ajouter le point à la scène
    }
    

    // function updateAI()
    // {
        // let currentTime = Date.now();
    
        // if (currentTime - lastIaUpdate >= 1000) {
        //     lastIaUpdate = currentTime;
        
        //     let zone1 = 1.25;
        //     let zone2 = 2.5;
        //     let zone3 = 3.75;
        //     let zone4 = 5;
        
        //     if (ball.position.x > 1.25)
        //     {
        //         if (ball.position.z > zone4) {
        //             positionBall = 4.5; // Zone très très haute
        //         } else if (ball.position.z > zone3) {
        //             positionBall = 3.5; // Zone très haute
        //         } else if (ball.position.z > zone2) {
        //             positionBall = 2.5; // Zone haute
        //         } else if (ball.position.z > zone1) {
        //             positionBall = 1.5; // Zone légèrement haute
        //         } else if (ball.position.z < -zone4) {
        //             positionBall = -4.5; // Zone très très basse
        //         } else if (ball.position.z < -zone3) {
        //             positionBall = -3.5; // Zone très basse
        //         } else if (ball.position.z < -zone2) {
        //             positionBall = -2.5; // Zone basse
        //         } else if (ball.position.z < -zone1) {
        //             positionBall = -1.5; // Zone légèrement basse
        //         } else {
        //             positionBall = 0; // Zone centrale
        //         }
        //     }
        //     else if (ball.position.x < -1.25)
        //     {
        //         if (ball.position.z > zone4) {
        //             positionBall = -4.5; // Zone très très haute
        //         } else if (ball.position.z > zone3) {
        //             positionBall = -3.5; // Zone très haute
        //         } else if (ball.position.z > zone2) {
        //             positionBall = -2.5; // Zone haute
        //         } else if (ball.position.z > zone1) {
        //             positionBall = -1.5; // Zone légèrement haute
        //         } else if (ball.position.z < -zone4) {
        //             positionBall = 4.5; // Zone très très basse
        //         } else if (ball.position.z < -zone3) {
        //             positionBall = 3.5; // Zone très basse
        //         } else if (ball.position.z < -zone2) {
        //             positionBall = 2.5; // Zone basse
        //         } else if (ball.position.z < -zone1) {
        //             positionBall = 1.5; // Zone légèrement basse
        //         } else {
        //             positionBall = 0; // Zone centrale
        //         }
        //     }
        // }
        
    
        // if (positionBall > paddleRight.position.z)
        //     paddleRight.position.z += paddleMaxSpeed;
        // else if (positionBall < paddleRight.position.z)
        //     paddleRight.position.z -= paddleMaxSpeed;
    // }
    

    function animate() {
        if (!gameOver) {
            requestAnimationFrame(animate);
        }
    
        if (checkWin()) {
            ia = false;
            return;
        }
    
        ball.position.add(ballVelocity);
    
        if (ball.position.z > 4.5 || ball.position.z < -4.5) {
            ballVelocity.z = -ballVelocity.z;
        }
    
        const paddleWidth = 0.2; // Largeur de la raquette
        const paddleHeight = 0.75; // Hauteur de la raquette (dans l'axe Z)

        // Collision avec la raquette gauche (paddleLeft)
        if (ball.position.z > paddleLeft.position.z - paddleHeight && ball.position.z < paddleLeft.position.z + paddleHeight &&
            ball.position.x > paddleLeft.position.x - paddleWidth && ball.position.x < paddleLeft.position.x + paddleWidth) {
            let reboundFactor = 1.05;
            ballVelocity.x = -ballVelocity.x * reboundFactor;
            ballVelocity.z += paddleLeftSpeed * 0.1;
        }

        // Collision avec la raquette droite (paddleRight)
        if (ball.position.z > paddleRight.position.z - paddleHeight && ball.position.z < paddleRight.position.z + paddleHeight &&
            ball.position.x > paddleRight.position.x - paddleWidth && ball.position.x < paddleRight.position.x + paddleWidth) {
            let reboundFactor = 1.;
            ballVelocity.x = -ballVelocity.x * reboundFactor;
            ballVelocity.z += paddleRightSpeed * 0.1;
        }
        
        if (ball.position.x > 6.5) {
            player1Score++;
            updateScore();
            resetGame();
        }
    
        if (ball.position.x < -6.5) {
            player2Score++;
            updateScore();
            resetGame();
        }

        paddleLeft.position.z += paddleLeftSpeed;

        if (ia)
        {
            updateAI();
            paddleRight.position.z += paddleRightSpeed;
        }
        else
            paddleRight.position.z += paddleRightSpeed;

        limitPaddleMovement();
        renderer.render(scene, camera);
    }
    
    function limitPaddleMovement() {
        paddleLeft.position.z = Math.max(-4, Math.min(4, paddleLeft.position.z));
        paddleRight.position.z = Math.max(-4, Math.min(4, paddleRight.position.z));
    }
    
    function resetGame() {
        ball.position.set(0, 0.5, 0);
        
        let speed = 0.07;
        // let randomX = (Math.random() > 0.5 ? 1 : -1) * speed;
        // let randomZ = (Math.random() > 0.5 ? 1 : -1) * speed;
        // ballVelocity.set(randomX, 0, randomZ);
        ballVelocity.set(0.05, 0, 0.05);
        paddleLeft.position.set(-6.5, 0.5, 0);
        paddleRight.position.set(6.5, 0.5, 0);
    }
    
    animate();    
}

document.getElementById('button-commencer').addEventListener('click', () => {
    const pongSection = document.getElementById('choix-PONG');
    pongSection.style.display = 'block';
  
    const existingCanvas = pongSection.querySelector('canvas');
    if (existingCanvas)
      pongSection.removeChild(existingCanvas);
  
    initPongGame();
});
  
document.getElementById('button-startIa').addEventListener('click', () => {
    const pongSection = document.getElementById('choix-PONG');
    pongSection.style.display = 'block';
  
    const existingCanvas = pongSection.querySelector('canvas');
    if (existingCanvas)
        pongSection.removeChild(existingCanvas);
  
    ia = true;
    initPongGame();
});