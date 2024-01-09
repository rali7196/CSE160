// Your JavaScript code for canvas interaction goes here
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('click', drawPoint)
ctx.beginPath();
point_counter = 1

function drawPoint(){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x)
    console.log("Coordinate y: " + y);
    console.log("point_counter: " + point_counter)
    if(point_counter == 1){
        console.log("first success")
        ctx.moveTo(x, y);
        point_counter = point_counter + 1
    }
    else if(point_counter % 2 == 0){
        console.log("second success")
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.moveTo(x,y)
    }


    // console.log("Success")


}



// Add your canvas drawing or interaction code here