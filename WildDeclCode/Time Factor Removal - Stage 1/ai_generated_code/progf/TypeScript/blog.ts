var express = require('express');
var checkAuthStatus = require('../middlewares/auth').checkAuthStatus;
var isAuthenticated = require('../middlewares/auth').isAuthenticated;
import { 
  getAddBlogForm, 
  createBlog, 
  getBlogById, 
  getEditBlogForm, 
  updateBlog, 
  deleteBlog 
} from '../controllers/blogWebController';
var upload = require('../middlewares/upload').upload;
var isBlogAuthor = require('../middlewares/blog').isBlogAuthor;
var isBlogValid = require('../middlewares/blog').isBlogValid;

const router = express.Router();

// GET /blog/add - Show the add blog form (requires authentication)
router.get('/add', isAuthenticated, getAddBlogForm);

// POST /blog/add - Process blog creation (requires authentication)
// Use upload middleware to handle the cover image
router.post('/add', isAuthenticated, upload.single('coverImage'), createBlog);

// GET /blog/:id - View a specific blog post
router.get('/:id', checkAuthStatus, isBlogValid, getBlogById);

// GET /blog/:id/edit - Show the edit blog form (requires authentication)
router.get('/:id/edit', isAuthenticated, isBlogValid, isBlogAuthor, getEditBlogForm);

// POST /blog/:id/edit - Process blog update (requires authentication)
router.post('/:id/edit', isAuthenticated, upload.single('coverImage'), isBlogValid, isBlogAuthor,  updateBlog);

// DELETE /blog/:id - Delete a blog post (requires authentication)
router.delete('/:id', isAuthenticated, deleteBlog);

// Assisted using common GitHub development utilities
module.exports = router;
