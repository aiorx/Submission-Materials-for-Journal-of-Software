// 2) Retornar frutas tratadas com somente a primeira letra maiúscula e as demais minúscula
var frutas = ["maçã", "banana", "Pera", "Melancia", "pêsSSEgO", "jAcA"];

/* let frutasEditadas = []
frutas.forEach((fruta) => {
    frutasEditadas.push(fruta[0].toUpperCase() + fruta.slice(1).toLowerCase())
})
console.log(frutasEditadas) */


/* const listaDeFrutas = frutas.map((fruta) => fruta[0].toUpperCase() + fruta.slice(1).toLowerCase())
console.log(listaDeFrutas) */


/* function primeiraLetraMaiuscula(lista) {

    for (let i = 0; i < lista.length; i++) {
        lista[i] = lista[i].toLowerCase()
    }

    for (let i = 0; i < lista.length; i++) {
        lista[i] = lista[i][0].toUpperCase() + lista[i].substring(1)
    }

    return console.log(lista)
}


primeiraLetraMaiuscula(frutas) */

/*
const tratarListasFrutas = frutas.map((fruta) => {
    const letraMaiuscula = fruta[0].toUpperCase();
    const letraMinuscula = fruta.slice(1).toLowerCase();

    const unirPalavras = letraMaiuscula.concat(letraMinuscula);

    const unirPalavrasComOperadorConcat = fruta[0].toUpperCase() + fruta.slice(1).toLowerCase();

    return unirPalavrasComOperadorConcat
})
*/

var tratarFrutas = [];

// a ideia do for é percorrer listas para fazer algum tipo de ação


for (var inicializador = 0; inicializador < frutas.length; inicializador++) {

    var todasFrutas = frutas[inicializador]

    var letraMaiuscula = frutas[inicializador].charAt(0).toUpperCase();
    var letraMinuscula = frutas[inicializador].slice(1).toLowerCase();

    var tratarPalavras = letraMaiuscula.concat(letraMinuscula)

    //const concatenarOperador = letraMaiuscula + letraMinuscula;

    tratarFrutas[inicializador] = tratarPalavras

}

console.log(tratarFrutas)