import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import vertexShader from '@/shaders/vertex.glsl'
import fragmentShader from '@/shaders/fragment.glsl'
import gsap from 'gsap'

const canvas = document.querySelector('canvas.webgl')

// GUI
// const gui = new GUI().close()

// Scene, Lights and Camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2
camera.position.y = 0
camera.position.x = 0


const mouse = new THREE.Vector2()
let prevMouse = new THREE.Vector2()
let followMouse = new THREE.Vector2()
let speed = 0
let targetSpeed = 0

window.addEventListener('mousemove', (event) => {
 mouse.x = event.clientX / sizes.width;
 mouse.y = 1 - event.clientY / sizes.height;
})

function getSpeed() {

 speed = Math.sqrt(
  (prevMouse.x - mouse.x) * (prevMouse.x - mouse.x) +
  (prevMouse.y - mouse.y) * (prevMouse.y - mouse.y)
 )

 targetSpeed -= 0.1*(targetSpeed - speed)
 followMouse.x -= 0.1*(mouse.x - followMouse.x)
 followMouse.y -= 0.1*(mouse.y - followMouse.y)
 
 prevMouse.x = mouse.x
 prevMouse.y = mouse.y

}

const textureLoader = new THREE.TextureLoader()
const medieval = textureLoader.load('/Medieval.jpg')

// Geometry and Material
const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const shader = new THREE.ShaderMaterial({
 vertexShader: vertexShader,
 fragmentShader: fragmentShader,
 uniforms: {
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uDirection: { value: 0 },
  uSpeed : { value: 0 },
  uResolution: { value: new THREE.Vector4() },
  uTexture: { value: medieval },
  uMouse: { value: mouse }
 },
 side: THREE.DoubleSide,
 // wireframe: true,
 // transparent: true,
})

const plane = new THREE.Mesh(geometry, shader)
scene.add(plane)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Resize canvas on resize window
const sizes = {
 width: window.innerWidth,
 height: window.innerHeight
}


if (sizes.width / sizes.height > 1) {
 plane.scale.x = camera.aspect
} else {
 plane.scale.y = 1 / camera.aspect
}

const dist = camera.position.z
const height = 1
camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist))

camera.updateProjectionMatrix()

// canvas offset

window.addEventListener('resize', () => {
 sizes.width = window.innerWidth
 sizes.height = window.innerHeight

 camera.aspect = sizes.width / sizes.height

 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

 camera.aspect = window.innerWidth / window.innerHeight
 if (sizes.width / sizes.height > 1) {
  plane.scale.x = camera.aspect
 } else {
  plane.scale.y = 1 / camera.aspect
 }

 camera.updateProjectionMatrix()
})

// Renderer
const renderer = new THREE.WebGLRenderer({
 canvas: canvas,
 antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const clock = new THREE.Clock()




// const raycaster = new THREE.Raycaster()


canvas.addEventListener('mousedown', () => {
 shader.uniforms.uDirection.value = 0
 gsap.to(shader.uniforms.uProgress, {
  duration: 1,
  value: 1,
 })
})

canvas.addEventListener('mouseup', () => {
 shader.uniforms.uDirection.value = 1
 gsap.to(shader.uniforms.uProgress, {
  duration: 1,
  value: 0,
 })
})
console.log(mouse)

function animate() {
 getSpeed()
 // raycaster.setFromCamera(mouse, camera)

 // const intersects = raycaster.intersectObject(plane);
 // if (intersects.length > 0) {
 //  console.log(intersects[0].point)
 // }

 const elapsedTime = clock.getElapsedTime()
 shader.uniforms.uTime.value = elapsedTime
 shader.uniforms.uMouse.value = mouse
 shader.uniforms.uSpeed.value = targetSpeed

 controls.update()

 renderer.render(scene, camera)
 requestAnimationFrame(animate)
}

animate()