import "../style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function animate() {
  requestAnimationFrame(animate);
  // const currentTimeline = window.pageYOffset / 1500;
  // if (currentTimeline < 1) {
  //   const pos = curve.getPointAt(currentTimeline);
  //   camera.position.copy(pos);
  //   console.log(curve.getPointAt(currentTimeline));
  // }

  camera.lookAt(0, 30, -10);
  // console.log(camera.position);
  controls.update();
  renderer.render(scene, camera);
}

// ! scene init camera init and renderer init
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 30, -40);
camera.lookAt(0, 30, -10);

// ! creating lights
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(164, 176, 180);
pointlight.castShadow = true;
pointlight.intensity = 1.5;
scene.add(pointlight);

const pointlight1 = new THREE.PointLight(0xffffff);
pointlight1.position.set(-52, 7, 299);
pointlight1.intensity = 0.5;
scene.add(pointlight1);

const ambientLight = new THREE.AmbientLight(0x808080);
ambientLight.intensity = 0.1;
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointlight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper);
scene.add(gridHelper);

scene.background = new THREE.Color("#ADD8E6");

// ! loading texture

const assetLoader = new GLTFLoader();
assetLoader.load(
  "assets/scene.glb",
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
  },
  undefined,
  function (err) {
    console.error(err);
  }
);

const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, 0, 10),
  new THREE.Vector3(-5, 5, 5),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(5, -5, 5),
  new THREE.Vector3(10, 0, 10),
]);

const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

// Create the final object to add to the scene
const curveObject = new THREE.Line(geometry, material);
scene.add(curveObject);

const controls = new OrbitControls(camera, renderer.domElement);
animate();
