import * as THREE from 'three';


function calculateCircleCoords(x){
    return Math.sqrt(10-Math.pow(x,2))
}


const scene = new THREE.Scene();

const canvasWidth = 1000
const canvasHeight = 1000

const canvas = document.getElementById('myCanvas')
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( canvasWidth, canvasHeight);
// document.body.appendChild( renderer.domElement );
// renderer.shadowMap.enabled = true;

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.set(0,1,0)


const geometry1 = new THREE.SphereGeometry(1,10,20)
const material1 = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
const cube1 = new THREE.Mesh( geometry1, material1 );
scene.add( cube1 );
cube1.position.set(0,2.4,0)

let slider = document.getElementById('inputSlider')
let sliderValue = slider.value

const camera = new THREE.PerspectiveCamera( 75, canvasWidth/canvasHeight, 0.1, 1000 );
camera.position.z = 5;
camera.position.x = sliderValue/3;
camera.position.y = calculateCircleCoords(sliderValue/3);
scene.add(camera)


slider.addEventListener('input', ()=>{
    sliderValue=slider.value;
    camera.position.x = sliderValue/3;
    camera.position.y = calculateCircleCoords(sliderValue/3);
 })

const point = new THREE.PointLight( 0xffffff, 30, 100 );
point.position.set( 2, 2, 2 );
scene.add(point);

const ambientlight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientlight );


function animate(){
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.1;
    cube.rotation.y += 0.05;
    renderer.render( scene, camera );
}

animate()