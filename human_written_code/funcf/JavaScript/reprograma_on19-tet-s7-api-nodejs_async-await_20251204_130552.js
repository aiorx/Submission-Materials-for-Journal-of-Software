```javascript
const imprimirDadosComPromiseAll = async () => {
  const values = await Promise // retorna uma array com todos os resultados, CASO OCORRA SUCESSO EM TODAS AS PROMISES
  .all([ // o método .all() ele recebe como parametro uma array de promise
    acharUsuaria("Bea"), // ele só traz os dados da usuaria
    acharEndereco("12345678"), // ele só os dados do endereco
    imprimirDados("Elvira", "123456") // como aqui foi chamado ambos e seus resultados retornados, ele traz ambos
    ])

    console.log(values)
}
```