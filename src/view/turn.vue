
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  AxesHelper,
  BufferGeometry,
  BufferAttribute,
  Color,
  Mesh,
  MeshBasicMaterial,
  Group,
  DoubleSide,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  TextureLoader,
  SpotLight,
  BoxHelper,
  Box3,
} from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/Addons.js";
// 导入调试工具
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
const animateSwitch = ref(false);
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

// 创建纹理加载器
const textureLoader = new TextureLoader();
// 增加纹理
const texture = textureLoader.load("./texture/corrugated.jpg");
const material = new MeshBasicMaterial({
  wireframe: true,
  map: texture,
  side: DoubleSide,
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

const data = [
  // [-2, 0, -5, -2, 0, 5, 0, 0, 5, 0, 0, -5],
  // [0, 0, 5, 0, 0, -5, 7, 0, -5, 7, 0, 5],
  // [0, 0, -7, 0, 0, -5, 7, 0, -5, 7, 0, -7],
  // [0, 0, 7, 0, 0, 5, 7, 0, 5, 7, 0, 7],
  // [7, 0, -5, 7, 0, 5, 9, 0, 5, 9, 0, -5],
  // [9, 0, -5, 9, 0, 5, 16, 0, 5, 16, 0, -5],

  [0, 0, 0, 0, 0, 2, 7, 0, 2, 7, 0, 0],
];
// 创建平面瓦楞纸
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
// 创建组列表
const groups = ref([]);
for (let i of data) {
  let geometry = new BufferGeometry();
  let vertices = new Float32Array(i);
  // 因为每个顶点都是一个三元组。
  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  // 使用索引
  geometry.setIndex(new BufferAttribute(indices, 1));
  let mesh = new Mesh(geometry, material);
  // 模型的包围盒
  let boxHelper = new BoxHelper(mesh);
  scene.add(boxHelper);

  // mesh.position.set(0, 0, -7);
  let group = new Group();
  // groups.value.push(group);
  scene.add(group);
  group.add(mesh);

  let box = new Box3().setFromObject(mesh);
  console.log(box);
  

  //添加坐标系
  const ases = new AxesHelper(20);
  ases.position.copy(group.position);
  scene.add(ases);
}

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
