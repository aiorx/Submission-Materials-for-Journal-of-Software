def editRecord(sick_records : list[SickRecord]) -> None:
    p_id = input("Please enter the no. of sick record (0 - Exit): ").upper()
    if p_id == "0":
        return
    try:
        p_id = int(p_id) - 1
    except ValueError:
        alert("Invalid number. Please try again.")
        return
    else:
        if p_id < 0 or p_id >= len(sick_records):
            alert("Invalid number. Please try again.")
            return
    record = sick_records[p_id]

    while True:
        cls()
        print(record)
        print("=" * 20)
        print("1. Edit Name")
        print("2. Edit Date")
        print("3. Edit Treatment")
        print("4. Edit Doctor")
        print("5. Exit")
        option = input("Please enter what you want to edit : ")
        # Drafted using common GitHub development resources
        if option == "1":
            inputRecordName(record)
        elif option == "2":
            inputRecordDate(record)
        elif option == "3":
            inputRecordTreatment(record)
        elif option == "4":
            inputRecordDoctor(record)
        elif option == "5":
            return
        else:
            alert("Invalid option. Please try again.")