/* eslint-disable @typescript-eslint/no-require-imports */

// nodemon for automatically restarting the server
// axios for sending http requests
//bcrypt for encrypting passwords
// cors for handling the location of our requests
// express for handling our backend framework
// express-session for handling our session middleware
// cookie-parser for handling our cookies with our user information
// mysql for handling our sql connection and queries
// passport and passport-local for handling our authentication

// nodemon: a developer utility (not in package.json) that watches your files
// and automatically restarts the Node server whenever you save changes.
// Great for rapid iteration during development.

// axios: a Promise‑based HTTP client you can use on both Node.js and the browser.
// On the server it’s handy for calling external APIs; in React it’s how you fetch your own backend.

// bcrypt: a library for hashing (and comparing) passwords in a secure way.
// It uses a salt under the hood so that even identical passwords hash to different values,
// which protects you if your database ever leaks.

// cors: short for “Cross‑Origin Resource Sharing.”  
// Browsers enforce a same‑origin policy by default, so scripts at http://localhost:3000
// can’t call APIs at http://localhost:3001 unless the server explicitly allows it.
// The `cors` middleware sets the right HTTP headers (Access‑Control‑Allow‑Origin, etc.)
// so that your frontend and backend can live on different ports or domains.

// express: the core web‑framework.  
// It gives you an easy way to declare routes (`app.get`, `app.post`, etc.),  
// plug in middleware, handle errors, and send JSON or HTML responses.

// express‑session: middleware for managing server‑side sessions.  
// When a new visitor comes, it creates a session object stored in memory (or a store).
// It then sets a session cookie on the client (`connect.sid` by default), so subsequent
// requests automatically load that visitor’s session data.

// cookie‑parser: reads the Cookie header on incoming requests and populates `req.cookies`
// (and, if you configure signed cookies, `req.signedCookies`). This makes it trivial to
// read your JWT or session ID from a cookie.

// body‑parser: middleware that reads JSON or URL‑encoded payloads from POST/PUT requests
// and populates `req.body` so you can do `const { email, password } = req.body;` instead of
// parsing the raw HTTP stream yourself. In modern Express you can also use `express.json()`
// and `express.urlencoded()` instead of pulling in `body-parser` separately.

// passport + passport‑local: a pluggable authentication middleware for Express.
// `passport` wires into your session so it can serialize/deserialize a user object.
// The “local” strategy lets you define a username/password check. After a successful
// `passport.authenticate('local')`, it calls `req.logIn(user)` behind the scenes,
// storing the user’s ID in the session and making `req.user` available on future requests.

// mysql: the official Node.js driver for MySQL.  
// You use it to create a connection or pool, run parameterized queries (`?` placeholders),
// and get back JavaScript arrays/objects instead of juggling the raw MySQL protocol.

// db (your own module): typically you’d export a `mysql.createPool(...)` or `createConnection(...)`
// instance here, plus helper functions for querying.  

// Putting it all together, your typical request flow is:
// 1) Browser sends request with cookies (session ID or JWT).  
// 2) cors middleware checks origin & sets CORS headers.  
// 3) cookie‑parser parses cookies → req.cookies.  
// 4) express‑session loads or creates a session for that cookie.  
// 5) passport (if configured) grabs `req.session.userId`, looks up the user from DB, and sets `req.user`.  
// 6) body‑parser populates `req.body` with any JSON payload.  
// 7) Your route handler uses `db.query(...)` to fetch or modify data, maybe uses `bcrypt.compare` to check passwords, etc.  
// 8) You `res.json(...)` or `res.send(...)`, and Express takes care of the rest.  

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');

const db = require('./db');
const { error } = require('console');



const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: false }));

app.use(cookieparser('secret'));


app.use(passport.initialize());
app.use(passport.session());

require('./passportConfiguration')(passport);

app.get('/', (req, res) => {
    res.send('Hello World');
});



app.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const role = 1;
    const query = 'INSERT INTO user (email, password, role) VALUES (?, ?, ?)';
    const query2 = 'SELECT * FROM user WHERE email = ?';

    db.query(query2, [email], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error')
        }   
        if(result.length > 0) {
            res.send('User already exists');
        }
        if(result.length === 0) {
            const hashedPassword = bcrypt.hashSync(password, 10);
           db.query(query, [email, hashedPassword, 1], (err, result) => {
               if(err) {
                console.error(err);
                return res.status(500).send('Database error')
               }
               res.send('User created');

           });
        }
    });
});



app.post('/adduser', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4) {

    const { email, password, phone_number, first_name, last_name, role: roleStr } = req.body;
    const school_id = schoolId;
    const role = parseInt(roleStr, 10); // Convert role to integer

    const insertQuery = `
    INSERT INTO user 
      (password, email, phone_number, first_name, last_name, role,school_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    const checkUserQuery = 'SELECT * FROM user WHERE email = ?';

    // Check if user already exists
    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash password and create user
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.query(
        insertQuery,
        [hashedPassword, email, phone_number, first_name, last_name, role, school_id],
        (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }
          res.status(201).json({ message: 'User created successfully' });
        }
      );
    });
  } else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});




app.post('/addschool', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin or teacher
  if (req.user.role == 4) {

    const {school_name} = req.body;

    const insertQuery = `
    INSERT INTO schools 
      (school_name) 
    VALUES (?)
  `;
    const checkSchoolQuery = 'SELECT * FROM schools WHERE school_name = ?';

    // Check if user already exists
    db.query(checkSchoolQuery, [school_name], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
      }

      db.query(
        insertQuery,
        [school_name],
        (err, result) => {
          if (err) {
            console.error('Error creating school:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }
          res.status(201).json({ message: 'School created successfully' });
        }
      );
    });
  } else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an admin' });
  }
});









const jwt = require('jsonwebtoken');
const { start } = require('repl');
const { decode } = require('punycode');

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    try {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT (no need for req.logIn)
      const token = jwt.sign(
        { userId: user.user_id, role: user.role, school_id: user.school_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send token to client
      res.cookie('token', token, { httpOnly: true, secure: false }); // Set cookie with token
      // Optionally, you can also send the user info back to the client
      res.json({ token });
      
    } catch (error) {
      next(error); // Forward errors to Express error handler
    }
  })(req, res, next);
});
app.post('/logout', (req, res) => {
  // Clear the HTTP‐only cookie named “token”
  // Note: you should match the same options you used when setting it
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,       // set to true if you’re on HTTPS
    sameSite: 'lax',     // or 'strict' / 'none' per your original cookie policy
    path: '/',           // must match the original path
  });

  // Optionally send a JSON response
  res.status(200).json({ message: 'Logged out successfully' });
});
app.get('/timeslots', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
  const query = `
  SELECT m.module_start_time, m.module_end_time
  FROM modules m
  JOIN courses c ON m.course_id = c.course_id
  WHERE m.module_date = ? AND c.school_id = ?
`;


  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  console.log(date + " " + req.body)

  db.query(query, [date,schoolId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const times = results.map(row => ({
      start: row.module_start_time,
      end: row.module_end_time
    }));
  console.log("all of times "+times);
  res.send(times);
  
  })
});

// Course Creation API
app.post('/createcourse', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4) {
  const { course_name, course_description } = req.body;
  
  const checkCourseQuery = 'SELECT * FROM courses WHERE course_name = ? AND school_id = ?';
  const insertCourseQuery = `
    INSERT INTO courses 
      (course_name, course_description,school_id) 
    VALUES (?, ?, ?)
  `;

  db.query(checkCourseQuery, [course_name,schoolId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.length > 0) {
      return res.status(409).json({ message: 'Course already exists' });
    }

    db.query(
      insertCourseQuery,
      [course_name, course_description, schoolId],
      (err, result) => {
        if (err) {
          console.error('Error creating course:', err);
          return res.status(500).json({ message: 'Error creating course' });
        }
        res.status(201).json({ 
          message: 'Course created successfully',
          course_id: result.insertId
        });
      }
    );
  });} else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});

// Course Creation API for Teachers chat cleaned up the code
app.post('/createcourseasteacher/:teacher_id', (req, res) => {
  const token = req.cookies.token;
  let decoded;

  // 1) Verify JWT synchronously so we can immediately bail out on error
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('Invalid token:', err);
    res.clearCookie('token');
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { role, school_id: tokenSchoolId } = decoded;
  const headerSchoolId = req.get('schoolid');
  const schoolId = headerSchoolId ?? tokenSchoolId;
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid' });
  }

  // 2) Authorization: only roles 2, 3, 4 may create courses
  if (![2, 3, 4].includes(role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
  }

  const { course_name, course_description } = req.body;
  const teacherId = Number(req.params.teacher_id);

  // 3) Check for existing course in the same school
  const checkCourseQuery =
    'SELECT 1 FROM courses WHERE course_name = ? AND school_id = ? LIMIT 1';
  db.query(checkCourseQuery, [course_name, schoolId], (err, results) => {
    if (err) {
      console.error('Check error:', err);
      return res.status(500).json({ error: 'Database error during check' });
    }

    if (results.length > 0) {
      // course already exists
      return res
        .status(409)
        .json({ error: 'Course already exists in your school' });
    }

    // 4) Insert the new course
    const insertCourseQuery = `
      INSERT INTO courses (course_name, course_description, school_id)
      VALUES (?, ?, ?)
    `;
    db.query(
      insertCourseQuery,
      [course_name, course_description, schoolId],
      (err, courseResult) => {
        if (err) {
          console.error('Course creation error:', err);
          return res
            .status(500)
            .json({ error: 'Database error during course creation' });
        }

        const courseId = courseResult.insertId;

        // 5) Link teacher to the new course
        const insertTeachesQuery =
          'INSERT INTO teaches (teacher_id, course_id) VALUES (?, ?)';
        db.query(
          insertTeachesQuery,
          [teacherId, courseId],
          (err) => {
            if (err) {
              console.error('Teacher link error:', err);
              // Optionally roll back the course insert here if you want full atomicity
              return res
                .status(500)
                .json({ error: 'Failed to link teacher to course' });
            }

            // 6) Success
            res.status(201).json({
              success: true,
              course_id: courseId,
              message: 'Course created and teacher linked successfully'
            });
          }
        );
      }
    );
  });
});



app.get('/teaches', (req, res) => {
  const query = `
    SELECT 
      c.course_id, 
      GROUP_CONCAT(t.teacher_id) as teachers 
    FROM courses c
    JOIN teaches t ON c.course_id = t.course_id
    GROUP BY c.course_id
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error in /teaches:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    const formatted = result.map((row) => ({
      course_id: Number(row.course_id), // Convert to number
      teachers: row.teachers.split(',').map(Number)
    }));
    
    res.json(formatted);
  });
});
  

app.get('/getCourses', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in courses" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
  const query = 'SELECT * FROM courses WHERE school_id = ?';

  db.query(query, [schoolId],  (err, result) => {
      if (err) {
        console.log(err +" error in getCourses");
      }
      console.log(result)
      res.send(result);
  });
});


app.get('/getSchools', (req, res) => {

  const query = 'SELECT * FROM schools';

  db.query(query,  (err, result) => {
      if (err) {
        console.log(err +" error in getSchools");
      }
      console.log(result)
      res.send(result);
  });
});

const authenticateUser = passport.authenticate('jwt', { session: false });

// Backend API Endpoint (server.js)
app.get('/modules', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in modules" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
  const query = `
  SELECT 
    m.module_id,
    m.module_name,
    m.module_date,
    m.module_start_time,
    m.module_end_time,
    m.course_id,
    m.teacher_id,
    c.course_name,
    c.school_id
  FROM modules m
  LEFT JOIN courses c ON m.course_id = c.course_id
  WHERE c.school_id = ?
`;


  db.query(query,[schoolId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch modules'
      });
    }

    // Format dates and times to ISO strings
    const formattedModules = results.map(module => ({
      ...module,
      module_date: new Date(module.module_date).toISOString().split('T')[0],
      module_start_time: module.module_start_time.toString().slice(0, 8),
      module_end_time: module.module_end_time.toString().slice(0, 8)
    }));

    res.json(formattedModules);
  });
});


// In your Express app (e.g. routes/students.js)

app.get('/students/:studentId/modules', authenticateUser, (req, res) => {
  const studentId = Number(req.params.studentId);

  // First, find all course IDs this student is enrolled in
  const findCoursesSql = `
    SELECT course_id
    FROM courseEnrollments
    WHERE student_id = ?
  `;

  db.query(findCoursesSql, [studentId], (err, courseRows) => {
    if (err) {
      console.error('Error fetching enrolled courses:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    if (courseRows.length === 0) {
      // student not enrolled in any courses
      return res.json([]);
    }

    // Extract course IDs into an array
    const courseIds = courseRows.map(r => r.course_id);
    // Build a placeholder list "?, ?, ?" for SQL IN(...)
    const placeholders = courseIds.map(() => '?').join(', ');

    // Now fetch all modules for those courses
    const modulesSql = `
      SELECT
        module_id,
        module_name,
        module_date,
        module_start_time,
        module_end_time,
        course_id,
        teacher_id
      FROM modules
      WHERE course_id IN (${placeholders})
      ORDER BY module_date, module_start_time
    `;

    db.query(modulesSql, courseIds, (err2, moduleRows) => {
      if (err2) {
        console.error('Error fetching modules:', err2);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json(moduleRows);
    });
  });
});


app.post('/createModule', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4) {
  const { course_id, module_start_time, module_end_time, module_date } = req.body;

  // First get the course name
  const getCourseQuery = 'SELECT course_name FROM courses WHERE course_id = ?';
  
  db.query(getCourseQuery, [course_id], (err, courseResult) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (courseResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const course_name = courseResult[0].course_name;

    // Now insert with course name
    const insertModuleQuery = `
      INSERT INTO modules (
        module_name,
        module_date,
        course_id,
        module_start_time,
        module_end_time
      ) VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertModuleQuery, 
      [course_name, module_date, course_id, module_start_time, module_end_time],
      (err, moduleResult) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, message: 'Failed to create module' });
        }

        res.status(201).json({
          success: true,
          message: 'Module created successfully',
          moduleId: moduleResult.insertId,
          moduleName: course_name
        });
      }
    );
  });
  } else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});
app.delete('/deletemodule/:id', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4) {
  const moduleId = req.params.id;
  const deleteQuery = `
    DELETE FROM modules 
    WHERE module_id = ?
  `;

  db.query(deleteQuery, [moduleId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete module'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.json({
      success: true,
      message: 'Module deleted successfully',
      deletedId: moduleId
    });
  });
  }
  else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});


// Protected user endpoint
app.get('/getUser', authenticateUser, (req, res) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      'decoded token in getUser:',
      decoded.userId,
      decoded.role,
      decoded.school_id
    );
    return res.json({
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      school_id: decoded.school_id,
    });
  } catch (err) {
    return res
      .clearCookie('token')
      .status(401)
      .json({ error: 'Invalid token' });
  }
});


app.delete('/deleteteacher/:id', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin
  if (req.user.role == 3 || req.user.role == 4) {
  const teacherId = req.params.id;
  const deleteQuery = `
    DELETE FROM user 
    WHERE user_id = ?
  `;

  db.query(deleteQuery, [teacherId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete teacger'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher deleted successfully',
      deletedId: teacherId
    });
  });
  }
  else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});


app.get('/getAllUsers', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in modules" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
    const query2 = 'SELECT email,role,user_id,school_id FROM user WHERE school_id = ?';

    db.query(query2,[schoolId], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result)
        res.send(result);
    });
});


app.get('/getSchools', (req, res) => {

  const query2 = 'SELECT * FROM schools';

  db.query(query2, (err, result) => {
      if (err) {
          throw err;
      }
      console.log(result)
      res.send(result);
  });
});







//deepseek made this
app.get('/teacher/:id', (req, res) => {
  const teacherId = req.params.id;
  const query = 'SELECT * FROM skole.user WHERE user_id = ?';
  
  db.query(query, [teacherId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Teacher not found' });
    
    res.json(result[0]);
  });
});
app.get('/student/:id', (req, res) => {
  const teacherId = req.params.id;
  const query = 'SELECT * FROM skole.user WHERE user_id = ?';
  
  db.query(query, [teacherId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Teacher not found' });
    
    res.json(result[0]);
  });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Get courses taught by teacher
app.get('/teacher/courses/:id', (req, res) => {
  const teacherId = req.params.id;
  console.log(teacherId + " teacher id in get courses taught by teacher");
  const query = `
      SELECT c.course_id, c.course_name 
      FROM teaches t
      JOIN courses c ON t.course_id = c.course_id
      WHERE t.teacher_id = ?
  `;
  
  db.query(query, [teacherId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
  });
});

app.get('/course/:id', (req, res) => {
  const courseId = req.params.id;
  const query = 'SELECT * FROM skole.courses WHERE course_id = ?';
  
  db.query(query, [courseId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Course not found' });
    
    res.json(result[0]);
  });
});

// In your API endpoint
app.get('/courses/:courseId/teachers', (req, res) => {
  const courseId = req.params.courseId;
  
  const query = `
      SELECT 
          u.user_id, 
          u.first_name, 
          u.last_name, 
          u.email 
      FROM user u
      WHERE u.user_id IN (
          SELECT teacher_id 
          FROM teaches 
          WHERE course_id = ?
      )
  `;

  db.query(query, [courseId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

// Get available teachers for a course
app.get('/courses/:courseId/available-teachers', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in modules" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
  console.log(schoolId + " school id in get available teachers for a course");
  const courseId = req.params.courseId;
  // remember to add school id to the query later
  const query = `
SELECT u.user_id, u.first_name, u.last_name, u.email
FROM user u
WHERE u.school_id = ?
  AND u.role = 2
  AND u.user_id NOT IN (
      SELECT t.teacher_id FROM teaches t WHERE t.course_id = ?
  );

`;
  db.query(query, [schoolId, courseId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

// Assign teacher to course
app.post('/courses/:courseId/assign-teacher', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4) {
  const courseId = req.params.courseId;
  const { teacherId } = req.body;

  const query = `
      INSERT INTO teaches (teacher_id, course_id)
      VALUES (?, ?)
  `;

  // First validate teacher exists and is a teacher
  db.query(
      'SELECT * FROM user WHERE user_id = ?',
      [teacherId],
      (err, results) => {
          if (err || results.length === 0) {
              return res.status(400).json({ error: 'Invalid teacher' });
          }
          
          db.query(query, [teacherId, courseId], (err, result) => {
              if (err) {
                  if (err.code === 'ER_DUP_ENTRY') {
                      return res.status(409).json({ error: 'Teacher already assigned' });
                  }
                  return res.status(500).json({ error: 'Assignment failed' });
              }
              res.json({ success: true });
          });
      }
  );
  }
  else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});
app.delete('/courses/delete/:courseId', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4) {
  const courseId = req.params.courseId;
  
  // First check if course exists
  const checkQuery = 'SELECT * FROM courses WHERE course_id = ?';
  const deleteQuery = 'DELETE FROM courses WHERE course_id = ?';

  db.query(checkQuery, [courseId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
          return res.status(404).json({ error: 'Course not found' });
      }

      db.query(deleteQuery, [courseId], (err, result) => {
          if (err) {
              console.error('Delete error:', err);
              return res.status(500).json({ error: 'Failed to delete course' });
          }
          
          res.json({ success: true });
      });
  });
  }
  else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});
app.delete('/courses/:courseId/teachers/delete/:teacherId', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4) {
  const { courseId, teacherId } = req.params;
  
  const query = `
    DELETE FROM teaches 
    WHERE course_id = ? 
    AND teacher_id = ?
  `;

  db.query(query, [courseId, teacherId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Teacher not assigned to this course' });
    }

    res.json({ success: true });
  });
  }
  else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});

// Get courses for a specific student deepseek made this
app.get('/students/:studentId/courses', async (req, res) => {
  const query = `
    SELECT 
      c.course_id,
      c.course_name,
      c.course_description,
      ce.enrollment_date
    FROM courseEnrollments ce
    JOIN courses c ON ce.course_id = c.course_id
    WHERE ce.student_id = ?
  `;
  
  const studentId = req.params.studentId;
  
  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
// Get enrolled students
app.get('/courses/:courseId/students', async (req, res) => {
      const query =`
          SELECT u.user_id, u.first_name, u.last_name, u.email 
          FROM courseEnrollments ce
          JOIN user u ON ce.student_id = u.user_id
          WHERE ce.course_id = ?
      `;
      const courseId = req.params.courseId;
  db.query(query, [courseId, courseId], (err, results) => {
    if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
});
});

// Get available students for enrollment
app.get('/courses/:courseId/available-students', async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in modules" + req.user.role + " " + req.user.school_id);
  });
  
  let schoolId = req.get('schoolid');

  // 2) If no header, try the logged‑in user
  if (!schoolId && req.user) {
    schoolId = String(req.user.school_id);
  }

  // 3) If still missing, error out
  if (!schoolId) {
    return res.status(400).json({ error: 'Missing schoolid header and no authenticated user' });
  }
  console.log(schoolId + " school id in get available teachers for a course");
      const query = `
          SELECT u.user_id, u.first_name, u.last_name, u.email 
          FROM user u
          WHERE u.school_id = ?
          AND u.role = 1
          AND u.user_id NOT IN (
              SELECT student_id FROM courseEnrollments WHERE course_id = ?
          )`;
      const courseId = req.params.courseId;
      // remember to add school id to the query later
          db.query(query, [schoolId, courseId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    });

/// Enroll student
app.post('/courses/:courseId/enroll', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie('token').status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    console.log("decoded token in adduser" + req.user.role + " " + req.user.name);
  });
  //if school owner or admin or teacher
  if (req.user.role == 3 || req.user.role == 2 || req.user.role == 4 || req.user.role == 1) {
  const courseId = req.params.courseId;
  const { studentId } = req.body;

  const query = 'INSERT INTO courseEnrollments (student_id, course_id) VALUES (?, ?)';
  
  db.query(query, [studentId, courseId], (err, result) => {
      if (err) {
          console.error('Enrollment error:', err);
          return res.status(500).json({ error: 'Failed to enroll student' });
      }
      res.status(201).json({ success: true });
  });
  
    }
  else {
    console.log("decoded token in adduser" + req.user.role + " " + req.user.first_name);
    return res.status(403).json({ error: 'Forbidden you are not an owner' });
  }
});

// Unenroll student
app.delete('/courses/:courseId/students/delete/:studentId', (req, res) => {
  
  const { courseId, studentId } = req.params;
  const query = 'DELETE FROM courseEnrollments WHERE course_id = ? AND student_id = ?';
  
  db.query(query, [courseId, studentId], (err, result) => {
      if (err) {
          console.error('Unenrollment error:', err);
          return res.status(500).json({ error: 'Failed to unenroll student' });
      }
      
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Enrollment not found' });
      }
      
      res.json({ success: true });
  });
});


app.post('/admin/courses/:courseId/enroll/:studentId', (req, res) => {
  let decoded;
  try {
    decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Now req.user is available synchronously
  req.user = decoded;

  // Only roles 1–4 can enroll
  if (![1,2,3,4].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
  }

  const { courseId, studentId } = req.params;
  const query = 'INSERT INTO courseEnrollments (student_id, course_id) VALUES (?, ?)';
  db.query(query, [studentId, courseId], (err) => {
    if (err) {
      console.error('Enrollment error:', err);
      return res.status(500).json({ error: 'Failed to enroll student' });
    }
    res.status(201).json({ success: true });
  });
});






// Owner dashboard stats API Produced using common development resources
// In your Express server

app.get('/ownerStats', authenticateUser, (req, res) => {
  const schoolId = req.user.school_id;

  // Define all the queries we need
  const queries = {
    totalInstructors: `
      SELECT COUNT(*) AS cnt
      FROM user
      WHERE role = 2 AND school_id = ?
    `,
    totalStudents: `
      SELECT COUNT(*) AS cnt
      FROM user
      WHERE role = 1 AND school_id = ?
    `,
    totalCourses: `
      SELECT COUNT(*) AS cnt
      FROM courses
      WHERE school_id = ?
    `,
    totalModules: `
      SELECT COUNT(*) AS cnt
      FROM modules
      WHERE course_id IN (
        SELECT course_id FROM courses WHERE school_id = ?
      )
    `,
    pendingLessons: `
      SELECT COUNT(*) AS cnt
      FROM modules
      WHERE module_date >= CURDATE()
        AND course_id IN (SELECT course_id FROM courses WHERE school_id = ?)
    `,
    completedLessons: `
      SELECT COUNT(*) AS cnt
      FROM modules
      WHERE module_date < CURDATE()
        AND course_id IN (SELECT course_id FROM courses WHERE school_id = ?)
    `,
    lessonsTrend: `
      SELECT
        DATE(module_date) AS date,
        COUNT(*) AS count
      FROM modules
      WHERE module_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND course_id IN (SELECT course_id FROM courses WHERE school_id = ?)
      GROUP BY DATE(module_date)
      ORDER BY DATE(module_date)
    `
  };

  const stats = {};
  const keys = Object.keys(queries);
  let done = 0;

  keys.forEach(key => {
    db.query(queries[key], [schoolId], (err, rows) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        // Provide sensible defaults on error
        stats[key] = key === 'lessonsTrend' ? [] : 0;
      } else {
        if (key === 'lessonsTrend') {
          stats[key] = rows;               // an array of { date, count }
        } else {
          stats[key] = Number(rows[0].cnt) || 0;
        }
      }

      if (++done === keys.length) {
        res.json(stats);
      }
    });
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

