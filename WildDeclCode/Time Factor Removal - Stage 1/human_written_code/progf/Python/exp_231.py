import os

s = " " * 4
for File in os.listdir('structs'):
    if '.txt' in File:
        with open('structs/'+File) as F:
            Head, *Fields = [Ln.strip().split('\t') for Ln in F.readlines()]
        Object = File.split('.')[0]
        with open('structs/'+Object+'.py', 'w') as F:
            F.write("class {}:
".format(Object.capitalize()))
            F.write(s + "def __init__(s, d):
")
            for Name, Type, Description in Fields:
                Name = Name.replace('*', '').replace('?', '')
                F.write(s*2 + "s.__{} = d.get('{}', None)
".format(Name, Name))
            for Name, Type, Description in Fields:
                Name = Name.replace('*', '').replace('?', '')
                F.write(s + "@property
")
                F.write(s + "def {}(s):
".format(Name))
                F.write(s*2 + "'''{}'''
".format(Description.capitalize()))
                F.write(s*2 + "return s.__{}
".format(Name))
                F.write(s + "@{}.setter
".format(Name))
                F.write(s + "def {}(s, val):
".format(Name))
                F.write(s*2 + "s.__{} = val
".format(Name))

        
    
