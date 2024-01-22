//initialize elements that are referenced
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
// canvas.origin = {x: 0, y: 0}

//add event listeners
canvas.addEventListener('mousedown', drawPoint)
context.beginPath();
point_counter = 1
right_clicked = false

//drawing the x and y axis
let rectInit = canvas.getBoundingClientRect();
context.moveTo(rectInit.right/2,0)
context.lineTo(rectInit.right/2, 500)
context.strokeStyle = "green";
context.stroke()
context.beginPath();

context.moveTo(0, 250)
context.lineTo(rectInit.right, 250)
context.strokeStyle = "red"
context.stroke()
context.beginPath();
context.strokeStyle = "black"

const outputCanvas = document.getElementById('3dCanvas');
const outputContext = outputCanvas.getContext('2d');
let outputRect = canvas.getBoundingClientRect();


outputContext.moveTo(outputRect.right/2,0)
outputContext.lineTo(outputRect.right/2, 500)
outputContext.strokeStyle = "green";
outputContext.stroke()
outputContext.beginPath();

outputContext.moveTo(0, 250)
outputContext.lineTo(rectInit.right, 250)
outputContext.strokeStyle = "red"
outputContext.stroke()
outputContext.beginPath();
outputContext.strokeStyle = "black"


// context.strokeStyle = "black"


//TODO: 
    //Generate the points needed to generate shape using rcos(360/n) for x and rsin(360/n) for y
    //Scale points down using similar triangles equation 
    //Figure out how to render shapes in 2d using webgl
    //Figure out how to get triangles from shapes given coordinates
    //

function getN(){
    var n = document.getElementById("n").value
    console.log(n)
}

function getDrawEndCaps(){
    var n = document.getElementById("drawEndCaps").value
    console.log(n)
}

var vertices = []
function drawPoint(e){
    //if user has right clicked, stop drawing
    if(right_clicked == true){
        return
    }
    //calculate offset of cursor on Canvas
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let normX = x / rect.right
    let normZ = ((-e.clientY + rect.bottom))/ rect.bottom

    //edge case for starting a drawing
    if(point_counter == 1){
        context.moveTo(x, y);
        point_counter = point_counter + 1
        // console.log("point placed at ("+x+","+y+")")
        vertices.push(normX)
        vertices.push(0)
        vertices.push(normZ)
        // console.log("normZ "+normZ)
        // console.log("normX "+normX)
        vertices_length = vertices_length + 3

    }
    //continuously draw lines until user presses RMB
    else if(point_counter % 2 == 0){
        context.lineTo(x, y);
        // console.log("point placed at ("+x+","+y+")")
        // console.log("normZ "+normZ)
        // console.log("normX "+normX)
        context.stroke();
        context.moveTo(x,y)
        vertices.push(normX)
        vertices.push(0)
        vertices.push(normZ)
        vertices_length = vertices_length + 3

        console.log(vertices)
        if(e.buttons == 2){
            right_clicked = true
        }  
    }
}

var rotated_points = []

function generateSORPoints(){
    //generate points
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
        theta = 360 / n
        for(let j = 2; j <= n; j++){
            let newX = r * Math.cos(theta * j)
            let newY = r * Math.sin(theta * j)
            curr.push(newX)
            curr.push(newY)
            curr.push(z)
        }
    }
}
function generateSOR(){
    generateSORPoints()
    

    console.log(rotated_points)   
}




