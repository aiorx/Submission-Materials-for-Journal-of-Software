/*
    @AssetManger class
    Used to create all assets on the map (Trees, roads, cars...)
*/

var Level = require('./level').Level;
var LevelInfo = require('./level').LevelInfo;
var U = require('./utils');

import {
    ROADSIZE, Graphics, Sprite, ASSETS, MAP, CAR_IMG
} from "./global";

var CarOptions = require('./car').CarOptions;
var Car = require('./car').Car;
var LidarInfoI = require('./car').LidarInfoI;
var BasicMotionEngine = require('./basic_motion_engine').BasicMotionEngine;
var BotMotionEngine = require('./bot_motion_engine').BotMotionEngine;
var Editor = require('./editor').Editor;

export interface AssetInfo {
    readonly mx?: number;
    readonly my?: number;
    readonly type?: any;
    readonly x?: number;
    readonly y?: number;
};

export interface RoadSprite extends PIXI.Sprite {
    // The road is not an obstacle (should be false)
    obstacle?: boolean;
    // Id of the road
    mapId?: number;
    // Orientation of the road
    orientation?: number;
    // Method call to set a car on this road
    setCarPosition?: any;
    // Array used to stored all the car currently on this road
    // This method take a list of id (id of each car)
    cars?: number[];
    // (x, y position) Relatif to the map
    mx?: number;
    my?: number;
    isremove?: boolean;
    arrow?: string;
}

export interface SimpleSprite extends PIXI.Sprite {
    obstacle?: boolean;
    // name of the asset (not the name of the image)
    type?: string;
    mapId?: number;
    isremove?: boolean;
}

class AssetManger {

    private level: Level|Editor;
    // Used to list the differents MotionEngine possible to add on the car
    // List of all items on the map
    public assets: SimpleSprite[] = [];
    private agentMotionEngine: any = BasicMotionEngine;
    private agentMotionOptions: Object = {};
    private agentLidarInfo: LidarInfoI = {};

    constructor(level: Level|Editor) {
        this.level = level;
    }

    /**
     * 
     * options Options to change the lidar options of the agent.
     * Changing the lidar change the state representation of the car in the
     * environement.
     */
    public setAgentLidar(options: LidarInfoI){
        this.agentLidarInfo = options;
    }

    /**
     * Change the motion engine of the agent. BasicMotionEngine by default.
     * This method should be called before to called 'load'.
     * @motion The motion engine to used for the agent when the environement is loaded.
     * @options Options to change the behavior of the motion engine.
     */
    public setAgentMotion(motion: any, options: Object){
        this.agentMotionEngine = motion;
        this.agentMotionOptions = options;
    }

    createRoadSide(info: AssetInfo){
        /*
            @textures: (Pixi textures)
        */
        var x = (info.mx) * ROADSIZE;
        var y = (info.my) * ROADSIZE;

        var area = new Graphics();
        area.beginFill(0xe8e8e8);
        area.drawRoundedRect(0, 0, ROADSIZE+30, ROADSIZE+30, undefined);
        area.x = x-15;
        area.y = y-15;
        area.endFill();

        this.level.addChild(area);
    }

    createRoad(info: AssetInfo, textures: any, arrow: string){
        /*
            Method use to add a new road on the map
            ↕, ↱ or ↔, ↰, ↲, ↳
            @textures: (Pixi textures)
        */
        var road: RoadSprite = new Sprite(textures[ASSETS.ROADS[info.type].image]);

        road.arrow = arrow;
        // Set the position of this road
        road.x = (info.mx) * ROADSIZE;
        road.y = (info.my) * ROADSIZE;

        road.obstacle = false;
        road.mapId = MAP.ROAD;       
        road.orientation = ASSETS.ROADS[info.type].orientation;
        road.setCarPosition = function (car: any, line: number, force: boolean=false) { return this.setCarOnRoad(road, car, line, force); };
        road.cars = [];
        road.mx = info.mx; // Map x
        road.my = info.my; // Map y

        this.level.addRoad(road);
    }

    setCarOnRoad(road: RoadSprite, car: any, line: number, force: boolean=false){
        /*
            @road: (Obejct) road to position the car on
            @car: (Object) car object to position
            @line is Optional. 0 By default.
        */
        if (line == undefined)
            line = Math.min(1, Math.floor(Math.random() * 2));
        var carById = this.level.findCarById(road.cars[0]);
        if (!force && road.cars.length >= 1 && carById && carById.core.line == line){
            line = line == 0 ? 1:0;
        }
        car.line = line;

        car.a = 0;
        car.v = 0;

        // Set the car on the road
        car.x = road.x;
        car.y = road.y;
        car.x += ROADSIZE / 2;
        car.y += ROADSIZE / 2;
        var x_margin = 0
        var y_margin = (ROADSIZE*1/4);
        // transform to map x coordinate
        // transform to map y coordinate
        road.orientation = (Math.floor(road.orientation / car.rotationStep)*car.rotationStep);
        var th = -road.orientation*(Math.PI); // theta
        var x_m = (Math.cos(th) * x_margin) - (y_margin * Math.sin(th));
        var y_m = (Math.cos(th) * y_margin) + (x_margin * Math.sin(th));

        var line_side_factor = line == 0 ? 1:-1;
        var line_side_factor_t = line == 0 ? 0:Math.PI;
        car.x += line_side_factor*Math.round(x_m);
        car.y += line_side_factor*Math.round(y_m);
        // (x, y position) Relatif to the map
        car.mx = Math.floor(car.x / ROADSIZE);
        car.my = Math.floor(car.y / ROADSIZE);
        // Car rotation
        car.rotation = (th+line_side_factor_t);
        // Set the new road of the car
        car.checkAndsetNewRoad(road);
    }

    createAsset(img: string, info: AssetInfo, textures: any, type: string){
        /*
            Create a simple asset on the map
            @type: (String) name of the asset (image)
            @info: (Object) x,y position of the asset
            @textures: (Pixi textures)
            @type (String) name of the asset (not the name of the image)
        */
        var asset: SimpleSprite = new Sprite(textures[img]);
        // The road is not an obstacle
        asset.obstacle = false;
        // Set the id of the road)
        asset.type = type;
        asset.mapId = 0;
        asset.x = info.x;
        asset.y = info.y;

        this.level.addChild(asset);
        this.assets.push(asset);
    }

    createMap(map: (string|number)[][], info: LevelInfo, textures: (PIXI.Texture|PIXI.loaders.TextureDictionary), roadside:boolean=true){
        /*
            Method used to create the map with all assets (except the cars)
            @map (2dim Array)
            @info (Object) Level's json.
            @textures: (Pixi textures)
        */
        if (roadside){
            // Draw the roads side
            for (var my = 0; my < map.length; my++) {
                for (var mx = 0; mx < map[my].length; mx++) {
                    if (ASSETS.ROADS[map[my][mx]]){
                        this.createRoadSide({mx, my, type: map[my][mx]});
                    }
                }
            }
        }
        // Draw the roads
        for (var my = 0; my < map.length; my++) {
            for (var mx = 0; mx < map[my].length; mx++) {
                if (ASSETS.ROADS[map[my][mx]]){
                    this.createRoad({mx, my, type: map[my][mx]}, textures, <string>map[my][mx]);
                }
            }
        }
        // Draw the others items
        for (var key in ASSETS){
            if (key != "ROADS" && info[key]){
                for (var a=0; a < info[key].length; a++){
                    this.createAsset(ASSETS[key].image, info[key][a], textures, key);
                }
            }
        }
    }

    createCars(info: any, textures: (PIXI.Texture|PIXI.loaders.TextureDictionary)){
        /*
            Method used to create all the cars
            @map (2dim Array)
            @info (Object) Level's json.
            @textures: (Pixi textures)
        */
        // Go through all the bot cars on the map
        for (var c in info.cars){
            var options: CarOptions = {lidar: true, lidarInfo: {pts: 2, width: 0.5, height: 1, pos: 1}};
            options.lidar = true;
            options.motionEngine = new BotMotionEngine(this.level);
            var n_car = new Car(this.level, info.cars[c], textures, options);
            // Append the car to the canvas
            this.level.addCar(n_car);
            //this.level.addChild(n_car.lidar);
        }
    }

    createAgent(info: any, textures: (PIXI.Texture|PIXI.loaders.TextureDictionary), displayLidar:boolean=true){
        /*
            Method used to create the agent's car.
            @map (2dim Array)
            @info (Object) Level's json.
            @textures: (Pixi textures)
        */
        var agent = new Car(this.level, info.agent, textures, {
            image: CAR_IMG.AGENT,
            lidar: true,
            lidarInfo: this.agentLidarInfo,
            motionEngine: new this.agentMotionEngine(<Level>this.level, this.agentMotionOptions)
        });
        if (displayLidar){
            this.level.addChild(agent.lidar);
        }
        this.level.addCar(agent);
        agent.core.agent = true;

        return agent;
    }

    addAsset(asset: any){
        this.assets.push(asset);
    }

    exportMap(width: number, height: number, file_name: string, download: boolean): any {
        /*
            Export the map
            @width (Integer) Width of the new map
            @height (Integer) Height of the new map
            @file_name (String) name of the file to export
        */
        var file: any = {"cars": []};
        var map = [];
        var envs = this.level.getEnvs();
        for (var y = 0; y < height; y++) {
            var line = [];
            for (var x = 0; x < width; x++) {
                line.push(0);
            }
            map.push(line);
        }
        for (var e = 0; e < envs.length; e++) {
            var elem = envs[e];
            if (!elem.isremove){
                // Add the cars
                if (elem.mapId == MAP.CAR && !elem.agent && elem.my < height && elem.mx < width){
                    file.cars.push({
                        "mx": elem.mx,
                        "my": elem.my,
                        "line": elem.line
                    });
                }
                else if (elem.mapId == MAP.ROAD && elem.my < height && elem.mx < width){
                    map[elem.my][elem.mx] = elem.arrow;
                }
            }
        }
        for (var e = 0; e < this.assets.length; e++) {
            var elem = this.assets[e];
            if (!elem.isremove){
                if (elem.type != "car" && elem.type !="agent"){
                    if (!file[elem.type])
                        file[elem.type] = [];
                    file[elem.type].push({
                        "x": elem.x,
                        "y": elem.y
                    });
                }
            }
        }
        // Set the map
        file.map = map;
        // If the agent exist
        if (this.level.agent){
            file.agent = {
                "mx": this.level.agent.core.mx,
                "my": this.level.agent.core.my,
                "line": this.level.agent.core.line,
                "motion": {
                    "type": "BasicMotionEngine",
                    "options":{
                        "rotationStep": 0.5,
                        "actions": ["UP", "LEFT", "RIGHT", "DOWN", "WAIT"]
                    }
                }
            };
        }
        var fileCOntent = JSON.stringify(file, null, 4);
        if (download)
            U.saveAs(fileCOntent, file_name);
        return file;
    }
}
