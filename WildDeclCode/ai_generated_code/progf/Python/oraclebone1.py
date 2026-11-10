#--------------------------------------
# Created On: 29 October 2024
# Title: Watered Down Oracle Bone Reading Program
# Code for generating Turtle graphics were Penned via standard programming aids
# 
# For fun and entertainment purposes only. 
# It does not represent serious oracle bone reading practices. 
# There is also room for improvement in writing 命辭 (divination text).
#--------------------------------------
import random
import time
import turtle as ttl
from datetime import datetime, timedelta
# -------------- FUNCTIONS --------------
def ganzhi(date):
    gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    base_date = datetime(2024, 1, 1) # known 甲子 date
    day_diff = (date - base_date).days
    gan = gan[day_diff % 10]
    zhi = zhi[day_diff % 12]
    return gan + zhi
def cnmonth(month):
    cnmonth = ['一', '二', '三', '亖', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三']
    return cnmonth[month - 1]
def cracks(t, length, angle, depth):
    if depth == 0 or length < 5:
        return
    t.forward(length)
    for turn in [angle, -angle]:  # Left and right branches
        if random.choice([True, False]):
            t.right(turn)
            cracks(t, length * random.uniform(0.5, 0.75), angle, depth - 1)
            t.left(turn)  # Return to original direction
    t.backward(length)
def sym_cracks(t):
    for x in [-100, 0, 100]:  # Left, middle, and right positions
        t.penup()
        t.goto(x, -100)
        t.setheading(60 if x < 0 else (120 if x > 0 else 90))
        t.pendown()
        cracks(t, random.randint(80, 120), random.randint(15, 30), random.randint(3, 5))
# -------------- MAIN --------------
dec1 = str(input("Are you performing divination (a) today or (b) for a custom date? ")).upper()
if dec1 == "A":
    day = ganzhi(datetime.now())
    month = cnmonth(datetime.now().month)
elif dec1 == "B":
    yearx = int(input("Input year: "))
    monthx = int(input("Input month (1-13): "))
    while monthx < 1 or monthx > 13:
        monthx = int(input("Invalid month input. Please reënter (1-13): "))
    dayx = int(input("Input date (1-31): "))
    while dayx < 1 or dayx > 31:
        dayx = int(input("Invalid day input. Please reënter (1-31): "))

    # leap year
    if monthx == 13:
        date = datetime.strptime(f"{yearx}/12/{dayx}", "%Y/%m/%d") + timedelta(days=30)
    else:
        date = datetime.strptime(f"{yearx}/{monthx}/{dayx}", "%Y/%m/%d")

    day = ganzhi(date)
    month = cnmonth(monthx)
else:
    print("Invalid input. Bye.")
    exit()

diviner = str(input("Diviner Name: ")).upper()
inquirer = input("Inquirer Name (leave blank if none): ").upper() or ""
progname = inquirer if inquirer else diviner
location = input("Location (leave blank if none): ").upper() or ""
question = input("Inquiry (subject / state, e.g., 'tomorrow travels / safe ' or '今日 / 雨'): ").upper()

inquirer = inquirer if inquirer else ""
location = ("才" + location) if location else ""
diviner = diviner + "貞"
q1 = question.replace(" / ", "")
q2 = question.replace(" / ", "不")
month = month + "月"
precharge = day + inquirer + "卜" + location + diviner + q2 + month + "    " + (day + inquirer + "卜" + location + diviner + q1 + month)[::-1]

time.sleep(2)
print("\n" + precharge + "\n")
time.sleep(1)
print("祝曰：")
print("假之玉靈夫子。夫子玉靈。荊灼而心。令而先知。")
print("而上行於天。下行於淵。諸靈數。莫如汝信。今日良日。行一良貞。")
print(f"{diviner}欲卜{q1}。即得而喜。不得而悔。")
# print("即得。發鄉我身長大。首足收人皆上偶。不得。發鄉我身挫折。中外不相應。首足滅去。\n")

ttl.setup(432, 432)  # Smaller window size
ttl.bgcolor("black")
t = ttl.Turtle()
t.speed(0)
t.color("white")
sym_cracks(t)
t.hideturtle()

print("\nInput your prognostication below: ")
prog = str(input(progname + "占曰：")).upper()

print("---------- Reading Summary ----------")
print("Preface and Charge:\n" + precharge)
print("\nPrognostication:\n" + progname + "占曰：" + prog)
print("-------------------------------------")

ttl.mainloop()