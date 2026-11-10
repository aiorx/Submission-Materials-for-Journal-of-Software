//Aided with basic GitHub coding tools

class Cone {
    constructor() {
        this.type = 'cone';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.segments = 20; 
    }

    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var angleStep = (2 * Math.PI) / this.segments;
        for (var i = 0; i < this.segments; i++) {
            var angle1 = i * angleStep;
            var angle2 = (i + 1) * angleStep;

            var x1 = Math.cos(angle1);
            var y1 = Math.sin(angle1);
            var x2 = Math.cos(angle2);
            var y2 = Math.sin(angle2);

            drawTriangle3D([
                0.0, 0.0, 0.0, 
                x1, y1, 0.0,
                x2, y2, 0.0 
            ]);
        }

        for (var i = 0; i < this.segments; i++) {
            var angle1 = i * angleStep;
            var angle2 = (i + 1) * angleStep;

            var x1 = Math.cos(angle1);
            var y1 = Math.sin(angle1);
            var x2 = Math.cos(angle2);
            var y2 = Math.sin(angle2);

            drawTriangle3D([
                0.0, 0.0, 1.0, 
                x1, y1, 0.0,   
                x2, y2, 0.0   
            ]);
        }
    }
}