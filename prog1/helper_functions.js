function initialize(){
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

}