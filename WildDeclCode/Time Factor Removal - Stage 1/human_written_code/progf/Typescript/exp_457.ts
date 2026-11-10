var Request = require('express').Request;
var Response = require('express').Response;
var getCustomRepository = require('typeorm').getCustomRepository;
var ProductRepository = require('../repositories/ProductRepository');

class PermissionController {
  async create(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    var name = request.body.name;
var description = request.body.description;

    const existsProduct = await productRepository.findOne({ name });

    if (existsProduct) {
      return response.status(400).json({ err: "Product already exists!" });
    }

    const product = productRepository.create({
      name,
      description,
    });

    await productRepository.save(product);

    return response.json(product);
  }

  async index(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find();

    return response.json(products);
  }

  async show(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    var id = request.params.id;

    const product = await productRepository.findOne(id);

    return response.json(product);
  }
}

module.exports = new PermissionController();
