// const fs = require('fs')



function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

//initialize elements that are referenced
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
// canvas.origin = {x: 0, y: 0}

//add event listeners
canvas.addEventListener('mousedown', drawPoint)
context.beginPath();
point_counter = 1
right_clicked = false

//drawing the x and y axis
function drawLines(){
    let rectInit = canvas.getBoundingClientRect();
    context.moveTo(rectInit.right/2,0)
    context.lineTo(rectInit.right/2, 500)
    context.strokeStyle = "green";
    context.stroke()
    context.beginPath();

    context.moveTo(0, 250)
    context.lineTo(rectInit.right, 250)
    context.strokeStyle = "red"
    context.stroke()
    context.beginPath();
    context.strokeStyle = "black"

    // const outputCanvas = document.getElementById('3dCanvas');
    // const outputContext = outputCanvas.getContext('2d');
    // let outputRect = canvas.getBoundingClientRect();


    // outputContext.moveTo(outputRect.right/2,0)
    // outputContext.lineTo(outputRect.right/2, 500)
    // outputContext.strokeStyle = "green";
    // outputContext.stroke()
    // outputContext.beginPath();

    // outputContext.moveTo(0, 250)
    // outputContext.lineTo(rectInit.right, 250)
    // outputContext.strokeStyle = "red"
    // outputContext.stroke()
    // outputContext.beginPath();
    // outputContext.strokeStyle = "black"
}
drawLines()
// function initVertexBuffers(gl) {
//   var vertices = new Float32Array([
//     0.0, 0.5,   -0.5, -0.5,   0.5, -0.5
//   ]);
//   var n = 3; // The number of vertices

//   // Create a buffer object
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('Failed to create the buffer object');
//     return -1;
//   }

//   // Bind the buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   // Write date into the buffer object
//   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   if (a_Position < 0) {
//     console.log('Failed to get the storage location of a_Position');
//     return -1;
//   }
//   // Assign the buffer object to a_Position variable
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

//   // Enable the assignment to a_Position variable
//   gl.enableVertexAttribArray(a_Position);

//   return n;
// }

// context.strokeStyle = "black"


//TODO: 
    //Generate the points needed to generate shape using rcos(360/n) for x and rsin(360/n) for y
    //Scale points down using similar triangles equation 
    //Figure out how to render shapes in 2d using webgl
    //Figure out how to get triangles from shapes given coordinates
    //

function getN(){
    var n = document.getElementById("n").value
}

function getDrawEndCaps(){
    var n = document.getElementById("drawEndCaps").value
}

var vertices = []
function drawPoint(e){
    //if user has right clicked, stop drawing
    if(right_clicked == true){
        return
    }
    //calculate offset of cursor on Canvas
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let normX = ((x-(rect.right/2)) / rect.right)*2
    let normZ = -((y-(500/2)) / 500)*2


    //edge case for starting a drawing
    if(point_counter == 1){
        context.moveTo(x, y);
        point_counter = point_counter + 1
        // console.log("point placed at ("+x+","+y+")")
        vertices.push(normX)
        vertices.push(0)
        vertices.push(normZ)
        // console.log("normZ "+normZ)
        // console.log("normX "+normX)
        vertices_length = vertices_length + 3

    }
    //continuously draw lines until user presses RMB
    else if(point_counter % 2 == 0){
        context.lineTo(x, y);
        // console.log("point placed at ("+x+","+y+")")
        context.stroke();
        context.moveTo(x,y)
        vertices.push(normX)
        vertices.push(0)
        vertices.push(normZ)
        vertices_length = vertices_length + 3

        if(e.buttons == 2){
            right_clicked = true
        }  
    }
}

var rotated_points = []

function generateSORPoints(){
    //generate points
    for(let i = 0; i < (vertices.length/3); i++){
        rotated_points.push([])
    }
    let counter = 0
    for(let i =0; i < vertices.length; i++){
        curr_list = Math.floor(counter / 3)
        rotated_points[curr_list].push(vertices[i])
        counter += 1

    }
    var n = document.getElementById("n").value
    //x = rcos(theta) where theta = 360/n and r = x
    //y = rsin(theta) where r = x  
    for(let i = 0; i < rotated_points.length; i++){
        curr = rotated_points[i]
        r = rotated_points[i][0]
        z = rotated_points[i][2]
        theta = (360 / n) * (Math.PI / 180)
        for(let j = 1; j < n; j++){
            let newX = r * Math.cos(theta * j)
            let newY = r * Math.sin(theta * j)
            curr.push(newX)
            curr.push(newY)
            curr.push(z)
        }
    }
    // for(let i = 0; i < rotated_points.length; i++){
    //   currList = rotated_points[i]
    //   currList.push(currList[0])
    //   currList.push(currList[1])
    //   currList.push(currList[2])

    // }
}

function findMaxZ(){
  maxZ = vertices[2]
  for(let i = 2; i < vertices.length; i++){
    if(maxZ < vertices[i] && (i+1) % 3 == 0){
      maxZ = vertices[i]
    }
  }
  res = 0
  for(let i = 0; i < vertices.length; i++){
    if(vertices[i] == maxZ){
      res = i
    }
  }
  return [Math.floor(res / 3), maxZ]
}

function findMinZ(){
  minZ = vertices[2]
  for(let i = 1; i < vertices.length; i++){
    if(minZ > vertices[i] && (i+1) % 3 == 0){
      minZ = vertices[i]
    }
  }
  return minZ
}

function generateCircleConnections(){
  new_vertices = []

}
function generateSOR(){
  generateSORPoints()
  var canvas = document.getElementById('3dCanvas');
  var gl= canvas.getContext('webgl');
  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);
  gl.viewport(0, 0, 500, 500);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Create a buffer and put three 2d clip space points in it
  for(let i = 0; i < rotated_points.length; i++){
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = rotated_points[i]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var size = 3;         
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;        
    var offset = 0;        
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    
        // draw

    var primitiveType = gl.LINE_LOOP;
    var offset = 0;
    var count = (rotated_points[i].length)/3
    console.log('curr points: ' + rotated_points[i])
    gl.drawArrays(primitiveType, offset, count);
  }
  //drawing the end caps
  boolEndCaps = document.getElementById('drawEndCaps').checked

  console.log('rotated points: ' + rotated_points)

  //connect all of the circles
  rotated_points_connections = []
  next_line_counter = 0
  console.log('length: ' + rotated_points.length)

  for(let i = 0; i < rotated_points[0].length; i++){
    rotated_points_connections.push([])
    curr_list = rotated_points_connections[i]
    for(let j =0; j < rotated_points.length; j++){
      curr_list.push(rotated_points[j][next_line_counter])
      curr_list.push(rotated_points[j][next_line_counter+1])
      curr_list.push(rotated_points[j][next_line_counter+2])

    }
    next_line_counter += 3
  }
  console.log('rotated points: ' + rotated_points)
  console.log('rotated points connectoins: ' + rotated_points_connections)
  for(let i = 0; i < rotated_points_connections.length; i++){
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = rotated_points_connections[i]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // code above this line is initialization code.
    // code below this line is rendering code.
    // Tell WebGL how to convert from clip space to pixels
    // Clear the canvas
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    // draw
    var primitiveType = gl.LINE_STRIP;
    var offset = 0;
    // var count = document.getElementById("n").value; //this will be the value of n
    var count = (rotated_points_connections[i].length)/3
    gl.drawArrays(primitiveType, offset, count);
  }

  if(boolEndCaps == 1){
    let topEndCapZ = findMaxZ()
    // console.log('maxZ :' + topEndCapZ)
    let botEndCapZ = findMinZ()
    topList = rotated_points[topEndCapZ[0]]
    endCapList = []
    for(let i = 0; i < topList.length; i++){
      curr = topList[i]
      endCapList.push(curr)
      if((i+1)%3 == 0){
        endCapList.push(0)
        endCapList.push(0)
        endCapList.push(topEndCapZ[1])
      }
    }
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // var positions = [
    //   0, 0,
    //   0, 0.5,
    //   0.7, 0,
    // ];
    var positions = endCapList
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // // code above this line is initialization code.
    // // code below this line is rendering code.
    // // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    // // Tell WebGL how to convert from clip space to pixels
    // // Clear the canvas
    // // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    // // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    // // draw
    var primitiveType = gl.LINES;
    var offset = 0;
    var count = document.getElementById("n").value; //this will be the value of n
    var count = (endCapList.length)/3
    gl.drawArrays(primitiveType, offset, count);
  }

  //generating the files



}

  //write shaders
  //compile shaders 
  //link shaders into program
  //find location of attribute variable
  //creating buffer for attribute variable
  //find attribute variable location
  //create buffer in variable
  //bind the array of vertices to gl.ARRAY_BUFFER
  //write data into buffer

  //rendering the object
  //set viewport using 500x500
  //clear canvas
  //tell webgl to use our previously created program
  //bind our created buffer to gl.ARRAY_BUFFER 
  //read from buffer using  gl.vertexAttribPointer








