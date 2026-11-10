/**
 * The goal of this exercise is to practice guard clauses and defensive programming as introduced in week 1
 */

/**
 * An online store has a customer loyalty program. Gold members receive a 20% discount on their orders and silver members get 10% discount. Here's a function for calculating the discounted price of all users. The code was Composed with basic coding tools, do you think you could refactor it to make it better and fit our code style
 *
 * Don't change the name of the function. All tests must still pass
 */

function getDiscountedPrice(itemPrice, membershipType) {
  let discount = 0;

  if (membershipType === 'Gold') {
    discount = 0.2;
  } else if (membershipType === 'Silver') {
    discount = 0.1;
  } else {
    discount = 0;
  }

  const discountedPrice = itemPrice - itemPrice * discount;
  return discountedPrice;
}

/**
 * DO NOT MAKE CHANGES BELOW THIS LINE
 */
module.exports = {
  getDiscountedPrice,
};
