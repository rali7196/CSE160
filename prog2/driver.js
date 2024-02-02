

var vertices = []

function main(){

  const canvas = document.getElementById('myCanvas');
  const context = canvas.getContext('2d');
  point_counter = 1
  right_clicked = false

  initializeAsgn0Canvas(canvas, context, point_counter, right_clicked)

  let rangeInput = document.getElementById("rotationSliderX")
  rangeInput.addEventListener('input', ()=>{ 
     generateSORNewTransformation("asgn2Canvas", 500, 500, "vertex-shader-2d-asgn2", "fragment-shader-2d")
  })

  rangeInput = document.getElementById("rotationSliderY")
  rangeInput.addEventListener('input', ()=>{ 
     generateSORNewTransformation("asgn2Canvas", 500, 500, "vertex-shader-2d-asgn2", "fragment-shader-2d")
  })

  rangeInput = document.getElementById("rotationSliderZ")
  rangeInput.addEventListener('input', ()=>{ 
     generateSORNewTransformation("asgn2Canvas", 500, 500, "vertex-shader-2d-asgn2", "fragment-shader-2d")
  })

  rangeInput = document.getElementById("translationSliderX")
  rangeInput.addEventListener('input', ()=>{ 
     generateSORNewTransformation("asgn2Canvas", 500, 500, "vertex-shader-2d-asgn2", "fragment-shader-2d")
  })


}





















