```python
def listCatalogItems(self):
    products = []
    response = self.client.get("/products")
    if response.ok:
        items = response.json()["data"]
        for item in items:
            products.append(item["id"])
    return products
```