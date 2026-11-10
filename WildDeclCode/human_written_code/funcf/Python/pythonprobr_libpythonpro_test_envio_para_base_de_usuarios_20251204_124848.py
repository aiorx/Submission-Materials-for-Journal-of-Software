```python
def test_parametros_de_spam(sessao):
    usuario = Usuario(nome='Renzo', email='renzo@python.pro.br')
    sessao.salvar(usuario)
    enviador = Mock()
    enviador_de_spam = EnviadorDeSpam(sessao, enviador)
    enviador_de_spam.enviar_emails(
        'luciano@python.pro.br',
        'Curso Python Pro',
        'Confira os módulos fantásticos'
    )
    enviador.enviar.assert_called_once_with(
        'luciano@python.pro.br',
        'renzo@python.pro.br',
        'Curso Python Pro',
        'Confira os módulos fantásticos'
    )
```