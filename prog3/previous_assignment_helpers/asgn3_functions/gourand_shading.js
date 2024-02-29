//use look at for camera control
//dynamically calculate view vector for specular lighting
//use set ortho and setPerspective(modify fovy for perspective and box dimensions for set ortho)
//to have camera rotate around scene, change eye point for lookat


function gourandShadingInit(gl, program, triangle_list, boolEndCaps, surfaceColor){
    let normals = calculateNormals(triangle_list, boolEndCaps);

    let vertex_normals = calculateVertexNormals(triangle_list, normals, boolEndCaps);
    writeToBuffer(gl, program, 'a_normal', vertex_normals)

    if(document.getElementById('diffuseLightingBool').checked){

    
        let gl_light_color = gl.getUniformLocation(program, 'light_color');
        gl.uniform3f(gl_light_color, 1.0,1.0,1.0);

        
        let gl_light_color_specular = gl.getUniformLocation(program, 'u_Light_Color');
        gl.uniform3f(gl_light_color_specular, 1.0,1.0,1.0);
    } else {
            
        let gl_light_color = gl.getUniformLocation(program, 'light_color');
        gl.uniform3f(gl_light_color, 0.0,0.0,0.0);

        
        let gl_light_color_specular = gl.getUniformLocation(program, 'u_Light_Color');
        gl.uniform3f(gl_light_color_specular, 0.0,0.0,0.0);

    }

    // let positions_list = getPointsList(true, generateSORPoints());

    // let point_light_dir = []
    // for(let i = 0; i < positions_list.length; i++){
    //     point_light_dir.push(0.0)
    //     point_light_dir.push(0.0)
    //     point_light_dir.push(0.0)

    // }
    // writeToBuffer(gl, program, 'light_direction_point', [-100.0,100.0,100.0])
    let point_color = gl.getUniformLocation(program, 'light_color_point')
    gl.uniform3f(point_color, 1.0, 0.8, 0.2)

    let modelMatrix = new Matrix4()
    modelMatrix.setTranslate(0,document.getElementById('pointLightingTranslationY').value/100,0)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'model_matrix'), false, modelMatrix.elements)

    let point_loc = gl.getUniformLocation(program, 'light_direction_point')
    gl.uniform3f(point_loc, -100.0, 100.0, 100.0)
    
    let gl_light_direction = gl.getUniformLocation(program, 'light_direction');
    let light_direction = new Vector3([1.0,1.0,1.0])
    light_direction.normalize();

    let gl_ambient_color = gl.getUniformLocation(program, 'ambient_color')
    gl.uniform3f(gl_ambient_color, surfaceColor[0]/10,surfaceColor[1]/10,surfaceColor[2]/10)


    let gl_light_direction_specular = gl.getUniformLocation(program, 'u_Light_Position');
    gl.uniform3fv(gl_light_direction_specular, light_direction.elements)


    gl.uniform3fv(gl_light_direction, light_direction.elements)

}


function gourandShading(gl, program, second, surfaceColor, primitiveType){

    let positions_list = getPointsList(true, generateSORPoints());
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

    gourandShadingInit(gl, program, triangle_list, boolEndCaps, surfaceColor)

    webGLDrawTrianglesFromIndices(gl, positions_list, triangle_list, program, positionAttributeLocation, primitiveType)



}