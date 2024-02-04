//rendering wireframe with triangles

function drawSORWithTriangles(canvasName, canvasWidth, canvasHeight, vertexShaderName, fragmentShaderName){
    //get 1d array of all coordinates
    //get the triangles
    //create new webgl function to draw from triangles

    let positions_list = []
    let rotated_points = generateSORPoints()
    for(let i = 0; i < rotated_points.length; i++){
        for(let j = 0; j < rotated_points[i].length; j++){
            positions_list.push(rotated_points[i][j])
        }
    }

    let boolEndCaps = document.getElementById('drawEndCaps').checked

    let triangle_list = countTriangles(boolEndCaps, rotated_points)

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

    myRotateX(gl, program)

    webGLDrawTrianglesFromIndices(gl, positions_list, triangle_list, program, positionAttributeLocation)
}