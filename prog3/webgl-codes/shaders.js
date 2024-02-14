let vertexShader2d = `
attribute vec4 a_position;
    
uniform mat4 transformation;
varying vec4 v_color;

void main() {
  gl_Position = transformation * a_position;
  v_color = gl_Position+0.5;
}
`
let fragmentShader2d = `
precision mediump float;
    
varying vec4 v_color;


void main() {
  //gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  gl_FragColor = v_color;
}
`

let vertexShaderAsgn2 = `
attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec4 a_color;

uniform vec3 light_color;
uniform vec3 light_direction;

uniform vec3 ambient_color;

uniform mat4 transformation;
uniform mat4 normal_transformation;

varying vec4 v_Color;

void main() {

  gl_Position = transformation * a_position;
  //vec4 a_color = vec4(1.0,0.0,1.0,1.0);

  vec3 normal = normalize(vec3(normal_transformation * a_normal));
  float nDotL = max(dot(light_direction, normal), 0.0);
  vec3 diffuse = light_color * a_color.rgb * nDotL;

  //v_Color = a_color;

  vec3 ambient_light = ambient_color * a_color.rgb;

  v_Color = vec4(diffuse + ambient_light, a_color.a);
  //v_Color = vec4(diffuse, gl_Position.a);
}
`

let fragmentShaderAsgn2 = `
precision mediump float;
      
varying vec4 v_Color;


void main() {
  gl_FragColor = v_Color;
}
`