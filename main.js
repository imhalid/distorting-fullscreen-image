import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import vertexShader from './src/shaders/vertex.glsl'
import fragmentShader from './src/shaders/fragment.glsl'

const canvas = document.querySelector('canvas.webgl')

// GUI
// const gui = new GUI().close()

// Scene, Lights and Camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3
camera.position.y = 0
camera.position.x = 0

const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 2
scene.add(ambientLight)

const shader = new THREE.ShaderMaterial({
 vertexShader: vertexShader,
 fragmentShader: fragmentShader,
 uniforms: {
  uTime: { value: 0 },
  uWaveElevation: { value: 0.5 },
  uWaveFrequency: { value: new THREE.Vector2(1, 1) },
  uDepthColor: { value: new THREE.Color(0x0044ff) },
  uSurfaceColor: { value: new THREE.Color(0x00ffff) },
  uWaveDirection: { value: 4 }
 },
})

// Geometry and Material
const geometry = new THREE.SphereGeometry(1, 64, 64)
const material = new THREE.MeshNormalMaterial({
 color: 0xffffff,
 shininess: 100,
 side: THREE.DoubleSide,
})

const sphere = new THREE.Mesh(geometry, material)
sphere.castShadow = true
scene.add(sphere)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Resize canvas on resize window
const sizes = {
 width: window.innerWidth,
 height: window.innerHeight
}

window.addEventListener('resize', () => {
 sizes.width = window.innerWidth
 sizes.height = window.innerHeight

 camera.aspect = sizes.width / sizes.height
 camera.updateProjectionMatrix()
 console.log(sizes.width, sizes.height)
 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Renderer
const renderer = new THREE.WebGLRenderer({
 canvas: canvas,
 antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
 mouse.x = event.clientX / sizes.width * 2 - 1
 mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

const raycaster = new THREE.Raycaster()

function animate() {
 raycaster.setFromCamera(mouse, camera)

 const intersects = raycaster.intersectObject(sphere);
 if (intersects.length > 0) {
  console.log(intersects[0].point)
 }

 const elapsedTime = clock.getElapsedTime()

 // material.uniforms.uTime.value = elapsedTime
 controls.update()

 renderer.render(scene, camera)
 requestAnimationFrame(animate)
}

animate()