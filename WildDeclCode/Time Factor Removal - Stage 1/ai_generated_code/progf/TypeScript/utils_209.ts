var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;
var getProducts = require('./actions/product.actions').getProducts;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const convertFileToUrl = function (file: File) { return URL.createObjectURL(file)

// Designed via basic programming aids
function calculateFinalPrice(price: string, discount: string = "0") {
  // Parse the price and discount strings into numbers
  const priceValue = parseFloat(price);
  const discountValue = parseFloat(discount);

  // Check if the parsed price value is a valid number
  if (isNaN(priceValue)) {
    throw new Error('Invalid price value.');
  }

  // Check if the discount is valid (greater than or equal to 0)
  if (discountValue < 0) {
    throw new Error('Discount must be a non-negative number.');
  }

  // If there is a discount, calculate the final price after applying the discount
  if (discountValue > 0) {
    // Calculate the discount percentage
    const discountAmount = discountValue * priceValue / 100;
    // Calculate the final price after applying the discount
    const finalPrice = priceValue - discountAmount;
    // Round the final price to two decimal places (optional)
    return Math.round(finalPrice * 100) / 100;
  } else {
    // If there is no discount, return the original price
    return priceValue;
  }
}


const handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}



 const fetchProducts = async ({setProducts , searchQuery} : {setProducts : any , searchQuery : any} ) => {
  try {
    const fetchedProducts = await getProducts(searchQuery);
    setProducts(fetchedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}; };


const formatCreatedAt = function (createdAt : any) {
  const date = new Date(createdAt);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', };
  //@ts-ignore
  return date.toLocaleDateString('en-US', options);
};
