import "../style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TextTexture from "@seregpie/three.text-texture";
// * import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function animate() {
  requestAnimationFrame(animate);

  const currentTimeline = window.pageYOffset / 3000; // ? following section takes the pos from currenttimeline and follows the line
  if (currentTimeline < 1) {
    const pos = curve.getPointAt(currentTimeline);
    camera.position.copy(pos);
    camera.lookAt(0, 24, 10);
    texture.text = "";
    texture.text = [
      "Hi there,",
      "My name is Mehmet Caran",
      "i am a Software Engineer/Developer",
    ].join("\n");
  }

  if (currentTimeline > 0.5) {
    texture.redraw();
    texture.text = "";
    texture.text = [
      "Hi there,",
      "My name is Dominik Auer",
      "i am a Software Engineer/Developer",
    ].join("\n");
  }

  // console.log(camera.position);
  // controls.update();
  texture.lineGap = 0;
  texture.redraw();
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
const light = new THREE.SpotLight(0xffffff);
light.position.set(32, -17, -17);

light.castShadow = true;

light.intensity = 1.5;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 1;
light.shadow.camera.far = 100;
light.shadow.camera.fov = 90;
light.shadow.camera.top = 10;
scene.add(light);

// const ambientLight = new THREE.AmbientLight(0x808080);
// ambientLight.intensity = 0.5;
// ambientLight.castShadow = true;
// scene.add(ambientLight);

scene.background = new THREE.Color("#ADD8E6");

// ! loading texture

const assetLoader = new GLTFLoader();
assetLoader.load(
  "assets/c64_monitor.glb",
  function (gltf) {
    const model = gltf.scene;
    model.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });
    scene.add(model);
  },
  undefined,
  function (err) {
    console.error(err);
  }
);

// ! floor

var floorMaterial = new THREE.MeshStandardMaterial({
  color: "#ADD8E6",
  side: THREE.DoubleSide,
});
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
floor.doubleSided = true;
floor.receiveShadow = true;
floor.position.y = -10;
scene.add(floor);

let texture = new TextTexture({
  alignment: "left",
  color: "#24ff00",
  fontFamily: '" Consolas"',
  fontSize: 32,
  text: [
    "> Hi there,",
    "> My name is Mehmet Caran",
    "> i am a Software Engineer/Developer",
  ].join("\n"),
});

const geometry1 = new THREE.PlaneGeometry(27, 27);
const material1 = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  // map: texture,
  side: THREE.DoubleSide,
});

const material5 = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: texture,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry1, material5);
plane.position.set(0, 25, 17.5);
scene.add(plane);
plane.rotation.y = Math.PI;

const plane1 = new THREE.Mesh(geometry1, material1);
plane1.position.set(0, 25, 17.5);
scene.add(plane1);
plane1.rotation.y = Math.PI;

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
// const controls = new OrbitControls(camera, renderer.domElement);
animate();
