
<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/Addons.js";
// 导入调试工具
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
const animateSwitch = ref(false);
const containerRef = ref<HTMLDivElement>();
//创建场景
const scene = new THREE.Scene();
//创建摄像机
const camera = new THREE.PerspectiveCamera(
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
const renderer = new THREE.WebGLRenderer();
//重置webGL的颜色（画布背景色）
renderer.setClearColor(new THREE.Color("#eeeeee"));
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader();
// 增加纹理
const texture = textureLoader.load("./texture/corrugated.jpg");
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
  map: texture,
  side: THREE.DoubleSide,
});

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 带阻尼的惯性
controls.enableDamping = true;
// 旋转速度
controls.autoRotateSpeed = 1;
// 自动旋转
// controls.autoRotate = true;
controls.minDistance = 10;
controls.maxDistance = 80;

// 创建GUI调试器
const gui = new GUI();
const controllers = {
  open: () => {
    animateSwitch.value = false;
  },
  close: () => {
    animateSwitch.value = true;
  },
};
gui.add(controllers, "close").name("合");
gui.add(controllers, "open").name("开");

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
  if (animateSwitch.value) {
    //   if (groups.value[0].rotation.z > Math.PI * -0.5) {
    //     groups.value[0].rotateZ(-0.01);
    //   }
    //   if (groups.value[2].rotation.x < Math.PI * 0.5) {
    //     groups.value[2].rotateX(0.01);
    //   }
    // if (groups.value[0].rotation.x > Math.PI * -0.5) {
    //   groups.value[0].translateZ(7);
    //   groups.value[0].rotateX(-0.01);
    // }
    // } else {
    //   if (groups.value[0].rotation.z < 0) {
    //     groups.value[0].rotateZ(0.01);
    //   }
  }
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
