try:
    import os
    import random
except Exception as e:
    print(e)
    print("\nimport module failed, try again later")
    input("\npress ENTER to exit...")
    exit()
def test():
    input()
    print("loading...")
    questionList = [
        "What is the Christian belief about the Trinity?",
        "What does Tawhid mean in Islam?",
        "Define the term 'karma' in Hinduism.",
        "What are the Four Noble Truths in Buddhism?",
        "What is the Shema in Judaism?",
        "What is meant by sanctity of life?",
        "Name the Five Pillars of Islam.",
        "What is the significance of baptism in Christianity?",
        "What is the Torah?",
        "What does 'Ahimsa' mean in Hinduism?",
        "What is meant by omnipotence?",
        "Explain the concept of resurrection in Christianity.",
        "What is Zakah?",
        "What is Nirvana?",
        "What does Bar Mitzvah celebrate?",
        "What is the Golden Rule in Christianity?",
        "Define reincarnation.",
        "What is the meaning of Eid al-Adha?",
        "What is the Christian view on euthanasia?",
        "What is a mandir?",
        "What is prayer in Islam?",
        "What is meant by agape love?",
        "What is the Eightfold Path?",
        "Why is Jerusalem important in Judaism?",
        "What is a sin in Christianity?",
        "What is meant by free will?",
        "What does 'Sharia' mean?",
        "What is the purpose of Holy Communion?",
        "What is the Qur’an?",
        "What is the meaning of Diwali?",
        "What is meant by suffering in Buddhism?",
        "What is the role of the Ten Commandments?",
        "What is Ummah?",
        "What is a Guru in Sikhism?",
        "What is the meaning of Easter?",
        "What is a parable?",
        "What is karma in Buddhism?",
        "What is the Hadith?",
        "What is the purpose of fasting during Ramadan?",
        "What is a soul?",
        "What is meant by omniscient?",
        "Define stewardship.",
        "What is the difference between natural and moral evil?",
        "What does pacifism mean?",
        "What is the significance of the crucifixion?",
        "What is the Talmud?",
        "What is meant by monotheism?",
        "What is meant by polytheism?",
        "What is a covenant in Judaism?",
        "What is the Christian view on marriage?",
        "What is the Shahadah?",
        "What is moksha in Hinduism?",
        "What is a Christian view on abortion?",
        "What is the role of a rabbi?",
        "What is meditation in Buddhism?",
        "What does ‘Islam’ mean?",
        "What is the purpose of pilgrimage?",
        "Name a Buddhist holy site.",
        "What is the importance of the Ganges River in Hinduism?",
        "What is the meaning of Advent?",
        "What is the significance of Pentecost?",
        "What does omnibenevolent mean?",
        "What is a mosque?",
        "What is atonement in Christianity?",
        "What is meant by justice in Islam?",
        "What is a Seder meal?",
        "What are the Fruits of the Holy Spirit?",
        "What is the Day of Judgement?",
        "What is the role of the Sangha?",
        "What is meant by the term revelation?",
        "What is the meaning of Hajj?",
        "What is the Great Commission?",
        "What are the Upanishads?",
        "What is the Islamic view on gender equality?",
        "What is the purpose of the Lord’s Prayer?",
        "What is the role of angels in Islam?",
        "What is the Christian belief in life after death?",
        "What is karma yoga?",
        "What is the Tanakh?",
        "What is aniconism?",
        "What is a Christian pilgrimage site?",
        "What is halal?",
        "What is the Guru Granth Sahib?",
        "What is original sin?",
        "What is the problem of evil?",
        "What is meant by omnipresence?",
        "What is a Sikh place of worship called?",
        "What is the Just War theory?",
        "What is circumcision in Judaism?",
        "What is the meaning of enlightenment?",
        "What is the meaning of the Trinity?",
        "What is the Day of Atonement?",
        "What are the Beatitudes?",
        "What is the concept of dharma?",
        "What is forgiveness in Christianity?",
        "What is the Hijrah?",
        "What is the Christian view on poverty?",
        "What is the middle way in Buddhism?",
        "What is sewa in Sikhism?",
        "What is idolatry?",
        "What is purgatory?",
        "What is the role of prophets in Islam?",
        "What is the difference between absolute and relative morality?",
        "What is evangelism?",
        "What is the meaning of the Ten Gurus?",
        "What is salvation in Christianity?",
        "What is the Ark of the Covenant?"
    ]

    answerList = [
        "The belief that God is three persons in one: Father, Son, and Holy Spirit.",
        "Tawhid is the belief in the oneness and uniqueness of Allah.",
        "Karma is the law of cause and effect: good actions lead to good outcomes and vice versa.",
        "They explain the nature of suffering and the path to overcoming it.",
        "A key Jewish prayer declaring the oneness of God.",
        "The belief that life is holy and belongs to God.",
        "Shahadah, Salah, Zakah, Sawm, Hajj.",
        "It represents entry into the Christian faith.",
        "The Jewish holy book, the first five books of the Bible.",
        "Ahimsa means non-violence toward all living things.",
        "All-powerful.",
        "The belief that Jesus rose from the dead after crucifixion.",
        "Charitable giving, one of the Five Pillars of Islam.",
        "A state of perfect peace and liberation from the cycle of rebirth.",
        "A coming-of-age ceremony for Jewish boys.",
        "Treat others as you would like to be treated.",
        "The belief that after death, the soul is reborn into a new body.",
        "Celebrates Ibrahim’s willingness to sacrifice his son for Allah.",
        "Many Christians are against it, believing life is sacred.",
        "A Hindu temple.",
        "Communication with Allah through specific rituals.",
        "Unconditional love, as demonstrated by Jesus.",
        "A guide to ethical living in Buddhism.",
        "It is the holiest city in Judaism, home to the Temple Mount.",
        "An action or thought that goes against God's law.",
        "The ability to choose between different possible actions.",
        "Islamic law derived from the Qur’an and Hadith.",
        "To remember Jesus’ sacrifice and bring believers closer to God.",
        "The holy book of Islam, believed to be the word of God.",
        "A Hindu festival celebrating the victory of light over darkness.",
        "Suffering is part of life and must be understood to attain enlightenment.",
        "Rules given by God to Moses for moral living.",
        "The worldwide Muslim community.",
        "A spiritual teacher in Sikhism.",
        "Celebrates the resurrection of Jesus from the dead.",
        "A story with a moral or spiritual lesson, often used by Jesus.",
        "A force that drives rebirth based on past actions.",
        "Sayings and actions of the Prophet Muhammad.",
        "To become closer to Allah and show self-discipline.",
        "The spiritual part of a person, believed to live on after death.",
        "All-knowing.",
        "The responsibility to take care of the world.",
        "Natural evil includes disasters; moral evil is caused by humans.",
        "Opposition to all war and violence.",
        "Shows Jesus' sacrifice and obedience to God.",
        "A collection of Jewish laws and traditions.",
        "Belief in one God.",
        "Belief in many gods.",
        "An agreement between God and the Jewish people.",
        "A sacred union between a man and a woman before God.",
        "The declaration of faith in Islam.",
        "Liberation from the cycle of rebirth in Hinduism.",
        "Varies, but often opposed due to the sanctity of life.",
        "A Jewish religious teacher and leader.",
        "A mental discipline used to achieve spiritual insight.",
        "Submission to the will of Allah.",
        "A journey to a sacred place to grow spiritually.",
        "Lumbini, the birthplace of the Buddha.",
        "It is a sacred river, believed to purify sins.",
        "The season preparing for the birth of Jesus.",
        "Commemorates the descent of the Holy Spirit on the apostles.",
        "All-loving.",
        "A Muslim place of worship.",
        "The act of making amends for sin.",
        "Ensuring fairness and equality as guided by Allah.",
        "A ceremonial meal during Passover.",
        "Qualities inspired by the Holy Spirit like kindness and peace.",
        "The day when all people are judged by God.",
        "The Buddhist community of monks and followers.",
        "God revealing Himself to humans, e.g., through scripture.",
        "Pilgrimage to Mecca, required once in a lifetime for Muslims.",
        "Jesus' instruction to spread the Gospel to all nations.",
        "Sacred Hindu texts discussing philosophy and meditation.",
        "Islam promotes equality but interpretations vary.",
        "To connect with God and seek forgiveness.",
        "They serve as messengers and protectors for humans.",
        "Christians believe they will either be with God or separated from Him after death.",
        "A way of life focusing on selfless service to others.",
        "The central Jewish scripture.",
        "The worship of physical idols is forbidden.",
        "A temporary state before a soul reaches Heaven.",
        "A mediator between humans and God in Islam.",
        "The ethical dilemma of distinguishing right from wrong.",
        "Sharing the Christian message with others.",
        "The first ten spiritual leaders of Sikhism.",
        "Being saved from sin through faith in Jesus Christ.",
        "A sacred chest holding the tablets of the Ten Commandments."
    ]
    blacklist = []
    os.system('cls' if os.name == 'nt' else 'clear')
    while True:
        matchWordCount = 0
        ramdomNum = random.randint(0,len(questionList) -1)
        while ramdomNum in blacklist:
            ramdomNum = random.randint(0,len(questionList) -1)
        question = questionList[ramdomNum]
        answer = answerList[ramdomNum]
        answerWord = answerList[ramdomNum].lower().split()
        print(question) #show question
        userAnswer = input().lower() #input answer
        for word in answerWord: #check answer if it sertain 3 word matched
            if word in userAnswer:
                matchWordCount += 1
        if matchWordCount >= 3:
            print("\nyou answered it right!\n")
            blacklist.append(ramdomNum) #blacklist the question you answered it right
        else:
            print("""
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⠤⢄⣀⣀⣤⡤⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠟⠟⠁⠀⠀⠈⡿⣼⠁⠀⠀⠈⠑⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⠚⠁⠀⠀⠀⠀⠀⡹⠟⠻⣓⠀⠀⠀⠀⠀⠻⢴⣢⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⣰⠃⠀⣀⣤⣤⠴⠚⠁⠀⠀⠀⠀⠈⠑⠀⠀⠀⢄⣈⠲⣧⢛⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⡴⠁⣠⣾⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢟⡺⡱⢎⡦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⢰⡇⡜⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢢⣑⡝⢮⡜⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⢠⣧⢻⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡜⣿⢣⡜⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⣯⣿⣠⠆⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠹⣒⢧⣚⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⢠⠏⡴⢻⠀⠀⠂⣉⡭⠸⣿⣋⠀⠀⠀⣈⣿⣯⡿⢿⣷⣶⡄⢠⣏⠶⣹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠘⢀⡭⠏⠀⠀⠹⠋⠛⠛⠙⠏⠁⠀⠀⡏⠀⠙⠻⠋⠟⠋⠁⠈⣎⠳⣍⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⢀⡞⡜⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣏⡳⣍⢞⡹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠰⡻⣜⡹⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡀⠀⠀⠀⠀⠀⠀⠀⣧⠳⡜⢮⡱⢣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⢀⠆⡾⡱⣮⣱⡛⠀⠀⠀⠀⠀⠀⠀⠠⣄⡀⣶⣬⡇⠀⠀⠀⠀⠀⠀⢸⢲⡹⣜⢣⡝⣣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⢰⡾⣱⢓⡇⠘⢺⡆⠀⠀⠀⠀⠀⠀⠀⢸⢫⡝⣣⢄⠀⠀⠀⠀⠀⠀⣏⢧⠳⣌⡳⡜⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⢸⡱⣣⢏⠶⣄⠀⡾⡄⠀⠀⢀⣴⢻⠷⣯⣳⣜⣱⣎⠗⣤⢄⠀⠀⠀⣏⢎⡳⢥⠳⣭⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⢸⣱⠙⣎⠳⣜⡱⣏⢯⠀⠀⣯⠊⠁⠀⢀⣀⣀⣀⠀⠈⠣⣏⠦⠀⢸⡜⢮⡱⣋⠷⡅⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠠⣫⢰⣍⠳⣎⠵⣪⡝⡇⡀⡏⠀⠀⠐⠉⠀⡈⠁⠀⠀⢀⡼⣙⢧⡚⣜⢣⠳⣍⢞⡱⢤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⢰⢏⡶⣜⠳⣬⢳⡱⠹⣽⣿⣡⣠⠀⠀⠀⡀⣯⠻⣤⡠⣞⠲⣍⠶⡹⣌⡳⡹⡜⢮⡱⢯⠛⢆⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠈⡟⢮⡱⢎⡳⢬⢣⣳⠀⠉⣧⣟⣻⡀⢠⢸⢫⡕⣫⢖⡹⣌⠗⣎⠳⡕⢮⡱⢣⡝⣲⡙⢮⢆⡆⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠫⢶⡛⢧⢫⡜⣣⢗⡺⠀⠀⠘⠙⣮⢝⡻⢏⡳⣜⡱⢎⡵⢪⡝⣬⢛⡜⣣⢝⡣⢞⡥⣛⢬⣋⣧⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⢠⡞⡹⢎⡳⣜⡱⡎⠋⠀⠀⠀⠀⠀⠈⠫⠎⠵⠎⡵⢫⡜⣣⠞⡴⢫⣜⡱⢎⡵⣋⠶⣩⠖⡥⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠠⣀⣙⣧⡯⠒⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢑⡏⢶⣩⢓⠧⣎⠵⣋⠶⣩⠞⣥⢛⡼⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡝⠉⢣⡏⡞⣬⢳⡍⡞⣥⠛⣴⢫⡜⢣⡗⣤⢢⡄⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡓⠁⠀⡯⣜⡱⠋⠈⢳⡱⣍⢞⡱⢎⡵⣋⠶⣩⠞⣜⢲⢄⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⠀⢸⡵⠋⠀⠀⢀⢧⠳⡜⢮⡱⣋⠶⣩⠞⣥⢛⡬⢣⢏⡞⣵⡚⠶⠄
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠞⠁⠀⠀⢀⡞⣎⡳⣙⠶⡱⣍⠞⣥⢛⡴⢫⡼⠓⠉⠈⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠌⠀⠀⠀⢠⡞⡼⠋⡷⣩⠞⠕⢪⣛⢦⡫⠜⠁⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣯⠞⠁⡰⠗⠋⠀⣰⢯⠜⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠟⠁⠀⠀⠀⠀⢀⡾⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
 ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⠛⠁⠀⠀⠀⠀⠀⠀⠁""")
            print("\njusus love you, but")
            print(f"You answered it wrong, the answer is '{answer}'\n")

def clean():
    os.system('cls' if os.name == 'nt' else 'clear')

#menu
while True:
    try:
        clean()
        with open("firstTime.txt", "r") as f:
            file = f.read()
            f.close
        if file != "false":
            print("\nHi welcome to RS gcse quiz")
            print("i cant afford kahoot premium edition, so i choosed python;)")
            print("\nTerms of service:")
            print(" 1.all question and answer Aided using common development resources.")
            print(" 2.comment if it is wrong.\n")
            menuInput = input("I have read and agree to Terms of services [y/n]")
            if menuInput == "y":
                with open("firstTime.txt", "w") as f:
                    f.write("false")
                    f.close
                test()
            elif menuInput == "n":
                print("okay bye")
                input("\npress ENTER to exit...")
                exit()
            else:
                print("ERROR! type 'y' or 'n' only.")
                input("press ENTER to continue...")
        elif file == "false":
            test()
        
            
    except Exception as e:
        print(e)
        input("\npress ENTER to exit...")
        exit()