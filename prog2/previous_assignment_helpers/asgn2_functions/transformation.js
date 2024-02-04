function myRotateX(gl, program){
  let transformation_matrix = new Matrix4()

  let angleX = document.getElementById('rotationSliderX').value
  let angleY = document.getElementById('rotationSliderY').value
  let angleZ = document.getElementById('rotationSliderZ').value

  let translationX = (document.getElementById('translationSliderX').value) / 100





  transformation_matrix.setRotate(angleX,1,0, 0)
  transformation_matrix.scale(0.5,0.5,0.5)
  transformation_matrix.rotate(angleY, 0,1,0)
  transformation_matrix.rotate(angleZ, 0,0,1)

  transformation_matrix.translate(translationX,0,0)

  var positionAttributeLocationConst = gl.getUniformLocation(program, "transformation");
  gl.uniformMatrix4fv(positionAttributeLocationConst, false, transformation_matrix.elements);
}








function generateSORNewTransformation(canvasName, canvasWidth, canvasHeight, vertexShaderName, fragmentShaderName){
  let rotated_points = generateSORPoints()

  //need to translate rotated points by multiplying composite matrix by each point
  

  var canvas = document.getElementById(canvasName);//3dCanvas
  var gl= canvas.getContext('webgl');
  var vertexShaderSource = document.querySelector('#'+vertexShaderName).text;
  var fragmentShaderSource = document.querySelector('#'+fragmentShaderName).text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  gl.viewport(0, 0, canvasWidth, canvasHeight);//500, 500

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);


  // let transformation_matrix = new Matrix4()
  // transformation_matrix.setRotate(70,0,1, 0)

  // var positionAttributeLocationConst = gl.getUniformLocation(program, "transformation");
  // gl.uniformMatrix4fv(positionAttributeLocationConst, false, transformation_matrix.elements);

  myRotateX(gl, program)





  
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
  boolEndCaps = document.getElementById('drawEndCaps').checked

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





function generateSORNew(canvasName, canvasWidth, canvasHeight, vertexShaderName, fragmentShaderName){
    let rotated_points = generateSORPoints()
  
    //need to translate rotated points by multiplying composite matrix by each point
    
  
    var canvas = document.getElementById(canvasName);//3dCanvas
    var gl= canvas.getContext('webgl');
    var vertexShaderSource = document.querySelector('#'+vertexShaderName).text;
    var fragmentShaderSource = document.querySelector('#'+fragmentShaderName).text;
  
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);
    gl.viewport(0, 0, canvasWidth, canvasHeight);//500, 500
  
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);



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
  
    generateFiles(boolEndCaps, rotated_points)
  }
  