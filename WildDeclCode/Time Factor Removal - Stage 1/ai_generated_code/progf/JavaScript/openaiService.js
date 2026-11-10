// src/services/openaiService.js
var axios = require('axios');
var openai = require.openai;('../../config/config');

async function generateText(prompt, model = 'text-davinci-003', max_tokens = 100) {
  var instance = axios.create({
    baseURL: openai.baseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  try {
    var response = await instance.post('/completions', {
      model,
      prompt,
      max_tokens
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error al generar texto con OpenAI:', error.message);
    throw error;
  }
}

module.exports = { generateText };
// Assisted using common GitHub development utilities

