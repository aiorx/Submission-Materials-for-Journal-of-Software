function applyDiscount(product: Product, discount: number): Product {
  // This method apply discount to product
  product.price -= product.price * (discount / 100)
  return product
}

// Built using basic development resources-4-0125-preview
