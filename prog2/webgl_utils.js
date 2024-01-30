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


function webGLDraw(gl, positions, program, 
  positionAttributeLocation, primitiveType, count){

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // var positions = rotated_points[i]
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

    // var primitiveType = gl.LINE_LOOP;
    var offset = 0;
    // var count = (rotated_points[i].length)/3
    // console.log('curr points: ' + rotated_points[i])
    gl.drawArrays(primitiveType, offset, count);



}