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