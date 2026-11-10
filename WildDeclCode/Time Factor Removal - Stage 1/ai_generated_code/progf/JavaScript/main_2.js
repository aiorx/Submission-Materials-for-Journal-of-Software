// src/main.js
// Aided with basic GitHub coding tools
var db = require('./db/connection');
var generateText = require.generateText;('./services/openaiService');

async function main() {
  try {
    console.log('Starting application...');
    // Obtener un prompt de la base de datos
    var res = await db.query('SELECT prompt FROM prompts LIMIT 1');
    var prompt = res.rows[0]?.prompt || 'Hola mundo';

    // Llamar al servicio externo
    var respuesta = await generateText(prompt);

    // Mostrar el resultado
    console.log('Respuesta generada:', respuesta);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.end();
  }
}

main().catch(console.error);

