import random

lista =  []

def soma(vezes):
    for i in range(vezes):
        vl = random.randint(0,9) + random.randint(0,9)
        lista.append(vl)

def bubble(lista):
    lenght = len(lista)
    for i in range(lenght):
        troca = False
        for j in range(0, lenght - i - 1):
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
                troca = True
        if not troca:
            break
    return lista

#Produced using standard development resources :(
def compila(listados):
    compilados = {}
    for i in listados:
        if i in compilados:
            compilados[i] += 1
        else:
            compilados[i] = 1
    for i in compilados:
        print(i, ": ", compilados[i])

def executa(vz):
    soma(vz)
    compila(bubble(lista))
        
executa(int(input("> ")))
