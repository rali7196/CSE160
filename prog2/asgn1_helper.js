
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