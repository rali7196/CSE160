
//  TODO: Figure out how to find the color on a surface being affected by two light sources
//Possibly taking the average of the two light sources? Ask at discussion section today
//adding the light color calculated from equation

//TODO: Ask about using multiple kinds of shading
//should be able to switch between them one at a time

//  TODO: Figure out how to do ambient lighting(should be easy)
//
//  TODO: Figure out how to do specular lighting(check notes for how to calculate view vector & reflection vector,)
//The view vector should be constant, only need to calculate the reflection vector

//  TODO: Figure out how to calculate the vertex normals for gourand shading





var vertices = []

function main(){

  const canvas = document.getElementById('myCanvas');
  const context = canvas.getContext('2d');
  point_counter = 1
  right_clicked = false

  initializeAsgn0Canvas(canvas, context, point_counter, right_clicked)
  transformationListenerInit()
}


function SORWrapper(){
  // generateSORNew("3dCanvas", 500, 500, "vertex-shader-2d-old", "fragment-shader-2d")

  var canvas = document.getElementById('asgn2Canvas');//3dCanvas
  var gl= canvas.getContext('webgl');


  let program = initializeProgram(gl, vertexShader2d, fragmentShader2d)

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, 500, 500);//500, 500

  let dropDownMenu= document.getElementById('shadingType')
  let shadingType = dropDownMenu.options[dropDownMenu.selectedIndex].value


  if(shadingType=='wireframe'){
    generateSORNewTransformation(gl, program, false)
    generateSORNewTransformation(gl, program, true)
  } else if(shadingType=='flatShading'){
    let program2 = initializeProgram(gl, vertexShaderAsgn2, fragmentShaderAsgn2);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // gl.clear(gl.DEPTH_BUFFER_BIT);
    
    drawSORWithTriangles(gl, program2, false, [1.0,0.0,0.0], gl.TRIANGLES)
    drawSORWithTriangles(gl, program2, true, [0.0,1.0,0.0], gl.TRIANGLES)

  } else if(shadingType=='gourandShading'){
    let program2 = initializeProgram(gl, vertexShaderAsgn2, fragmentShaderAsgn2);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // gl.clear(gl.DEPTH_BUFFER_BIT);
    
    gourandShading(gl, program2, false, [1.0,0.0,0.0], gl.TRIANGLES)
    gourandShading(gl, program2, true, [0.0,1.0,0.0], gl.TRIANGLES)
  }
}




















