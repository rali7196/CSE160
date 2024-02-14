//rendering wireframe with triangles

function diffuseLightingInit(gl, program, triangle_list, boolEndCaps, surfaceColor){
    //get the rotation matrix, find inverse transpose of it, and then set the
    
    //calculate normals
    let normals = calculateNormals(triangle_list, boolEndCaps)

    //write normals into buffer

    writeToBuffer(gl, program, 'a_normal', normals)

    //initialize lighting
    let gl_light_color = gl.getUniformLocation(program, 'light_color');

    gl.uniform3f(gl_light_color, 1.0,1.0,1.0);
    
    let gl_light_direction = gl.getUniformLocation(program, 'light_direction');
    let light_direction = new Vector3([1.0,1.0,1.0])
    light_direction.normalize();
    gl.uniform3fv(gl_light_direction, light_direction.elements)

    let gl_ambient_color = gl.getUniformLocation(program, 'ambient_color')
    gl.uniform3f(gl_ambient_color, surfaceColor[0]/10,surfaceColor[1]/10,surfaceColor[2]/10)

}



function drawSORWithTriangles(gl, program, second, surfaceColor, primitiveType){
    //get 1d array of all coordinates
    //get the triangles
    //create new webgl function to draw from triangles

    let positions_list = getPointsList(true, generateSORPoints())

    //creating color array


    
    let triangle_list = countTriangles(boolEndCaps, rotated_points)
    
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");


    let colors = [];
    for(let i = 0; i < positions_list.length; i++){
        if(i%3 == 0){
            colors.push(surfaceColor[0])
            colors.push(surfaceColor[1])
            colors.push(surfaceColor[2])
        }
    }

    //writing colors to vertex shader


    writeToBuffer(gl, program, 'a_color', colors)


    // gl.clearColor(0, 0, 0, 1);


    myRotateX(gl, program, second)

    diffuseLightingInit(gl, program, triangle_list, boolEndCaps, surfaceColor)

    webGLDrawTrianglesFromIndices(gl, positions_list, triangle_list, program, positionAttributeLocation, primitiveType)

    //start to draw triangles for this area
}


//return a 1d array that contains normals for all triangles
