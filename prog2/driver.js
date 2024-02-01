

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

  countTriangles(boolEndCaps, rotated_points)
  generateFiles(boolEndCaps, rotated_points)
}



















