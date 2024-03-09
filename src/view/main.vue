
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
// 创建时钟
const clock = new THREE.Clock();
//创建摄像机
const camera = new THREE.PerspectiveCamera(
  35, //视角
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近平面
  1000 //远平面
);
camera.fov = 40;
//设置摄像机位置
camera.position.set(-20, 60, 30);
//设置摄像机朝向
camera.lookAt(scene.position);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 是否执行抗锯齿
});
//重置webGL的颜色（画布背景色）
renderer.setClearColor(new THREE.Color("#eeeeee"));
renderer.setSize(window.innerWidth, window.innerHeight);

//添加坐标系
const ases = new THREE.AxesHelper(20);
scene.add(ases);

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
const planeMaterial = new THREE.MeshLambertMaterial({
  // 生成材质
  color: 0xcccccc,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
scene.add(planeMesh); // 添加到场景中

// 创建平行光源
const light = new THREE.DirectionalLight(0xffffff, 1); // 平行光，颜色为白色，强度为1
light.position.set(-40, 40, 20); // 设置灯源位置
scene.add(light); // 添加到场景中

// 创建门框
const doorFrameSide = new THREE.BoxGeometry(1, 20, 2); // 侧边门框
const doorFrameTop = new THREE.BoxGeometry(12, 1, 2); // 上门框
const doorFrameMaterial = new THREE.MeshLambertMaterial({
  color: 0xad4800,
});
const doorFrameLeftMesh = new THREE.Mesh(doorFrameSide, doorFrameMaterial);
const doorFrameTopMesh = new THREE.Mesh(doorFrameTop, doorFrameMaterial);
const doorFrameRightMesh = doorFrameLeftMesh.clone();
doorFrameLeftMesh.position.set(-5.5, 10, 0);
doorFrameRightMesh.position.set(5.5, 10, 0);
doorFrameTopMesh.position.set(0, 20.5, 0);
scene.add(doorFrameLeftMesh);
scene.add(doorFrameRightMesh);
scene.add(doorFrameTopMesh);

// 创建门
const door = new THREE.BoxGeometry(10, 20, 0.5);
const doorMaterial = new THREE.MeshLambertMaterial({ color: 0xd88c00 });
const doorMesh = new THREE.Mesh(door, doorMaterial);

// 实现门围绕特定轴旋转
const group = new THREE.Group();
group.position.set(5, 10, 0); // 设置外层对象的中心为原本想要旋转的位置
group.add(doorMesh);
group.name = "door";
doorMesh.position.set(-5, 0, 0);
scene.add(group);

const times = [0, 3]; // 关键帧时间数组
const rotationValues = [0, -Math.PI / 2];
const rotationTrack = new THREE.KeyframeTrack(
  "door.rotation[y]",
  times,
  rotationValues
); // 关键帧轨道
const duration = 3; // 持续时间 (单位秒)
const clip = new THREE.AnimationClip("open", duration, [rotationTrack]); // 动画剪辑

// 播放编辑好的关键帧数据
const mixer = new THREE.AnimationMixer(group); // 动画混合器
const AnimationAction = mixer.clipAction(clip); // 返回所传入的剪辑参数的AnimationAction
AnimationAction.timeScale = 1; // 可以调节播放速度，默认是1。为0时动画暂停。值为负数时动画会反向执行。
AnimationAction.play(); // 开始播放

// // 创建纹理加载器
// const textureLoader = new THREE.TextureLoader();
// // 增加纹理
// const texture = textureLoader.load("./texture/corrugated.jpg");
// const material = new THREE.MeshBasicMaterial({
//   wireframe: true,
//   map: texture,
//   side: THREE.DoubleSide,
// });

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 带阻尼的惯性
controls.enableDamping = true;
// 旋转速度
controls.autoRotateSpeed = 1;
// 自动旋转
// controls.autoRotate = true;
controls.minDistance = 10;
controls.maxDistance = 100;

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

// const geometry = new THREE.BoxGeometry(5, 5, 5);
// // 材质
// const material = new THREE.MeshLambertMaterial({ color: 0xff1100 });
// const group = new THREE.Group(); // 创建一个画布
// const mesh1 = new THREE.Mesh(geometry, material); // 创建两个相大小和材质的正方体
// const mesh2 = new THREE.Mesh(geometry, material);
// mesh2.translateX(10);
// group.add(mesh1);
// group.add(mesh2);
// scene.add(group);

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
    mixer.update(clock.getDelta());
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
