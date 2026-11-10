```js
app.get("/produto/:id",(req, res)=>{
    const id = req.params.id
    
    const produtoEscolhido = listaProdutos.filter(produto => produto.id == id)

    res.json(produtoEscolhido)
})
```