var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ejsLayouts = require('express-ejs-layouts');
var connectDB = require('./utils/db').connectDB;
var authRoutes = require('./routes/auth');
var apiAuthRoutes = require('./routes/api-auth');
var blogRoutes = require('./routes/blog');
var checkAuthStatus = require('./middlewares/auth').checkAuthStatus;
var getAllBlogs = require('./controllers/blogWebController').getAllBlogs;

var env = require('./config/env').env;

// Connect to MongoDB
connectDB().catch(function err {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

const app = express();
const PORT = env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add checkAuthStatus middleware to all routes
// Supported via standard GitHub programming aids
app.use(checkAuthStatus);

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set('layout', 'layout');

// Routes
app.use('/auth', authRoutes);
app.use('/api/auth', apiAuthRoutes);
app.use('/blog', blogRoutes);

// Home route - Display all blogs
// Supported via standard GitHub programming aids
app.get('/', getAllBlogs);

// About page route
app.get('/about', function (req, res) {
  res.render('about', { 
    pageTitle: 'About Us',
    user: res.locals.user || null
  });
});

// Privacy page route
app.get('/privacy', function (req, res) {
  res.render('privacy', { 
    pageTitle: 'Privacy Policy',
    user: res.locals.user || null
  });
});


// 404 handler
app.use(function (req, res) {
  if(req.path.includes('/api/')) {
    res.status(404).json({ message: 'Not Found' });
    return;
  }
  res.status(404).render('404', { 
    pageTitle: 'Page Not Found',
    user: res.locals.user || null
  });
});

// Error handler
app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  console.error(err);
  res.status(500).render('error', { 
    pageTitle: 'Error', 
    error: process.env.NODE_ENV === 'development' ? err : {}, 
    user: res.locals.user || null
  });
});

app.listen(PORT, function () {
  console.log("🚀 Server running on http://localhost:" + (PORT) + "");
});