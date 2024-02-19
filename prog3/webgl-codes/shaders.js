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


varying vec3 diffuse;
varying vec3 ambient_light;
varying vec4 a_color_fragment;


varying vec4 v_Vertex;
varying vec3 v_Normal;

void main() {

  gl_Position = transformation * a_position;
  //vec4 a_color = vec4(1.0,0.0,1.0,1.0);

  v_Vertex = transformation * a_position;



  vec3 normal = normalize(vec3(normal_transformation * a_normal));

  v_Normal = normal;

  float nDotL = max(dot(light_direction, normal), 0.0);
  diffuse = light_color * a_color.rgb * nDotL;


  ambient_light = ambient_color * a_color.rgb;
  a_color_fragment = a_color;

  //v_Color = vec4(diffuse + ambient_light, a_color.a);
}
`

let fragmentShaderAsgn2 = `
precision mediump float;
      
uniform vec3 u_Light_Position;
uniform vec3 u_Light_Color;
uniform float u_Shininess;


varying vec4 v_Color;
varying vec3 diffuse;
varying vec3 ambient_light;
varying vec4 a_color_fragment;

varying vec4 v_Vertex;
varying vec3 v_Normal;


void main() {

  vec3 to_light_directional = normalize(u_Light_Position - v_Vertex.xyz);

  


  gl_FragColor = vec4(diffuse + ambient_light, a_color_fragment.a);
  //gl_FragColor = v_Color;
}
`