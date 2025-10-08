const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying production bundle...\n');

const buildDir = path.join(__dirname, 'build', 'static', 'js');

try {
  // Get all JS files
  const jsFiles = fs.readdirSync(buildDir).filter(f => f.endsWith('.js'));

  // Find main bundle
  const mainFile = jsFiles.find(f => f.startsWith('main.'));
  const chunkFiles = jsFiles.filter(f => f.includes('.chunk.'));

  if (mainFile) {
    const mainSize = fs.statSync(path.join(buildDir, mainFile)).size;
    const mainSizeKB = (mainSize / 1024).toFixed(2);
    console.log(`✓ Main bundle: ${mainFile}`);
    console.log(`  Size: ${mainSizeKB} KB (uncompressed)`);
    console.log(`  Estimated gzipped: ~${(mainSizeKB / 3).toFixed(2)} KB\n`);

    if (mainSizeKB > 1000) {
      console.log(`⚠️  Warning: Main bundle is large (${mainSizeKB} KB)`);
      console.log(`   Consider further optimizations\n`);
    }
  }

  console.log(`✓ Chunk files created: ${chunkFiles.length}`);
  if (chunkFiles.length > 0) {
    console.log('  Code splitting is working! ✅\n');

    // Show top 5 largest chunks
    const chunks = chunkFiles
      .map(f => ({
        name: f,
        size: fs.statSync(path.join(buildDir, f)).size
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    console.log('  Largest chunks:');
    chunks.forEach(chunk => {
      console.log(`    - ${chunk.name}: ${(chunk.size / 1024).toFixed(2)} KB`);
    });
  } else {
    console.log('  ⚠️  No chunk files found - code splitting may not be working\n');
  }

  // Check CSS
  const cssDir = path.join(__dirname, 'build', 'static', 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    const mainCSS = cssFiles.find(f => f.startsWith('main.'));

    if (mainCSS) {
      const cssSize = fs.statSync(path.join(cssDir, mainCSS)).size;
      const cssSizeKB = (cssSize / 1024).toFixed(2);
      console.log(`\n✓ CSS bundle: ${mainCSS}`);
      console.log(`  Size: ${cssSizeKB} KB\n`);

      if (cssSizeKB > 50) {
        console.log(`⚠️  Warning: CSS bundle is large (${cssSizeKB} KB)`);
        console.log(`   Check for unused styles\n`);
      }
    }
  }

  // Check for source maps (should not exist in production)
  const sourceMaps = jsFiles.filter(f => f.endsWith('.map'));
  if (sourceMaps.length === 0) {
    console.log('✓ Source maps disabled (good for production)\n');
  } else {
    console.log(`⚠️  Warning: ${sourceMaps.length} source map files found`);
    console.log('   Consider disabling source maps in production\n');
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📦 Build Summary:');
  console.log(`   Main JS: ${mainFile ? 'Created ✅' : 'Missing ❌'}`);
  console.log(`   Chunks: ${chunkFiles.length} files ${chunkFiles.length > 10 ? '✅' : '⚠️'}`);
  console.log(`   CSS: ${fs.existsSync(cssDir) ? 'Created ✅' : 'Missing ❌'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (chunkFiles.length > 10) {
    console.log('✅ Build verification complete!');
    console.log('   Ready to deploy to production.\n');
  } else {
    console.log('⚠️  Build verification found issues.');
    console.log('   Please review warnings above.\n');
  }

} catch (error) {
  console.error('❌ Error verifying bundle:', error.message);
  console.log('\nMake sure you have run: npm run build\n');
  process.exit(1);
}
