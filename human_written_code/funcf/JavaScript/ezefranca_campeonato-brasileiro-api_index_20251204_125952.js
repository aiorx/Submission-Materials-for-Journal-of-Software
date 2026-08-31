exports.tabela = function(serie) {
  return new Promise(function(accept, error) {
    var options = {
      url: urlBase + serie,
      headers: {
        'User-Agent': userAgent
      }
    };
    request(options, function(error, response, html) {
      if(!error) {

        var $ = cheerio.load(html);
        var lista = [];

        $('.tabela-times tbody tr').each(function() {
          var item = $(this);
          var time = {};
          time.nome = item.find('.tabela-times-time-nome').text();
          lista.push(time);
        });
        var x = 0;
        $('.tabela-pontos tbody tr').each(function() {
          var item = $(this);
          lista[x].pontos = item.find('.tabela-pontos-ponto').text();
          lista[x].jogos = item.find('.tabela-pontos-ponto').next().text();
          lista[x].vitorias = item.find('.tabela-pontos-ponto').next().next().text();
          lista[x].empates = item.find('.tabela-pontos-ponto').next().next().next().text();
          lista[x].derrotas = item.find('.tabela-pontos-ponto').next().next().next().next().text();
          lista[x].golsPro = item.find('.tabela-pontos-ponto').next().next().next().next().next().text();
          lista[x].golsContra = item.find('.tabela-pontos-ponto').next().next().next().next().next().next().text();
          lista[x].saldoGols = item.find('.tabela-pontos-ponto').next().next().next().next().next().next().next().text();
          lista[x].percentual = item.find('.tabela-pontos-ponto').next().next().next().next().next().next().next().next().text();
          x++;
        });
        accept(lista);
      } else {
        error({ error:"Não foi possível retornar as informações!" });
      }
    });
  });
};