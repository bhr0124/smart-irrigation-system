// 使用Three.js创建3D模型展示
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

class ModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // 添加环境光和平行光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);

        // 添加轨道控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // 加载3D模型
        this.loadModel();

        // 添加窗口大小调整监听
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // 开始动画循环
        this.animate();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            '/models/valve.glb', // 更新为支持的3D模型文件路径
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // 调整模型位置和大小
                this.model.scale.set(1, 1, 1);
                this.model.position.set(0, 0, 0);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened:', error);
            }
        );
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // 控制方法
    rotateLeft() {
        if (this.model) {
            this.model.rotation.y += 0.1;
        }
    }

    rotateRight() {
        if (this.model) {
            this.model.rotation.y -= 0.1;
        }
    }

    resetView() {
        if (this.model) {
            this.model.rotation.set(0, 0, 0);
            this.camera.position.set(0, 0, 5);
            this.controls.reset();
        }
    }
}

// 初始化3D查看器
const modelViewer = new ModelViewer('model-viewer');

// 添加控制按钮事件监听
document.getElementById('rotate-left')?.addEventListener('click', () => modelViewer.rotateLeft());
document.getElementById('rotate-right')?.addEventListener('click', () => modelViewer.rotateRight());
document.getElementById('reset-view')?.addEventListener('click', () => modelViewer.resetView()); 