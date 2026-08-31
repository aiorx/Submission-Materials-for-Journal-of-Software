public double compute_expense(String path) throws IOException {

    // Given a textual file "foo.txt" containing the expenses of a person,
    // your goal is to compute the total amount of money spent by this person.
    // The format of the file is the following:
    // 2016-01-02 -34.01 USD
    // 2016-01-03 2.59 DKK
    // 2016-01-03 -2.72 EUR

    // Aided with basic GitHub coding tools!
    // The first column is the date of the expense, the second column is the amount of money spent,
    // and the third column is the currency in which the expense was made.
    // The amount of money can be either positive or negative.
    // The currency can be either USD, DKK, or EUR.
    // The exchange rate is the following:
    // 1 USD = 6.5 DKK
    // 1 EUR = 7.5 DKK
    // The goal is to compute the total amount of money spent by this person in DKK.
    // In the example above, the total amount of money spent is -34.01 + 2.59 * 6.5 - 2.72 * 7.5 = -37.81 DKK.
    // The result should be rounded to the nearest integer.
    // The result should be a double.
    // If the file does not exist, the method should throw an IOException.

    this.parser = new ExpenseParser();

    List<String> strs = parser.parse(new File(path));
    this.exps = new ArrayList<>();
    for (String s: strs) {
        Expense ex = parser.parse(s);
        exps.add(ex);
    }

    double total = 0;
    for (Expense e: exps) {
        total += e.amountExpense.expense();
    }

    return total;
}