// Code Aided using common development resources
// Main program
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl2');

// Set the viewport size
gl.viewport(0, 0, canvas.width, canvas.height);

// Create the vertex data for a single point
var vertices = new Float32Array([0, 0, 0, 1]);

// Create a vertex buffer object to store the vertex data
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Create the vertex shader
var vertexShaderSource = "#version 300 es
in vec4 a_position;

uniform float u_time;

void main() {
  // Generate a random number with a Gaussian distribution
  float rand = randn(u_time);

  // Update the position of the vertex using the random number
  gl_Position = a_position + vec4(rand, rand, 0, 0);
}";

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// Create the fragment shader
var fragmentShaderSource = "#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
  // Set the fragment color to white
  outColor = vec4(1, 1, 1, 1);
}";

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Create the program
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Bind the vertex data to the program
var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);

var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;       
