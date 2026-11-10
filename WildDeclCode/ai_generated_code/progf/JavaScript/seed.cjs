//seed file Formed using common development resources to enter data into the database

const db = require('./models/db.cjs');

const seedData = [
  {
    name: 'Greenwood High School',
    address: '101 Maple Street',
    latitude: 40.712776,
    longitude: -74.005974
  },
  {
    name: 'Sunnydale Elementary',
    address: '202 Oak Avenue',
    latitude: 40.73061,
    longitude: -73.935242
  },
  {
    name: 'Riverside Middle School',
    address: '303 Pine Road',
    latitude: 40.741895,
    longitude: -73.989308
  }
];

const seedDatabase = () => {
  seedData.forEach((school) => {
    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const values = [school.name, school.address, school.latitude, school.longitude];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err.stack);
      } else {
        console.log(`Inserted school: ${school.name}`);
      }
    });
  });

  // Close the database connection after seeding
  db.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.stack);
    } else {
      console.log('Database connection closed.');
    }
  });
};

seedDatabase(); 