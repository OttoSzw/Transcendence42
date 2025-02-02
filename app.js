import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById("three-container");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild(renderer.domElement);

const orbit = new OrbitControls( camera, renderer.domElement );

camera.position.set( 3, 2, 5 );
orbit.update();
orbit.minDistance = 3.0;
orbit.maxDistance = 6.0;

orbit.minPolarAngle = Math.PI / 4;
orbit.maxPolarAngle = Math.PI / 2.2;

// orbit.autoRotate = true;
orbit.enabled = true;

function updateCanvas() {
	camera.aspect = (container.offsetWidth) / (container.offsetHeight);
	camera.updateProjectionMatrix();
	renderer.setSize( container.offsetWidth, container.offsetHeight);
}

updateCanvas();

async function getGltfModels(path) {
	return new Promise((resolve, reject) => {
		const assetLoader = new GLTFLoader();

		assetLoader.load(path, (gltf) => {
			const model = gltf.scene;
			// scene.add(model);
			resolve(gltf.scene);
		}, undefined, (error) => {
			reject(error);
		});
	});
}

var porsche_env = await getGltfModels('scene.gltf');
scene.add(porsche_env);


camera.position.x = 3;
camera.position.z = 10;
camera.position.y = 2;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
window.addEventListener('resize', updateCanvas);
animate();
