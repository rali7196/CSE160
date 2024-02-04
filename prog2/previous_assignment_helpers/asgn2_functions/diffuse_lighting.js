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
    let normals =calculateNormals(triangle_list)
    //start to draw triangles for this area
}

function calculateNormals(triangle_list){
    let positions_list = []
    let rotated_points = generateSORPoints()
    for(let i = 0; i < rotated_points.length; i++){
        for(let j = 0; j < rotated_points[i].length; j++){
            positions_list.push(rotated_points[i][j])
        }
    }

    let indexed_positions = []
    for(let i = 0; i < positions_list.length; i++){
        if(i%3 == 0){
            indexed_positions.push([])
        }
        let current = indexed_positions[Math.floor(i/3)]
        current.push(positions_list[i])
    }

    //iterating throuh triangle_list to calculate normals
    let normals = []
    for(let i = 0; i < triangle_list-2; i++){
        let tri_v1 = triangle_list[i]
        let tri_v2 = triangle_list[i+1]
        let tri_v3 = triangle_list[i+2]

        let tri_v1_coords = indexed_positions[tri_v1]
        let tri_v2_coords = indexed_positions[tri_v2]
        let tri_v3_coords = indexed_positions[tri_v3]

        let v12 = [tri_v2_coords[0]-tri_v1_coords[0], tri_v2_coords[1]-tri_v1_coords[1], 
            tri_v2_coords[2]-tri_v1_coords[2]]
        
        let v13 = [tri_v3_coords[0]-tri_v1_coords[0], tri_v3_coords[1]-tri_v1_coords[1], 
        tri_v3_coords[2]-tri_v1_coords[2]]

        //     i        j       k
        // v12[0](a) v12[1](b) v12[2](c)
        // v13[0](x) v13[1](y) v13[2](z)
        //

        let a = v12[0]
        let b = v12[1]
        let c = v12[2]
        
        let x = v13[0]
        let y = v13[1]
        let z = v13[2]


        let normX = (b*z) - (c*y)
        let normY = (c*x) - (a*z)
        let normZ = (a*y) - (b*x)

        normals.push(normX)
        normals.push(normY)
        normals.push(normZ)
    }
    


    return normals

}