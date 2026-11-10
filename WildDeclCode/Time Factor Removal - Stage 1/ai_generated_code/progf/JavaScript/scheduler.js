// import { urlToHttpOptions } from "url";
// import { Card } from "./interfaces/card";
// import * as fs from "fs";
// import * as path from "path";
// import { equal } from "assert";
var cardEquality = require('./utils').cardEquality;
var deckEquality = require('./utils').deckEquality;
var exportPath = "./exportedCards/";



//Sort function Supported via standard programming aids
function sortCardArray(cardArray, criteria="Accuracy", direction="Ascending") {
    if (cardArray.length > 0) {
        var sortedCards = cardArray.map(function (card) {return {...card};} );
        if (criteria === "Accuracy") {
            sortedCards.sort(function (a, b) {
                if (a.accuracy < b.accuracy) {
                return -1;
                } else if (a.accuracy > b.accuracy) {
                return 1;
                } else {
                return 0;
                }
            });    
        }
        if (direction === "Descending")
            return sortedCards.reverse();
        else if (direction === "Ascending"){
            return sortedCards
        }
        else {
            console.log("Sorting direction not implemented yet!")
        }
    }
    else {
        return [];
    }
}

function avoidRecentCards(sortedCardArray, cardArray, recentCards=[], wait=3) {
    var avoidedIndices = [];
    // If the array is long enough to space out the repetition of cards according to wait
    if (sortedCardArray.length > wait) {
        // Based on the wait value for spacing of repetition, determine which cards to avoid repeating for the current iteration 
        avoidedIndices = recentCards.slice(Math.max(0, recentCards.length - wait), recentCards.length);
        // console.log("AvoidsCase1: ", avoidedIndices);
    }
    // If the array is too short for the requested spacing of repetition
    else {
        if (recentCards.length > 1) {
            // Since there aren't enough cards for spaced repetition, just take the least recent.
            //    Note: this only works because QuizPage will drop the first element of the index after it's repeated. Otherwise a cleaner solution needs to be found
            avoidedIndices = recentCards.slice(1, recentCards.length);
        }
        else {
            // If the recentCards are empty, just return an empty array
            avoidedIndices = [];
        }
    }
    // console.log("avoidIndices: ", avoidedIndices);
    

    // Look through the sortedCardArray, finding the highest-priority card that is ready to be shown again 
    //    returning its index within the sorted array
    for (var i = 0; i < sortedCardArray.length; i++) {
        var nextCard = sortedCardArray[i];
        var unsortedIndex = cardArray.findIndex(function card { return cardEquality(card, nextCard); });

        // console.log("Index of unsortedIndex: " , unsortedIndex);
        if (avoidedIndices.includes(unsortedIndex)) {
            // console.log("Index of unsortedIndex is in avoidedIndices: " , unsortedIndex);
        }
        else {
            // console.log("Index picked: " , unsortedIndex);
            return unsortedIndex;
        }
      }
    return -1;
}


function getNextCard(cardArray, recentCards, criteria="Accuracy", direction="Ascending") {
    var sortedCardArray = sortCardArray(cardArray, criteria, direction);
    var index = avoidRecentCards(sortedCardArray, cardArray, recentCards);
    // console.log("equal: ", deckEquality(sortedCardArray, cardArray));
    // console.log("index picked: ", index);
    return index;
}
