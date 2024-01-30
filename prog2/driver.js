// const fs = require('fs')
var vertices = []

function main(){

  const canvas = document.getElementById('myCanvas');
  const context = canvas.getContext('2d');
  point_counter = 1
  right_clicked = false

  initializeAsgn0Canvas(canvas, context, point_counter, right_clicked)

}


function generateSOR(){
  let rotated_points = generateSORPoints()
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
  //draws the connection between each "circle" in the SOR
  for(let i = 0; i < rotated_points.length; i++){
    webGLDraw(gl, rotated_points[i], program, 
      positionAttributeLocation, gl.LINE_LOOP, 
      (rotated_points[i].length)/3)
  }
  //drawing the end caps


  //connect all of the circles by, starting from the top 
  //circle, then go down to each point at the same position
  //in each circle and connect them. 
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
    webGLDraw(gl, rotated_points_connections[i], 
      program, positionAttributeLocation, gl.LINE_STRIP,
      (rotated_points_connections[i].length)/3)

  }
  //drawing the end caps
  boolEndCaps = document.getElementById('drawEndCaps').checked

  //draws lines between the center point and every point
  //in the top circle
  //same process is repeated for bottom endcap
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

    webGLDraw(gl, endCapList, program, 
      positionAttributeLocation, gl.LINES, 
      (endCapList.length)/3)


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

    webGLDraw(gl, endCapListTwo, program,
      positionAttributeLocation, gl.LINES,
      (endCapListTwo.length)/3)
  }

  //generating the files

  //generating the .coor file
  point_list = []
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
    //removes trailing comma after every line
    if((i+1)%3 == 0){
      // coor_file += ','
      placeholder = coor_file.slice(0,-1)
      coor_file = placeholder
      coor_file += '\n'
    } 
  }
  // console.log(coor_file)

  //generating the poly file

  poly_points_list = []

  let poly_counter = 0
  // console.log(rotated_points)
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
  //pointers used for keeping track of triangles
  pOne = 0
  pTwo = 1
  topListIndex = 0
  bottomListIndex = 1

  polyFile = '';
  triCounter = 0

  //adds all the triangles for the sides
  while(bottomListIndex != poly_points_list.length){
    v1 = poly_points_list[topListIndex][pOne % poly_points_list[topListIndex].length]
    v2 = poly_points_list[topListIndex][pTwo % poly_points_list[topListIndex].length]
    v3 = poly_points_list[bottomListIndex][pOne % poly_points_list[bottomListIndex].length]
    v4 = poly_points_list[bottomListIndex][pTwo % poly_points_list[bottomListIndex].length]
    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v2 + ' ' + v4 +'\n'
    triCounter += 1
    polyFile += 'tri' + triCounter + ' ' + v3 + ' ' + v4 + ' ' + v1 +'\n'
    triCounter += 1
    pOne += 1
    pTwo += 1
    if(v2 == poly_points_list[topListIndex][0]){
      pOne = 0
      pTwo = 1
      topListIndex += 1
      bottomListIndex += 1
    }
    // console.log(polyFile)
    //add p1, p2, p4
    //add p1,p4,p3
  }

  //defining the triangles for the endcaps
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








