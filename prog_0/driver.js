//initialize elements that are referenced
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

//add event listeners
canvas.addEventListener('mousedown', drawPoint)
context.beginPath();
point_counter = 1
right_clicked = false

//drawing the x and y axis
let rectInit = canvas.getBoundingClientRect();
context.moveTo(500,0)
context.lineTo(500,350)
context.strokeStyle = "green";
context.stroke()
context.beginPath();

context.moveTo(0, 350/2)
context.lineTo(1000, 350/2)
context.strokeStyle = "red"
context.stroke()
context.beginPath();
context.strokeStyle = "black"
// context.strokeStyle = "black"


function drawPoint(e){
    //if user has right clicked, stop drawing
    if(right_clicked == true){
        return
    }
    //calculate offset of cursor on Canvas
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    //edge case for starting a drawing
    if(point_counter == 1){
        context.moveTo(x, y);
        point_counter = point_counter + 1
    }
    //continuously draw lines until user presses RMB
    else if(point_counter % 2 == 0){
        context.lineTo(x, y);
        context.stroke();
        context.moveTo(x,y)
        if(e.buttons == 2){
            right_clicked = true
        }
    }

}


