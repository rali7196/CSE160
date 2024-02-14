function gourandShadingInit(gl, program, triangle_list, boolEndCaps){
    let normals = calculateNormals(triangle_list, boolEndCaps);

    let vertex_normals = calculateVertexNormals(triangle_list, normals, boolEndCaps);
    writeToBuffer(gl, program, 'a_normal', vertex_normals)
    let gl_light_color = gl.getUniformLocation(program, 'light_color');

    gl.uniform3f(gl_light_color, 1.0,1.0,1.0);
    
    let gl_light_direction = gl.getUniformLocation(program, 'light_direction');
    let light_direction = new Vector3([1.0,1.0,1.0])
    light_direction.normalize();
    gl.uniform3fv(gl_light_direction, light_direction.elements)

}


function gourandShading(gl, program, triangle_list, boolEndCaps){

    let positions_list = getPointsList();
    let triangle_list = countTriangles(boolEndCaps, generateSORPoints())
    
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    
    let colors = [];
    for(let i = 0; i < positions_list.length; i++){
        if(i%3 == 0){
            colors.push(surfaceColor[0])
            colors.push(surfaceColor[1])
            colors.push(surfaceColor[2])
        }
    }

    writeToBuffer(gl, program, 'a_color', colors)

    myRotateX(gl, program, second)

    diffuseLightingInit(gl, program, triangle_list, boolEndCaps)

    webGLDrawTrianglesFromIndices(gl, positions_list, triangle_list, program, positionAttributeLocation, primitiveType)



}