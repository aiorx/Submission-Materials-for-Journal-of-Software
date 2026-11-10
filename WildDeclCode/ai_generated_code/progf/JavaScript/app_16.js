/*
File Name:  app.js
Course: CSC 648
Author:  Team 7    
Last-Updated:  12/17/2024
Description: Application File which handles Server & DB connection. Also handles routing and file logic.
Editors: Jaylin Jack, Zarko Cosovic, & ChatGPT
Intense help from code generation by ChatGPT.
*/

// The following lines are imports, declarations, and connection creation
const http = require('http');
const multer = require('multer');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const session = require('express-session');

const app = express();
const crypto = require('crypto');


// Assure no more than 50 concurrent users on site.
const MAX_CONCURRENT_USERS = 50;
let activeConnections = 0;

// Generated with Chat-GPT 
app.use((req, res, next) => {
  if (activeConnections > MAX_CONCURRENT_USERS) {
    // Reject the request if max concurrent connections are exceeded
    res.status(503).send('Server is at full capacity, please try again later.');
  } else {
    next();
  }
});

// Create the server using Express
const server = http.createServer(app);

// Generated with Chat-GPT 
server.on('connection', (socket) => {
  activeConnections++; // Increment on connection

  // Log when a new connection is made
  

  socket.on('close', () => {
    activeConnections--; // Decrement on disconnection
  });
});

// Setup the app to use sessions which tracks logged in users info.
app.use(session({
  secret: "team 7 secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false 
  }
}));


app.use(bodyParser.json()); 

// Access our dbFunctions file.
const db = require('./public/src/functions/dbFunctions');

// AWS Server Port
const serverPort = 80;

// LocalHost Server Port
// const serverPort = 3000;


// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


// Intense help with files from ChatGPT
const fileTypes = {
  image: ['image/jpeg', 'image/png'],
  video: ['video/mp4'],
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save images to 'public/images' and videos to 'public/videos'
    if (fileTypes.image.includes(file.mimetype)) {
      cb(null, 'public/images'); // Image folder
    } else if (fileTypes.video.includes(file.mimetype)) {
      cb(null, 'public/videos'); // Video folder
    } else {
      cb(new Error('Invalid file type'), false); // Reject unsupported file types
    }
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and original file name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (fileTypes.image.includes(file.mimetype)) {
    return cb(null, true); // Allow image files
  } else if (fileTypes.video.includes(file.mimetype)) {
    return cb(null, true); // Allow video files
  } else {
    cb(new Error('Invalid file type, only .jpg, .png for images and .mp4 for videos are allowed'), false);
  }
};


const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }  // Optional: Set file size limit (e.g., 50MB)
});



/*
    Creator: JJ
    All pages on our site must have access to Tutors and Subjects 
    so search functions correctly on all pages
*/
app.get('/', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("homepage", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});

app.get('/tutor_application', (req, res) => {

  if (!req.session.user) {
    // Redirect to login page if not logged in
    req.session.message = "You must log in to access this page.";
    return res.redirect('/login');
  }

  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("tutor_application", {
        tutor: tutors,
        subject: subjects,
        message: req.session.message
      });
      req.session.message = null;
    });
  });
});

// The logic to handle files is Assisted with basic coding tools
app.post('/tutor_application', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]), (req, res) => {
  // Ensure req.body and req.files are properly parsed

  const { subject, bio, courses } = req.body;  // Extract the fields from req.body


  // Validate that subject is not empty
  if (!subject || subject.trim() === '') {
    
    return res.redirect('/dashboard');  
  }


  const reg_user_id = req.session.user.id;  // Get user ID from session

  // Get file paths for photo and video (if they exist)
  const photoPath = req.files['photo'] ? `../images/${req.files['photo'][0].filename}` : null;
  const videoPath = req.files['video'] ? `../videos/${req.files['video'][0].filename}` : null;



  // SQL query to insert tutor information into the database
  const query = `INSERT INTO tutor (reg_user_id, subject, bio, courses, photo, video, approval_status)
                 VALUES (?, ?, ?, ?, ?, ?, 'pending')`;

  // Execute the query
  db.connection.query(query, [reg_user_id, subject, bio, courses, photoPath, videoPath], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error occurred' });
    }


    res.redirect('/');  // Redirect to the homepage or wherever
  });
});


// Shows your Message Inbox. Exclusive to Logged In Users.
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    // Redirect to login page if not logged in
    req.session.message = "You must log in to access this page.";
    return res.redirect('/login');
  }

  db.getMessages(req.session.user.id, (messages, senders) => {
    db.getPostings(req.session.user.id, (postings) => {
      db.getSubjects((subjects) => {
        db.getTutors((tutors) => {
            res.status(200).render("Dashboard", {
                tutor: tutors,
                subject: subjects,
                messages: messages,
                senders: senders,
                name: req.session.user.name,
                tutorPostings: postings,
                message: req.session.message 
            });
          req.session.message = null;
        });
      });
    });
  });
});

//Log the current session out
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err){
      return res.status(500).send('Logout Failed');
    }
    res.redirect('/login');
  })
});


// Messaging Form. Exclusive to Logged In Users.
app.get('/messaging/:id', (req, res) => {
  if (!req.session.user) {
    // Redirect to login page if not logged in
    req.session.message = "You must log in to access this page.";
    return res.redirect('/login');
  }

  const tutorId = req.params.id;
    // Fetch subjects and tutors after checking if the user is a tutor
    db.getSubjects((subjects) => {
      db.getTutors((tutors) => {
          // If the user is not a tutor, simply render the messaging page with tutors and subjects
          res.status(200).render("messaging", {
            tutor: tutors,
            subject: subjects,
            message: req.session.message
          });
          req.session.message = null;
    });
  });
});

// The logic to handle messaging is Assisted with basic coding tools
app.post('/messaging/:id', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const recipientId = req.params.id;
  const { message } = req.body;  
  const senderId = req.session.user.id; 
  
  // Query to get the recipient's ID (tutor's ID) based on the selected tutor's name
  // Insert the message into the database
  db.connection.query("INSERT INTO message (content, sender_id, recipient_id, approval_status) VALUES (?, ?, ?, 'pending')", 
  [message, senderId, recipientId], (err, result) => {
      if (err) {
          return res.status(500).send('Error sending message');
      }
      res.redirect('/dashboard'); 
  });
});





app.get('/about-us', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("about_us", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});

app.get('/Jaylin_Jack', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("Jaylin_Jack", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});

app.get('/Thomas_Bercasio', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("Thomas_Bercasio", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});

app.get('/Suzanna_Li', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("Suzanna_Li", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});

app.get('/Ken_Chika', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("Ken_Chika", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});

app.get('/Zarko_Cosovic', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("Zarko_Cosovic", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});



app.get('/search',(req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("search", {
        tutor: tutors,
        subject: subjects,
        user: req.session.user
      });
    });
  });
});

app.get('/registration', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("registration", {
        errors: [],
        tutor: tutors,
        subject: subjects
      });
    });
  });
});

// The logic to handle registration is Assisted with basic coding tools
app.post('/registration', (req, res) => {
  const { name, email, newPassword } = req.body;

  // Hash the password before storing it
  const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

  // Insert the new user into the database
  db.connection.query("INSERT INTO registered_user (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error registering user');
    }

    // Now that the user is inserted, query the user to log them in immediately
    db.connection.query('SELECT registered_user_id FROM registered_user WHERE email = ?', [email], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error logging in user');
      }

      if (rows.length > 0) {
        const userId = rows[0]['registered_user_id'];

        // Store user info in the session to sign them in
        req.session.user = {
          id: userId,
          name: name,
          email: email
        };

        // Redirect the user to the dashboard after successful registration and login
        res.redirect('/dashboard');
      } else {
        // If something went wrong, redirect to login
        res.redirect('/login');
      }
    });
  });
});

app.get('/forgot-password', (req, res) => {
  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("forgot-password", {
        tutor: tutors,
        subject: subjects
      });
    });
  });
});

// The logic to handle reset password is Assisted with basic coding tools
app.post('/forgot-password', (req, res) => {
  const { email, newPassword } = req.body;

  // Hash the password inserted
  const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
  db.connection.query('SELECT * FROM registered_user WHERE email = ?', [email], (err, rows) => {
    if (err) {
        console.error(err);  // Log any database errors
        return res.status(500).send('Database error');
    }
    const userId = rows[0]['registered_user_id'];
    const userName = rows[0]['name'];
 

    db.connection.query(`UPDATE registered_user SET password = ? WHERE registered_user_id = ?;`, [hashedPassword, userId], (err, result) => {
      // activeUsers++;
      req.session.user = {
          id: userId,
          name: userName,
          email: email 
      };

      res.redirect('/dashboard');
    });
  });

});

app.get('/login',  (req, res) => {

  // After displaying user they must be logged in to use the restricted pages
  // clear the message to stop from displaying.
  const message = req.session.message;
  req.session.message = null;

  db.getSubjects((subjects) => {
    db.getTutors((tutors) => {
      res.status(200).render("login", {
        tutor: tutors,
        subject: subjects,
        message: message,
        user: req.session.user
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;  // Destructure form data

  // Hash the password inserted
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');


  // Must have a unique way of logging in. Email is unique in our DB
  // Find the password, id from reg. user and name that matches user's email.
  db.connection.query('SELECT password, registered_user_id, name FROM registered_user WHERE email = ?', [email], (err, rows) => {
      if (err) {
          console.error(err);  // Log any database errors
          return res.status(500).send('Database error');
      }

      // If a matching user is found and the password matches
      if (rows.length > 0 && rows[0]['password'] === hashedPassword) {
        const userId = rows[0]['registered_user_id'];
        const userName = rows[0]['name'];

        // Store user info in the session
        req.session.user = {
            id: userId,
            name: userName,
            email: email // You can store the email too, if needed
        };

        // Redirect the user to the dashboard after successful login
        res.redirect('/dashboard');
    } else {
      res.redirect("/login");
    }
  });
});




// Creator: JJ
app.get('/search/tutors',  (req, res) => {

  // Either the search option is nothing or something.
  const subjectSelected = req.query.subject || '';
  const search = req.query.bio || '';


  db.getSubjects((subjects) => {
    if(subjectSelected && search){
      // Show results from user's dropdown menu selection & user's search input
      db.getTutorsBySearch(subjectSelected, search, (tutors) => {
        if(tutors.length === 0){
          // No tutors available under search criteria.
          // Go Back to homepge which shows all tutors available.
          res.redirect('/');

        }else{
          res.status(200).render("results", {
            tutor: tutors, 
            subjectSelected,
            subject: subjects,
            search: search,
            userText: search,
            userChoice: subjectSelected,
            user: req.session.user
          });
        }
        })
      }else if (subjectSelected){
        // Show results from user's dropdown menu selection
        db.getTutorsBySubject(subjectSelected, (tutors) => {
          if (tutors.length === 0) {
            // No tutors available under search criteria.
            // Go Back to homepge which shows all tutors available.
            res.redirect('/');
          } else {
            res.status(200).render("results", {
              tutor: tutors, 
              subjectSelected,
              subject: subjects,
              userText: search,
              userChoice: subjectSelected,
              user: req.session.user
            });
          }
      })
    }else if (search){
      // Show results from user's search input
      db.getTutorsByInput(search, (tutors) => {
        if (tutors.length === 0) {
          // No tutors available under search criteria.
          // Go Back to homepge which shows all tutors available.
          res.redirect('/');
        } else {
          res.status(200).render("results", {
            tutor: tutors, 
            search: search,
            subject: subjects,
            userText: search,
            // Leave subjectSelected blank since there was no subject used in search
            // (This line keeps search persistent)
            subjectSelected: '',
            user: req.session.user
          });
        }
      });
    }else{
      // No tutors available under search criteria.
      // Go Back to homepge which shows all tutors available.
      res.redirect('/');
    }
  });
});




// Ensure no more than 50 concurrent users on server.
server.maxConnections = 50;

server.listen(serverPort, (error) => {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log('Server is working on port', serverPort);
  }
});
