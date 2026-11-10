
const arrayNumeros = [1, 2, 3, 4, 5];

const arrayDeObjetos = [
    { nome: 'Alan', },
    { nome: 'Nathan', },
]

const matriz2d = [
    [1, 2, 3],
    [4, 5, 6],
    [4, 5, 6],
    [4, 5, 6],
    [4, 5, 6],
    [4, 5, 6],
]

const dobroNumeros = arrayNumeros
    .map(function x { return x * 2; });

const numerosComoStrings = arrayNumeros
    .map(function x { return x.toString(); });

const listaDeNomes = arrayDeObjetos
    .map(function pessoa { return pessoa.nome; });

const nomesQueComecamComA = listaDeNomes
    .filter(function nome { return nome.startsWith('A'); });

const totalNumeros = arrayNumeros
    .reduce(function (acumulador, valorAtual) {

        return acumulador + valorAtual
    }, 0)

const arrayNumeros2 = arrayNumeros.concat()

const pessoa = arrayDeObjetos.find(function pessoa { return pessoa.nome === 'Aldfgfdgan'; });

console.log(pessoa)
