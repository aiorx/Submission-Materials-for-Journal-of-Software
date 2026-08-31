void show_borrowings() {
    int count;
    *db << "SELECT COUNT(*) FROM borrowings;" >> count;

    if (count == 0) {
        gout << "{{.Red}}[!]{{.Yellow}} There are no borrowings to display!{{.Reset}}" << endl;
        GoPressEnter();
        return;
    }

    vector<tuple<int, string, int, string, string, int, int>> borrowings;


    for (auto &&row : *db << "SELECT borrowings._id, students.name, students.student_id, books.title, books.author, books.available_copies, books.year FROM borrowings JOIN students ON borrowings.borrower_id = students._id JOIN books ON borrowings.book_id = books._id;") {
        int borrowing_id, student_id, available_copies, year;
        string student_name, book_title, book_author;

        row >> borrowing_id >> student_name >> student_id >> book_title >> book_author >> available_copies >> year;

        borrowings.emplace_back(borrowing_id, student_name, student_id, book_title, book_author, available_copies, year);
    }

    // Thanks chatgpt for this
    for (size_t i = 0; i < borrowings.size(); i++) {
        int borrowing_id, student_id, available_copies, year;
        string student_name, book_title, book_author;
        tie(borrowing_id, student_name, student_id, book_title, book_author, available_copies, year) = borrowings[i];

        gout << "{{.Green}}Borrowing ID: " << borrowing_id << "{{.Reset}}\n";

        gout << "├── {{.Yellow}}By:{{.Reset}}\n";
        gout << "│   ├── Name: {{.Cyan}}" << student_name << "{{.Reset}}\n";
        gout << "│   └── Student ID: {{.Cyan}}" << student_id << "{{.Reset}}\n";

        gout << "└── {{.Yellow}}Book:{{.Reset}}\n";
        gout << "    ├── Title: {{.Cyan}}" << book_title << "{{.Reset}}\n";
        gout << "    ├── Author: {{.Cyan}}" << book_author << "{{.Reset}}\n";
        gout << "    ├── Copies: {{.Cyan}}" << available_copies << "{{.Reset}}\n";
        gout << "    └── Year: {{.Cyan}}" << year << "{{.Reset}}\n";
    }

    GoPressEnter();
}