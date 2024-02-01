function initializeAsgn0Canvas(canvas, context){
    // const canvas = document.getElementById('myCanvas');
    // const context = canvas.getContext('2d');
    // canvas.origin = {x: 0, y: 0}
    

    // point_counter = 1
    // right_clicked = false
  
    //add event listeners
    canvas.addEventListener('mousedown', (e) => {
        drawPoint(e,canvas, context)
    })
    context.beginPath();

    
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
    // drawLines(canvas, context)
    
    // context.strokeStyle = "black"
}


function drawPoint(e, canvas, context){
    //if user has right clicked, stop drawing
    if(right_clicked == true){
        return
    }
    //calculate offset of cursor on Canvas
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let normX = ((x-(rect.right/2)) / rect.right)*2
    let normZ = -((y-(500/2)) / 500)*2


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
        // vertices_length = vertices_length + 3

    }
    //continuously draw lines until user presses RMB
    else if(point_counter % 2 == 0){
        context.lineTo(x, y);
        // console.log("point placed at ("+x+","+y+")")
        context.stroke();
        context.moveTo(x,y)
        vertices.push(normX)
        vertices.push(0)
        vertices.push(normZ)
        // vertices_length = vertices_length + 3

        if(e.buttons == 2){
            right_clicked = true
        }  
    }
}