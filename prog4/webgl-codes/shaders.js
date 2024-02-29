let vertexShader2d = `
attribute vec4 a_position;
    
uniform mat4 transformation;
varying vec4 v_color;

uniform mat4 MV_matrix;


void main() {
  gl_Position = MV_matrix * a_position;
  v_color = gl_Position+0.5;
}
`
let fragmentShader2d = `
precision mediump float;
    
varying vec4 v_color;


void main() {
  gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  //gl_FragColor = v_color;
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

varying vec3 point_vector_distance;

uniform vec3 light_direction_point;
uniform vec3 light_color_point;

uniform mat4 model_matrix;
uniform mat4 MV_matrix;

varying vec3 point_diffuse;
void main() {

  //gl_Position = transformation * a_position;
  gl_Position = MV_matrix * a_position;

  v_Vertex = transformation * a_position;
  vec3 normal = normalize(normal_transformation * a_normal).xyz;

  vec3 light_dir_point = (vec4(-100.0,100.0,100.0,1.0) ).xyz - (transformation * a_position).xyz;
  
  float nDotLPoint = max( dot( normalize(light_dir_point), normal), 0.0 );

  point_diffuse = vec3(1.0,0.8,0.2) * a_color.rgb * nDotLPoint;

  v_Normal = normal;

  float nDotL = max(dot(vec3(1.0,1.0,1.0), normal), 0.0);

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
varying vec3 point_vector_distance;
varying vec3 point_diffuse;

void main() {

  vec3 to_light_directional = normalize(u_Light_Position - v_Vertex.xyz);
  vec3 reflection = normalize(2.0 * dot(3, to_light_directional) * v_Normal - to_light_directional);
//change this to camera_vector - a_position, v_vertex is the a_position
  vec3 to_camera = normalize(-1.0 * v_Vertex.xyz);
  float cos_angle_directional = dot(reflection, to_camera);
  cos_angle_directional = clamp(cos_angle_directional, 0.0, 1.0);
  cos_angle_directional = pow(cos_angle_directional, 2.0);
  vec3 specular_color_directional = u_Light_Color * a_color_fragment.rgb * cos_angle_directional;



  gl_FragColor = vec4(diffuse + ambient_light + specular_color_directional, a_color_fragment.a);
  //gl_FragColor = v_Color;
}
`