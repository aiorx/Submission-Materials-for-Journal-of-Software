//Supported via standard GitHub programming aids
var http = require('http');

var url = 'http://localhost:5003/blocks';

http.get(url, function (res) {
    var data = '';

    // Odbieranie danych po kawałku
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Gdy wszystkie dane zostaną odebrane
    res.on('end', () => {
        try {
            // Parsowanie danych JSON
            var blocks = JSON.parse(data);

            // Logowanie każdego elementu listy
            blocks.forEach((block) => {
                t = block['data']['transaction']['data']
                if (t['sender'].includes('305'))
                console.log(block['hash'].slice(0,8)+'...');
            });
        } catch (err) {
            console.error('Błąd parsowania danych JSON:', err.message);
        }
    });
}).on('error', function (err) {
    console.error('Błąd połączenia:', err.message);
});
