//
// Originally Produced via common programming aids on 2024-06-29
//
//import { mat4, vec3 } from 'gl-matrix';
declare var mat4: any;
declare var vec3: any;
namespace _11dotjs {
class WebGL {

        // Retrieve the canvas element and its WebGL rendering context
        private canvas: HTMLCanvasElement = null;
        private gl: WebGLRenderingContext = null;
        private vsSource = null;
        private fsSource = null;
        private clearColor = null;
        private positions: number[];

        constructor() {
            this.initWebGl();
        }

        private initWebGl() {
            this.canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
            this.gl = this.canvas.getContext('webgl');
            
            if( !this.gl ) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                throw new Error("WebGL not supported");
            }
            
            // Define the color to clear the screen to (red, green, blue, alpha)
            this.clearColor = [0.66, 0.66, 0.66, 1.0]; // Black
            
            // Vertex shader program
            this.vsSource = "
            attribute vec4 aVertexPosition;
            void main(void) {
                gl_Position = aVertexPosition;
            }
            ";
            
            // Fragment shader program
            this.fsSource = "
            void main(void) {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // White color
            }
            ";
        }

        // Initialize a shader program
        private initShaderProgram( gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
            var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
            var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

            // Create the shader program
            var shaderProgram = gl.createProgram();
            if (!shaderProgram || !vertexShader || !fragmentShader) {
                throw new Error("Error creating shader program");
            }
            
            gl.attachShader( shaderProgram, vertexShader );
            gl.attachShader( shaderProgram, fragmentShader );
            gl.linkProgram( shaderProgram );

            // Check if it linked successfully
            if ( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
                var info = gl.getProgramInfoLog(shaderProgram);
                gl.deleteProgram(shaderProgram);
                throw new Error('Unable to initialize the shader program: ' + info);
            }

            return shaderProgram;
        }

        // Load a shader
        private loadShader( gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
            var shader = gl.createShader(type);
            if (!shader) {
                throw new Error("Error creating shader");
            }

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            // Check if it compiled successfully
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var info = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error('An error occurred compiling the shaders: ' + info);
            }

            return shader;
        }


        // Initialize buffers
        private initBuffers( gl: WebGLRenderingContext): WebGLBuffer {
            // Create a buffer for the square's positions.
            var positionBuffer = gl.createBuffer();

            // Select the positionBuffer as the one to apply buffer
            // operations to from here out.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Now create an array of positions for the square.
            var origin: VisPoint = new VisPoint( 0.0, 0.0, 0.0 );
            this.positions = this.sphereVertexList( origin, 8.0 );
            /*
            [
                0.0,  1.0,  0.0,
            -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
            ];
            */

            // Pass the list of positions into WebGL to build the
            // shape. We do this by creating a Float32Array from the
            // JavaScript array, then use it to fill the current buffer.
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW );
            return positionBuffer;
        }

        private sphereVertexList( origin: VisPoint, radius: number ): number[] {
            var slices: number = 8;//this.getSlices();
            var rings: number = 8;//this.getRings();
            var PI: number = <number>Math.PI;
            var rho: number;
            var drho: number;
            var theta: number;
            var dtheta: number;
            var x: number;
            var y: number;
            var z: number;
            var s: number;
            var t: number;
            var ds: number;
            var dt: number;
            var i: number;
            var j: number;
            var imin: number;
            var imax: number;
            var oX: number = origin.x;
            var oY: number = origin.y;
            var oZ: number = origin.z;
            drho = PI / rings;
            dtheta = 2.0 * PI / slices;
            //this.glBegin(GL.GL_TRIANGLE_FAN);
            //this.normal$float$float$float(0.0, 0.0, 1.0);
            
            //this.vertex$double$double$double(oX, oY, oZ + radius);
            var ret: number[] = [];
            ret.push( oX, oY, oZ + radius );
            for(j = 0; j <= slices; j++) {{
                theta = (j === slices) ? 0.0 : j * dtheta;
                x = -Math.sin(theta) * Math.sin(drho);
                y = Math.cos(theta) * Math.sin(drho);
                z = Math.cos(drho);
                //this.normal$double$double$double(x, y, z);
                //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                ret.push( oX + x * radius, oY + y * radius, oZ + z * radius );
            };}
            //this.glEnd();
            ds = (<any>Math).fround(1.0 / slices);
            dt = (<any>Math).fround(1.0 / rings);
            t = 1.0;
            imin = 1;
            imax = rings - 1;
            for(i = imin; i < imax; i++) {{
                rho = i * drho;
                //this.glBegin(GL.GL_QUAD_STRIP);
                s = 0.0;
                for(j = 0; j <= slices; j++) {{
                    theta = (j === slices) ? 0.0 : j * dtheta;
                    x = -Math.sin(theta) * Math.sin(rho);
                    y = Math.cos(theta) * Math.sin(rho);
                    z = Math.cos(rho);
                    //this.normal$double$double$double(x, y, z);
                    //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                    ret.push( oX + x * radius, oY + y * radius, oZ + z * radius );
                    x = -Math.sin(theta) * Math.sin(rho + drho);
                    y = Math.cos(theta) * Math.sin(rho + drho);
                    z = Math.cos(rho + drho);
                    //this.normal$double$double$double(x, y, z);
                    s += ds;
                    //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                    ret.push( oX + x * radius, oY + y * radius, oZ + z * radius );
                };}
                //this.glEnd();
                t -= dt;
            };}
            //this.glBegin(GL.GL_TRIANGLE_FAN);
            //this.normal$float$float$float(0.0, 0.0, -1.0);
            //this.vertex$double$double$double(oX + 0.0, oY + 0.0, oZ + -radius);
            ret.push( oX + 0.0, oY + 0.0, oZ + -radius );
            rho = PI - drho;
            s = 1.0;
            for(j = slices; j >= 0; j--) {{
                theta = (j === slices) ? 0.0 : j * dtheta;
                x = -Math.sin(theta) * Math.sin(rho);
                y = Math.cos(theta) * Math.sin(rho);
                z = Math.cos(rho);
                //this.normal$double$double$double(x, y, z);
                s -= ds;
                //this.vertex$double$double$double(oX + x * radius, oY + y * radius, oZ + z * radius);
                ret.push(oX + x * radius, oY + y * radius, oZ + z * radius);
            };}
            //this.glEnd();
            return ret;
        }


        // Draw the scene
        private drawScene(gl: WebGLRenderingContext, programInfo: any, buffers: any) {
            // Clear the canvas before we start drawing on it.
            gl.clearColor( this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Tell WebGL how to pull out the positions from the position
            // buffer into the vertexPosition attribute.
            {
                var numComponents = 3;  // pull out 3 values per iteration
                var type = gl.FLOAT;    // the data in the buffer is 32bit floats
                var normalize = false;  // don't normalize
                var stride = 0;         // how many bytes to get from one set of values to the next
                                        // 0 = use type and numComponents above
                var offset = 0;         // how many bytes inside the buffer to start from
                gl.bindBuffer( gl.ARRAY_BUFFER, buffers.position );
                gl.vertexAttribPointer(
                    programInfo.attribLocations.vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                gl.enableVertexAttribArray(
                    programInfo.attribLocations.vertexPosition);
            }

            // Tell WebGL to use our program when drawing
            gl.useProgram( programInfo.program );
            this.configureViewVolume( programInfo.program );
            this.configureLighting( programInfo.program );

            // Set the shader uniforms

            {
                var offset = 0;
                var vertexCount = this.positions.length / 3;
                // Break here to see output?!
                gl.drawArrays( gl.TRIANGLES, offset, vertexCount );
                var stop = 1;
            }
        }

        private configureViewVolume( program ) {
            //var mat4: any;
            // Set up the view volume and perspective projection matrix
            var fieldOfView = 45 * Math.PI / 180;   // in radians
            var aspect = this.canvas.width / this.canvas.height;
            var zNear = 0.1;
            var zFar = 100.0;
            var projectionMatrix = mat4.create();
            mat4.perspective( projectionMatrix, fieldOfView, aspect, zNear, zFar );

            // Set up the model view matrix (camera position)
            var modelViewMatrix = mat4.create();
            mat4.translate( modelViewMatrix, modelViewMatrix, [ 0.0, 0.0, -20.0 ] );  // Move back 6 units

            // Set up the normal matrix
            var normalMatrix = mat4.create();
            mat4.invert( normalMatrix, modelViewMatrix );
            mat4.transpose( normalMatrix, normalMatrix );

            // Pass matrices to the shader
            var uProjectionMatrix = this.gl.getUniformLocation( program, 'u_projectionMatrix' );
            var uModelViewMatrix = this.gl.getUniformLocation( program, 'u_modelViewMatrix' );
            var uNormalMatrix = this.gl.getUniformLocation( program, 'u_normalMatrix' );

            this.gl.uniformMatrix4fv( uProjectionMatrix, false, projectionMatrix );
            this.gl.uniformMatrix4fv( uModelViewMatrix, false, modelViewMatrix );
            this.gl.uniformMatrix4fv( uNormalMatrix, false, normalMatrix );

        }

        private configureLighting( program ) {
            var lightDirection = vec3.fromValues(-0.5, -0.5, -0.5);
            vec3.normalize( lightDirection, lightDirection );

            var uLightDirection = this.gl.getUniformLocation(program, 'u_lightDirection');
            var uLightColor = this.gl.getUniformLocation(program, 'u_lightColor');
            var uAmbientColor = this.gl.getUniformLocation(program, 'u_ambientColor');

            this.gl.uniform3fv( uLightDirection, lightDirection );
            this.gl.uniform4f( uLightColor, 1.0, 1.0, 1.0, 1.0 );  // White light
            this.gl.uniform4f( uAmbientColor, 0.2, 0.2, 0.2, 1.0 );  // Ambient light
        }

        // Main function
        // 2024-07-06 - I am not too clever. This demo renders only blackness. I
        // wrote the code to create vertices for a sphere, but I still need a 
        // view volume and lighting. Phooey. It's a lot of work, for what??
        //
        private runDemo() {
            // Initialize WebGL
            var shaderProgram = this.initShaderProgram( this.gl, this.vsSource, this.fsSource );
            var programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: this.gl.getAttribLocation( shaderProgram, 'aVertexPosition' ),
                },
            };

            var buffers = {
                position: this.initBuffers( this.gl ),
            };

            this.drawScene( this.gl, programInfo, buffers );
        }

        public static demo() {
            DocComposer.compose( 
                {
                    canvas: { 
                        id: "glCanvas",
                        width: 1400,
                        height: 900,
                        style: "cursor: crosshair"
                    },

                    script: {
                        src: "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"
                    }
                },
                document.body
            );
            var webGl = new WebGL();
            webGl.runDemo();
        }
    }
}



