function findEndCapLevel(rotated_points, minZ, maxZ){
    triangle_list = [0,0]
    for(let i = 0; i < rotated_points.length; i++){
        for(let j = 0; j < rotated_points[i].length; j++){
            if(rotated_points[i][j] == minZ){
                triangle_list[0] = i
            }
            if(rotated_points[i][j] == maxZ){
                triangle_list[1] = i
            }
        }
    }
    return triangle_list
}


//counts all of the triangles in rotated points
//returns a 1d array of all triangle locations
function countTriangles(boolEndCaps, rotated_points){
    //1d array that contains all x,y, and z coordinates [x1,y1,z1,x2,y2,z2 ...]
    // let point_list = getPointsList(boolEndCaps, rotated_points)


    //2d array that contains the indices of each vertex from rotated_points
    poly_points_list = []

    let poly_counter = 0
    // console.log(rotated_points)
    for(let i= 0; i < rotated_points.length; i++){
      poly_points_list.push([])
      curr_list = poly_points_list[i]
      for(let j = 0; j < rotated_points[i].length; j++){
        if(j%3==0){
          curr_list.push(poly_counter)
          poly_counter += 1
        }
      }
    }


    let pOne = 0
    let pTwo = 1
    topListIndex = 0
    bottomListIndex = 1

    //contains the vertex indices for all triangles within the shape
    let triangle_indices=[]

    //this while loop counts all of the triangles on each face of the SOR
    while(bottomListIndex != poly_points_list.length){
        let v1 = poly_points_list[topListIndex][pOne % poly_points_list[topListIndex].length]
        let v2 = poly_points_list[topListIndex][pTwo % poly_points_list[topListIndex].length]
        let v3 = poly_points_list[bottomListIndex][pOne % poly_points_list[bottomListIndex].length]
        let v4 = poly_points_list[bottomListIndex][pTwo % poly_points_list[bottomListIndex].length]
        triangle_indices.push(v4)
        triangle_indices.push(v2)
        triangle_indices.push(v1)

        triangle_indices.push(v3)
        triangle_indices.push(v4)
        triangle_indices.push(v1)

        pOne += 1
        pTwo += 1
        if(v2 == poly_points_list[topListIndex][0]){
          pOne = 0
          pTwo = 1
          topListIndex += 1
          bottomListIndex += 1
        }
        // console.log(polyFile)
        //add p1, p2, p4
        //add p1,p4,p3
    }

    //calculate triangles for endcaps
    //involves pushing 
    const topEndCapHeight = findMaxZ()[1]
    const bottomEndCapHeight = findMinZ()[1]
    //iterate through rotated points to find which circle the endcap should be in 
    const endCapCircles  = findEndCapLevel(rotated_points, bottomEndCapHeight, topEndCapHeight)
    const bottomEndCapCircleList = poly_points_list[endCapCircles[1]]
    const topEndCapCircleList = poly_points_list[endCapCircles[0]]

    //calulate triangles for bottom end cap list by connecting endcap to all points within bottomEndCapCircleList,
    //do same for top end cap list

    //bottom end cap is current poly_counter, top end cap is poly_counter += 1
    if(!boolEndCaps){
      return triangle_indices
    }
    pOne = 0
    pTwo = 1
    let v1 = 0
    let v2 = 0
    do{
      v1 = pOne % bottomEndCapCircleList.length
      v2 = pTwo % bottomEndCapCircleList.length
      triangle_indices.push(poly_counter)
      triangle_indices.push(bottomEndCapCircleList[v2])
      triangle_indices.push(bottomEndCapCircleList[v1] )
      pOne += 1
      pTwo += 1
    }while(v2 != 0);

    //counting all triangles for top end cap

    pOne = 0
    pTwo = 1
    poly_counter += 1
    v1 = 0
    v2 = 0
    do{
      v1 = pOne % topEndCapCircleList.length
      v2 = pTwo % topEndCapCircleList.length
      triangle_indices.push(topEndCapCircleList[v1])
      triangle_indices.push(topEndCapCircleList[v2])
      triangle_indices.push(poly_counter)
      pOne += 1
      pTwo += 1
    }while(v2 != 0);
    return triangle_indices
}

function transformationListenerInit(){
  let rangeInput = document.getElementById("rotationSliderX")
  rangeInput.addEventListener('input', ()=>{ 
    SORWrapper()  })

  rangeInput = document.getElementById("rotationSliderY")
  rangeInput.addEventListener('input', ()=>{ 
    SORWrapper()  })

  rangeInput = document.getElementById("rotationSliderZ")
  rangeInput.addEventListener('input', ()=>{ 
    SORWrapper()  })

  rangeInput = document.getElementById("translationSliderX")
  rangeInput.addEventListener('input', ()=>{ 
    SORWrapper()  })

  rangeInput = document.getElementById('shadingType')
  rangeInput.addEventListener('change', ()=>{
    SORWrapper()
  })

  rangeInput = document.getElementById('n')
  rangeInput.addEventListener('input', ()=>{
    if(vertices.length > 6){
      SORWrapper()
    }
  })

}



