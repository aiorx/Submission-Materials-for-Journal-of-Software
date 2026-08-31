import re
pattern = ('(\w+),\s(\w+),\s(\+\d+\s\d+\-\d+\-\d+)')

raw=open('generated_data_1.txt')

d_={}
df_={}
for line in raw:
    trap=re.search(pattern,line)
    name=trap.group(1)
    country=trap.group(2)
    phone_number=trap.group(3)
    d_[phone_number] = [country,name]
    
#print(d_)




brawl=open('generated_data_1.txt')
#easier version using split
for line in brawl:
    ak=line.rstrip('\n').split(',')
    df_[ak[2]]=[ak[0],ak[1]]
    
    
#print(df_)

#contrived dataset Formed using common development resources
'''Grace, India, +91 579-207-6396
Frank, USA, +1 999-240-1055
Frank, Canada, +1 834-318-5729
Ivy, Australia, +61 449-793-8762
Vera, Canada, +1 917-568-5971
Vera, Brazil, +55 200-441-1740
Alice, Canada, +1 135-525-8489
Frank, Australia, +61 523-536-4694
Yara, UK, +44 667-829-8194
Grace, Japan, +81 519-669-9728
Zane, Germany, +49 389-237-3859
Liam, Australia, +61 642-753-3756
Zane, USA, +1 507-796-3844
Hannah, Australia, +61 933-700-2412
Eve, USA, +1 891-329-5268
David, Canada, +1 856-741-9743
Rachel, Japan, +81 494-587-2175
Ivy, Germany, +49 796-533-2077
Zane, France, +33 622-371-7431
Grace, USA, +1 473-458-1676
Rachel, Japan, +81 347-876-3231
Paul, India, +91 681-245-1018
Tina, Japan, +81 829-259-9470
Frank, France, +33 338-620-8643
Grace, India, +91 752-820-8965
Jack, UK, +44 911-763-6516
Zane, India, +91 493-897-3638
Grace, Canada, +1 790-174-7952
Yara, Germany, +49 211-784-7153
Mona, Germany, +49 227-523-8066
Paul, China, +86 810-516-2388
Nina, USA, +1 174-363-2476
Charlie, Germany, +49 810-248-3226
Sam, Australia, +61 813-186-5222
Bob, France, +33 632-845-7215
Sam, Brazil, +55 108-123-6409
Umar, Brazil, +55 607-696-7502
Karen, Canada, +1 991-252-2560
Umar, Australia, +61 893-385-7378
Eve, Germany, +49 310-835-2776
Bob, Japan, +81 809-986-7842
Wendy, Japan, +81 647-894-8766
David, India, +91 373-540-3189
Oscar, China, +86 684-904-3289
Xander, Brazil, +55 373-359-1225
Paul, India, +91 367-743-2686
Eve, India, +91 903-622-1398
Sam, Japan, +81 748-270-8205
Hannah, Japan, +81 410-358-2704
Quincy, France, +33 289-285-5216
Frank, UK, +44 479-505-9922
Jack, China, +86 260-920-1125
Charlie, Australia, +61 961-606-5957
Xander, Germany, +49 815-229-4807
Nina, India, +91 948-160-9656
Wendy, France, +33 697-684-3884
Frank, Brazil, +55 583-157-9778
Ivy, India, +91 499-520-1691
Quincy, UK, +44 414-104-7610
Vera, Australia, +61 206-413-2016
Alice, France, +33 455-662-5299
Xander, India, +91 557-394-1201
Grace, Canada, +1 780-908-4086
Bob, Australia, +61 832-483-8770
Sam, Australia, +61 491-301-7663
Ivy, Canada, +1 411-256-9169
Zane, UK, +44 442-787-8757
Alice, India, +91 674-547-4088
Hannah, Japan, +81 626-452-7269
Jack, Australia, +61 554-518-3680
Charlie, France, +33 805-455-9454
Umar, Germany, +49 709-788-8176
Vera, China, +86 563-484-7735
Rachel, Australia, +61 252-423-6564
Grace, USA, +1 635-207-5223
Nina, Australia, +61 359-716-9654
Liam, Brazil, +55 730-653-7368
Umar, France, +33 893-294-7257
Ivy, Canada, +1 340-180-4913
Rachel, UK, +44 848-956-3241
Vera, China, +86 480-646-1358
Paul, USA, +1 420-215-3137
Ivy, China, +86 951-745-9440
Hannah, Canada, +1 302-493-7154
Ivy, Japan, +81 751-592-7618
Zane, Australia, +61 298-904-3960
Mona, China, +86 119-712-8147
Grace, UK, +44 451-849-9636
Yara, Germany, +49 587-195-8078
Umar, India, +91 350-138-9701
Grace, Germany, +49 739-564-4766
Rachel, Japan, +81 824-711-5224
Paul, Australia, +61 363-968-6651
Umar, China, +86 745-741-1669
Liam, China, +86 440-834-7004
Xander, Australia, +61 349-131-5894
Ivy, Japan, +81 564-950-2742
Grace, USA, +1 279-143-3834
Umar, France, +33 791-953-3664
Ivy, Australia, +61 336-536-1915'''