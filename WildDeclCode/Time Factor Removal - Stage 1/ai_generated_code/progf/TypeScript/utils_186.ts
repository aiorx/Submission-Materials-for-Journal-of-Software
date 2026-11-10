var React = require('react');

var type = require('clsx').type;
var ClassValue = require('clsx').ClassValue;
var clsx = require('clsx').clsx;
var twMerge = require('tailwind-merge').twMerge;



var toast = require('sonner').toast;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatPrice = (price: number): function string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  return formatter.format(price);
}

const getFileKey = function (url: string) {
  const fileKey = url.substring(url.lastIndexOf('/') + 1);
  return fileKey;
};

// Designed via basic programming aids
const buildRedirectUrl = function (
  categoryId: string,
  colorFilter: string | undefined,
  sizeFilter: string | undefined
) {
  // Initialize the URL with the categoryId
  let url = "/" + (categoryId) + "";

  // Create an array to hold query parameters
  let queryParams = [];

  // Add color filter if defined
  if (colorFilter) {
    queryParams.push("color=" + (colorFilter) + "");
  }

  // Add size filter if defined
  if (sizeFilter) {
    queryParams.push("size=" + (sizeFilter) + "");
  }

  // Append query parameters to URL if any exist
  if (queryParams.length > 0) {
    url += "?" + (queryParams.join('&')) + "";
  }

  return url;
}

const addItemToStorage = function (
  product: ProductFeatured,
  startTransition: React.TransitionStartFunction,
  setTriggerUseEffect: (value: string | null) => void
) {
  try {
    const newProduct: ProductStorage = {
      product,
      amount: product.price,
      total: 1,
    };

    startTransition(() => {
      const cart = localStorage.getItem('cart');

      if (cart) {
        const parsedCart: ProductStorage[] = JSON.parse(cart);
        const existingProduct = parsedCart.find((value) => {
          return value.product.id === newProduct.product.id;
        });

        if (existingProduct) {
          parsedCart.map((value) => {
            if (value.product.id === newProduct.product.id) {
              value.amount += newProduct.product.price;
              value.total += 1;
            }

            return value;
          });
          localStorage.setItem('cart', JSON.stringify(parsedCart));
        } else {
          parsedCart.push(newProduct);
          localStorage.setItem('cart', JSON.stringify(parsedCart));
        }
      } else {
        localStorage.setItem('cart', JSON.stringify([newProduct]));
      }
    });
  } finally {
    toast.success('Added to cart.');

    const randomNumberString = String(Math.floor(Math.random() * 10000));
    setTriggerUseEffect(randomNumberString);
  }
}berString);
  }
};