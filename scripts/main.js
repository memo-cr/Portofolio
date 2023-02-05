import "../style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

function animate() {
  requestAnimationFrame(animate);

  // const currentTimeline = window.pageYOffset / 3000; // ? following section takes the pos from currenttimeline and follows the line
  // if (currentTimeline < 1) {
  //   const pos = curve.getPointAt(currentTimeline);
  //   camera.position.copy(pos);
  //   camera.lookAt(0, 24, 10);

  // }

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
renderer.shadowMap.enabled = true;
camera.position.set(0, 25, 0);
camera.lookAt(0, 30, -1000);

// ! creating lights
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(20, 20, -30);

light.castShadow = true;

light.intensity = 1;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 1;
light.shadow.camera.far = 100;
light.shadow.camera.fov = 90;
light.shadow.camera.top = 10;
scene.add(light);

// const lighthelper = new THREE.PointLightHelper(light, 1);
// scene.add(lighthelper);
const ambientLight = new THREE.AmbientLight(0x808080);
ambientLight.intensity = 1;
// ambientLight.castShadow = true;
scene.add(ambientLight);

scene.background = new THREE.Color("#ADD8E6");

// ! loading texture

const assetLoader = new FBXLoader(); //change fbx to gltf
assetLoader.load(
  "assets/BirchTree_1_FBX.fbx",
  (object) => {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);
  },
  undefined,
  function (err) {
    console.error(err);
  }
);

// ! floor

var floorMaterial = new THREE.MeshToonMaterial({
  color: "#90ee90",
  side: THREE.DoubleSide,
});
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
floor.doubleSided = true;
floor.receiveShadow = true;
floor.position.y = -10;
scene.add(floor);

const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 25, 0),
  new THREE.Vector3(2, 24, -13),
  new THREE.Vector3(14, 20, -21),
  new THREE.Vector3(22, 17, -24),
  new THREE.Vector3(33, 10, -17),
]);

const points = curve.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

// Create the final object to add to the scene
const curveObject = new THREE.Line(geometry, material);
// scene.add(curveObject);

const controls = new OrbitControls(camera, renderer.domElement);

animate();

var text = "hello world";
//create image
var bitmap = document.createElement("canvas");
var g = bitmap.getContext("2d");
bitmap.width = 100;
bitmap.height = 100;
g.font = "Bold 20px Arial";

g.fillStyle = "white";
g.fillText(text, 0, 20);
g.strokeStyle = "black";
g.strokeText(text, 0, 20);

// canvas contents will be used for a texture
var texture = new THREE.Texture(bitmap);
texture.needsUpdate = true;

const geometryplane = new THREE.PlaneGeometry(100, 100);
const materialplane = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(geometryplane, materialplane);
plane.position.set(0, 100, 0);
scene.add(plane);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
