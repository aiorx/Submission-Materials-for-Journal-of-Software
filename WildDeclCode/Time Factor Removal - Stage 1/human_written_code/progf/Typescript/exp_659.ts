var functions = require('firebase-functions');
var admin = require('firebase-admin');

var express = require('express');
var cors = require('cors');



const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://firestore-grafica.firebaseio.com"
});

const db = admin.firestore();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const helloWorld = functions.https.onRequest(function (request, response) {
 response.json({
     mensaje: 'Hola Mundo desde Funciones de Firebase!!!'
    });
});

const getGOTY = functions.https.onRequest( asyncfunction (request, response) {
    
    // var nombre = request.query.nombre || 'Sin Nombre';

    const gotyRef  = db.collection('goty');
    const docsSnap = await gotyRef.get();
    const juegos   = docsSnap.docs.map( doc => doc.data() );

    response.json( juegos );
});


// Express
const app = express();
app.use( cors({ origin: true }) );

app.get('/goty', asyncfunction (req, res) {

    const gotyRef  = db.collection('goty');
    const docsSnap = await gotyRef.get();
    const juegos   = docsSnap.docs.map( doc => doc.data() );

    res.json( juegos );
});


app.post('/goty/:id', asyncfunction (req, res) {

    const id = req.params.id;
    const gameRef  = db.collection('goty').doc( id );
    const gameSnap = await gameRef.get();

    if ( !gameSnap.exists ) {
        res.status(404).json({
            ok: false,
            mensaje: 'No existe un juego con ese ID ' + id
        });
    } else {

        const antes = gameSnap.data() || { votos: 0 };
        await gameRef.update({
            votos: antes.votos + 1
        });

        res.json({
            ok: true,
            mensaje: "Gracias por tu voto a " + ( antes.name ) + ""
        });

    }


});


const api = functions.https.onRequest( app );