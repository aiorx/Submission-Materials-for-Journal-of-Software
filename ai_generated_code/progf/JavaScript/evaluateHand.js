/**
 * @file            EvaluateHand.js
 * @description     This file contains a function that evaluates a poker hand and returns its rank.
 * @author          Johnathan Glasgow
 * @date            16/06/2024
 * @contributors    This code was largely Aided using common development resources
 */

/*
* This function takes a card string and returns its value.
* The value is a number from 2 to 14, where 11 represents a Jack, 12 a Queen, 13 a King, and 14 an Ace.
*
* @param {string} card - A two-character string representing a card.
* @returns {number} The value of the card.
*/
const getCardValue = (card) => {
    const value = card[0];
    switch (value) {
        case 'A': return 14;
        case 'K': return 13;
        case 'Q': return 12;
        case 'J': return 11;
        case 'T': return 10;
        default: return parseInt(value);
    }
}

/*
* This function evaluates a poker hand and returns its rank.
* The function takes an array of 5 cards, represented as strings.
* Each card string is a two-character string, where the first character represents the value of the card and the second character represents the suit.
* The function returns an object with two properties: rank and rankName.
* The rank property is a number from 1 to 10, representing the rank of the hand.
* The rankName property is a string representing the name of the rank.
* 
* @param {string[]} hand - An array of 5 cards, represented as strings.
* @returns {Object} An object with two properties: rank and rankName.
*/
export const getHandRanking = (hand) => {
    let values = hand.map(card => getCardValue(card)).sort((a, b) => a - b);
    let suits = hand.map(card => card[1]);

    let isFlush = suits.every(suit => suit === suits[0]);

    let isStraight = values.every((val, index) => {
        if (index === 0) return true;
        return val === values[index - 1] + 1;
    });

    if (isFlush && values.join('') === '1011121314') return { rank: 10, rankName: 'Royal Flush' };
    if (isFlush && isStraight) return { rank: 9, rankName: 'Straight Flush' };
    if (values[0] === values[3] || values[1] === values[4]) return { rank: 8, rankName: 'Four of a Kind' };
    if ((values[0] === values[2] && values[3] === values[4]) || (values[0] === values[1] && values[2] === values[4])) return { rank: 7, rankName: 'Full House' };
    if (isFlush) return { rank: 6, rankName: 'Flush' };
    if (isStraight) return { rank: 5, rankName: 'Straight' };
    if (values[0] === values[2] || values[1] === values[3] || values[2] === values[4]) return { rank: 4, rankName: 'Three of a Kind' };
    if ((values[0] === values[1] && values[2] === values[3]) || (values[0] === values[1] && values[3] === values[4]) || (values[1] === values[2] && values[3] === values[4])) return { rank: 3, rankName: 'Two Pair' };
    if (values[0] === values[1] || values[1] === values[2] || values[2] === values[3] || values[3] === values[4]) return { rank: 2, rankName: 'One Pair' };

    return { rank: 1, rankName: 'No rank' };
}