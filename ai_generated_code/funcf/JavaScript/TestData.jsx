```js
[
  // The following test data is Assisted with basic coding tools
  // January Expenses
  { date: '2023-01-02', category: 'Dining', description: 'Tim Hortons', amount: 15.00 },
  { date: '2023-01-03', category: 'Fashion', description: 'Roots', amount: 120.00 },
  { date: '2023-01-09', category: 'Entertainment', description: 'Cineplex', amount: 25.00 },
  { date: '2023-01-12', category: 'Groceries', description: 'Loblaw', amount: 90.00 },
  { date: '2023-01-12', category: 'Transportation', description: 'Petro-Canada Gas', amount: 45.00 },
  { date: '2023-01-15', category: 'Utilities', description: 'Hydro One', amount: 65.00 },
  { date: '2023-01-17', category: 'Others', description: 'Amazon.ca Order', amount: 35.00 },

  // February Expenses
  { date: '2023-02-02', category: 'Dining', description: 'Swiss Chalet', amount: 50.00 },
  { date: '2023-02-07', category: 'Fashion', description: 'Hudson\'s Bay', amount: 200.00 },
  { date: '2023-02-10', category: 'Entertainment', description: 'Netflix Subscription', amount: 14.99 },
  { date: '2023-02-14', category: 'Groceries', description: 'Metro', amount: 75.00 },
  { date: '2023-02-18', category: 'Transportation', description: 'GO Transit Pass', amount: 120.00 },
  { date: '2023-02-20', category: 'Utilities', description: 'Bell Internet', amount: 80.00 },
  { date: '2023-02-25', category: 'Others', description: 'IKEA Furniture', amount: 250.00 },

  // March Expenses
  { date: '2023-03-03', category: 'Dining', description: 'A&W', amount: 25.00 },
  { date: '2023-03-06', category: 'Fashion', description: 'Zara', amount: 150.00 },
  { date: '2023-03-11', category: 'Entertainment', description: 'Spotify Subscription', amount: 9.99 },
  { date: '2023-03-15', category: 'Groceries', description: 'Costco', amount: 300.00 },
  { date: '2023-03-18', category: 'Transportation', description: 'TTC Monthly Pass', amount: 146.25 },
  { date: '2023-03-22', category: 'Utilities', description: 'Enbridge Gas', amount: 60.00 },
  { date: '2023-03-27', category: 'Others', description: 'Canadian Tire Tools', amount: 180.00 },

  // April Expenses
  { date: '2023-04-02', category: 'Dining', description: 'Boston Pizza', amount: 55.00 },
  { date: '2023-04-05', category: 'Fashion', description: 'Simons', amount: 140.00 },
  { date: '2023-04-08', category: 'Entertainment', description: 'Amazon Prime Subscription', amount: 7.99 },
  { date: '2023-04-13', category: 'Groceries', description: 'Whole Foods Market', amount: 120.00 },
  { date: '2023-04-17', category: 'Transportation', description: 'Uber', amount: 30.00 },
  { date: '2023-04-21', category: 'Utilities', description: 'Rogers Wireless', amount: 85.00 },
  { date: '2023-04-26', category: 'Others', description: 'Best Buy Electronics', amount: 200.00 },

  // May Expenses
  { date: '2023-05-02', category: 'Dining', description: 'Harvey\'s', amount: 20.00 },
  { date: '2023-05-03', category: 'Fashion', description: 'Gap', amount: 110.00 },
  { date: '2023-05-07', category: 'Entertainment', description: 'Xbox Game Pass', amount: 14.99 },
  { date: '2023-05-12', category: 'Groceries', description: 'No Frills', amount: 65.00 },
  { date: '2023-05-16', category: 'Transportation', description: 'Taxi Fare', amount: 40.00 },
  { date: '2023-05-19', category: 'Utilities', description: 'City Water Bill', amount: 70.00 },
  { date: '2023-05-23', category: 'Others', description: 'IKEA Decor', amount: 150.00 },

  // June Expenses
  { date: '2023-06-02', category: 'Dining', description: 'Subway', amount: 15.00 },
  { date: '2023-06-06', category: 'Fashion', description: 'Old Navy', amount: 90.00 },
  { date: '2023-06-10', category: 'Entertainment', description: 'Bowling Alley', amount: 35.00 },
  { date: '2023-06-14', category: 'Groceries', description: 'Farm Boy', amount: 80.00 },
  { date: '2023-06-17', category: 'Transportation', description: 'Local Bus Pass', amount: 100.00 },
  { date: '2023-06-21', category: 'Utilities', description: 'Natural Gas Bill', amount: 60.00 },
  { date: '2023-06-25', category: 'Others', description: 'Home Hardware', amount: 75.00 },

  // July Expenses
  { date: '2023-07-02', category: 'Dining', description: 'Moxie\'s Grill', amount: 60.00 },
  { date: '2023-07-06', category: 'Fashion', description: 'Club Monaco', amount: 130.00 },
  { date: '2023-07-10', category: 'Entertainment', description: 'Ontario Place Admission', amount: 55.00 },
  { date: '2023-07-14', category: 'Groceries', description: 'Kensington Market Shopping', amount: 80.00 },
  { date: '2023-07-18', category: 'Transportation', description: 'Car Insurance', amount: 120.00 },
  { date: '2023-07-22', category: 'Utilities', description: 'Mobile Phone Bill', amount: 60.00 },
  { date: '2023-07-27', category: 'Others', description: 'Home Depot Tools', amount: 145.00 },
  
  // August Expenses
  { date: '2023-08-03', category: 'Dining', description: 'Jack Astor\'s Bar', amount: 75.00 },
  { date: '2023-08-05', category: 'Fashion', description: 'Nordstrom', amount: 200.00 },
  { date: '2023-08-09', category: 'Entertainment', description: 'Wonderland Tickets', amount: 100.00 },
  { date: '2023-08-13', category: 'Groceries', description: 'Whole Foods', amount: 110.00 },
  { date: '2023-08-17', category: 'Transportation', description: 'Gas Refill', amount: 70.00 },
  { date: '2023-08-21', category: 'Utilities', description: 'Water Bill', amount: 55.00 },
  { date: '2023-08-26', category: 'Others', description: 'Amazon Purchase', amount: 90.00 },
]
```