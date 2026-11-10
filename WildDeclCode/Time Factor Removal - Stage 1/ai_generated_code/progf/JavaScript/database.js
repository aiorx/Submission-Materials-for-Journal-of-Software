// Importing Mongoose Schemas
var User = require("../models/User");
var ExplorationItem = require("../models/ExplorationItem")

// Aided using common development resources, checkout dummy_Data folder
var dummyExplorationData = require('../dummy_Data/explorationData.json')
var mongoose = require("mongoose");

// Importing DB calls
var userCalls = require('../backend/userCalls');
var explorationItemCalls = require('../backend/explorationItemCalls');

// Declaring Database Name / Size
// CHECKING UTIL FILE FOR GLOBAL CONSTANTS
var util = require('../util')
var dbName = util.DATABASE_NAME;
var userCount = util.USERS_COUNT;
var maxUserPlanCount = util.MAX_USER_PLAN_COUNT;

/**
 * Initializing Database * 
 * @returns Database
 */
async function init() {
    try {
        await mongoose.connect("mongodb+srv://admin:EiRWf7t6xkNcHsty@6ixplore.gt56rc8.mongodb.net/" + (dbName) + "");
        var db = mongoose.connection;

        // Resetting DB entries so it doesnt stack every run
        // db.dropCollection(User.collection.name);
        // db.dropCollection(ExplorationItem.collection.name);

        // Adding User and Exploration Schemas to DB
        db.model("User", User.schema);
        db.model("ExplorationItem", ExplorationItem.schema);

        // Populating DB with dummy Data 
        // Note Exploration Data is hard capped to 23 entries (Check out data inside dummy_Data folder)
        // await addDummyExplorationData();
        // await addDummyUserData(userCount);        

        return db;

    } catch (error) {
        console.error(error);
    }
}


/**
 * This fetches and adds dummy user data to our data base
 * 
 * Api-endpoint: https://random-data-api.com/api/v2/users  
 * Documentation: https://random-data-api.com/documentation
 * @param {Number} size Size of Users to be added to DB
 */
async function addDummyUserData(size) {

    var api_endpoint = "https://random-data-api.com/api/v2/users?size=" + (size) + "";
    await fetch(api_endpoint, {
        method: "GET"
    })
        .then(function response {
            if (response.status !== 200) {
                return "error";
            }
            return response.json();
        })
        .then(function data {
            data.forEach(async user => {
                var favList = await addRandomFavoriteItems();
                var newUser = {
                    name: "" + (user.first_name) + " " + (user.last_name) + "",
                    email: user.email,
                    password: user.password,
                    favourites: favList,
                    plans: await addRandomPlanItems(favList)
                }
                userCalls.addUserToDB(newUser);
            });
        })
        .catch(function error {
            console.log(error);
            throw (new Error("Error: " + (error) + "\nSomething went wrong with the Dummy Data API"));
        });
}

/**
 * Adding Dummy Exploration Data (Aided using common development resources) 
 * 
 * Check Out dummyData Folder
 */
async function addDummyExplorationData() {
    for (var item of dummyExplorationData) {
        item.stars = 1 + util.getRandomInt(5);
        await explorationItemCalls.addExplorationItemToDB(item);
    }
}

/**
 * 
 * @returns Return Random Plan Items to be Added to User (Dummy Data Purpose)
 */
async function addRandomPlanItems(favList) {
    // Getting Random Items from based on USER FAV LIST
    var array = []
    for (var item of favList) {
        // Randomly picking Fav items to add to plan
        if (Math.random() >= 0.5) {
            var tempItem = await explorationItemCalls.getExplorationItemFromDB(item._id);
            array.push({
                name: tempItem.name,
                planItem: item._id
            })
        }
    }
    return array;
}

/**
 * 
 * @returns Return Random Favorite Items to be added to User (Dummy Data Purpose)
 */
async function addRandomFavoriteItems() {
    // Getting Random Items from DB. Hard coded 15 as the highest number of fav items for now
    var randomFavItems = await getRandomExplorationItems(util.getRandomInt(maxUserPlanCount));
    var array = [];

    for (var item of randomFavItems) {
        array.push(item._id);
    }
    return array;
}

/**
 * 
 * @param {number} itemCount 
 * @returns Random number of exploration items from the database
 */
async function getRandomExplorationItems(itemCount) {
    try {
        var randomItems = await ExplorationItem.aggregate([
            { $sample: { size: itemCount } }
        ]);

        return randomItems;
    } catch (error) {
        throw new Error('Error fetching random exploration items');
    }
}

module.exports = { init }
