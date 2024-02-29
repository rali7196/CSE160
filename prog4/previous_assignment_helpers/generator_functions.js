//returns 1d array of vertex coordinates [x1,y1,z1..xN, yN, zN]
function getPointsList(boolEndCaps, rotated_points){
    let point_list = []
    for(let i = 0; i < rotated_points.length; i++){
        for(let j = 0; j < rotated_points[i].length; j++){
          point_list.push(rotated_points[i][j])
        }
      }
  
      if(boolEndCaps){
          highest_point = (findMaxZ())[1]
          point_list.push(0,0,highest_point)
          lowest_point = (findMinZ())[1]
          point_list.push(0,0,lowest_point)
      }
      return point_list
}

function calculateNormals(triangle_list, boolEndCaps){
    let positions_list = []
    let rotated_points = generateSORPoints()
    for(let i = 0; i < rotated_points.length; i++){
        for(let j = 0; j < rotated_points[i].length; j++){
            positions_list.push(rotated_points[i][j])
        }
    }

    if(boolEndCaps){
        highest_point = (findMaxZ())[1]
        positions_list.push(0,0,highest_point)
        lowest_point = (findMinZ())[1]
        positions_list.push(0,0,lowest_point)
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
    for(let i = 0; i+2 < triangle_list.length; i+=3){
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

//returns a 1d array that contains the vertex normals. 
function calculateVertexNormals(triangle_list, normals, boolEndCaps){
    //TODO: need to find a way that, for each vertex, calculate a normal
    //TODO: This is done by finding the vertices of each polygon, and then, using the normal
    //each polygon, find the average of the normals for each vertex
    //triangle list contains the vertices of each polygon, normals contains the normals of each polygon

    //create a 2d array, where each subarray contains all of the normals for vertex i
    //to identify which normals belong to which vertices, I need to take the three points, and assign them to 
    //i, i+1, i+2 in triangle indices

    //ask about world matrix in point lighting
    //just the 
    
    //ask about gourand shading vertex calculation algorihtm
    //works
    //ask about number 3 in the midterm
    //was a unit cube, finding normals should be trivial

    //ask about the light color in number 2
    //its the same light color for all kinds of lighting

    //ask about halfway vector
    //just (A+B)/2, normalized for light calculations

    //ask about specular lighting calculation
    //this is just a color calculated, just like diffuse lighting. 
    //make sure to use different surface values for specular and ambient lighting calculations

    //for ambient lighting, use a darker surface color

    //find the number of vertices in the array
    let point_list = getPointsList(boolEndCaps, generateSORPoints())
    let vertex_normals = []
    for(let i = 0; i < point_list.length/3; i++){
        vertex_normals.push([])
    }


    //pushing relevant normals into arrays, sorting them by which vertex they belong to.
    for(let i = 0; i < normals.length-2; i++){
        let x = normals[i]
        let y = normals[i+1]
        let z = normals[i+2]

        //access triangle indices in triangle_list
        let vertex_one = triangle_list[i]
        let vertex_two = triangle_list[i+1]
        let vertex_three = triangle_list[i+2]

        vertex_normals[vertex_one].push(x)
        vertex_normals[vertex_one].push(y)
        vertex_normals[vertex_one].push(z)

        vertex_normals[vertex_two].push(x)
        vertex_normals[vertex_two].push(y)
        vertex_normals[vertex_two].push(z)

        vertex_normals[vertex_three].push(x)
        vertex_normals[vertex_three].push(y)
        vertex_normals[vertex_three].push(z)
    }

    //now, i need to find the vertex normal of every point. 
    //iterate through every array in vertex_normals
    //for every element in vertex_normals[i], add every 1st element, 2nd element, and 3rd element to three sums
    //then, take those three summed coordinates, find the magnitude, and then divide each one by calculated magnitude

    let calculated_vertex_normals = []
    //iterating through each collection of normals
    for(let i = 0; i < vertex_normals.length; i++){
        //iterating throuh the collection of normals
        let sumX = 0
        let sumY = 0
        let sumZ = 0
        for(let j = 0; j < vertex_normals[i].length-2; j++){
            let current_normalX = vertex_normals[i][j]
            let current_normalY = vertex_normals[i][j+1]
            let current_normalZ = vertex_normals[i][j+2]

            sumX += current_normalX
            sumY += current_normalY
            sumZ += current_normalZ
        }

        // let magnitude = Math.sqrt((sumX**2) + (sumY**2) + (sumZ**2))
        // sumX = sumX / magnitude
        // sumY = sumY / magnitude
        // sumZ = sumZ / magnitude

        calculated_vertex_normals.push(sumX)
        calculated_vertex_normals.push(sumY)
        calculated_vertex_normals.push(sumZ)       
    }
    return calculated_vertex_normals
}


function generateSphere(gl, program){
    var SPHERE_DIV = 13;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;
  
    var positions123 = [];
    var indices123 = [];
  
    // Generate coordinates
    for (j = 0; j <= SPHERE_DIV; j++) {
      aj = j * Math.PI / SPHERE_DIV;
      sj = Math.sin(aj);
      cj = Math.cos(aj);
      for (i = 0; i <= SPHERE_DIV; i++) {
        ai = i * 2 * Math.PI / SPHERE_DIV;
        si = Math.sin(ai);
        ci = Math.cos(ai);
  
        positions123.push((si * sj) );  // X
        positions123.push((cj) );       // Y
        positions123.push((ci * sj) );  // Z
      }
    }
  
    // Generate indices
    for (j = 0; j < SPHERE_DIV; j++) {
      for (i = 0; i < SPHERE_DIV; i++) {
        p1 = j * (SPHERE_DIV+1) + i;
        p2 = p1 + (SPHERE_DIV+1);
  
        indices123.push(p1);
        indices123.push(p2);
        indices123.push(p1 + 1);
  
        indices123.push(p1 + 1);
        indices123.push(p2);
        indices123.push(p2 + 1);
      }
    }

    // let new_program = initializeProgram(gl, vertexShader2d, fragmentShader2d)
    writeToBuffer(gl, program, 'a_position', positions123)

    let transformation_matrix = new Matrix4()
    transformation_matrix.setScale(0.05, 0.05, 0.05)
    // .setTranslate(0,document.getElementById('pointLightingTranslationY').value/100,0)
    transformation_matrix.translate(-10,document.getElementById('pointLightingTranslationY').value/100,10)
    var positionAttributeLocationConst = gl.getUniformLocation(program, "transformation");
    gl.uniformMatrix4fv(positionAttributeLocationConst, false, transformation_matrix.elements);

    let colors_buffer123 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, colors_buffer123);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices123), gl.STATIC_DRAW);
  
    gl.drawElements(gl.TRIANGLES, indices123.length, gl.UNSIGNED_SHORT, 0);

    let dropDownMenu= document.getElementById('shadingType')
    let shadingType = dropDownMenu.options[dropDownMenu.selectedIndex].value

}