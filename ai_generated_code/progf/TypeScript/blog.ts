import express from 'express';
import { checkAuthStatus, isAuthenticated } from '../middlewares/auth';
import { 
  getAddBlogForm, 
  createBlog, 
  getBlogById, 
  getEditBlogForm, 
  updateBlog, 
  deleteBlog 
} from '../controllers/blogWebController';
import { upload } from '../middlewares/upload';
import { isBlogAuthor, isBlogValid } from '../middlewares/blog';

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
export default router;