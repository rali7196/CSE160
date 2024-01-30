// const fs = require('fs')
function main(){
  



}




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
}
drawLines()

// context.strokeStyle = "black"


//TODO: 
    //Generate the points needed to generate shape using rcos(360/n) for x and rsin(360/n) for y
    //Scale points down using similar triangles equation 
    //Figure out how to render shapes in 2d using webgl
    //Figure out how to get triangles from shapes given coordinates
    //

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
  for(let i = 2; i < vertices.length; i++){
    if(minZ < vertices[i] && (i+1) % 3 == 0){
      minZ = vertices[i]
    }
  }
  res = 0
  for(let i = 0; i < vertices.length; i++){
    if(vertices[i] == minZ){
      res = i
    }
  }
  return [Math.floor(res / 3), minZ]
}

function generateCircleConnections(){
  new_vertices = []

}

function downloadCoor(stringData, fileName){
  const blob = new Blob([stringData], { type: 'text/plain' });

  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName; // Specify the filename for the download
  document.body.appendChild(downloadLink);

  downloadLink.click();


}

function generateSOR(){
  generateSORPoints()
  var canvas = document.getElementById('3dCanvas');
  var gl= canvas.getContext('webgl');
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  gl.viewport(0, 0, 500, 500);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
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
    // console.log('curr points: ' + rotated_points[i])
    gl.drawArrays(primitiveType, offset, count);
  }
  //drawing the end caps


  //connect all of the circles
  rotated_points_connections = []
  next_line_counter = 0
  // console.log('length: ' + rotated_points.length)

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
  // console.log('rotated points: ' + rotated_points)
  // console.log('rotated points connectoins: ' + rotated_points_connections)
  for(let i = 0; i < rotated_points_connections.length; i++){
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = rotated_points_connections[i]
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
    var primitiveType = gl.LINE_STRIP;
    var offset = 0;
    // var count = document.getElementById("n").value; //this will be the value of n
    var count = (rotated_points_connections[i].length)/3
    gl.drawArrays(primitiveType, offset, count);
  }
  //drawing the end caps
  boolEndCaps = document.getElementById('drawEndCaps').checked


  if(boolEndCaps == 1){
    let topEndCapZ = findMaxZ()
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
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = endCapList
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
    // // draw
    var primitiveType = gl.LINES;
    var offset = 0;
    var count = document.getElementById("n").value; //this will be the value of n
    var count = (endCapList.length)/3
    gl.drawArrays(primitiveType, offset, count);

    let botEndCapZ = findMinZ()
    botList = rotated_points[botEndCapZ[0]]
    endCapListTwo = []
    for(let i = 0; i < botList.length; i++){
      curr = botList[i]
      endCapList.push(curr)
      if((i+1)%3 == 0){
        endCapListTwo.push(0)
        endCapListTwo.push(0)
        endCapListTwo.push(botEndCapZ[1])
      }
    }
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = endCapListTwo
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
    // // draw
    var primitiveType = gl.LINES;
    var offset = 0;
    var count = document.getElementById("n").value; //this will be the value of n
    var count = (endCapListTwo.length)/3
    gl.drawArrays(primitiveType, offset, count);

  }

  //generating the files

  //generating the .coor file
  point_list = []
  point_iterator = rotated_points
  let coor_counter = 0
  
  if(boolEndCaps){
    highest_point = (findMaxZ())[1]
    point_list.push(0,0,highest_point)
    lowest_point = (findMinZ())[1]
    point_list.push(0,0,lowest_point)
  }
  for(let i = 0; i < rotated_points.length; i++){
    for(let j = 0; j < rotated_points[i].length; j++){
      point_list.push(rotated_points[i][j])
    }
  }

  //coor file generation
  coor_file = ""
  coor_file += '' + point_list.length/3 + '\n'
  for(let i = 0; i < point_list.length; i++){
    if(i%3==0){
      coor_file += "" + i/3 + ','
    }
    coor_file += "" + point_list[i] + ','
    if((i+1)%3 == 0){
      // coor_file += ','
      placeholder = coor_file.slice(0,-1)
      coor_file = placeholder
      coor_file += '\n'
    } 
  }
  // console.log(coor_file)

  poly_points_list = []

  let poly_counter = 0
  console.log(rotated_points)
  for(let i= 0; i < rotated_points.length; i++){
    poly_points_list.push([])
    curr_list = poly_points_list[i]
    for(let j = 0; j < rotated_points[i].length; j++){
      if(j%3==0){
        curr_list.push(poly_counter)
        poly_counter += 1
      }
    }

    
  }
  pOne = 0
  pTwo = 1
  topListIndex = 0
  bottomListIndex = 1

  polyFile = '';
  triCounter = 0

  while(bottomListIndex != poly_points_list.length){
    v1 = poly_points_list[topListIndex][pOne % poly_points_list[topListIndex].length]
    v2 = poly_points_list[topListIndex][pTwo % poly_points_list[topListIndex].length]
    v3 = poly_points_list[bottomListIndex][pOne % poly_points_list[bottomListIndex].length]
    v4 = poly_points_list[bottomListIndex][pTwo % poly_points_list[bottomListIndex].length]
    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v2 + ' ' + v4 +'\n'
    triCounter += 1
    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v4 + ' ' + v3 +'\n'
    triCounter += 1
    pOne += 1
    pTwo += 1
    if(v2 == poly_points_list[topListIndex][0]){
      pOne = 0
      pTwo = 1
      topListIndex += 1
      bottomListIndex += 1
    }
    console.log(polyFile)

    


    //add p1, p2, p4
    //add p1,p4,p3
  }

  endCapLevelTop = findMaxZ()[0]
  triCounter += 1
  endCapP1 = 0
  endCapP2 = 1
  
  while(endCapP2 % poly_points_list[endCapLevelTop].length != 0){
    v1 = poly_points_list[endCapLevelTop][endCapP1 % poly_points_list[endCapLevelTop].length]
    v2 = poly_points_list[endCapLevelTop][endCapP2 % poly_points_list[endCapLevelTop].length]

    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v2 + ' '+ 0 + '\n'
    endCapP1 += 1
    endCapP2 += 1
    triCounter += 1
  }

  endCapLevelTop = findMinZ()[0]
  triCounter += 1
  endCapP1 = 0
  endCapP2 = 1
  
  while(endCapP2 % poly_points_list[endCapLevelTop].length != 0){
    v1 = poly_points_list[endCapLevelTop][endCapP1 % poly_points_list[endCapLevelTop].length]
    v2 = poly_points_list[endCapLevelTop][endCapP2 % poly_points_list[endCapLevelTop].length]

    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v2 + ' ' + 0 + '\n'
    endCapP1 += 1
    endCapP2 += 1
    triCounter += 1
  }

  let downloadFiles = document.getElementById('downloadFiles').checked
  if(downloadFiles){
    downloadCoor(coor_file, 'SOR.coor')
    setTimeout(()=>downloadCoor(polyFile, 'SOR.poly'), 500)
  }
  

}

//notes from webgl fundamentals
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








