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
  gl.useProgram(program)
  gl.program = program
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    gl.useProgram(program)
    gl.program = program
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}


function webGLDraw(gl, positions, program, 
  positionAttributeLocation, primitiveType, count){

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // var positions = rotated_points[i]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    var size = 3;         
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;        
    var offset = 0;        
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    
        // draw

    // var primitiveType = gl.LINE_LOOP;
    var offset = 0;
    // var count = (rotated_points[i].length)/3
    // console.log('curr points: ' + rotated_points[i])
    gl.drawArrays(primitiveType, offset, count);
}

function getWebGLProgram(){
  var gl= canvas.getContext('webgl');
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // var vertexShaderSource = document.querySelector("#"+vertexShader).text;
  // var fragmentShaderSource = document.querySelector("#"+fragmentShader).text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  return program
}


function webGLDrawTrianglesFromIndices(gl, positions, triangleIndices, program, 
  positionAttributeLocation){

    //writing to array_buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // var positions = rotated_points[i]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    

    //writing to element_buffer
    let elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndices), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    var size = 3;         
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;        
    var offset = 0;        
    gl.vertexAttribPointer(positionAttributeLocation, size, type, 
      normalize, stride, offset);
    
    // draw

    // var primitiveType = gl.LINE_LOOP;
    var offset = 0;
    // var count = (rotated_points[i].length)/3
    // console.log('curr points: ' + rotated_points[i])
    // gl.drawArrays(primitiveType, offset, count);
    gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_SHORT, offset)

}
