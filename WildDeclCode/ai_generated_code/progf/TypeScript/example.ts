/*
Initial code Aided using common development resources 3.5

In this example:

CreateProductCommand represents a command for creating a new product.
ProductCommandHandler handles the command by creating a new product and storing it.
Product is the read model representing a product.
ProductQueryHandler handles queries for retrieving products.
ProductService acts as an application service coordinating commands and queries.

*/

// Command Model
class CreateProductCommand {
  constructor(public name: string, public price: number) { }
}

// Command Handler
class ProductCommandHandler {
  private products: Product[] = [];

  handleCreateProductCommand(command: CreateProductCommand): void {
    const newProduct = new Product(command.name, command.price);
    this.products.push(newProduct);
    console.log(`Product created: ${newProduct.name}`);
  }
}

// Query Model
// @ts-ignore
class Product {
  constructor(public name: string, public price: number) { }
}

// Query Handler
class ProductQueryHandler {
  private products: Product[] = [
    new Product("Laptop", 1000),
    new Product("Phone", 500),
  ];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductByName(name: string): Product | undefined {
    return this.products.find(product => product.name === name);
  }
}

// Application Service
// @ts-ignore
class ProductService {
  private commandHandler: ProductCommandHandler = new ProductCommandHandler();
  private queryHandler: ProductQueryHandler = new ProductQueryHandler();

  createProduct(name: string, price: number): void {
    const command = new CreateProductCommand(name, price);
    this.commandHandler.handleCreateProductCommand(command);
  }

  getAllProducts(): Product[] {
    return this.queryHandler.getAllProducts();
  }

  getProductByName(name: string): Product | undefined {
    return this.queryHandler.getProductByName(name);
  }
}

// Example usage
// @ts-ignore
const productService = new ProductService();

productService.createProduct("Tablet", 300);
const allProducts = productService.getAllProducts();
console.log("All Products:", allProducts);

const productByName = productService.getProductByName("Phone");
console.log("Product by Name:", productByName);

// Product created: Tablet
// All Products: [
//   Product { name: 'Laptop', price: 1000 },
//   Product { name: 'Phone', price: 500 }
// ]
// Product by Name: Product { name: 'Phone', price: 500 }
