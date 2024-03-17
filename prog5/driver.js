import * as THREE from 'three';





const scene = new THREE.Scene();

const canvasWidth = 1000
const canvasHeight = 1000

const canvas = document.getElementById('myCanvas')
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( canvasWidth, canvasHeight);
// document.body.appendChild( renderer.domElement );
// renderer.shadowMap.enabled = true;

const geometry = new THREE.BoxGeometry( 1, 0.2, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x000000 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.set(0,1,0)

const geometry1 = new THREE.BoxGeometry( 1, 0.2, 1 );
const material1 = new THREE.MeshStandardMaterial( { color: 0x000000 } );
const cube1 = new THREE.Mesh( geometry1, material1 );
scene.add( cube1 );
cube1.position.set(1.1,1,0)


const geometry2 = new THREE.BoxGeometry( 1, 1.5, 1 );
const material2 = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
const cube2 = new THREE.Mesh( geometry2, material2 );
scene.add( cube2 );
cube2.position.set(0,1.9,0)

const geometry3 = new THREE.BoxGeometry( 1, 1.5, 1 );
const material3 = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
const cube3 = new THREE.Mesh( geometry3, material3 );
scene.add( cube3 );
cube3.position.set(1.1,1.9,0)

const geometry4 = new THREE.BoxGeometry( 2.2, 2, 1 );
const material4 = new THREE.MeshStandardMaterial( { color: 0x00fff0 } );
const cube4 = new THREE.Mesh( geometry4, material4 );
scene.add( cube4 );
cube4.position.set(0.6,3.6,0)

const geometry5 = new THREE.BoxGeometry( 1.2, 1.3, 1 );
const material5 = new THREE.MeshStandardMaterial( { color: 0x654321 } );
const cube5 = new THREE.Mesh( geometry5, material5 );
scene.add( cube5 );
cube5.position.set(0.6,5.2,0)

const geometry6 = new THREE.BoxGeometry( 0.4, 0.2, 0.2 );
const material6 = new THREE.MeshStandardMaterial( { color: 0xffffff } );
const cube6 = new THREE.Mesh( geometry6, material6 );
scene.add( cube6 );
cube6.position.set(0.8,5.5,0.5)

const geometry7 = new THREE.BoxGeometry( 0.4, 0.2, 0.2 );
const material7 = new THREE.MeshStandardMaterial( { color: 0xffffff } );
const cube7 = new THREE.Mesh( geometry7, material7 );
scene.add( cube7 );
cube7.position.set(0.3,5.5,0.5)

const geometry8 = new THREE.BoxGeometry( 1.2, 1.0, 0.7 );
const material8 = new THREE.MeshStandardMaterial( { color: 0x00fff0 } );
const cube8 = new THREE.Mesh( geometry8, material8 );
scene.add( cube8 );
cube8.position.set(-0.8,4,0   )

const geometry9 = new THREE.BoxGeometry( 1.2, 1.0, 0.7 );
const material9 = new THREE.MeshStandardMaterial( { color: 0x00fff0 } );
const cube9 = new THREE.Mesh( geometry9, material9 );
scene.add( cube9 );
cube9.position.set(2.2,4.0,0   )


const geometry10 = new THREE.BoxGeometry( 1.2, 1.0, 0.7 );
const material10 = new THREE.MeshStandardMaterial( { color: 0x654321 } );
const cube10 = new THREE.Mesh( geometry10, material10);
scene.add( cube10 );
cube10.position.set(2.2,3.0,0)


const geometry11 = new THREE.BoxGeometry( 1.2, 1.0, 0.7 );
const material11 = new THREE.MeshStandardMaterial( { color: 0x654321 } );
const cube11 = new THREE.Mesh( geometry11, material11);
scene.add( cube11 );
cube11.position.set(-0.8,3.0,0)


const geometry12 = new THREE.BoxGeometry( 1.2, 1.0, 0.7 );
const material12 = new THREE.MeshPhongMaterial( { color: 0x993399 } );
const cube12 = new THREE.Mesh( geometry12, material12);
scene.add( cube12 );
cube12.position.set(-2.1,5.0,0)

const geometry14 = new THREE.BoxGeometry( 1.2, 1.0, 0.7 );
const material14 = new THREE.MeshPhongMaterial( { color: 0x993399 } );
const cube14 = new THREE.Mesh( geometry14, material14);
scene.add( cube14 );
cube14.position.set(3.4,5.0,0)


const geometry13 = new THREE.BoxGeometry( 1.3, 0.95, 1.0 );
const material13 = new THREE.MeshPhongMaterial( { color: 0x2D221C } );
const cube13 = new THREE.Mesh( geometry13, material13);
scene.add( cube13 );
cube13.position.set(0.6,5.7,-0.04)

// const geometry1 = new THREE.SphereGeometry(1,10,20)
// const material1 = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
// const cube1 = new THREE.Mesh( geometry1, material1 );
// scene.add( cube1 );
// cube1.position.set(0,2.4,0)

let slider = document.getElementById('inputSlider')
let sliderValue = slider.value

function calculateCircleCoords(x){
    return Math.sqrt(10-Math.pow(x,2))
}

let zoom = 75
const camera = new THREE.PerspectiveCamera( 75, canvasWidth/canvasHeight, 0.1, 1000 );
camera.position.z = 10
camera.position.x = sliderValue/3;
camera.position.y = 2
scene.add(camera)

function rotateCameraAroundZ(angle) {
    // Calculate new position of the camera
    // var radius = camera.position.distanceTo(0,0,0);
    var newX = Math.cos(angle) * 10;
    var newY = Math.sin(angle) * 10;
    var newPosition = new THREE.Vector3(newX, 10, newY);


    // Set camera position
    camera.position.copy(newPosition);

    // Make camera look at the center
    camera.lookAt(0,0,0);
}


slider.addEventListener('input', ()=>{
    sliderValue=slider.value;
    // camera.position.x = sliderValue;
    // camera.position.y = calculateCircleCoords(sliderValue/3);
 })

const point = new THREE.PointLight( 0xffffff, 30, 100 );
point.position.set( 2, 2, 2 );
scene.add(point);

const point2 = new THREE.PointLight( 0xffffff, 30, 100 );
point2.position.set( -2,-2, -2 );
scene.add(point2);

const ambientlight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientlight );
var newX = Math.cos(0) * 10;
var newY = Math.sin(0) * 10;
console.log(camera.position, parseInt(sliderValue/3), newX, newY)
var idleArms = [0, 0.001,0.002,0.003,0.002,0.001,0,-0.001,-0.002,-0.003,-0.002-0.001]
var currAnim = 0;
function animate(){
    // cube.rotation.x += 0.1;
    // cube5.rotation.x += 0.05 ;
    // cube10.rotation.x += 0.05;

    cube12.rotation.y += 0.2;
    cube14.rotation.y += -0.2;
    renderer.render( scene, camera );
    rotateCameraAroundZ(sliderValue * (Math.PI / 180))

    requestAnimationFrame(animate)

}

animate()