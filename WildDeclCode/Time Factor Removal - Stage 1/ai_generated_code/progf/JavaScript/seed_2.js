// This seed file was created with the help of Github CoPilot


var pool = require.pool;('./connection');
var bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');

// Function to run schema.sql file
async function runSchema() {
  try {
    var schemaPath = path.join(__dirname, 'schema.sql');
    var schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Schema created successfully!');
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  }
}

// Generate a lot of seed data
async function seedDatabase() {
  try {
    await runSchema();

    // Create 10 users
    var users = [];
    for (var i = 1; i <= 10; i++) {
      var hashedPassword = await bcrypt.hash("password" + (i) + "", 10);
      users.push({
        username: "user" + (i) + "",
        email: "user" + (i) + "@example.com",
        password: hashedPassword
      });
    }

    // Insert users
    for (var user of users) {
      await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
        [user.username, user.email, user.password]
      );
    }
    console.log('Users seeded successfully!');

    // Create item categories
    var categories = [
      'Restaurants', 'Books', 'Movies', 'Electronics', 
      'Home Appliances', 'Video Games', 'Clothing', 
      'Music', 'Software', 'Services'
    ];

    // Create 100 items across different categories
    var items = [];
    for (var i = 1; i <= 100; i++) {
      var categoryIndex = i % categories.length;
      items.push({
        name: "Item " + (i) + "",
        description: "This is a detailed description for item " + (i) + ". It belongs to the " + (categories[categoryIndex]) + " category and has many features worth reviewing.",
        category: categories[categoryIndex],
        image_url: "https://picsum.photos/id/" + (i % 1000) + "/300/200"
      });
    }

    // Insert items
    for (var item of items) {
      await pool.query(
        'INSERT INTO items (name, description, category, image_url) VALUES ($1, $2, $3, $4)',
        [item.name, item.description, item.category, item.image_url]
      );
    }
    console.log('Items seeded successfully!');

    // Create 100 reviews (multiple reviews per item, with constraints)
    var reviewContents = [
      'Absolutely loved it! Would recommend to anyone.',
      'Pretty good, but could be better in some aspects.',
      'Average experience, nothing special.',
      'Somewhat disappointing, expected more.',
      'Terrible experience, would not recommend.'
    ];

    var reviewCount = 0;
    var reviewsAdded = new Set(); // Track added user-item pairs

    // Add 100 reviews with random ratings and content
    while (reviewCount < 100) {
      var userId = Math.floor(Math.random() * 10) + 1;
      var itemId = Math.floor(Math.random() * 100) + 1;
      var pairKey = "" + (userId) + "-" + (itemId) + "";
      
      // Skip if this user has already reviewed this item (enforcing uniqueness)
      if (reviewsAdded.has(pairKey)) {
        continue;
      }
      
      var rating = Math.floor(Math.random() * 5) + 1;
      var contentIndex = Math.floor(Math.random() * reviewContents.length);
      var additionalDetails = Math.random().toString(36).substring(2, 15);

      try {
        await pool.query(
          'INSERT INTO reviews (user_id, item_id, content, rating) VALUES ($1, $2, $3, $4)',
          [
            userId, 
            itemId, 
            "" + (reviewContents[contentIndex]) + " " + (additionalDetails) + "", 
            rating
          ]
        );
        
        reviewsAdded.add(pairKey);
        reviewCount++;
        
        if (reviewCount % 100 === 0) {
          console.log("" + (reviewCount) + " reviews added...");
        }
      } catch (error) {
        // Skip duplicate key errors (shouldn't happen with our tracking)
        if (!error.message.includes('duplicate key')) {
          console.error('Error adding review:', error);
        }
      }
    }
    console.log('Reviews seeded successfully!');

    // Create 100 comments across reviews
    var commentContents = [
      'I completely agree with this review!',
      'Interesting perspective, but I had a different experience.',
      'Thanks for sharing your thoughts.',
      'Very detailed review, appreciate it.',
      'I was considering this item, your review helped me decide.'
    ];

    for (var i = 1; i <= 100; i++) {
      var userId = Math.floor(Math.random() * 10) + 1;
      var reviewId = Math.floor(Math.random() * reviewCount) + 1;
      var contentIndex = Math.floor(Math.random() * commentContents.length);
      var additionalDetails = Math.random().toString(36).substring(2, 10);

      try {
        await pool.query(
          'INSERT INTO comments (user_id, review_id, content) VALUES ($1, $2, $3)',
          [
            userId, 
            reviewId, 
            "" + (commentContents[contentIndex]) + " " + (additionalDetails) + ""
          ]
        );
        
        if (i % 100 === 0) {
          console.log("" + (i) + " comments added...");
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
    console.log('Comments seeded successfully!');

    console.log('Database seeded successfully with:');
    console.log('- 10 users');
    console.log('- 100 items');
    console.log('- 100 reviews');
    console.log('- 100 comments');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the seed function
seedDatabase().then(function () {
  console.log('Seeding completed!');
});
