//ejemplos de while
/*
while (true) {
    var numero = Math.floor (Math.random() *100)//genera numero aleatorio entre 0 y 100
    console.log (numero)
    if (numero === 45) {
        break
    } 
}

// do while (primero se ejecuta el do luego el while)

var numero = 5
 do {
    console.log (" Hola mundo" + numero)
    numero--;
}while ( numero > 0);

El bucle do...while es muy versátil y se puede usar en una variedad de contextos. Aquí te dejo algunos ejemplos para ilustrar cómo podrías aplicarlo:

1. Validación de Entrada del Usuario
Puedes usar do...while para asegurarte de que el usuario ingrese un valor válido antes de continuar con el programa.

JavaScript

let numero;

do {
    numero = parseFloat(prompt("Ingrese un número mayor que 0:"));
} while (isNaN(numero) || numero <= 0);

console.log("Número válido ingresado:", numero);
Basic development code blocks. Review and use carefully. More info on FAQ.
2. Menú de Opciones
En aplicaciones de consola, puedes usar do...while para mostrar un menú de opciones hasta que el usuario decida salir.

JavaScript

let opcion;

do {
    console.log("Menú de Opciones:");
    console.log("1. Opción 1");
    console.log("2. Opción 2");
    console.log("3. Salir");
    opcion = parseInt(prompt("Seleccione una opción:"));

    switch(opcion) {
        case 1:
            console.log("Has seleccionado la Opción 1");
            break;
        case 2:
            console.log("Has seleccionado la Opción 2");
            break;
        case 3:
            console.log("Saliendo...");
            break;
        default:
            console.log("Opción no válida, intenta de nuevo.");
    }
} while (opcion !== 3);
Basic development code blocks. Review and use carefully. More info on FAQ.
3. Reintentar una Operación
Si tienes una operación que puede fallar y quieres reintentar hasta que tenga éxito, do...while es útil.

JavaScript

let exito = false;
let intentos = 0;

do {
    intentos++;
    // Simulación de una operación que puede fallar
    exito = Math.random() > 0.5;
    console.log(`Intento ${intentos}: ${exito ? "Éxito" : "Fallo"}`);
} while (!exito && intentos < 5);

if (exito) {
    console.log("Operación completada con éxito.");
} else {
    console.log("Se alcanzó el número máximo de intentos.");
}
Basic development code blocks. Review and use carefully. More info on FAQ.
4. Procesamiento de Datos
Puedes usar do...while para procesar elementos de una lista o array hasta que se cumpla una condición específica.

JavaScript

let datos = [1, 2, 3, 4, 5];
let i = 0;

do {
    console.log("Procesando dato:", datos[i]);
    i++;
} while (i < datos.length);

*/