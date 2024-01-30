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
    drawLines(canvas, context)
    
    context.strokeStyle = "black"
}