#include "../include/model_simulator_breakout.h"
#include "../src/model/ball.cpp"
#include "../src/model/paddle.cpp"
#include "../src/model/brick.cpp"

#include <ncurses.h>
#include <stdlib.h>
#include <random>

BreakoutModel::BreakoutModel() {
    
    
    //initialize paddle
    gamepaddle = new paddle(width/2, height);
    
    
    //initialize ball with random direction
    gameball = new ball(width/2, height-1, 0, 0);
    std::srand(static_cast<unsigned int>(std::time(nullptr))); // Seed the random number generator
    float randomDx;
    float randomDy;
    float ballSpeed = gameball->getSpeed();
    generateRandomSpeeds(randomDx, randomDy, ballSpeed);
    gameball->setDx(randomDx);
    gameball->setDy(randomDy);
    
    //initialize field
    initializeField();
    
    specialBrickOneActivated = false; 
    numberOfCollisionsLeft = 0; 
    

};


int BreakoutModel::getGameWidth() {
    return width; 
};
    
int BreakoutModel::getGameHeight() {
    return height; 
};

int BreakoutModel::getHScore() {
    return highscore; 
};

int BreakoutModel::getCScore() {
    return currentscore; 
};

bool BreakoutModel::getLost() {
    return lost; 
};

bool BreakoutModel::getWon() {
    return won; 
};

bool BreakoutModel::getStart() {
    return start; 
};

int BreakoutModel::getLevel() {
    return level; 
};

bool BreakoutModel::getAutoplay(){
    return autoplay;
}

bool BreakoutModel::getSpecialBrickOneActivated(){
    return specialBrickOneActivated; 
}

int BreakoutModel::getNumberOfCollisionsLeft(){
    return numberOfCollisionsLeft; 
}

void BreakoutModel::initializeField() {
    for(int i = 0; i < 5*13; i++) {
        if(i == 21 || i == 43) { 
            gamebricks[i] = new brick(3*(i%13)+1, (7 + i/13), 1); 
        } else { 
            gamebricks[i] = new brick(3*(i%13)+1, (7 + i/13));
        }
        
    }
};

//the getRandomAngle and generateRandomSpeeds functions were Aided using common development resources and then modified to suit for the gameball
// first prompt: I need a c++ method to give me two random speeds in x and y-direction so that the movement angle is random.

// Generate a random angle in radians between 0 and 2*pi
float BreakoutModel::getRandomAngle() {
    return (2.0 * M_PI * std::rand()) / RAND_MAX;
};

// Generate random speeds in the x and y directions resulting in a random angle of movement
void BreakoutModel::generateRandomSpeeds(float& dx, float& dy, float speed) {
    float angle = getRandomAngle();
    dx = speed * std::cos(angle);
    dy = speed * std::sin(angle);
    if (dy>0){
        dy = -dy;
    }
};

//restarts the game with a random direction of the ball
void BreakoutModel::restart(){
    float randomDx;
    float randomDy;
    float ballSpeed = gameball->getSpeed();
    generateRandomSpeeds(randomDx, randomDy, ballSpeed);
    
    gameball->setDx(randomDx);               
    gameball->setDy(randomDy);
    gameball->setX(width/2);
    gameball->setY(height-1);
    gamepaddle->setX(width/2);
    gamepaddle->setWidth(5);
    numberOfCollisionsLeft = 0;
    
    initializeField();
};

void BreakoutModel::simulate_game_step()
{
    // Move ball and paddle
        if(!start && !lost && !won){
            gameball-> move();
            // Check for Paddle collsion with bounds
            if(gamepaddle->getX() - (gamepaddle->getWidth()-1)/2 >= 1 && gamepaddle->getX() + (gamepaddle->getWidth()-1)/2 <= width-2){
                gamepaddle->move(); //move the paddle
            }
            if(gamepaddle->getX() - (gamepaddle->getWidth()-1)/2 <= 1 && gamepaddle->getDx() == 1){
                gamepaddle->move(); //move the paddle
            }
            if(gamepaddle->getX() + (gamepaddle->getWidth()-1)/2 >= width-2 && gamepaddle->getDx() == -1){
                gamepaddle->move(); //move the paddle
            } 
        }
    
    // Check for paddle movement
        if(gamepaddle->getDx() == -1) {
            gamepaddle->moveLeft();
        }
        if(gamepaddle->getDx() == 1) {
            gamepaddle->moveRight();
        }
        if(gamepaddle->getDx() == 0) {
            gamepaddle->stop();
        }
    
    
    // Check for Ball out of bounds
        if(gameball->getY() >= height+1){
            gameball->stop();
            gamepaddle->stop();
            lost = true;
        }
    
    // Check for Ball collisions with bounds
        if(gameball->getX() <= 1.5f || gameball->getX() >= width-1.5f) {
            gameball->reflectX();
        }
        if(gameball->getY() <= 3.5f){
            gameball->reflectY();
        }
    
    // Check for Ball collisions with paddle
    if(!start){
        if(gameball->getY() >= height-1){
            if( gameball->getX() >= gamepaddle->getX() - gamepaddle->getWidth()/2  && gameball->getX() <= gamepaddle->getX() + gamepaddle->getWidth()/2){
                gameball->reflectY();
                if(specialBrickOneActivated) {
                    numberOfCollisionsLeft--; 
                } 
                if (numberOfCollisionsLeft == 0) {
                    gamepaddle->setWidth(5); 
                    specialBrickOneActivated = false;  
                }
            }
        }
    } 

    // Check for Ball collisions with Bricks
    bool allDestroyed = true;
    for(int i = 0; i < 5*13; i++){
        if(!gamebricks[i]->getIsDestroyed()){
            allDestroyed = false;
            if(gameball->getY() <= gamebricks[i]->getY()+0.5f && gameball->getY() >= gamebricks[i]->getY()-0.5f){
                if(gameball->getX() >= gamebricks[i]->getX()-0.5f && gameball->getX() <= gamebricks[i]->getX()+2.5f){
                    gameball->reflectY();
                    gamebricks[i]->destroy();
                    currentscore++;
                    if(gamebricks[i]->getType() == 1){
                        gamepaddle->setWidth(7); 
                        specialBrickOneActivated = true; 
                        numberOfCollisionsLeft += 5; 
                    }
                    break;
                }
            }
        }     
    }
    if(allDestroyed){
        won = true;
    }
        
    
    notifyUpdate();
};



void BreakoutModel::control_game(std::string control){
    if (control=="startGame"){
        if(start) {
            start = false;
            gameball->move();
            gamepaddle->move(); //move the paddle
        } 
        else if(lost){
            if(currentscore > highscore){
            highscore = currentscore;
            }
            currentscore = 0;
            lost = false;
            start = true;
            restart();    
        } 
        else if(won){
            if(currentscore > highscore){
                highscore = currentscore;
            }
            currentscore = 0;
            won = false;
            start = true;
            restart(); 
        }
    }
    else{
        control_paddle(control);
    }
            
}


void BreakoutModel::control_paddle(std::string control)
{
    if (control=="moveLeft"){
        if(gamepaddle->getX() >= 1)
            gamepaddle->moveLeft();
    }
    else if (control=="moveRight"){
        if(gamepaddle->getX() <= width-gamepaddle->getWidth())
            gamepaddle->moveRight();
    }
    else if (control=="stop"){
        if(gamepaddle->getX() != width-gamepaddle->getWidth())
            gamepaddle->stop();
    }
};
