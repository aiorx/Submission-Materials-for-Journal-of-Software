data = """1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122"""

def fromSNAFU(line):
    foo = list(line)
    foo.reverse()
    snafu = 0
    for i in range(len(foo)):
        digit = foo[i]
        if digit == '=':
            d = -2
        elif digit == '-':
            d = -1
        else:
            d = int(digit)
        snafu += d * 5**i
    return snafu

# thanks ChatGPT
def to_base_5(n: int) -> str:
    if n == 0:
        return "0"
    digits = []
    while n > 0:
        digits.append(str(n % 5))
        n //= 5
    return "".join(reversed(digits))

def toSNAFU(num):
    base5 = to_base_5(num)
    digits = [int(x) for x in reversed(list(base5))]
    digits.append(0)
    snafu = []
    for i in range(len(digits)-1):
        d = digits[i]
        if d == 5:
            snafu.append('0')
            digits[i+1] += 1
        elif d == 4:
            snafu.append('-')
            digits[i+1] += 1
        elif d == 3:
            snafu.append('=')
            digits[i+1] += 1
        else:
            snafu.append(str(d))
    if digits[-1] > 0:
        snafu.append(str(digits[-1]))
    return "".join(reversed(snafu))

data = open('data', 'r').read()
lines = data.split('\n')
foo = sum([fromSNAFU(line) for line in lines])
print(foo)
print(toSNAFU(foo))
