
//initializes various transformations to be performed on SOR
function myRotateX(gl, program, second){
  let transformation_matrix = new Matrix4()

  let angleX = document.getElementById('rotationSliderX').value
  let angleY = document.getElementById('rotationSliderY').value
  let angleZ = document.getElementById('rotationSliderZ').value

  let translationX = (document.getElementById('translationSliderX').value) / 100


  transformation_matrix.setRotate(angleX,1,0, 0)
  transformation_matrix.scale(0.5,0.5,0.5)
  transformation_matrix.rotate(angleY, 0,1,0)
  transformation_matrix.rotate(angleZ, 0,0,1)

  if(second){
    transformation_matrix.translate(translationX+1.3,0,0)
  } else {
    transformation_matrix.translate(translationX-1.0,0,0)
  }

  var positionAttributeLocationConst = gl.getUniformLocation(program, "transformation");
  gl.uniformMatrix4fv(positionAttributeLocationConst, false, transformation_matrix.elements);
  

  let vp_matrix = new Matrix4()


  vp_matrix.setPerspective(30,1,0.1,6)
  vp_matrix.lookAt(
    1,1,4,
    0,0,0,
    0,0,1)
  vp_matrix.multiply(transformation_matrix)
  let mv_matrix_location = gl.getUniformLocation(program, 'MV_matrix')
  gl.uniformMatrix4fv(mv_matrix_location, false, vp_matrix.elements)

  let normal_transformation_matrix = new Matrix4();
  normal_transformation_matrix.setInverseOf(transformation_matrix)
  normal_transformation_matrix.transpose()

  var glsl_transformation_matrix = gl.getUniformLocation(program, 'normal_transformation');
  gl.uniformMatrix4fv(glsl_transformation_matrix, false, normal_transformation_matrix.elements);

}








function generateSORNewTransformation(gl, program, second){

  //need to translate rotated points by multiplying composite matrix by each point
  let rotated_points = generateSORPoints()
  

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  myRotateX(gl, program, second)

  
  //draws the connection between each "circle" in the SOR
  for(let i = 0; i < rotated_points.length; i++){
    webGLDraw(gl, rotated_points[i], program, 
      positionAttributeLocation, gl.LINE_LOOP, 
      (rotated_points[i].length)/3)
  }


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
  // boolEndCaps = document.getElementById('drawEndCaps').checked
  boolEndCaps = true

  //draws lines between the center point and every point
  //in the top circle
  //same process is repeated for bottom endcap
  if(boolEndCaps == 1){
    let topEndCapZ = findMaxZ()
    let topList = rotated_points[topEndCapZ[0]]
    let endCapList = []
    for(let i = 0; i < topList.length; i++){
      let curr = topList[i]
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
    let botList = rotated_points[botEndCapZ[0]]
    let endCapListTwo = []
    for(let i = 0; i < botList.length; i++){
      let curr = botList[i]
      endCapListTwo.push(curr)
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

  let triangle_indices = countTriangles(boolEndCaps, rotated_points)
  generateFiles(boolEndCaps, rotated_points)
}





