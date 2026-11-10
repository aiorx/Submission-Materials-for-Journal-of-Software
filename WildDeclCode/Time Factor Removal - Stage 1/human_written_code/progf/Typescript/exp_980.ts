var MotionEngine = require('./motion_engine').MotionEngine;
var Level = require('./level').Level;

import {
    MAP, ROADSIZE
} from "./global";

var U = require('./utils');
var actionSpaceDescription = require('./motion_engine').actionSpaceDescription;

export interface BasicMotionOptions{
    readonly rotationStep?: number;
    readonly actions?: string[];
}

class BasicMotionEngine extends MotionEngine {
    /*
        Basic Motion Engine
        In this configuration the possible action of the environement are
        either left, right, up, down or wait.
    */
    private rotationStep: number;
    private actions: string[];
    private maxSpeed: number = 1.0;

    constructor(level: Level, options: BasicMotionOptions) {
        super(level);
        this.rotationStep = options.rotationStep || 0.5;
        this.actions = options.actions || ["UP", "LEFT", "RIGHT", "DOWN", "WAIT"];
    }

    setUp(car: any, lidar: any){
        /*
            Setup the motion engine
            @car: (Vehicle Object)
            @lidar: (Lidar Object)
        */
        this.car = car;
        this.lidar = lidar;
        // Init the lidar state
        this.state = [];
        for (let y = 0; y < lidar.pts; y++) {
            let line = [];
            for (let x = 0; x < lidar.pts; x++) {
                line.push(MAP.DEFAULT);
            }
            this.state.push(line);
        }
        // Set up keyboard interaction
        this.setUpKeyboard();
        // Setup up velocity to 0
        this.car.v = 0;
        this.car.a = 0; // Acceleration
        this.car.yaw_rate = 0;

        this.detectInteractions();
    }

    setUpKeyboard(){
        /*
            Setup possible keyboard interactions
        */
        let left = U.keyboard(37);
        let up  = U.keyboard(38);
        let right = U.keyboard(39);
        let down = U.keyboard(40);

        // Left and Right
        if (this.actions.indexOf("LEFT") != -1)
            left.press = function () { this.turnLeft(); };
        if (this.actions.indexOf("RIGHT") != -1)
            right.press = function () { this.turnRight(); };
        // Move forward
        if (this.actions.indexOf("UP") != -1){
            up.press = function () { this.moveForward(); };
            up.release = function () {
                this.car.v = 0;
            };
        }
        if (this.actions.indexOf("DOWN") != -1){
            // Move backward
            down.press = function () { this.moveBackward();};
            down.release = function () {
                this.car.v = 0;
            };
        }
    }

    turnLeft():void {
        /*
            Turn left
        */
       this.car.rotation -= this.rotationStep*Math.PI
       this.lidar.rotation = this.car.rotation;
    }

    turnRight():void {
        /*
            Turn right
        */
        this.car.rotation += this.rotationStep*Math.PI;
        this.lidar.rotation = this.car.rotation;
    }

    moveForward():void {
        /*
            Move forward
        */
        this.car.v = 1;
    }

    moveBackward():void {
        /*
            Move backward
        */
        this.car.v = -1;
    }

    actionStep(delta: number, action: number){
        /*
            Step into the environement with one action
            @delta (Float) time since the last update
            @action: (Integer) The action to take (can be null if no action)
        */
        if (this.actions[action] == "LEFT") { this.turnLeft();}
        if (this.actions[action] == "RIGHT") { this.turnRight();}
        if (this.actions[action] == "UP") { this.moveForward();}
        if (this.actions[action] == "DOWN") { this.moveBackward();}

        var agentCollisions = this.step.agentCollisions;
var onRoad = this.step.onRoad;(delta);
        this.car.v = 0;
        return {agentCollisions, onRoad};
    }

    actionSpace(): actionSpaceDescription{
        /*
            Return a description of the action space.
        */
        return {
            type: "Discrete",
            size: 1,
            range: [0, 1, 2, 3, 4]
        }
    }

    step(delta: number){
        /*
            Step into the environement
            @delta (Float) time since the last update
        */
        // Update the x and y position according to the velocity
        this.car.x += this.car.v * Math.cos(this.car.rotation)*delta;
        this.car.y += this.car.v * Math.sin(this.car.rotation)*delta;
        // Update the x and x position according to the map
        this.car.mx = Math.floor(this.car.x / ROADSIZE);
        this.car.my = Math.floor(this.car.y / ROADSIZE);

        // Set the new road of the car (if changed)
        this.car.checkAndsetNewRoad();

        // Be sure to keep the lidar position at the same position than the car
        this.lidar.x = this.car.x;
        this.lidar.y = this.car.y;
        this.lidar.rotation = this.car.rotation;

        // Point A
        //var x_margin = this.car.width / 2;
        //var y_margin = this.car.height / 2;
        // Point B
        //var x_margin = -this.car.width / 2;
        //var y_margin = this.car.height / 2;
        // Point C
        //var x_margin = -this.car.width / 2;
        //var y_margin = -this.car.height / 2;
        // Point D
        //var x_margin = this.car.width / 2;
        //var y_margin = -this.car.height / 2;
        //var th = this.car.rotation;
        //var x_m = (Math.cos(th) * x_margin) - (y_margin * Math.sin(th));
        //var y_m = (Math.cos(th) * y_margin) + (x_margin * Math.sin(th));
        //this.car.mybound.width = 3;
        //this.car.mybound.height = 3;
        //this.car.mybound.x = this.car.x + x_m;
        //this.car.mybound.y = this.car.y + y_m;

        // Detection the new collision with the environement
        var agentCollisions = this.detectInteractions.agentCollisions;
var onRoad = this.detectInteractions.onRoad;(true, true);

        if (agentCollisions.length > 0){ // Stop the vehicle if a collision is detected
            this.car.v = 0;
            this.car.vy = 0;
        }
        return {agentCollisions, onRoad};
    }
}
