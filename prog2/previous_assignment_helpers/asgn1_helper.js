
function generateSORPoints(){
    //generate points
    rotated_points = []
    for(let i = 0; i < (vertices.length/3); i++){
        rotated_points.push([])
    }
    let counter = 0
    for(let i =0; i < vertices.length; i++){
        curr_list = Math.floor(counter / 3)
        rotated_points[curr_list].push(vertices[i])
        counter += 1

    }
    var n = document.getElementById("n").value
    //x = rcos(theta) where theta = 360/n and r = x
    //y = rsin(theta) where r = x  
    for(let i = 0; i < rotated_points.length; i++){
        curr = rotated_points[i]
        r = rotated_points[i][0]
        z = rotated_points[i][2]
        theta = (360 / n) * (Math.PI / 180)
        for(let j = 1; j < n; j++){
            let newX = r * Math.cos(theta * j)
            let newY = r * Math.sin(theta * j)
            curr.push(newX)
            curr.push(newY)
            curr.push(z)
        }
    }
    return rotated_points
    // for(let i = 0; i < rotated_points.length; i++){
    //   currList = rotated_points[i]
    //   currList.push(currList[0])
    //   currList.push(currList[1])
    //   currList.push(currList[2])

    // }
}



//finding the height top endcap
//returns the 
function findMaxZ(){
    maxZ = vertices[2]
    for(let i = 2; i < vertices.length; i++){
      if(maxZ < vertices[i] && (i+1) % 3 == 0){
        maxZ = vertices[i]
      }
    }
    res = 0
    for(let i = 0; i < vertices.length; i++){
      if(vertices[i] == maxZ){
        res = i
      }
    }
    return [Math.floor(res / 3), maxZ]
  }
  
  //finding the height of the bottom endcap
function findMinZ(){
    minZ = vertices[2]
    for(let i = 2; i < vertices.length; i++){
      if(minZ < vertices[i] && (i+1) % 3 == 0){
        minZ = vertices[i]
      }
    }
    res = 0
    for(let i = 0; i < vertices.length; i++){
      if(vertices[i] == minZ){
        res = i
      }
    }
    return [Math.floor(res / 3), minZ]
}


function downloadCoor(stringData, fileName){
    const blob = new Blob([stringData], { type: 'text/plain' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName; // Specify the filename for the download
    document.body.appendChild(downloadLink);

    downloadLink.click();
}


function generateFiles(boolEndCaps, rotated_points){
  point_list = []
  let coor_counter = 0
  
  if(boolEndCaps){
    highest_point = (findMaxZ())[1]
    point_list.push(0,0,highest_point)
    lowest_point = (findMinZ())[1]
    point_list.push(0,0,lowest_point)
  }
  for(let i = 0; i < rotated_points.length; i++){
    for(let j = 0; j < rotated_points[i].length; j++){
      point_list.push(rotated_points[i][j])
    }
  }

  //coor file generation
  coor_file = ""
  coor_file += '' + point_list.length/3 + '\n'
  for(let i = 0; i < point_list.length; i++){
    if(i%3==0){
      coor_file += "" + i/3 + ','
    }
    coor_file += "" + point_list[i] + ','
    //removes trailing comma after every line
    if((i+1)%3 == 0){
      // coor_file += ','
      placeholder = coor_file.slice(0,-1)
      coor_file = placeholder
      coor_file += '\n'
    } 
  }
  // console.log(coor_file)

  //generating the poly file

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
  //pointers used for keeping track of triangles
  pOne = 0
  pTwo = 1
  topListIndex = 0
  bottomListIndex = 1

  polyFile = '';
  triCounter = 0

  //adds all the triangles for the sides
  while(bottomListIndex != poly_points_list.length){
    v1 = poly_points_list[topListIndex][pOne % poly_points_list[topListIndex].length]
    v2 = poly_points_list[topListIndex][pTwo % poly_points_list[topListIndex].length]
    v3 = poly_points_list[bottomListIndex][pOne % poly_points_list[bottomListIndex].length]
    v4 = poly_points_list[bottomListIndex][pTwo % poly_points_list[bottomListIndex].length]
    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v2 + ' ' + v4 +'\n'
    triCounter += 1
    polyFile += 'tri' + triCounter + ' ' + v3 + ' ' + v4 + ' ' + v1 +'\n'
    triCounter += 1
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

  //defining the triangles for the endcaps
  endCapLevelTop = findMaxZ()[0]
  triCounter += 1
  endCapP1 = 0
  endCapP2 = 1
  
  while(endCapP2 % poly_points_list[endCapLevelTop].length != 0){
    v1 = poly_points_list[endCapLevelTop][endCapP1 % poly_points_list[endCapLevelTop].length]
    v2 = poly_points_list[endCapLevelTop][endCapP2 % poly_points_list[endCapLevelTop].length]

    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v2 + ' '+ 0 + '\n'
    endCapP1 += 1
    endCapP2 += 1
    triCounter += 1
  }

  endCapLevelTop = findMinZ()[0]
  triCounter += 1
  endCapP1 = 0
  endCapP2 = 1
  
  while(endCapP2 % poly_points_list[endCapLevelTop].length != 0){
    v1 = poly_points_list[endCapLevelTop][endCapP1 % poly_points_list[endCapLevelTop].length]
    v2 = poly_points_list[endCapLevelTop][endCapP2 % poly_points_list[endCapLevelTop].length]

    polyFile += 'tri' + triCounter + ' ' + v1 + ' ' + v2 + ' ' + 0 + '\n'
    endCapP1 += 1
    endCapP2 += 1
    triCounter += 1
  }

  let downloadFiles = document.getElementById('downloadFiles').checked
  if(downloadFiles){
    downloadCoor(coor_file, 'SOR.coor')
    setTimeout(()=>downloadCoor(polyFile, 'SOR.poly'), 500)
  }
}