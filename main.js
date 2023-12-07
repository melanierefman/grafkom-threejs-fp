import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene, camera, and renderer
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const loader = new GLTFLoader();
let object3D;

loader.load('./glb/modeltidakgabungan.glb', function (gltf) {
  console.log(gltf);
  const root = gltf.scene;
  root.scale.set(0.01, 0.01, 0.01);
  object3D = root;
  scene.add(object3D);
}, function (xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function (error) {
  console.log('An error happened');
});

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3); 
hemisphereLight.position.set(0.1, 0.1, 0.1);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); 
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Camera setup
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(10, sizes.width / sizes.height, 1, 100);
camera.position.set(2, 2, 2);
scene.add(camera);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;
renderer.setClearColor(new THREE.Color(0.5, 0.9, 1)); // Nilai RGB lebih mendekati putih

// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1;
controls.screenSpacePanning = false;

// Handle window resize
const handleResize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  controls.update();
};

window.addEventListener('resize', handleResize);

// Animation
const animate = () => {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
};

animate();



