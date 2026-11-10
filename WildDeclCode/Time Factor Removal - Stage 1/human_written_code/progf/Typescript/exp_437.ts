
var configuration = require('@codedoc/core').configuration;
var codingBlog = require('@codedoc/coding-blog-plugin').codingBlog;

var theme = require('./theme').theme;



const config = /*#__PURE__*/configuration({
  theme,
  src: {
    base: 'posts'
  },
  dest: {
    namespace: '/coding-blog-boilerplate',    // --> change this if you want to also deploy to GitHub Pages
    html: 'dist',
    assets: process.env.GITHUB_BUILD === 'true' ? 'dist' : '.',
    bundle: process.env.GITHUB_BUILD === 'true' ? 'bundle' : 'dist/bundle',
    styles: process.env.GITHUB_BUILD === 'true' ? 'styles' : 'dist/styles',
  },
  page: {
    title: {
      base: 'Coding Blog Boilerplate [PLACEHOLDER]'         // --> change this to change your blog's title
    },
    favicon: '/favicon.ico'
  },
  plugins: [
    codingBlog({
      assets: [
        'img',
        'favicon.ico',
      ]
    })
  ],
  misc: {
    github: {
      repo: 'coding-blog-boilerplate',         // --> change this to your github repo
      user: 'CONNECT-platform'         // --> change this to your github username
    }
  }
});
