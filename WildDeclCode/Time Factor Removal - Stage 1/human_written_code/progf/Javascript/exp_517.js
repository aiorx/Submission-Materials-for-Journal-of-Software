console.log('-----------------------------------------------------')
console.log('Olá, mundo!', 'Revisão de JavaScript e Introdução a ES6!')
console.log('-----------------------------------------------------')

// ----------------------------------------------
console.log('Funções')

// FUNÇÕES
// Possuímos as funções: falar, dobro, calcularMedia
function falar() {
  return 'Pipipi popopo'
}

function dobro(num) {
  return num * 2
}

function calcularMedia(nota1, nota2, nota3) {
  const soma = (nota1 + nota2 + nota3)
  const media = soma / 3
  return media
}

// Vamos refatorar essas funções para a sintaxe de Arrow function





console.log('-----------------------------------------------------')
// ----------------------------------------------
console.log('Callback')

// CALLBACK
// Possuímos as funções: somar, subtrair, multiplicar e dividir.
function somar(a, b) {
  return a + b
}

function subtrair(a, b) {
  return a - b
}

function multiplicar(a, b) {
  return a * b
}

function dividir(a, b) {
  return a / b
}

function ordenar(a, b) {
  if (a <= b) {
    return [a, b]
  } else {
    return [b, a]
  }
}


// Crie uma função chamada calcular que receberá como parâmetro: dois números e uma função de callback







// Faça a soma de dois números usando a função calcular







// Faça a subtração de dois números usando a função calcular







// Faça a multiplicação de dois números usando a função calcular







// Faça a divisão de dois números usando a função calcular






// Faça a ordenação crescente de dois números usando a função calcular







// Volte nas funções e refatore-as na sintaxe ES6

console.log('-----------------------------------------------------')
// ----------------------------------------------
console.log('Condicionais')

// CONDICIONAIS
// Uma estudante obteve as seguinte notas: n1, n2 e n3
const n1 = 9
const n2 = 5
const n3 = 1

// Verifique se a estudante foi aprovada. Se a média das notas for maior ou igual a 7, a estudante passou!







console.log('-----------------------------------------------------')
// ----------------------------------------------
// OBJETOS
console.log('Objetos  🪑')

// Declaração de objetos
const objeto = new Object()
objeto.nome = 'cadeira'
objeto.tipo = 'madeira'
objeto.peso = 7

const pokemon = {
  name: 'Pikachu',
  type: 'elétrico',
  height: 40.6,
}

// Fazer destructuring e acessar os valores de objeto e pokemon







console.log('-----------------------------------------------------')
// ----------------------------------------------
// DATAS
console.log('Datas 🗓')

// Outro exemplo de um objeto JavaScript é o Date.

// Vamos criar a variável chamada hoje que irá receber a data de hoje.







// Vamos capturar os valores de dia, mes e ano da data de hoje pelos métodos de Date







// Vamos criar uma data específica. Lembrando que mês de Janeiro é 0 no Javascript 🤷🏻‍♀️







// Podemos usar o método toLocaleString para formatar a data







// Temos mais opções para formatar a data
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }







console.log('-----------------------------------------------------')
// ----------------------------------------------

const pessoa = {
  nome: 'Yasminn',
  sobrenome: 'Vaz',
  idade: 25,
  altura: 1.62,
  peso: 55,
  andando: false,
  caminhouQuantosMetros: 0,
}

pessoa.fazerAniversario = function () {
  return pessoa.idade++
}

pessoa.andar = function (metrosCaminhados) {
  pessoa.andando = true
  pessoa.caminhouQuantosMetros += metrosCaminhados
}

pessoa.parar = function () {
  pessoa.andando = false
}

pessoa.nomeCompleto = function () {
  return "Olá, meu nome é " + (pessoa.nome) + " " + (pessoa.sobrenome) + "."
}

pessoa.mostrarIdade = function () {
  return "Olá, eu tenho " + (pessoa.idade) + " anos."
}

pessoa.mostrarPeso = function () {
  return "Eu peso " + (pessoa.peso) + "."
}

pessoa.mostrarAltura = function () {
  return "Minha altura é " + (pessoa.altura) + "."
}

pessoa.mostrarDistancia = function () {
  return "" + (pessoa.nome) + " caminhou " + (pessoa.caminhouQuantosMetros) + "m."
}

pessoa.apresentacao = function () {
  let anos = 'anos'
  let metros = 'metros'

  if (pessoa.idade === 1) {
    anos = 'ano'
  }

  if (pessoa.caminhouQuantosMetros === 1) {
    metros = 'metro'
  }

  return "Olá, eu sou " + (pessoa.nome) + " " + (pessoa.sobrenome) + ", tenho " + (pessoa.idade) + " " + (anos) + ", " + (pessoa.altura) + ", meu peso é " + (pessoa.peso) + " e, só hoje, eu já caminhei " + (pessoa.caminhouQuantosMetros) + " " + (metros) + "!"
}

// Vamos utilizar o formato ES6 para refatorar a constante pessoa.

// Quero criar as variáveis pessoa2 e pessoa3 com as mesmas propriedades, mas alterando os valores de nome, sobrenome, altura e peso






console.log('-----------------------------------------------------')
// ----------------------------------------------
// CLASSES
console.log('Classes 🆕')

// Vamos criar a classe Pessoa







console.log('-----------------------------------------------------')
// ----------------------------------------------
// ARRAYS
console.log('Arrays [ 0️⃣  , 1️⃣  , 2️⃣  ]')

// Declaração de arrays
const lista = new Array('pera', 'uva', 'maçã')

const numbers = [9, 2, 5]

// Acessando elementos pela posição do array







// Informe o tamanho de cada array







// Faça a desestruturação do array







// Possuo 4 tias. Os dados delas estão armazenados no array de objetos dentro do arquivo db.js
// Vamos importar esses dados para podermos usá-los durante nosso exercício de revisão.
const db = require('./db')






console.log('-----------------------------------------------------')
// ----------------------------------------------
// MÉTODOS DE ITERAÇÃO
console.log('Métodos iteração ')

// Mostre a tabela das tias pelo console.table()







console.log('-----------------------------------------------------')
console.log('filter()')
// filter
// Filtre as tias que moram em SP e mostre no console.







console.log('-----------------------------------------------------')
console.log('map()')
// map
// Crie um novo array chamado tiasMaisChegadas e adicione uma propriedade chamada cuidouDeMim que recebe um valor booleano. Caso a tia teve até 2 filhos, isso significa que ela cuidou de mim e seu valor é true. Caso ela teve mais que 2 filhos, o valor da propriedade cuidouDeMim é false.







console.log('-----------------------------------------------------')
console.log('sort()')
// SORT

// Vamos praticar o método sort() com o array numbers
// var numbers = [9, 2, 5]

const comparar = function (a, b) {
  if (a < b) { // primeiro vem b e depois vem a
    return -1
  } else if (a > b) { // mantenho a como primeiro e b vem depois
    return 1
  } else { // se a e b forem iguais, mantém a mesma ordem
    return 0
  }
}

// Refatore a função comparar e ordene numbers em ordem crescente







// Ordene as tias por ordem decrescente de idade (a mais velha primeiro)








console.log('-----------------------------------------------------')
console.log('reduce()')
// reduce

// Faça a soma do array numbers







// Some a quantidade de netos que vovó possui.







// ----------------------------------------------
console.log('-----------------------------------------------------')
console.log('                         Fim                         ')
console.log('-----------------------------------------------------')