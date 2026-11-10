#include <SDL2/SDL.h>
#include <GL/gl.h>

/*
Display a static triangle. 
This code serves as the base case.
Code Supported by standard GitHub tools on 06/12/25. 
*/

int main() {
    // Initialize SDL with video
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        return 1;
    }

    // Create SDL window with OpenGL context
    SDL_Window* window = SDL_CreateWindow("Static Triangle",
        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 500, 500, SDL_WINDOW_OPENGL);
    if (!window) {
        SDL_Quit();
        return 1;
    }

    SDL_GLContext gl_context = SDL_GL_CreateContext(window);

    // Main loop
    bool running = true;
    SDL_Event event;
    while (running) {

        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) running = false;
        }

        // OpenGL rendering
        glClearColor(0, 0, 0, 1);
        glClear(GL_COLOR_BUFFER_BIT);

        glBegin(GL_TRIANGLES);
            // top vertex 
            glColor3f(1.0, 0.0, 0.0); // Red
            glVertex2f(0.0f, 0.5f);

            // left vertex
            glColor3f(0.0, 1.0, 0.0); // Green
            glVertex2f(-0.5f, -0.5f);

            // right vertex
            glColor3f(0.0, 0.0, 1.0); // Blue
            glVertex2f(0.5f, -0.5f);
        glEnd();

        SDL_GL_SwapWindow(window);
    }

    SDL_GL_DeleteContext(gl_context);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}