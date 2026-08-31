def test_homepage_loads(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Welcome to Warwick Summer Learning', response.data)

    def test_apply_page_loads(self):
        response = self.app.get('/apply')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Apply for a Short Course', response.data)

    def test_admin_redirect_without_login(self):
        response = self.app.get('/admin/dashboard', follow_redirects=True)
        self.assertIn(b'Admin Login', response.data)

    def test_fake_submission(self):
        response = self.app.post('/apply', data={
            'name': 'Test User',
            'email': 'test@example.com',
            'course_name': 'AI and Data Science',
            'statement': 'I want to join this course.'
        }, follow_redirects=True)
        self.assertIn(b'Thank you for your application', response.data)