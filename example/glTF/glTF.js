import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls }from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";

class App {
  constructor() {
    const divContainer = document.getElementById("container");
    this._divContainer = divContainer;  //다른 메서드에서 사용할 수 있도록

    const randerar = new THREE.WebGLRenderer({ antialias: true });
    randerar.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(randerar.domElement);
    this._randerar = randerar;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 'white' );
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _zoomFit(object3D, camera){
    const box = new THREE.Box3().setFromObject(object3D);

    const sizeBox = box.getSize(new THREE.Vector3()).length();

    const centerBox = box.getCenter(new THREE.Vector3());

    const halfSizeModel = sizeBox * 0.5;

    const halfFov = THREE.Math.degToRad(camera.fov * .5);

    const distance = halfSizeModel / Math.tan(halfFov);

    const direction = (new THREE.Vector3()).subVectors(
      camera.position, centerBox).normalize();
    
    const position = direction.multiplyScalar(distance).add(centerBox);
      camera.position.copy(position);

    camera.near = sizeBox /100;
    camera.far = sizeBox * 100;

    camera.updateProjectionMatrix();

    camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.z = 10;
    this._camera = camera;

    this._scene.add(this._camera);
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._camera.add(light);
  }

  _setupModel() {
    const gltfLoader = new GLTFLoader();
    const url = 'data/bee_gltf/scene.gltf';
    gltfLoader.load(
      url,
      (gltf) => {
        const root = gltf.scene;
        this._scene.add(root);

        this._zoomFit(root, this._camera);
      }
    )
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._randerar.setSize(width, height);
  }

  render() {
    this._randerar.render(this._scene, this._camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = function() {
  new App();
}
