#define MAX_ITERATIONS 32
#define PI 3.1415926
#define R 10.0
#define FRACTAL_POWER 2.0

#define cy -0.835
#define cx 0.2321

uniform float iTime;
uniform vec2 iResolution;
uniform float iEscapeRadius;


// Essentially copied from pseudocode in https://en.wikipedia.org/wiki/Julia_set
float julia(vec2 uv, float time) {
    int curr_iter = 0;
    float escR = abs(sin(time)) * -9.0 + iEscapeRadius;
    while (uv.x*uv.x + uv.y * uv.y < escR*escR) {
        if (curr_iter >= MAX_ITERATIONS) {
            break;
        }
        float xtemp = uv.x * uv.x - uv.y * uv.y;
        uv.y = 2.0 * uv.x * uv.y + (cy * sin(time));
        uv.x = xtemp + (cx * cos(time));
        curr_iter += 1;
    }
    if (curr_iter == MAX_ITERATIONS) {
        return 0.0;
    } else {

        // hard stepped variant
        //return float(curr_iter) / float(MAX_ITERATIONS);

        // smoothed variant
        float abs_uv = uv.x * uv.x + uv.y * uv.y;
        return float(curr_iter) + 1.0 - log(log(abs_uv))/log(FRACTAL_POWER);

    }
}

// Gradient mapping function, Penned via standard programming aids
vec3 smoothColorGradient(float f) {
    // Clamp the value to ensure it stays in the 0.0 - 1.0 range
    f = clamp(f, 0.0, 1.0);

    // Define the refined multi-color gradient (ocean depths theme)
    vec3 color1 = vec3(0.02, 0.04, 0.1);   // Dark Navy
    vec3 color2 = vec3(0.0, 0.5, 0.5);     // Teal
    vec3 color3 = vec3(0.0, 1.0, 1.0);     // Bright Cyan
    vec3 color4 = vec3(1.0, 0.2, 0.6);     // Magenta
    vec3 color5 = vec3(0.4, 0.0, 0.4);     // Purple

    // Smoothly interpolate between the colors based on the fractal value 'f'
    vec3 color;
    if (f < 0.25) {
        color = mix(color1, color2, f / 0.25);
    } else if (f < 0.5) {
        color = mix(color2, color3, (f - 0.25) / 0.25);
    } else if (f < 0.75) {
        color = mix(color3, color4, (f - 0.5) / 0.25);
    } else {
        color = mix(color4, color5, (f - 0.75) / 0.25);
    }

    return color;
}

void main(){
    vec2 uv = (2.0*gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    uv *= 1.2; // zoom out
    float f = julia(uv, iTime*0.2);
    f *= 0.07; // darken the image a bit

    gl_FragColor = vec4(smoothColorGradient(f), 1.0);
}

