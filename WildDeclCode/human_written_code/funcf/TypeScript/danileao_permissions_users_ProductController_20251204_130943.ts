```typescript
async index(request: Request, response: Response) {
  const productRepository = getCustomRepository(ProductRepository);

  const products = await productRepository.find();

  return response.json(products);
}
```