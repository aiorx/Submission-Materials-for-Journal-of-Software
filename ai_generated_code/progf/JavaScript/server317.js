require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');



const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Supported via standard programming aids, creates the database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});
//Supported via standard programming aids, if there an issue connecting to the database, an error message will be printed and will stop the node.js application
//else, we print that the connection to the database was successful
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL!');
});

//Supported via standard programming aids
//.post allows us to send data to servers
app.post('/register', async (req, res) => {
    //gets the information required to register to the server
    const { username, email, password, confirmPassword } = req.body;
    //checks if something was entered into each field, if they were not, we respond with a 400 error
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required.');
    }
    //checks if the two passwords the user entered match, if they do not, respond with a 400 error
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match!');
    }

    try {
        //encyrpts the password using bycrypt, creates a new random string call a salt that is appended to the password, then that password is put into a
        //a function that hashes it, meaning it cannot be reverted back to its cleartext form
        const hashedPassword = await bcrypt.hash(password, 10);

        //after hashing the password, we want to store this data into the sql database so we create a variable that stores the query that does that,
        //in which the questions marks are placeholders for the data that will be entered into the database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        //executes the database query
        db.query(query, [username, email, hashedPassword], (err, result) => {
            //error checking
            if (err) {
                //if the email is already in the database, we print a generic message because we do not want people knowing
                //that the email they entered already associated with an account
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Error registering');
                }
                console.error('Database error:', err);
                return res.status(500).send('An error occurred. Please try again.');
            }
            //if there are no errors, we print that the user registered succesfully
            res.redirect('/login.html?message=Successfully registered');
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Supported via standard programming aids
app.post('/login', (req, res) => {
    //gets the information required to login
    const { username, password } = req.body;

    //checks is the user entered something into both fields
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    //stores the query that checks the database for usernames matches the value entered
    const query = 'SELECT * FROM users WHERE username = ?';

    //executes the database query
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred. Please try again.');
        }

        //if the length of results is 0, it means that username was not found in the database
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const user = results[0];

        //once we found the username in the database, we compare the password they entered with the password in the database
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            //if it does not match, the password was incorrect
            return res.status(401).send('Invalid username or password.');
        }
        console.log('Login successful for user:', username);
        //if the correct password was entered for the given username, the login is successful and redirects to main page
        res.redirect('/index.html?message=Login successful');
    });
});

//Supported via standard programming aids
app.post('/checkout', (req, res) => {
    //gets the information required to make a purchase
    const { cart, paymentDetails } = req.body;

    
    //if the user trys to buy something when there is nothing in the cart, we notify them that the cart is empty
    if (!cart || cart.length === 0) {
        return res.status(400).send('Cart is empty.');
    }

    //checks if there is information in all the fields
    if (!paymentDetails.cardName || !paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvc || 
        !paymentDetails.billingAddress || !paymentDetails.city || !paymentDetails.zip || !paymentDetails.country) {
        return res.status(400).send('Payment details are incomplete.');
    }

    //calculates the total cost of all the items in the cart
    const totalAmount = cart.reduce((total, item) => total + item.price, 0);

    //stores the database query
    const insertOrderQuery = `
        INSERT INTO orders (total_amount, card_name, billing_address, city, zip, country) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    //executes the database query
    db.query(insertOrderQuery, [
        totalAmount, 
        paymentDetails.cardName, 
        paymentDetails.billingAddress, 
        paymentDetails.city, 
        paymentDetails.zip, 
        paymentDetails.country
    ], (err, result) => {
        if (err) {
            //if there is an error we send the client an error code
            return res.status(500).send('An error occurred while processing the order.');
        }

        //creates an Id so that we can keep of who purchased what in the order_items table
        const orderId = result.insertId;

        //creates an array of arrays, each element is an array that conatains the orderid, itemname, and price
        const cartItems = cart.map(item => [orderId, item.name, item.price]);

        //stores the database query 
        const insertCartItemsQuery = 'INSERT INTO order_items (order_id, item_name, price) VALUES ?';

        //executes the database query
        db.query(insertCartItemsQuery, [cartItems], (err) => {
            if (err) {
                return res.status(500).send('An error occurred while saving cart items.');
            }
            res.status(200).send('Payment processed successfully!');
            
        });
    });
});

//Supported via standard programming aids
app.post('/submit-contact', (req, res) => {
    //gets the information required to send a message
    const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

    //ensures that all fields are filled out
    if (!firstName || !lastName || !email || !subject || !message || !phoneNumber) {
        return res.status(400).send('All fields are required');
    }

    //stores the query
    const query = `
        INSERT INTO faq_contacts (first_name, last_name, email, phone_number, subject, message)
        VALUES (?, ?, ?, ?, ?, ?)`;

    //executes the query
    db.query(query, [firstName, lastName, email, phoneNumber || null, subject, message], (err, result) => {
        if (err) {
            //if there is an error, we send an error code
            return res.status(500).send('An error occurred while submitting the form.');
        }
        //at this point, the information is in the database, so we send a reponse back to the client
        res.status(200).send('Your message has been submitted successfully.');
    });
});





app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


