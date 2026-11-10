#include <vector>
#include <iostream>

#pragma once
using namespace std;
class Screen{
    public:
        vector<vector<int>> map;
        int SCREEN_HEIGHT, SCREEN_WIDTH, HALF_SCREEN_HEIGHT, HALF_SCREEN_WIDTH;

        // interactable objects inside field
        int POWER_PELLET,
            PELLET;

        // walls and CLI interface values
        static inline int BLANK_SPACE = 32;
        static inline int HORIZONTAL_WALL = 45;
        static inline int VERTICAL_WALL = 124;
        static inline int DIAGONAL_LEFT = 92;
        static inline int DIAGONAL_RIGHT = 47;
        static inline int SCREEN_MARGIN_TOP = 2; 
        static inline int SCREEN_MARGIN_BOTTOM = 1;
        static inline int GHOST_GATE = 61;
        static inline int INNER_DIAGONAL = 43;

    private:
        // the purpose of these variables is just to instantiate the game screen, they are the same as the verbose ones

        // [ ] - blank space 
        int bs;
        // [-] - horizontal wall 
        int hw;
        // [|] - vertical wall
        int vw;
        // [\\] - diagonal left 
        int dl;
        // [/] - diagonal right
        int dr;
        // [*] - pellet
        int pl;
        // [o] - power pellet
        int pp;
        // [=] - ghost gate
        int gg;
        // [+] - inner diagonal
        int id;

    public:
        Screen(){
            SCREEN_HEIGHT = 36;
            SCREEN_WIDTH = 28;

            HALF_SCREEN_WIDTH = SCREEN_WIDTH/2;
            HALF_SCREEN_HEIGHT = SCREEN_HEIGHT/2;

            POWER_PELLET = 64;//111;
            PELLET = 42;

            bs = BLANK_SPACE;
            hw = HORIZONTAL_WALL;
            vw = VERTICAL_WALL;
            dl = DIAGONAL_LEFT;
            dr = DIAGONAL_RIGHT;
            pp = POWER_PELLET;
            pl = PELLET;
            gg = GHOST_GATE;
            id = INNER_DIAGONAL;

            vector<vector<int>> screen(SCREEN_HEIGHT, vector(SCREEN_WIDTH, BLANK_SPACE));
            this->map = screen;
        }

        vector<vector<int>> setupGameField(){
            vector<vector<int>> screen
            {                                           //|
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {dr,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,dl,dr,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,dl},
                {vw,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,vw},
                {vw,pl,dr,hw,hw,dl,pl,dr,hw,hw,hw,dl,pl,vw,vw,pl,dr,hw,hw,hw,dl,pl,dr,hw,hw,dl,pl,vw},
                {vw,pp,vw,bs,bs,vw,pl,vw,bs,bs,bs,vw,pl,vw,vw,pl,vw,bs,bs,bs,vw,pl,vw,bs,bs,vw,pp,vw},
                {vw,pl,dl,hw,hw,dr,pl,dl,hw,hw,hw,dr,pl,dl,dr,pl,dl,hw,hw,hw,dr,pl,dl,hw,hw,dr,pl,vw},
                {vw,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,vw},
                {vw,pl,dr,hw,hw,dl,pl,dr,dl,pl,dr,hw,hw,hw,hw,hw,hw,dl,pl,dr,dl,pl,dr,hw,hw,dl,pl,vw},
                {vw,pl,dl,hw,hw,dr,pl,vw,vw,pl,dl,hw,hw,id,id,hw,hw,dr,pl,vw,vw,pl,dl,hw,hw,dr,pl,vw},
                {vw,pl,pl,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,pl,pl,vw},
                {dl,hw,hw,hw,hw,dl,pl,vw,id,hw,hw,dl,bs,vw,vw,bs,dr,hw,hw,id,vw,pl,dr,hw,hw,hw,hw,dr},
                {bs,bs,bs,bs,bs,vw,pl,vw,id,hw,hw,dr,bs,dl,dr,bs,dl,hw,hw,id,vw,pl,vw,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,vw,pl,vw,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,vw,vw,pl,vw,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,vw,pl,vw,vw,bs,dr,hw,hw,gg,gg,hw,hw,dl,bs,vw,vw,pl,vw,bs,bs,bs,bs,bs},
                {hw,hw,hw,hw,hw,dr,pl,dl,dr,bs,vw,bs,bs,bs,bs,bs,bs,vw,bs,dl,dr,pl,dl,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,pl,bs,bs,bs,vw,bs,bs,bs,bs,bs,bs,vw,bs,bs,bs,pl,bs,bs,bs,bs,bs,bs},
                {hw,hw,hw,hw,hw,dl,pl,dr,dl,bs,vw,bs,bs,bs,bs,bs,bs,vw,bs,dr,dl,pl,dr,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,vw,pl,vw,vw,bs,dl,hw,hw,hw,hw,hw,hw,dr,bs,vw,vw,pl,vw,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,vw,pl,vw,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,vw,vw,pl,vw,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,vw,pl,vw,vw,bs,dr,hw,hw,hw,hw,hw,hw,dl,bs,vw,vw,pl,vw,bs,bs,bs,bs,bs},
                {dr,hw,hw,hw,hw,dr,pl,dl,dr,bs,dl,hw,hw,id,id,hw,hw,dr,bs,dl,dr,pl,dl,hw,hw,hw,hw,dl},
                {vw,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,vw},
                {vw,pl,dr,hw,hw,dl,pl,dr,hw,hw,hw,dl,pl,vw,vw,pl,dr,hw,hw,hw,dl,pl,dr,hw,hw,dl,pl,vw},
                {vw,pl,dl,hw,id,vw,pl,dl,hw,hw,hw,dr,pl,dl,dr,pl,dl,hw,hw,hw,dr,pl,vw,id,hw,dr,pl,vw},
                {vw,pp,pl,pl,vw,vw,pl,pl,pl,pl,pl,pl,pl,bs,bs,pl,pl,pl,pl,pl,pl,pl,vw,vw,pl,pl,pp,vw}, //[25][13] - pacman spawn
                {id,hw,dl,pl,vw,vw,pl,dr,dl,pl,dr,hw,hw,hw,hw,hw,hw,dl,pl,dr,dl,pl,vw,vw,pl,dr,hw,id},
                {id,hw,dr,pl,dl,dr,pl,vw,vw,pl,dl,hw,hw,id,id,hw,hw,dr,pl,vw,vw,pl,dl,dr,pl,dl,hw,id},
                {vw,pl,pl,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,vw,vw,pl,pl,pl,pl,pl,pl,vw},
                {vw,pl,dr,hw,hw,hw,hw,id,id,hw,hw,dl,pl,vw,vw,pl,dr,hw,hw,id,id,hw,hw,hw,hw,dl,pl,vw},
                {vw,pl,dl,hw,hw,hw,hw,hw,hw,hw,hw,dr,pl,dl,dr,pl,dl,hw,hw,hw,hw,hw,hw,hw,hw,dr,pl,vw},
                {vw,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,vw},
                {dl,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,dr},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
            };

            this->map = screen;
            return screen;
        }

        // test map Designed via basic programming aids
        vector<vector<int>> chatGPTmap2(){
            vector<vector<int>> screen
            {                                                           //|15
                {hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pp,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,hw,hw,bs,hw,hw,bs,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,hw,hw,bs,hw,hw,bs,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,hw,bs,hw,hw,bs,hw,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,bs,bs,bs,hw,bs,bs,bs,bs,bs,bs,bs,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,hw,bs,hw,hw,bs,hw,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,bs,bs,bs,bs,bs,bs,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,bs,bs,bs,hw,bs,hw,hw,bs,bs,bs,bs,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,hw,bs,hw,hw,bs,hw,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,hw,hw,bs,hw,hw,bs,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pl,hw,hw,bs,hw,hw,bs,hw,hw,bs,hw,hw,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {vw,pp,pl,pl,pl,bs,pl,bs,pl,bs,pl,pl,pl,pl,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
        /*15*/  {vw,vw,vw,vw,vw,bs,vw,vw,vw,vw,vw,vw,vw,vw,vw,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,id,hw,hw,hw,hw,hw,id,hw,hw,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,pl,pl,pl,pl,pl,bs,pl,pl,pl,pl,pl,pl,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,hw,hw,hw,hw,hw,hw,id,hw,hw,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,pl,pl,pl,bs,pl,pl,pl,pl,bs,pl,pl,pl,pl,pl},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,hw,hw,id,hw,hw,hw,hw,hw,hw,id,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,pl,pl,bs,pl,pl,pl,pl,pl,pl,bs,pl,pl,pl,pl},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,hw,hw,id,hw,hw,hw,hw,hw,hw,id,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,pl,pl,pl,bs,pl,pl,pl,pl,bs,pl,pl,pl,pl,pl},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,id,hw,hw,hw,hw,hw,id,hw,hw,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,pl,pl,pl,pl,pl,bs,pl,pl,pl,pl,pl,pl,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,hw,hw,hw,hw,hw,hw,id,hw,hw,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,pl,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw,hw},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs},
                {bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs,bs}
            };
            return screen;
        }

        int countPellets(vector<vector<int>> map){
            int cont = 0;
            for(long unsigned int row = 0; row < map.size(); row++){
                for(long unsigned int col = 0; col < map[0].size(); col++){
                    if(map[row][col] == PELLET) cont++;
                }
            }
            return cont;
        }
};