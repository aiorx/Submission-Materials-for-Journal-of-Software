#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "graphics.h"
#include "globals.h"
#include "drawArena.h"

int const GRID_SIZE = 30;
int const MINROWCOL = 7;
int const MAXROWCOL = 15;
int NUMROWS;
int NUMCOLS;
int totMarkers;
// Using #define for SIZE ensures that it always represents the current product of NUMROWS and NUMCOLS,
// even if these values are changed later in the code. This keeps SIZE consistent with their current values.
#define SIZE (NUMROWS * NUMCOLS)

int randArenaSize(){
    return randomNum(MINROWCOL, MAXROWCOL);
}

void initialiseArenaSize(){
    NUMROWS = randomNum(MINROWCOL, MAXROWCOL);
    NUMCOLS = randomNum(MINROWCOL, MAXROWCOL);
}

//this function was Aided with basic GitHub coding tools
void printTiles(Tile *tile, int rows, int columns){
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < columns; c++) {
            int index = r * columns + c;
            printf("Tile at (%d, %d): x = %d, y = %d, type = %c , index = %d\n", r, c, tile[index].x, tile[index].y, tile[index].type, tile[index].index);
        }
    }
}

void drawTiles(Tile *tile){
    background();
    setColour(gray);
    for(int i = 0; i < SIZE; i++){
        int x = tile[i].x;
        int y = tile[i].y;
        char type = tile[i].type;
        if(type == 'w'){
            //wall
            drawOneTile(x, y, blue);
        } else if(type == 'm'){
            //marker
            drawOneTile(x, y, red);
        } else if(type == 'o'){
            //obstacle
            drawOneTile(x, y, black);
        } else{
            //tile
            drawRect(x, y, GRID_SIZE, GRID_SIZE);
        }
    }
}

void drawOneTile(int x, int y, colour colour){
    setColour(colour);
    fillRect(x, y, GRID_SIZE, GRID_SIZE);
    setColour(gray);
}


bool checkMoveableTile(Tile tile){
    return tile.type == 't' || tile.type == 'm';
}
bool checkImpossibleTile(Tile *tile, int index){
    if(checkMoveableTile(tile[index - NUMCOLS]) || checkMoveableTile(tile[index - 1]) || checkMoveableTile(tile[index + 1]) || checkMoveableTile(tile[index + NUMCOLS])){
        return false;
    }
    return true;
}

void createUniqueTiles(Tile *tile, int numTiles, char type){

    //I need to add a check to ensure that the obstacles don't make the markers impossible to get to
    int tilesDrawn = 0;
    while(tilesDrawn != numTiles){
        int index = randomNum(NUMCOLS + 1, NUMCOLS*(NUMROWS-1) - 2);
        if(type == 'm'){
            if(checkImpossibleTile(tile, index)){
                continue;
            }
        }
            //check we're on a tile
            if(tile[index].type == 't'){
                tile[index].type = type;
                tilesDrawn += 1;
            }
    }
}

//returns true if marker/home tile is impossible to get to
//returns false if possible

void replaceFreeTile(Tile curTile){
    background();
    setColour(red);
    fillRect(curTile.x, curTile.y, GRID_SIZE, GRID_SIZE);
}

void replaceMarker(Tile curTile){
    background();
    setColour(white);
    fillRect(curTile.x, curTile.y, GRID_SIZE, GRID_SIZE);
    setColour(gray);
    drawRect(curTile.x, curTile.y, GRID_SIZE, GRID_SIZE);
}

void appendArray(Tile *tile, int r, int c, Tile curTile){
    //append 3 elements
    int index = r * NUMCOLS + c;
    tile[index].x = curTile.x;
    tile[index].y = curTile.y;
    tile[index].type = curTile.type;
    tile[index].index = curTile.index;
}

//function to fill a 2d array with elements, where each element is an array with [x, y, typeOfTile]
void createTiles(Tile *tile, int rows, int columns){
    //initial x and y pos
    int x = CANVAS_WIDTH/5;
    int y = CANVAS_HEIGHT/5;
    int i = 0;

    for(int r = 0; r < rows; r++){
    
        for(int c = 0; c < columns; c++){
            //top wall
            if(r == 0 || r == rows - 1){
                Tile curTile = {x, y, 'w', i};
                appendArray(tile, r, c, curTile);
                x += GRID_SIZE;
                i++;
            }
            else{ 
                if(c == 0 || c == columns - 1){
                    //left and right wall
                    Tile curTile = {x, y, 'w', i};
                    appendArray(tile, r, c, curTile);
                    i++;
                } else{
                    //tiles between walls
                    Tile curTile = {x, y, 't', i};
                    appendArray(tile, r, c, curTile);
                    i++;
                }
                x += GRID_SIZE;
            }
        }
        //move to next row
        x = CANVAS_WIDTH/5;
        y += GRID_SIZE;
    }

    //create markers and obstacles
    totMarkers = randomNum(3, 5);
    int totObstacles = randomNum(4, 8);
    createUniqueTiles(tile, totObstacles, 'o');
    createUniqueTiles(tile, totMarkers, 'm');

}


Tile* drawArena(){
    initialiseArenaSize(); // Initialise NUMROWS and NUMCOLS
    //allocate memory for an array of structs
    Tile *arenaTiles = (Tile*)malloc(SIZE * sizeof(Tile));

    createTiles(arenaTiles, NUMROWS, NUMCOLS);
    // printTiles(arenaTiles, NUMROWS, NUMCOLS);
    drawTiles(arenaTiles);
    return arenaTiles;
}

