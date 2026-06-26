const fs = require('fs');
const path = require('path');

// Update proxy.ts
const proxyPath = path.join(__dirname, 'src/proxy.ts');
if (fs.existsSync(proxyPath)) {
  let proxyContent = fs.readFileSync(proxyPath, 'utf8');
  
  proxyContent = proxyContent.replace(/const publicRoutes = \["\/auth\/login"\];/, 'const publicRoutes = ["/"];');
  proxyContent = proxyContent.replace(/return NextResponse\.redirect\(new URL\("\/auth\/login", request\.url\)\);/, 'return NextResponse.redirect(new URL("/", request.url));');
  
  proxyContent = proxyContent.replace(/"Admin Produksi": "\/",/, '"Admin Produksi": "/dashboard",');
  
  fs.writeFileSync(proxyPath, proxyContent);
  console.log('Updated src/proxy.ts');
}

// Update auth.ts
const authPath = path.join(__dirname, 'src/lib/auth.ts');
if (fs.existsSync(authPath)) {
  let authContent = fs.readFileSync(authPath, 'utf8');
  
  // Remove "/" from the permission arrays
  authContent = authContent.replace(/", "\/"/g, '"');
  
  fs.writeFileSync(authPath, authContent);
  console.log('Updated src/lib/auth.ts');
}

// Update AppLayout and other layouts
const layoutsDir = path.join(__dirname, 'src/components/layout');
if (fs.existsSync(layoutsDir)) {
  const layoutFiles = fs.readdirSync(layoutsDir).filter(f => f.endsWith('Layout.tsx'));
  
  layoutFiles.forEach(file => {
    const layoutPath = path.join(layoutsDir, file);
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    // Change href: "/" to href: "/dashboard"
    layoutContent = layoutContent.replace(/href: "\/"/g, 'href: "/dashboard"');
    
    fs.writeFileSync(layoutPath, layoutContent);
    console.log(`Updated ${file}`);
  });
}
