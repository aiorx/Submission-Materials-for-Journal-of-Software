// Assisted using common GitHub development utilities
// Simplified build script for PrismWeave browser extension
// Uses esbuild with IIFE format to eliminate module compatibility issues

var esbuild = require('esbuild');
var fs = require('fs');
var path = require('path');

async function buildExtension() {
  console.log('🚀 Building PrismWeave Browser Extension...');

  var isProduction = process.env.NODE_ENV === 'production';
  console.log("📦 Build mode: " + (isProduction ? 'Production' : 'Development') + "");

  // Clean dist directory - use root-level dist (projectRoot/dist/browser-extension)
  // path.resolve('../dist/...') from scripts/ already points one level up (project root)
  var distPath = path.resolve(__dirname, '..', '..', 'dist', 'browser-extension');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true });
  }
  fs.mkdirSync(distPath, { recursive: true });

  var legacySharedStylesPath = path.resolve(__dirname, '..', '..', 'dist', 'shared-styles');
  if (fs.existsSync(legacySharedStylesPath)) {
    fs.rmSync(legacySharedStylesPath, { recursive: true });
  }

  var baseOptions = {
    target: 'es2020',
    platform: 'browser',
    sourcemap: !isProduction, // No sourcemaps in production
    minify: isProduction, // Minify in production
    bundle: true, // Bundle all dependencies
    define: {
      'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
      'process.env.PRISMWEAVE_INJECTABLE_URL': JSON.stringify(
        process.env.PRISMWEAVE_INJECTABLE_URL || ''
      ),
      'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },
  };

  try {
    // Build components with appropriate formats for Chrome extension compatibility
    var builds = [
      {
        name: 'Service Worker',
        entryPoints: ['src/background/service-worker.ts'],
        outfile: path.join(distPath, 'background/service-worker.js'),
        format: 'esm', // ES modules for service worker (manifest has "type": "module")
        ...baseOptions,
      },
      {
        name: 'Content Script',
        entryPoints: ['src/content/content-script.ts'],
        outfile: path.join(distPath, 'content/content-script.js'),
        format: 'iife', // IIFE format for content script
        ...baseOptions,
      },
      {
        name: 'Popup',
        entryPoints: ['src/popup/popup.ts'],
        outfile: path.join(distPath, 'popup/popup.js'),
        format: 'iife', // IIFE format for popup scripts
        ...baseOptions,
      },
      {
        name: 'Options',
        entryPoints: ['src/options/options.ts'],
        outfile: path.join(distPath, 'options/options.js'),
        format: 'iife', // IIFE format for options scripts
        ...baseOptions,
      },
      {
        name: 'Injectable Content Extractor',
        entryPoints: ['src/injectable/content-extractor-injectable.ts'],
        outfile: path.join(distPath, 'injectable/content-extractor-injectable.js'),
        format: 'iife', // IIFE format for injectable scripts
        minify: true, // Minify for optimal injection
        sourcemap: false, // No sourcemaps for injectable (size optimization)
        globalName: 'contentextractorinjectable', // Global name for injectable access
        ...baseOptions,
      },
      {
        name: 'Injectable PrismWeave Bundle',
        entryPoints: ['src/injectable/prismweave-bundle.ts'],
        outfile: path.join(distPath, 'injectable/prismweave-bundle.js'),
        format: 'iife', // IIFE format for injectable scripts
        minify: true, // Minify for optimal injection
        sourcemap: false, // No sourcemaps for injectable (size optimization)
        globalName: 'prismweavebundle', // Global name for injectable access
        ...baseOptions,
      },
    ];

    // Build all components in parallel
    await Promise.all(
      builds.map(async function build {
        console.log("  📦 Building " + (build.name) + "...");
        var name = build.name;
        await esbuild.build(options);
        console.log("  ✅ " + (build.name) + " completed");
      })
    );

    // Copy static assets
    await copyStaticAssets();

    console.log('🎉 Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function copyStaticAssets(distPathOverride) {
  console.log('  📁 Copying static assets...');
  var distPath =
    distPathOverride || path.resolve(__dirname, '..', '..', 'dist', 'browser-extension');
  var assets = [
    // Shared design tokens used by imported CSS
    {
      src: '../shared-styles',
      dest: path.join(distPath, 'shared-styles'),
      isDirectory: true,
    },

    // Manifest
    { src: 'manifest.json', dest: path.join(distPath, 'manifest.json') },

    // HTML and CSS files
    { src: 'src/popup/popup.html', dest: path.join(distPath, 'popup/popup.html') },
    { src: 'src/popup/popup.css', dest: path.join(distPath, 'popup/popup.css') },
    { src: 'src/options/options.html', dest: path.join(distPath, 'options/options.html') },
    { src: 'src/options/options.css', dest: path.join(distPath, 'options/options.css') },

    // Icons directory
    { src: 'icons', dest: path.join(distPath, 'icons'), isDirectory: true },

    // Styles directory (shared UI components)
    { src: 'src/styles', dest: path.join(distPath, 'styles'), isDirectory: true },

    // Libraries directory (TurndownService, etc.)
    { src: 'src/libs', dest: path.join(distPath, 'libs'), isDirectory: true },

    // Bookmarklet templates directory
    {
      src: 'src/bookmarklet/templates',
      dest: path.join(distPath, 'bookmarklet/templates'),
      isDirectory: true,
    },
  ];

  for (var asset of assets) {
    var srcPath = asset.src;
    var destPath = asset.dest;

    // Ensure destination directory exists
    var destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (asset.isDirectory) {
      // Copy entire directory
      if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    } else {
      // Copy single file
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  console.log('  ✅ Static assets copied');
}

// Development mode with watch
async function buildDev() {
  console.log('🔄 Starting development build with watch mode...');

  var distPath = path.resolve(__dirname, '..', '..', 'dist', 'browser-extension');

  var baseOptions = {
    target: 'es2020',
    platform: 'browser',
    sourcemap: true,
    minify: false,
    bundle: true,
  };

  var contexts = await Promise.all([
    esbuild.context({
      entryPoints: ['src/background/service-worker.ts'],
      outfile: path.join(distPath, 'background/service-worker.js'),
      format: 'esm', // ES modules for service worker
      ...baseOptions,
    }),
    esbuild.context({
      entryPoints: ['src/content/content-script.ts'],
      outfile: path.join(distPath, 'content/content-script.js'),
      format: 'iife', // IIFE for content script
      ...baseOptions,
    }),
    esbuild.context({
      entryPoints: ['src/popup/popup.ts'],
      outfile: path.join(distPath, 'popup/popup.js'),
      format: 'iife', // IIFE for popup
      ...baseOptions,
    }),
    esbuild.context({
      entryPoints: ['src/options/options.ts'],
      outfile: path.join(distPath, 'options/options.js'),
      format: 'iife', // IIFE for options
      ...baseOptions,
    }),
  ]);

  // Watch for changes
  await Promise.all(contexts.map(function ctx { return ctx.watch(); }));

  // Copy static assets initially (pass distPath so we don't recompute)
  await copyStaticAssets(distPath);

  console.log('👀 Watching for changes... Press Ctrl+C to stop');
  console.log('📦 Output directory:', distPath);

  // Keep the process alive
  process.on('SIGINT', async function () {
    console.log('\n🛑 Shutting down...');
    await Promise.all(contexts.map(ctx => ctx.dispose()));
    process.exit(0);
  });
}

// Check command line arguments
var args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
  buildDev().catch(console.error);
} else {
  buildExtension().catch(console.error);
}
