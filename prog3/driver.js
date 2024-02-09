class SOR {
  //couple of attributes: points_list, vertices, rotated_points
  //create skeleton methods that call other functions
}

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
  generateSORNew("3dCanvas", 500, 500, "vertex-shader-2d-old", "fragment-shader-2d")

  var canvas = document.getElementById('asgn2Canvas');//3dCanvas
  var gl= canvas.getContext('webgl');

  let renderOption = document.getElementById('renderOption').checked
  let program = initializeProgram(gl, "vertex-shader-2d-2", "fragment-shader-2d-2")

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, 500, 500);//500, 500


  if(!renderOption){
    generateSORNewTransformation(gl, program, false)
    generateSORNewTransformation(gl, program, true)



  } else {

    let program2 = initializeProgram(gl, 'vertex-shader-2d-asgn2', 'fragment-shader-2d-asgn2');
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    drawSORWithTriangles(gl, program2, false, [1.0,0.0,0.0], gl.TRIANGLES)
    drawSORWithTriangles(gl, program2, true, [0.0,1.0,0.0], gl.TRIANGLES)

  }

}




















