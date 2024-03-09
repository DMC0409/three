<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  AxesHelper,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  TextureLoader,
} from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/Addons.js";
// 导入调试工具
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const containerRef = ref<HTMLDivElement>();
//创建场景
const scene = new Scene();
//创建摄像机
const camera = new PerspectiveCamera(
  35, //视角
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近平面
  1000 //远平面
);
//设置摄像机位置
camera.position.set(-30, 30, 30);
//设置摄像机朝向
camera.lookAt(scene.position);

// 创建渲染器
const renderer = new WebGLRenderer();
//重置webGL的颜色（画布背景色）
renderer.setClearColor(new Color("#eeeeee"));
renderer.setSize(window.innerWidth, window.innerHeight);

//添加坐标系
const ases = new AxesHelper(20);
scene.add(ases);

// //绘制板子，设置板子的宽度为60，设置板子的高度为20
// const planeGeometry = new PlaneGeometry(60, 20);
// const meshBasicMaterial = new MeshBasicMaterial({ color: 0xcccccc }); //设置材质颜色
// const plane = new Mesh(planeGeometry, meshBasicMaterial);

// plane.rotation.x = -0.5 * Math.PI;
// plane.position.x = 15;
// plane.position.y = 0;
// plane.position.z = 0;
// scene.add(plane);

//绘制立方体，设置板子的长宽高分别是4,4,4
const cubeGeometry = new BoxGeometry(4, 4, 4);
// 创建纹理加载器
const textureLoader = new TextureLoader();
// 增加纹理
const texture = textureLoader.load("./texture/corrugated.jpg");
const cubeMaterial = new MeshBasicMaterial({
  wireframe: false,
  map: texture,
});
const cube = new Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 0);
scene.add(cube);

//绘制球体，设置球体的半径为4
const sphereGeometry = new SphereGeometry(4);
const sphereMaterial = new MeshBasicMaterial({
  color: "#7777ff",
  wireframe: true,
});
const sphere = new Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 15;
sphere.position.y = 4;
sphere.position.z = 2;
scene.add(sphere);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 带阻尼的惯性
controls.enableDamping = true;
// 旋转速度
controls.autoRotateSpeed = 1;
// 自动旋转
controls.autoRotate = true;
controls.minDistance = 10;
controls.maxDistance = 80;

// 创建GUI调试器
const gui = new GUI();
let folder = gui.addFolder("立方体位置");
folder.add(cube.position, "x").min(-10).max(10).step(1).name("立方体x轴位置");
folder.add(cube.position, "y").min(-10).max(10).step(1).name("立方体y轴位置");
folder.add(cube.position, "z").min(-10).max(10).step(1).name("立方体z轴位置");
gui.add(cubeMaterial, "wireframe").name("父元素线框模式");
let colorParams = {
  cubeColor: "#ff0000",
};
gui
  .addColor(colorParams, "cubeColor")
  .name("立方体颜色")
  .onChange((val) => {
    cube.material.color.set(val);
  });

onMounted(() => {
  //设置摄像头朝向
  containerRef.value?.appendChild(renderer.domElement);
  animate();
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
});
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
