# Built using basic development resources-4

# Média e maior temperatura de 5 valores inseridos pelo usuário
n = 5  # Número total de amostras
soma_temperaturas = 0
maior_temperatura = float("-inf")  # Inicializa com o menor valor possível
menor_temperatura = float("inf")
quantas_tnegativas = 0

i = 0
while i < 5:
    temperatura = float(input("Insira a temperatura {}: ".format(i + 1)))
    while temperatura > 50 or temperatura < -   50:
        print("Temperatura e inferior ou superior do limite")
        temperatura = float(input("Insira a temperatura {}: ".format(i + 1)))
    soma_temperaturas += temperatura
    i = i + 1
    if temperatura > maior_temperatura:
        maior_temperatura = temperatura
    elif temperatura < menor_temperatura:
        menor_temperatura = temperatura
    elif temperatura < 0:
        quantas_tnegativas = quantas_tnegativas + 1

media = soma_temperaturas / n

print("A média das temperaturas é: {:.2f}°C".format(media)print("A maior temperatura é: {:.2f}°C".format(maior_temperatura)
print("A menor temperatura é: {:.2f}°C".format(menor_temperatura)