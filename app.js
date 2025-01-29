const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,5,5);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const tableGeometry = new THREE.BoxGeometry(7, 0.3, 4);
const tablematerial = new THREE.MeshBasicMaterial({color: 0x8B4513});
const table = new THREE.Mesh(tableGeometry, tablematerial);
table.position.y = 1.5;
table.castShadow = true;
scene.add(table);

const legGeometry = new THREE.BoxGeometry(0.3, 3, 0.3);
const legMaterial = new THREE.MeshBasicMaterial({color: 0x8B4513});
const leg1 = new THREE.Mesh(legGeometry, legMaterial); 
const leg2 = new THREE.Mesh(legGeometry, legMaterial);
const leg3 = new THREE.Mesh(legGeometry, legMaterial);
const leg4 = new THREE.Mesh(legGeometry, legMaterial);
leg1.position.set(-3.2, 0, -1.7);
leg2.position.set( 3.2, 0, -1.7);
leg3.position.set(-3.2, 0,  1.7);
leg4.position.set( 3.2, 0,  1.7);
leg1.castShadow = true;
leg2.castShadow = true;
leg3.castShadow = true;
leg4.castShadow = true;
scene.add(leg1, leg2, leg3, leg4);


const paddleGeometry = new THREE.BoxGeometry(0.1, 0.2, 1);
const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
leftPaddle.position.set(-3, 1.8, 0);
rightPaddle.position.set(3, 1.8, 0);
scene.add(leftPaddle, rightPaddle);


const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 1.8, 0);
scene.add(ball);


// Ajouter une lumière directionnelle pour les ombres
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);

// Ajouter un sol pour recevoir les ombres
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.5;
ground.receiveShadow = true;
scene.add(ground);

scene.background = new THREE.Color(0xFFFFFF); // Bleu ciel


// 4️⃣ Variables pour la physique du jeu
let ballSpeedX = 0.05;
let ballSpeedZ = 0.05;
let paddleSpeed = 0.2;

// 5️⃣ Gestion des contrôles
const keys = {};
window.addEventListener("keydown", (event) => (keys[event.key] = true));
window.addEventListener("keyup", (event) => (keys[event.key] = false));

// 6️⃣ Animation et logique du jeu
function animate() {
    requestAnimationFrame(animate);

    // Déplacer les raquettes (Z / S pour gauche, Haut / Bas pour droite)
    if (keys["w"] && leftPaddle.position.z > -1.5) leftPaddle.position.z -= paddleSpeed;
    if (keys["s"] && leftPaddle.position.z < 1.5) leftPaddle.position.z += paddleSpeed;
    if (keys["ArrowUp"] && rightPaddle.position.z > -1.5) rightPaddle.position.z -= paddleSpeed;
    if (keys["ArrowDown"] && rightPaddle.position.z < 1.5) rightPaddle.position.z += paddleSpeed;

    // Déplacer la balle
    ball.position.x += ballSpeedX;
    ball.position.z += ballSpeedZ;

    // Rebonds sur les bords
    if (ball.position.z > 1.8 || ball.position.z < -1.8) ballSpeedZ *= -1;

    // Collision avec les raquettes
    if (
        (ball.position.x < -2.9 && ball.position.x > -3.1 && Math.abs(ball.position.z - leftPaddle.position.z) < 0.6) ||
        (ball.position.x > 2.9 && ball.position.x < 3.1 && Math.abs(ball.position.z - rightPaddle.position.z) < 0.6)
    ) {
        ballSpeedX *= -1; // Changer de direction
    }

    // Vérifier si la balle sort (reset)
    if (ball.position.x < -3.5 || ball.position.x > 3.5) {
        ball.position.set(0, 1.8, 0);
        ballSpeedX *= -1; // Inverser la direction après reset
    }

    // Render
    renderer.render(scene, camera);
}
animate();
